import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://dangky-daybu-backend.onrender.com/makeup-class/thoikhoabieu";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const periods = [1, 2, 3, 4, 5];

export default function ThoiKhoaBieuViewer() {
  const [tuan, setTuan] = useState(1);
  const [data, setData] = useState([]);
  const [namhoc, setNamhoc] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}?tuan=${tuan}`);
      setData(res.data.data);
      setNamhoc(res.data.namhoc);
    } catch (err) {
      alert("Không thể tải thời khóa biểu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tuan]);

  const renderCell = (buoi, thu, tiet) => {
    const found = data.find((d) => {
      const date = new Date(d.songay);
      const dow = (date.getDay() + 6) % 7; // 0 = Thứ 2
      return (
        dow === thu &&
        d.buoihoc === buoi &&
        d.tiethoc.includes(tiet)
      );
    });

    return found ? (
      <div className="bg-light border p-1 rounded small">
        <div><strong>{found.monhoc}</strong></div>
        <div>Lớp: {found.lop}</div>
        <div>GV: {found.giaovien}</div>
      </div>
    ) : null;
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          Thời khóa biểu tuần {tuan} ({namhoc})
        </h4>
        <div className="d-flex align-items-center">
          <label className="me-2 mb-0">Chọn tuần:</label>
          <select className="form-select" style={{ width: 120 }} value={tuan} onChange={(e) => setTuan(Number(e.target.value))}>
            {Array.from({ length: 35 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tuần {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-4">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>Buổi / Tiết</th>
                {days.map((d, i) => (
                  <th key={i}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Sáng", "Chiều"].map((buoi) =>
                periods.map((tiet) => (
                  <tr key={`${buoi}-${tiet}`}>
                    <th className="bg-light">{buoi} - Tiết {tiet}</th>
                    {days.map((_, thuIndex) => (
                      <td key={thuIndex}>
                        {renderCell(buoi, thuIndex, tiet)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
