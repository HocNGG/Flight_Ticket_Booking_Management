import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar";
const MonthRevenue = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("6");
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [totalRevenue, setToTalRevenue] = useState("");
    const [totalFlights, setTotalFlights] = useState("");
    const [monthRevenueData, setMonthRevenueData] = useState([]);
    const [time, setTime] = useState({
        month: 1,
        year: 2025
    });
    const years = [
        { value: "", label: "2025" },
        ...Array.from({ length: 100 }, (_, i) => {
            const year = 2005 + i;
            return { value: year, label: year };
        })
    ];
    const COLORS = [
     "#8B0000", "#FF4500", "#FFD400", "#006400", "#D90368", "#2F4F4F", "#4B0082", "#483D8B", "#000", "#800000", "#008080", "#E71D36"




    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTime(prev => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => {
        if (time.month && time.year) {
            const fetchData = async () => {
                try {
                    const res = await fetch(
                        `http://localhost:5000/api/chitietdoanhthuthang/get?thang=${time.month}&nam=${time.year}`
                    );
                    const data = await res.json();
                    if (data.status === "success") {
                        setData(data.data);
                        setToTalRevenue(data.data.reduce((sum, item) => sum + item.Doanh_thu, 0));
                        setTotalFlights(data.data.length);
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
    }, [time.month, time.year]);

    useEffect(() => {
        const fetchMonthRevenueData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/ds_doanhthuthang/get?nam=${time.year}`);
                const result = await res.json();
                if (result.status === "success") {
                    const formattedData = result.data.map((item) => ({
                        name: `Tháng ${item.month}`,
                        value: item.Tong_doanh_thu,
                    }));
                    setMonthRevenueData(formattedData);
                } else {
                    setMonthRevenueData([]);
                }
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", err);
                setMonthRevenueData([]);
            }
        };

        fetchMonthRevenueData();
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
                    <h2>Doanh Thu</h2>
                    <button className="btn btn-success fs-5" onClick={() => {
                        navigate(`/overall-revenue`);
                    }}>Tổng Quan</button>
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
                        <select name="month" id="month" className="fs-4 rounded-2 bg-white text-dark me-4" onChange={handleChange} value={time.month}>
                            <option value="1">Tháng 1</option>
                            <option value="2">Tháng 2</option>
                            <option value="3">Tháng 3</option>
                            <option value="4">Tháng 4</option>
                            <option value="5">Tháng 5</option>
                            <option value="6">Tháng 6</option>
                            <option value="7">Tháng 7</option>
                            <option value="8">Tháng 8</option>
                            <option value="9">Tháng 9</option>
                            <option value="10">Tháng 10</option>
                            <option value="11">Tháng 11</option>
                            <option value="12">Tháng 12</option>
                        </select>
                        <select name="year" id="year" className="fs-4 rounded-2 bg-white text-dark" onChange={handleChange} value={time.year}>
                            {years.map((y) => (
                                <option key={y.value} value={y.value}>{y.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {monthRevenueData.length > 0 && (
                    <div style={{ width: "100%", height: 450, marginBottom: '100px' }} className="mt-5">
                        <h3 className="text-center" style={{ color: '#111' }}>Tỉ lệ doanh thu các tháng trong năm {time.year}</h3>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={monthRevenueData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                    fill="#1B2432"
                                    labelLine={false}
                                >
                                    {monthRevenueData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ color: '#111', fontWeight: 600, fontSize: 16, background: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#111', fontWeight: 600, fontSize: 16 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {data.length > 0 && (
                    <table className="table table-bordered rounded-1 overflow-hidden table-hover align-middle">
                        <thead className="table-primary">
                            <tr>
                                <th>Mã chuyến bay</th>
                                <th>Số ghế đặt</th>
                                <th>Tỉ lệ</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.Ma_chuyen_bay} style={{ height: "60px" }}>
                                    <td>{item.Ma_chuyen_bay}</td>
                                    <td>{item.So_ghe_dat}</td>
                                    <td>{(item.Ti_le * 100).toFixed(1)}%</td>
                                    <td>{item.Doanh_thu.toLocaleString()} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {data.length === 0 && time.month && time.year && !error && (
                    <p className="fw-bold d-flex justify-content-center">Không có chuyến bay nào trong tháng này.</p>
                )}
            </div>
        </div>
        </div>
    )
}
export default MonthRevenue;