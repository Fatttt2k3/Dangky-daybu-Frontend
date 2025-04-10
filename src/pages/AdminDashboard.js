import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDuyetDonDayBu from "../components/admin/admin-duyet"
import MonHocManager from "../components/admin/MonHocManager";

const AdminDashboard = () => {
  const [monhoc, setMonhoc] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/system/monhoc")
      .then((res) => setMonhoc(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-4">
    <h1 className="title">Quản lý dạy bù</h1>
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Danh sách môn học</h4>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {monhoc.map((mh) => (
              <li key={mh._id} className="list-group-item">
                {mh.name}
              </li>
            ))}
          </ul>
        </div>
        <div><AdminDuyetDonDayBu /></div>
        <div><MonHocManager /></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
