import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/vi";
import "bootstrap/dist/css/bootstrap.min.css";

const ThoiKhoaBieuTuan = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [timetable, setTimetable] = useState([]);

  const startOfSchoolYear = moment("09-05", "MM-DD").year(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedWeek]);

  const fetchData = async () => {
    const startOfWeek = moment(startOfSchoolYear).add(selectedWeek - 1, "weeks").startOf("week");
    const endOfWeek = moment(startOfWeek).endOf("week");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/makeup-class", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          from: startOfWeek.format("YYYY-MM-DD"),
          to: endOfWeek.format("YYYY-MM-DD")
        }
      });
      setTimetable(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu thời khóa biểu:", err);
    }
  };

  const renderCell = (day, buoi, tiet) => {
    const dayDate = moment(startOfSchoolYear).add(selectedWeek - 1, "weeks").startOf("isoWeek").add(day, "days");
    const matched = timetable.find(
      (item) =>
        moment(item.songay).isSame(dayDate, "day") &&
        item.buoihoc.toLowerCase() === buoi.toLowerCase() &&
        item.tiethoc.includes(String(tiet))
    );
    if (matched) {
      return (
        <div className="bg-success text-white p-1 rounded">
          <div><strong>{matched.monhoc}</strong></div>
          <div>{matched.lop}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Thời Khóa Biểu Tuần</h2>
      <div className="mb-3">
        <label>Chọn tuần học:</label>
        <select className="form-select" value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
          {Array.from({ length: 35 }, (_, i) => (
            <option key={i + 1} value={i + 1}>Tuần {i + 1}</option>
          ))}
        </select>
      </div>
      <table className="table table-bordered text-center">
        <thead className="table-secondary">
          <tr>
            <th>Buổi/Tiết</th>
            <th>Thứ 2</th>
            <th>Thứ 3</th>
            <th>Thứ 4</th>
            <th>Thứ 5</th>
            <th>Thứ 6</th>
            <th>Thứ 7</th>
            <th>Chủ nhật</th>
          </tr>
        </thead>
        <tbody>
          {["Sáng", "Chiều"].map((buoi, index) => (
            Array.from({ length: 5 }, (_, tiet) => (
              <tr key={`${buoi}${tiet + 1}`}>
                <td>{buoi} - Tiết {tiet + 1}</td>
                {Array.from({ length: 7 }, (_, day) => (
                  <td key={day} style={{ minWidth: "120px" }}>
                    {renderCell(day, buoi, tiet + 1)}
                  </td>
                ))}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThoiKhoaBieuTuan;
