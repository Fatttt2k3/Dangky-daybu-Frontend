import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Alert, Spinner, Modal } from "react-bootstrap";

const API_BASE = "http://localhost:5000/api/system";

export default function MonHocManager() {
  const [monHocList, setMonHocList] = useState([]);
  const [newMonHoc, setNewMonHoc] = useState("");
  const [editMonHoc, setEditMonHoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalName, setModalName] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/monhoc`);
      setMonHocList(res.data);
    } catch (err) {
      setError("Không thể tải danh sách môn học.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMonHoc.trim()) return;
    try {
      await axios.post(
        `${API_BASE}/them-monhoc`,
        { name: newMonHoc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMonHoc("");
      fetchData();
    } catch (err) {
      alert("Thêm môn học thất bại!");
    }
  };

  const handleEdit = async () => {
    if (!modalName.trim()) return;
    try {
      await axios.put(
        `${API_BASE}/sua-monhoc/${editMonHoc._id}`,
        { name: modalName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalShow(false);
      setEditMonHoc(null);
      fetchData();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await axios.delete(`${API_BASE}/xoa-monhoc/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  const openEditModal = (monhoc) => {
    setEditMonHoc(monhoc);
    setModalName(monhoc.name);
    setModalShow(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h4>Quản lý Môn học</h4>

      <Form className="d-flex gap-2 my-3">
        <Form.Control
          type="text"
          placeholder="Nhập tên môn học"
          value={newMonHoc}
          onChange={(e) => setNewMonHoc(e.target.value)}
        />
        <Button onClick={handleAdd}>Thêm</Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên môn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {monHocList.map((mon, index) => (
              <tr key={mon._id}>
                <td>{index + 1}</td>
                <td>{mon.name}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(mon)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(mon._id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa môn học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={modalName}
            onChange={(e) => setModalName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
