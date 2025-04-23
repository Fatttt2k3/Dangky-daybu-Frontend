import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Row, Col, Spinner, Alert } from "react-bootstrap";

const API = "https://dangky-daybu-backend.onrender.com/api/system/tiethoc";
const API_THEM = "https://dangky-daybu-backend.onrender.com/api/system/them-tiethoc";
const API_XOA = "https://dangky-daybu-backend.onrender.com/api/system/xoa-tiethoc";
const API_SUA = "https://dangky-daybu-backend.onrender.com/api/system/sua-tiethoc";

export default function TietHocManager() {
  const [list, setList] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNumber, setEditNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setList(res.data);
    } catch (err) {
      setError("Không thể tải danh sách tiết học!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newNumber) return alert("Vui lòng nhập số tiết!");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_THEM,
        { number: parseInt(newNumber) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNumber("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Thêm thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tiết học này?")) return;
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
    if (!editNumber) return alert("Vui lòng nhập số tiết mới!");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_SUA}/${editId}`,
        { number: parseInt(editNumber) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditNumber("");
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
      <h4>Quản lý Tiết học</h4>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="number"
            placeholder="Số tiết mới"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </Col>
        <Col>
          <Button onClick={handleAdd}>Thêm tiết</Button>
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Số tiết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item._id}>
              <td>
                {editId === item._id ? (
                  <Form.Control
                    type="number"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                  />
                ) : (
                  item.number
                )}
              </td>
              <td>
                {editId === item._id ? (
                  <>
                    <Button variant="success" size="sm" onClick={handleEdit}>
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
                        setEditNumber(item.number);
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
