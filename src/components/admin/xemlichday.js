import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Xemlichday() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLichDayBu = async () => {
    try {
      const token = localStorage.getItem("token"); // Giả sử token lưu trong localStorage
      const res = await axios.get("https://dangky-daybu-backend.onrender.com/makeup-class/lichdaygiaovien", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data);
    } catch (err) {
      alert("Không thể tải danh sách dạy bù!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLichDayBu();
  }, []);

  return (
    <div className="container my-4">
      <h4 className="mb-3">📘 Danh sách lịch dạy bù</h4>

      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : data.length === 0 ? (
        <div className="alert alert-warning">Không có lịch dạy bù nào.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-primary">
              <tr>
                <th>STT</th>
                <th>Ngày dạy</th>
                <th>Buổi</th>
                <th>Tiết</th>
                <th>Môn học</th>
                <th>Lớp</th>
                <th>Giáo viên</th>
                <th>Bộ môn</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const dateStr = new Date(item.songay).toLocaleDateString("vi-VN");
                const tietStr = item.tiethoc.join(", ");

                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{dateStr}</td>
                    <td>{item.buoihoc}</td>
                    <td>{tietStr}</td>
                    <td>{item.monhoc}</td>
                    <td>{item.lop}</td>
                    <td>{item.giaovien}</td>
                    <td>{item.bomon}</td>
                    <td>{item.lido}</td>
                    <td>
                      {item.trangthai === "Cho duyet" && <span className="badge bg-warning text-dark">Chờ duyệt</span>}
                      {item.trangthai === "Dong y" && <span className="badge bg-success">Đồng ý</span>}
                      {item.trangthai === "Tu choi" && <span className="badge bg-danger">Từ chối</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
