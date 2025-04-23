import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Row, Col, Spinner, Alert } from "react-bootstrap";

const API = "https://dangky-daybu-backend.onrender.com/api/system/lop";
const API_THEM = "https://dangky-daybu-backend.onrender.com/api/system/them-lop";
const API_XOA = "https://dangky-daybu-backend.onrender.com/api/system/xoa-lop";
const API_SUA = "https://dangky-daybu-backend.onrender.com/api/system/sua-lop";

export default function LopManager() {
  const [list, setList] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setList(res.data);
    } catch (err) {
      setError("Không thể tải danh sách lớp!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_THEM,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!newName.trim()) {
  alert("Tên lớp không được để trống!");
  return;
}

      setNewName("");
      fetchData();
    } catch (err) {
      alert("Thêm thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_XOA}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_SUA}/${editId}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditName("");
      fetchData();
    } catch (err) {
      alert("Sửa thất bại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h4>Quản lý Lớp học</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Tên lớp mới"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={handleAdd}>Thêm lớp</Button>
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Tên lớp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item._id}>
              <td>
                {editId === item._id ? (
                  <Form.Control
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editId === item._id ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleEdit}
                    >
                      Lưu
                    </Button>{" "}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditId(null)}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setEditId(item._id);
                        setEditName(item.name);
                      }}
                    >
                      Sửa
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Xóa
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
