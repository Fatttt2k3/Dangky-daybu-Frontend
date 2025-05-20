import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert, Form } from "react-bootstrap";
import * as XLSX from "xlsx";

const API = "https://dangky-daybu-backend.onrender.com/makeup-class/danhsach-daybu";
const DELETE_API = "https://dangky-daybu-backend.onrender.com/makeup-class/xoa";

export default function AdminDanhSachDangKy() {
  const [donList, setDonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchGV, setSearchGV] = useState("");
  const [searchLop, setSearchLop] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("songay");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonList(res.data.data);
      setFilteredList(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá đơn này không?")) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${DELETE_API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newList = donList.filter((don) => don._id !== id);
      setDonList(newList);
      applyFilters(newList, searchGV, searchLop, startDate, endDate);
    } catch (err) {
      console.error(err);
      alert("Xoá không thành công!");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const applyFilters = (
    list = donList,
    keywordGV = searchGV,
    keywordLop = searchLop,
    start = startDate,
    end = endDate
  ) => {
    let updatedList = [...list];

    // Lọc theo tên giáo viên
    if (keywordGV) {
      updatedList = updatedList.filter((don) =>
        don.giaovien.toLowerCase().includes(keywordGV.toLowerCase())
      );
    }

    // Lọc theo lớp
    if (keywordLop) {
      updatedList = updatedList.filter((don) =>
        don.lop.toLowerCase().includes(keywordLop.toLowerCase())
      );
    }

    // Lọc theo khoảng thời gian
    if (start && end) {
      updatedList = updatedList.filter(
        (don) =>
          new Date(don.songay) >= new Date(start) &&
          new Date(don.songay) <= new Date(end)
      );
    }

    updatedList.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "songay") {
        valA = new Date(valA);
        valB = new Date(valB);
      } else {
        valA = valA?.toString().toLowerCase();
        valB = valB?.toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredList(updatedList);
  };

  const handleSearchGV = (e) => {
    const keyword = e.target.value;
    setSearchGV(keyword);
    applyFilters(donList, keyword, searchLop, startDate, endDate);
  };

  const handleSearchLop = (e) => {
    const keyword = e.target.value;
    setSearchLop(keyword);
    applyFilters(donList, searchGV, keyword, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    applyFilters(donList, searchGV, searchLop, date, endDate);
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    setEndDate(date);
    applyFilters(donList, searchGV, searchLop, startDate, date);
  };

  const getSortedIcon = (field) => {
    if (sortField !== field) return "↕";
    return sortOrder === "asc" ? "▲" : "▼";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Dong y":
        return "success";
      case "Tu choi":
        return "danger";
      default:
        return "warning";
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredList.map((don) => {
      const { _id, __v, ...rest } = don;
      return rest;
    });

    dataToExport.forEach((don) => {
      don.songay = formatDate(don.songay);
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách đăng ký");

    XLSX.writeFile(wb, "Danh_sach_dang_ky.xlsx");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sortField, sortOrder]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3>Danh sách đơn đăng ký dạy bù</h3>

      <Form.Group className="mb-3">
        <Form.Label>Lọc theo giáo viên:</Form.Label>
        <Form.Control
          type="text"
          value={searchGV}
          onChange={handleSearchGV}
          placeholder="Nhập tên giáo viên..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Lọc theo lớp:</Form.Label>
        <Form.Control
          type="text"
          value={searchLop}
          onChange={handleSearchLop}
          placeholder="Nhập tên lớp..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Lọc theo khoảng thời gian:</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="me-2"
          />
          <Form.Control
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </Form.Group>

      <Button variant="primary" onClick={exportToExcel}>
        Xuất Excel
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("songay")}>
              Ngày {getSortedIcon("songay")}
            </th>
            <th>Môn</th>
            <th>Tiết</th>
            <th>Buổi</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("lop")}>
              Lớp {getSortedIcon("lop")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("giaovien")}>
              Giáo viên {getSortedIcon("giaovien")}
            </th>
            <th>Bộ môn</th>
            <th>Lý do</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("trangthai")}>
              Trạng thái {getSortedIcon("trangthai")}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((don) => (
            <tr key={don._id}>
              <td>{formatDate(don.songay)}</td>
              <td>{don.monhoc}</td>
              <td>{don.tiethoc.join(", ")}</td>
              <td>{don.buoihoc}</td>
              <td>{don.lop}</td>
              <td>{don.giaovien}</td>
              <td>{don.bomon}</td>
              <td>{don.lido}</td>
              <td>
                <span className={`badge bg-${getStatusColor(don.trangthai)}`}>
                  {don.trangthai}
                </span>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(don._id)}
                  disabled={deletingId === don._id}
                >
                  {deletingId === don._id ? "Đang xoá..." : "Xoá"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
