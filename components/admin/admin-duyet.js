import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

const API = "https://dangky-daybu-backend.onrender.com/makeup-class/danhsach-daybu";
const DUYET_API = "https://dangky-daybu-backend.onrender.com/makeup-class/duyet-daybu";

export default function AdminDuyetDonDayBu() {
  const [donList, setDonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Lấy đúng mảng từ res.data.data
      setDonList(res.data.data.filter((don) => don.trangthai === "Cho duyet"));
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleDuyet = async (id, isDongY) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${DUYET_API}/${id}`,
        { trangthai: isDongY ? "Dong y" : "Tu choi" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Loại bỏ đơn vừa xử lý ra khỏi danh sách
      setDonList((prev) => prev.filter((don) => don._id !== id));
    } catch (err) {
      alert("Xử lý thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3>Danh sách lịch chờ duyệt</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Môn</th>
            <th>Tiết</th>
            <th>Buổi</th>
            <th>Lớp</th>
            <th>Giáo viên</th>
            <th>Bộ môn</th>
            <th>Lý do</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {donList.map((don) => (
            <tr key={don._id}>
              <td>{don.songay}</td>
              <td>{don.monhoc}</td>
              <td>{don.tiethoc.join(", ")}</td>
              <td>{don.buoihoc}</td>
              <td>{don.lop}</td>
              <td>{don.giaovien}</td>
              <td>{don.bomon}</td>
              <td>{don.lido}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDuyet(don._id, true)}
                  disabled={actionLoading === don._id}
                >
                  Đồng ý
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDuyet(don._id, false)}
                  disabled={actionLoading === don._id}
                >
                  Từ chối
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
