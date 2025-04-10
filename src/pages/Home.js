import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import "../style/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ThoiKhoaBieuTuan from "../components/chucnangchung/xem-tkb";
registerLocale("vi", vi);

const DangKyDayBu = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monHocRes, lopRes, tietHocRes, buoiHocRes] = await Promise.all([
          axios.get("http://localhost:5000/api/system/monhoc"),
          axios.get("http://localhost:5000/api/system/lop"),
          axios.get("http://localhost:5000/api/system/tiethoc"),
          axios.get("http://localhost:5000/api/system/buoihoc")
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
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, songay: date });
  };

  const handleTietHocChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      let updatedTietHoc = [...prevData.tiethoc];
      if (checked) {
        updatedTietHoc.push(value);
      } else {
        updatedTietHoc = updatedTietHoc.filter((t) => t !== value);
      }
      return { ...prevData, tiethoc: updatedTietHoc };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/makeup-class/dangky-daybu",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
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
      <div><ThoiKhoaBieuTuan/></div>
    </div>
  );
};

export default DangKyDayBu;
