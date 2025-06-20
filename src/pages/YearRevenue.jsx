import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import Sidebar from "../components/Sidebar";
const YearRevenue = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("7");
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [totalRevenue, setToTalRevenue] = useState("");
    const [totalFlights, setTotalFlights] = useState("");
    const [yearRevenueData, setYearRevenueData] = useState([]);
    const monthNames = [
        "", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    const chartData = data.map(item => ({
        ...item,
        name: monthNames[item.month],
    }));
    const [time, setTime] = useState({
        year: 2025
    });
    const years = [
        { value: "", label: "2025" },
        ...Array.from({ length: 100 }, (_, i) => {
            const year = 2005 + i;
            return { value: year, label: year };
        })
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTime(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        if (time.year) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem('access_token');
                    const res = await fetch(
                        `https://se104-airport.space/api/ds_doanhthuthang/get?nam=${time.year}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );
                    const data = await res.json();
                    if (data.status === "success") {
                        setData(data.data);
                        const total = data.data.reduce((sum, item) => sum + item.Tong_doanh_thu, 0);
                        setData(data.data.map(item => ({
                            ...item,
                            Ti_le: total > 0 ? item.Tong_doanh_thu / total : 0
                        })));
                        setToTalRevenue(total);
                        setTotalFlights(data.data.reduce((sum, item) => sum + item.so_chuyen_bay, 0));
                        setYearRevenueData(data.data.map(item => ({
                            name: `Tháng ${item.month}`,
                            value: item.Tong_doanh_thu
                        })));
                        setError("");
                    } else {
                        setData([]);
                        setError(res.data.message);
                    }
                } catch {
                    setData([]);
                    setError("Lỗi kết nối tới server.");
                }
            };
            fetchData();
        }
    }, [time.year]);

    return (
        <div className='full-container d-flex' style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1535557597501-0fee0a500c57?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'top'
        }}>
        <div className="full-container d-flex">
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>

            <div className="mt-5 p-4 w-100">
                <div className="d-flex justify-content-between">
                    <h2 style={{fontWeight: 'bold'}}>📈  Doanh Thu</h2>
                    <button className="btn btn-success fs-5" onClick={() => {
                        navigate(`/detail-revenue`);
                    }}>Xem Chi Tiết</button>
                </div>
                <div className="d-flex mt-5 justify-content-around bg-white p-4 shadow-sm text-center rounded-2">
                    <div>
                        <h3>Tổng Doanh Thu</h3>
                        <p className="fs-1 fw-bold text-danger"> {totalRevenue.toLocaleString()} VND</p>
                    </div>
                    <div>
                        <h3>Số Chuyến Bay</h3>
                        <p className="fs-1 fw-bold text-danger">{totalFlights}</p>
                    </div>
                    <div>
                        <select name="year" id="year" className="fs-4 rounded-2 bg-white text-dark" onChange={handleChange} value={time.year}>
                            {years.map((y) => (
                                <option key={y.value} value={y.value}>{y.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {yearRevenueData.length > 0 && (
                    <div style={{ width: "100%", height: 420 }} className="mt-5">
                        <h3 className="text-center" style={{ color: '#111' }}>Tỉ lệ doanh thu theo tháng trong năm {time.year}</h3>
                        <div style={{ borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={chartData} margin={{ top: 20, right: 40, left: 60, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <XAxis dataKey="name" tick={{ fill: '#111', fontWeight: 600, fontSize: 16 }} />
                                    <YAxis tickFormatter={(value) => value.toLocaleString() + " VND"} tick={{ fill: '#111', fontWeight: 600, fontSize: 16 }} />
                                    <Tooltip formatter={(value) => [`${value.toLocaleString()} VND`, "Tổng doanh thu"]} labelFormatter={(label) => `Tháng: ${label}`} contentStyle={{ color: '#111', fontWeight: 600, fontSize: 16 }} />
                                    <Bar dataKey="Tong_doanh_thu" fill="#1B2432" barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
                {data.length > 0 && (
                    <table className="table table-bordered rounded-1 overflow-hidden table-hover align-middle">
                        <thead className="table-primary">
                            <tr>
                                <th>Tháng</th>
                                <th>Số Chuyến Bay</th>
                                <th>Tỉ lệ</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.month} style={{ height: "60px" }}>
                                    <td>{item.month}</td>
                                    <td>{item.so_chuyen_bay}</td>
                                    <td> {item.Ti_le !== undefined && item.Ti_le !== null
                                        ? (item.Ti_le * 100).toFixed(1) + " %"
                                        : "0 %"}</td>
                                    <td>{item.Tong_doanh_thu.toLocaleString()} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {data.length === 0 && time.year && !error && (
                    <p className="fw-bold d-flex justify-content-center">Không có chuyến bay nào trong tháng này.</p>
                )}
            </div>
        </div>
        </div>
    )

}
export default YearRevenue;