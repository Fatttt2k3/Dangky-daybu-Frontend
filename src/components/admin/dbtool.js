import React, { useRef, useState } from "react";
import axios from "axios";
import { Container, Button, Form, Row, Col, Alert, Card } from "react-bootstrap";
import { useEffect } from "react";

const API_BASE = "https://dangky-daybu-backend.onrender.com/db";

export default function BackupImportManager() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const fileAllInputRef = useRef();
  const [collection, setCollection] = useState("MakeupClass");
  const [clearBeforeImport, setClearBeforeImport] = useState(false);
  const [overwrite, setOverwrite] = useState(true);

  const collections = [
    "Bomon",
    "Buoihoc",
    "Lop",
    "MakeupClass",
    "Monhoc",
    "Tiethoc",
    "Tuanhoc",
    "User",
  ];

  const tokenHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const handleDownload = async (type) => {
    try {
      const endpoint = type === "all" ? "/backup-all" : `/backup/${collection}`;
      const res = await axios.get(`${API_BASE}${endpoint}`, {
        ...tokenHeader(),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "all" ? "backup_all.json" : `${collection}.json`
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải backup!");
    }
  };

  const handleImport = async () => {
    try {
      if (!fileInputRef.current.files.length) return;
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);

      const endpoint = `/import/${collection}?clear=${clearBeforeImport}&overwrite=${overwrite}`;

      await axios.post(`${API_BASE}${endpoint}`, formData, {
        headers: {
          ...tokenHeader().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Import thành công!");
    } catch (err) {
      console.error(err);
      setError("Lỗi khi import dữ liệu!");
    }
  };

  const handleImportAll = async () => {
    try {
      if (!fileAllInputRef.current.files.length) return;
      const formData = new FormData();
      formData.append("file", fileAllInputRef.current.files[0]);

      await axios.post(`${API_BASE}/import-all?overwrite=${overwrite}`, formData, {
        headers: {
          ...tokenHeader().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Import toàn bộ dữ liệu thành công!");
    } catch (err) {
      console.error(err);
      setError("Lỗi khi import toàn bộ dữ liệu!");
    }
  };

  const handleDeleteMakeupClass = async () => {
    try {
      if (!window.confirm("Bạn có chắc muốn xoá toàn bộ đăng ký dạy bù?")) return;
      await axios.delete(`${API_BASE}/makeup-class/delete-all`, tokenHeader());
      setMessage("Đã xoá toàn bộ dữ liệu dạy bù!");
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xoá dữ liệu dạy bù!");
    }
  };
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);
  return (
    <Container className="mt-4">
      <h4>Quản lý Dữ liệu</h4>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Backup */}
      <Card className="p-3 mb-4">
        <h5>🔄 Backup dữ liệu</h5>
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Label>Chọn bảng:</Form.Label>
            <Form.Select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >
              {collections.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button onClick={() => handleDownload("one")}>Backup bảng</Button>
          </Col>
          <Col md={4}>
            <Button variant="secondary" onClick={() => handleDownload("all")}>Backup toàn bộ</Button>
          </Col>
        </Row>
      </Card>

      {/* Import từng bảng */}
      <Card className="p-3 mb-4">
        <h5>⬆️ Import dữ liệu cho một bảng</h5>
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Label>Chọn bảng:</Form.Label>
            <Form.Select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >
              {collections.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Chọn file JSON:</Form.Label>
            <Form.Control type="file" ref={fileInputRef} accept=".json" />
            <Form.Check
              className="mt-2"
              type="checkbox"
              label="Xoá dữ liệu cũ trước khi import"
              checked={clearBeforeImport}
              onChange={() => setClearBeforeImport(!clearBeforeImport)}
            />
            <Form.Check
              className="mt-2"
              type="checkbox"
              label="Ghi đè nếu trùng ID"
              checked={overwrite}
              onChange={() => setOverwrite(!overwrite)}
            />
          </Col>
          <Col md={4}>
            <Button variant="success" onClick={handleImport}>Import</Button>
          </Col>
        </Row>
      </Card>

      {/* Import toàn bộ */}
      <Card className="p-3 mb-4">
        <h5>📦 Import toàn bộ dữ liệu</h5>
        <Row className="align-items-end">
          <Col md={8}>
            <Form.Control type="file" ref={fileAllInputRef} accept=".json" />
            <Form.Check
              className="mt-2"
              type="checkbox"
              label="Ghi đè nếu trùng ID"
              checked={overwrite}
              onChange={() => setOverwrite(!overwrite)}
            />
          </Col>
          <Col md={4}>
            <Button variant="warning" onClick={handleImportAll}>Import toàn bộ</Button>
          </Col>
        </Row>
      </Card>

      {/* Xoá dữ liệu dạy bù */}
      <Card className="p-3 mb-4">
        <h5>🗑️ Xoá dữ liệu dạy bù</h5>
        <Button variant="danger" onClick={handleDeleteMakeupClass}>
          Xoá toàn bộ đăng ký dạy bù
        </Button>
      </Card>
    </Container>
  );
}
