import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

const API = "http://localhost:5000/makeup-class/danhsach-daybu";
const DUYET_API = "http://localhost:5000/makeup-class/duyet-daybu";

export default function AdminDuyetDonDayBu() {
  const [donList, setDonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("res.data:", res.data); // <== Ghi log ra để kiểm tra
  
      // Nếu là { success: true, data: [...] } thì cần lấy .data
      if (Array.isArray(res.data)) {
        setDonList(res.data);
      } else if (Array.isArray(res.data.data)) {
        setDonList(res.data.data);
      } else {
        throw new Error("Dữ liệu trả về không phải mảng");
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setError("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDuyet = async (id, isDuyet) => {
    setActionLoading(id);
    try {
      await axios.post(`${DUYET_API}/${id}`, { trangthai: isDuyet ? "Đã duyệt" : "Từ chối" });
      setDonList(prev =>
        prev.map(don =>
          don._id === id ? { ...don, trangthai: isDuyet ? "Đã duyệt" : "Từ chối" } : don
        )
      );
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
      <h3>Danh sách đơn đăng ký dạy bù</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tuần</th>
            <th>Môn</th>
            <th>Tiết</th>
            <th>Lớp</th>
            <th>Giáo viên</th>
            <th>Bộ môn</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {donList.map((don) => (
            <tr key={don._id}>
              <td>{don.tuan}</td>
              <td>{don.monhoc}</td>
              <td>{don.tiethoc?.join(", ")}</td>
              <td>{don.lop}</td>
              <td>{don.tengiaovien}</td>
              <td>{don.bomon}</td>
              <td>{don.trangthai}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  disabled={don.trangthai !== "Chờ duyệt" || actionLoading === don._id}
                  onClick={() => handleDuyet(don._id, true)}
                >
                  Duyệt
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={don.trangthai !== "Chờ duyệt" || actionLoading === don._id}
                  onClick={() => handleDuyet(don._id, false)}
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
