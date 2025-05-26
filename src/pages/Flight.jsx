import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FlightCard from '../components/FlightCard';


const Flight = () => {
    const [selectedOption, setSelectedOption] = useState("2");
    const [form, setForm] = useState({ from: '', to: '', startDate: '', arriveDate: '' });
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);
    const [detail, setDetail] = useState(null);
    const [show, setShow] = useState(false);
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { from, to, startDate, arriveDate } = form;
            const url = `http://localhost:5000/api/chuyenbay/search?start_time=${startDate}T00:00:00&end_time=${arriveDate}T23:59:59&sanbay_di=${from}&sanbay_den=${to}`;
            const res = await fetch(url);
            const data = await res.json();
            setFlights(data.data);
            // Biến kiểm tra thao tác Tìm chuyến
            setSearched(true);
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className='full-container d-flex'>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <h2>FLIGHTS</h2>
                <form onSubmit={handleSearch} className="d-flex my-3 justify-content-around align-items-center">
                    <div>
                        <label htmlFor="from">Từ</label>
                        <input type="text" className="form-control" placeholder="Nhập điểm khởi hành" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
                    </div>
                    <div>
                        <label htmlFor="to">Đến</label>
                        <input type="text" className="form-control" placeholder="Nhập điểm đến" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
                    </div>
                    <div>
                        <label htmlFor="startDate">Ngày khởi hành</label>
                        <input type="date" className="form-control" placeholder="Ngày đi" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                    </div>
                    <div>
                        <label htmlFor="arriveDate">Ngày đến</label>
                        <input type="date" className="form-control" placeholder="Ngày đến" value={form.arriveDate} onChange={(e) => setForm({ ...form, arriveDate: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Tìm</button>
                </form>
                <div className='flight-list'>
                    {flights.length > 0 ? (
                        flights.map(flight => (
                            <FlightCard
                                key={flight.Ma_chuyen_bay}
                                flight={flight}
                                detail={detail}
                                setDetail={setDetail}
                                show={show}
                                setShow={setShow} />
                        ))
                    ) : searched ? (
                        <p className="text-center mt-4 text-dark fw-bold">Không tìm thấy chuyến bay phù hợp</p>
                    ) : (
                        <p className='text-center mt-4 text-dark fw-bold'>Vui lòng nhập thông tin chuyến bay muốn tìm</p>
                    )}
                </div>
            </div>
        </div>

    )
}
export default Flight;