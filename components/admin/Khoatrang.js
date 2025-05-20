import React, { useState, useEffect } from "react";
import "../../style/Khoatrang.css"
import { FormLabel } from "react-bootstrap";
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
      <div className="row">
        <input
          className="col-1
"
          type="checkbox"
          id="toggleLock"
          checked={isLocked}
          onChange={handleToggle}
        />
        <form className="col-2" htmlFor="toggleLock">
          {isLocked ? <>🔒 Đang khóa trang đăng ký</> : <>✅ Đang mở trang đăng ký</>}
        </form>
      </div>
    </div>
  );
};

export default ToggleKhoaTrang;
