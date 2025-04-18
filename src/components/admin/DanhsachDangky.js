import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

const API = "http://localhost:5000/makeup-class/danhsach-daybu"; // bạn có thể đổi nếu API khác
const DELETE_API = "http://localhost:5000/makeup-class/xoa";     // ví dụ: /xoa/:id

export default function AdminDanhSachDangKy() {
  const [donList, setDonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonList(res.data.data); // đảm bảo API trả về đúng `data.data`
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

      setDonList((prev) => prev.filter((don) => don._id !== id));
    } catch (err) {
      console.error(err);
      alert("Xoá không thành công!");
    } finally {
      setDeletingId(null);
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
            <th>Ngày</th>
            <th>Môn</th>
            <th>Tiết</th>
            <th>Buổi</th>
            <th>Lớp</th>
            <th>Giáo viên</th>
            <th>Bộ môn</th>
            <th>Lý do</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {donList.map((don) => (
            <tr key={don._id}>
              <td>{new Date(don.songay).toLocaleDateString()}</td>
              <td>{don.monhoc}</td>
              <td>{don.tiethoc.join(", ")}</td>
              <td>{don.buoihoc}</td>
              <td>{don.lop}</td>
              <td>{don.giaovien}</td>
              <td>{don.bomon}</td>
              <td>{don.lido}</td>
              <td>{don.trangthai}</td>
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
