import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import FlightCard from '../components/FlightCard';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
const Flights = () => {
    const [selectedOption, setSelectedOption] = useState("2");
    const [form, setForm] = useState({ from: '', to: '', startDate: '', arriveDate: '' });
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);
    const [detail, setDetail] = useState(null);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { from, to, startDate, arriveDate } = form;
            const url = `http://localhost:5000/api/chuyenbay/search?start_time=${startDate}T00:00:00&end_time=${arriveDate}T23:59:59&sanbay_di=${from}&sanbay_den=${to}`;
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
                setFlights(data.data);
            } else {
                // Nếu không có chuyến bay nào
                setFlights([]);
            }
            setSearched(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (flightId) => {
    setFlights((prev) => prev.filter((f) => f.Ma_chuyen_bay !== flightId));
  };

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/chuyenbay/get/all`, {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.ok && Array.isArray(data.message) && data.message.length > 0) {
                    setFlights(data.message);
                } else {
                    console.warn("Dữ liệu chuyến bay không hợp lệ hoặc không phải mảng:", data);
                    setFlights([]); // Gán mảng rỗng để tránh lỗi .length
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFlights();
        console.log("Dữ liệu flights:", flights);
    }, []);
    return (
        <>
        <div className='full-container d-flex'>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <div className='d-flex justify-content-between'>
                    <h2>CHUYẾN BAY</h2>
                    <button className='btn btn-success' onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/create-flight`);
                    }}> + Tạo Chuyến Bay</button>
                </div>
                <form onSubmit={handleSearch} className="d-flex my-3 justify-content-between align-items-center">
                    <div>
                        <label htmlFor="from" className='mb-2 fs-5'>Từ</label>
                        <input type="text" className="form-control fs-5" placeholder="Nhập điểm khởi hành" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
                    </div>
                    <div>
                        <label htmlFor="to" className='mb-2 fs-5'>Đến</label>
                        <input type="text" className="form-control fs-5" placeholder="Nhập điểm đến" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
                    </div>
                    <div>
                        <label htmlFor="startDate" className='mb-2 fs-5'>Ngày khởi hành</label>
                        <input type="date" className="form-control fs-5" placeholder="Ngày đi" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                    </div>
                    <div>
                        <label htmlFor="arriveDate" className='mb-2 fs-5'>Ngày đến</label>
                        <input type="date" className="form-control fs-5" placeholder="Ngày đến" value={form.arriveDate} onChange={(e) => setForm({ ...form, arriveDate: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-5 fs-5">Tìm</button>
                </form>
                <div className='flight-list rounded-3 p-2'>
                    {flights.length > 0 ? (
                        flights
                            // Chỉ hiển thị các chuyến bay chưa bay
                            // .filter(flight => {
                            //     const today = new Date();
                            //     const flightDate = new Date(flight.ngay_khoi_hanh);
                            //     return flightDate >= today;
                            // })
                            .map(flight => (
                                <FlightCard
                                    key={flight.Ma_chuyen_bay}
                                    flight={flight}
                                    detail={detail}
                                    setDetail={setDetail}
                                    show={show}
                                    setShow={setShow}
                                    onDelete={handleDelete}
                                />
                            ))
                    ) : null}
                </div>
            </div>
        </div>
        <Footer></Footer>
        </>
    )
}
export default Flights;