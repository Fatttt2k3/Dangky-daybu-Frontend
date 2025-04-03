import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import "../style/Home.css"
registerLocale("vi", vi);
const DangKyDayBu = () => {
  const [formData, setFormData] = useState({
    sotuan: "",
    songay: new Date(),
    monhoc: "",
    tiethoc: "",
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
        updatedTietHoc.push(value);  // Thêm vào mảng nếu checkbox được chọn
      } else {
        updatedTietHoc = updatedTietHoc.filter((t) => t !== value);  // Loại bỏ nếu bị bỏ chọn
      }
  
      return { ...prevData, tiethoc: updatedTietHoc };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked", formData); // Kiểm tra dữ liệu đầu vào
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/makeup-class/dangky-daybu",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Server response:", response.data); // Kiểm tra phản hồi từ server
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };
  
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.post("http://localhost:5000/makeup-class/dangky-daybu", formData, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
  //   }
  // };

  return (
    <div className="home-body">
            {/* <alert>{message && <p>{message}</p>}  </alert>   */}
    <div className="home-header">
      <h2>Đăng Ký Dạy Bù</h2>
    </div>
    <div className="home-content">
        <div className="home-content-dangky">
          <form onSubmit={handleSubmit}>
         
          <div className="home-box">
            <label>Ngày dạy bù:</label>
            <DatePicker
                selected={formData.songay}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale="vi"
                placeholderText="Chọn ngày"
                required
              />        </div>
        <div className="home-box">
            <label>Môn học:</label>
            <select name="monhoc" onChange={handleChange} required>
              <option value="">Chọn môn học</option>
              {monHocList.map((mon) => (
                <option key={mon._id} value={mon.name}>{mon.name}</option>
              ))}
            </select>
          </div>
          <div className="home-box">
            <label>Buổi học:</label>
            <select name="buoihoc" onChange={handleChange} required>
              <option value="">Chọn buổi</option>
              {buoiHocList.map((buoi) => (
                <option key={buoi._id} value={buoi.name}>{buoi.name}</option>
              ))}
            </select>

            </div>
            <div className="home-box">
            <label>Lớp:</label>
            <select name="lop" onChange={handleChange} required>
              <option value="">Chọn lớp</option>
              {lopList.map((lop) => (
                <option key={lop._id} value={lop.name}>{lop.name}</option>
              ))}
            </select>
          </div>
          <div className="home-box">
  
  <label>Tiết học:</label>
  <div className="home-dangky-checkbox">
    {tietHocList.map((tiet) => (
      
      <label key={tiet._id} style={{ marginRight: "10px" }}>
        <input 
          type="checkbox"
          name="tiethoc"
          value={String(tiet.number)}  // Ép kiểu số thành chuỗi
          onChange={handleTietHocChange}
          checked={formData.tiethoc.includes(String(tiet.number))}  // Kiểm tra giá trị đã chọn
        />
        {tiet.number}
      </label>
    ))}
  </div>
</div>

          {/* <div className="home-box">
            <label>Tiết học:</label>
            <select name="tiethoc" onChange={handleChange} required>
              <option value="">Chọn tiết học</option>
              {tietHocList.map((tiet) => (
                <option key={tiet._id} value={tiet.number}>{tiet.number}</option>
              ))}
            </select>
          </div> */}
          <div className="home-box">
            <label>Lý do:</label>
            <textarea name="lido" onChange={handleChange} required></textarea>
            </div>

            <button type="submit">Đăng Ký</button>
          </form>
        </div>
 

    </div>

    <div className="home-footer">
      <h3>Chân trang đây nè</h3>
    </div>
     
    </div>
  );
};

export default DangKyDayBu;
