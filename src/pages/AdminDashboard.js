import React, { useState, useEffect } from "react";
import AdminDuyetDonDayBu from "../components/admin/admin-duyet";
import MonHocManager from "../components/admin/MonHocManager";
import LopManager from "../components/admin/LopManager";
import TietHocManager from "../components/admin/TietHocManager";
import BuoihocManager from "../components/admin/BuoihocManager";
import UserManager from "../components/admin/UserManager";
import BomonManager from "../components/admin/BomonManager";
import ToggleKhoaTrang from "../components/admin/Khoatrang";
import "../style/AdminDashboard.css"; // <== file CSS riêng
import DanhSachDangKy from "../components/admin/DanhsachDangky";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("duyet");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const goToHome = () => {
    window.location.href = "/home";
  };
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/home'); // hoặc "/" tuỳ bạn
    }
  }, []);
  const renderComponent = () => {
    switch (activeTab) {
      case "danhsachdangky": return <DanhSachDangKy />;
      case "duyet": return <AdminDuyetDonDayBu />;
      case "monhoc": return <MonHocManager />;
      case "lop": return <LopManager />;
      case "tiethoc": return <TietHocManager />;
      case "buoihoc": return <BuoihocManager />;
      case "bomon": return <BomonManager />;
      case "user": return <UserManager />;
      case "khoatrang": return <ToggleKhoaTrang />;
     default: return null;
    }
  };

  return (<>
   <div className="header">
   <strong className="admin-title">AdminDashboard</strong>
   <div className="header-buttons">
          <button onClick={goToHome}>Trang chủ  </button>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
    <div className="admin-container">
      <div className="admin-sidebar">
        <button onClick={() => setActiveTab("danhsachdangky")}>Danh sách đăng ký</button>
        <button onClick={() => setActiveTab("duyet")}>Duyệt đơn</button>
        <button onClick={() => setActiveTab("monhoc")}>Quản lý Môn học</button>
        <button onClick={() => setActiveTab("lop")}>Quản lý Lớp</button>
        <button onClick={() => setActiveTab("tiethoc")}>Quản lý Tiết học</button>
        <button onClick={() => setActiveTab("buoihoc")}>Quản lý Buổi học</button>
        <button onClick={() => setActiveTab("bomon")}>Quản lý Bộ môn</button>
        <button onClick={() => setActiveTab("user")}>Quản lý Giáo viên</button>
        <button onClick={() => setActiveTab("khoatrang")}>Khóa trang</button>
        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>Đăng xuất</button>

      </div>
      <div className="admin-content">
        {renderComponent()}
      </div>
    </div>
    <div className="footer">
        <p>© 2025 Hệ thống đăng ký dạy bù | Liên hệ: 0915 393 154</p>
      </div>
  </>
    
  );
};

export default AdminDashboard;




