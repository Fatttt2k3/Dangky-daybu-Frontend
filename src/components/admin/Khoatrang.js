import React, { useState, useEffect } from "react";
import "../../style/Khoatrang.css"
const ToggleKhoaTrang = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const lockStatus = localStorage.getItem("isPageLocked");
    setIsLocked(lockStatus === "true");
  }, []);

  const handleToggle = () => {
    const newStatus = !isLocked;
    localStorage.setItem("isPageLocked", newStatus.toString());
    setIsLocked(newStatus);
  };

  return (
    <div className="container mt-4">
      <h4 >Đóng mở trang đăng ký</h4>
      <div className="form-check form-switch mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleLock"
          checked={isLocked}
          onChange={handleToggle}
        />
        <label className="form-check-label" htmlFor="toggleLock">
          {isLocked ? <p className="khoa-trang">🔒 Đang khóa trang đăng ký</p> : <p className="khoa-trang">✅ Đang mở trang đăng ký</p>}
        </label>
      </div>
    </div>
  );
};

export default ToggleKhoaTrang;
