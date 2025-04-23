import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Row, Col, Spinner, Alert } from "react-bootstrap";

const API_BASE = "https://dangky-daybu-backend.onrender.com/api/system";

export default function BomonManager() {
  const [list, setList] = useState([]);
  const [newTen, setNewTen] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/bomon`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data.data);
    } catch (err) {
      setError("Không thể tải danh sách bộ môn!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newTen.trim()) return alert("Tên bộ môn không được để trống!");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/them-bomon`,
        { ten: newTen },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTen("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Thêm thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/xoa-bomon/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Xoá thất bại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h4>Quản lý Bộ môn</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Tên bộ môn mới"
            value={newTen}
            onChange={(e) => setNewTen(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={handleAdd}>Thêm bộ môn</Button>
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Tên bộ môn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item._id}>
              <td>{item.ten}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
