import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Spinner, Alert, Modal } from "react-bootstrap";

const API_LIST = "http://localhost:5000/auth/danhsach-giaovien";
const API_CREATE = "http://localhost:5000/auth/tao-taikhoan";
const API_DELETE = "http://localhost:5000/auth/xoa-taikhoan";
const API_UPDATE = "http://localhost:5000/auth/sua-taikhoan";
const API_BOMON = "http://localhost:5000/api/system/bomon";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [bomonList, setBomonList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    ten: "",
    ngaysinh: "",
    email: "",
    phone: "",
    bomon: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const fetchBomon = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_BOMON, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBomonList(res.data.data);
    } catch (err) {
      console.error("Lỗi tải bộ môn", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tài khoản này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_DELETE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Xoá thất bại!");
    }
  };

  const openEditModal = (user) => {
    setForm({
      username: user.username,
      password: "",
      ten: user.ten,
      ngaysinh: user.ngaysinh,
      email: user.email,
      phone: user.phone,
      bomon: user.bomon,
    });
    setSelectedId(user._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    setCreating(true);
    setCreateError(null);
    const token = localStorage.getItem("token");
    try {
      if (editMode && selectedId) {
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;

        await axios.put(`${API_UPDATE}/${selectedId}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          API_CREATE,
          { ...form, role: "teacher" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowModal(false);
      setForm({
        username: "",
        password: "",
        ten: "",
        ngaysinh: "",
        email: "",
        phone: "",
        bomon: "",
      });
      setEditMode(false);
      setSelectedId(null);
      fetchUsers();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (editMode ? "Cập nhật thất bại!" : "Tạo tài khoản thất bại!");
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBomon();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h4>Quản lý Tài khoản Giáo viên</h4>
      <Button
        className="mb-3"
        onClick={() => {
          setEditMode(false);
          setForm({
            username: "",
            password: "",
            ten: "",
            ngaysinh: "",
            email: "",
            phone: "",
            bomon: "",
          });
          setShowModal(true);
        }}
      >
        Thêm tài khoản
      </Button>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Tài khoản</th>
            <th>Ngày sinh</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Bộ môn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.ten}</td>
              <td>{u.username}</td>
              <td>{u.ngaysinh}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.bomon}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(u)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(u._id)}
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Cập nhật tài khoản" : "Thêm tài khoản giáo viên"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && <Alert variant="danger">{createError}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editMode ? "Bỏ trống nếu không đổi mật khẩu" : ""}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                value={form.ten}
                onChange={(e) => setForm({ ...form, ten: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                value={form.ngaysinh}
                onChange={(e) => setForm({ ...form, ngaysinh: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Bộ môn</Form.Label>
              <Form.Select
                value={form.bomon}
                onChange={(e) => setForm({ ...form, bomon: e.target.value })}
              >
                <option value="">-- Chọn bộ môn --</option>
                {bomonList.map((bm) => (
                  <option key={bm._id} value={bm.ten}>
                    {bm.ten}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave} disabled={creating}>
            {creating ? (
              <Spinner size="sm" animation="border" />
            ) : editMode ? (
              "Cập nhật"
            ) : (
              "Lưu"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
