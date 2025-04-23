import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import "../style/Home.css";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import Xemlichday from "../components/admin/xemlichday";


registerLocale("vi", vi);

const Home = () => {
  const [formData, setFormData] = useState({
    sotuan: "",
    songay: new Date(),
    monhoc: "",
    tiethoc: [],
    buoihoc: "",
    lop: "",
    lido: ""
  });
  const [message, setMessage] = useState("");
  const [monHocList, setMonHocList] = useState([]);
  const [lopList, setLopList] = useState([]);
  const [tietHocList, setTietHocList] = useState([]);
  const [buoiHocList, setBuoiHocList] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  useEffect(() => {
    // Kiểm tra quyền nếu trang bị khoá
    const isLocked = localStorage.getItem("isPageLocked") === "true";
    if (isLocked && token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "admin") {
          alert("Trang đăng ký hiện đang bị khoá. Vui lòng liên hệ quản trị viên.");
          window.location.href = "/";
        }
      } catch (err) {
        alert("Token không hợp lệ. Đang chuyển hướng...");
        window.location.href = "/";
      }
    }
  }, [token]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const [monHocRes, lopRes, tietHocRes, buoiHocRes] = await Promise.all([
          axios.get("https://dangky-daybu-backend.onrender.com/api/system/monhoc"),
          axios.get("https://dangky-daybu-backend.onrender.com/api/system/lop"),
          axios.get("https://dangky-daybu-backend.onrender.com/api/system/tiethoc"),
          axios.get("https://dangky-daybu-backend.onrender.com/api/system/buoihoc")
        ]);
        setMonHocList(monHocRes.data);
        setLopList(lopRes.data);
        setTietHocList(tietHocRes.data);
        setBuoiHocList(buoiHocRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, songay: date }));
  };

  const handleTietHocChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.tiethoc, value]
        : prev.tiethoc.filter((t) => t !== value);
      return { ...prev, tiethoc: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dangky-daybu-backend.onrender.com/makeup-class/dangky-daybu",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const goToAdmin = () => {
    window.location.href = "/admin";
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>Hệ thống Đăng ký Dạy bù</h1>
        <div className="header-buttons">
          {role === "admin" && <button onClick={goToAdmin}>Trang quản trị</button>}
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4">
        <h2 className="mb-4 text-center">Đăng Ký Dạy Bù</h2>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Ngày dạy bù:</label>
            <DatePicker
              selected={formData.songay}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="vi"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Môn học:</label>
            <select name="monhoc" className="form-select" onChange={handleChange} required>
              <option value="">Chọn môn học</option>
              {monHocList.map((mon) => (
                <option key={mon._id} value={mon.name}>{mon.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Buổi học:</label>
            <select name="buoihoc" className="form-select" onChange={handleChange} required>
              <option value="">Chọn buổi</option>
              {buoiHocList.map((buoi) => (
                <option key={buoi._id} value={buoi.name}>{buoi.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Lớp:</label>
            <select name="lop" className="form-select" onChange={handleChange} required>
              <option value="">Chọn lớp</option>
              {lopList.map((lop) => (
                <option key={lop._id} value={lop.name}>{lop.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            <label className="form-label">Tiết học:</label>
            <div className="form-check d-flex flex-wrap">
              {tietHocList.map((tiet) => (
                <div key={tiet._id} className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="tiethoc"
                    value={String(tiet.number)}
                    onChange={handleTietHocChange}
                    checked={formData.tiethoc.includes(String(tiet.number))}
                    id={`tiet${tiet.number}`}
                  />
                  <label className="form-check-label" htmlFor={`tiet${tiet.number}`}>
                    {tiet.number}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-12">
            <label className="form-label">Lý do:</label>
            <textarea
              name="lido"
              className="form-control"
              rows="3"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary px-4">Đăng Ký</button>
          </div>
        </form>

        {/* Xem lịch đã đăng ký */}
        <div className="mt-5">
          <Xemlichday />
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>© 2025 Hệ thống đăng ký dạy bù | Liên hệ: 0915 393 154</p>
      </div>
    </>
  );
};

export default Home;
