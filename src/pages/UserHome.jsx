import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFlightCard from '../components/UserFlightCard';
import './UserHome.css';

const UserHome = () => {
  const [flights, setFlights] = useState([]);
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    startDate: '',
    arriveDate: ''
  });
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch danh sách sân bay
    const fetchAirports = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sanbay/get');
        const data = await res.json();
        if (data.status === 'success') {
          setAirports(data.message);
        }
      } catch (err) {
        console.error('Lỗi lấy danh sách sân bay:', err);
      }
    };
    fetchAirports();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { from, to, startDate, arriveDate } = searchForm;
      if (!from || !to || !startDate || !arriveDate) {
        setError('Vui lòng điền đầy đủ thông tin tìm kiếm');
        return;
      }

      const url = `http://localhost:5000/api/chuyenbay/search?start_time=${startDate}T00:00:00&end_time=${arriveDate}T23:59:59&sanbay_di=${from}&sanbay_den=${to}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
        setFlights(data.data);
        setError('');
      } else {
        setFlights([]);
        setError('Không tìm thấy chuyến bay phù hợp');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm');
    }
  };

  const handleBookTicket = (flightId) => {
    // Chuyển hướng đến trang đặt vé với thông tin chuyến bay
    navigate(`/book-ticket/${flightId}`);
  };

  return (
    <div className="user-home-container">
      {/* Header với nút đăng nhập cho admin */}    
      <header className="user-home-header" style={{
         background:' rgba(0,0,0,0.6)',
         color:'#fff',
         cursor: 'pointer',
         opacity:'2',
         zIndex:'9',
         textShadow:'1px 1px  10px #fff'
      }}>
        <h1>Hệ Thống Đặt Vé Máy Bay Online Dành Cho Hành Khách</h1>
        <div>
        <button className="btn-95" onClick={() => navigate('/login')}
        ><svg viewBox="0 0 241.016 241.016">
        <path
          d="M210.818,96.393l-49.202,1.644L108.753,0H83.279c-2.791,0-5.052,2.259-5.052,5.055l27.504,94.843l-50.097,2.037
                c-4.312,0.004-8.372,0.732-11.97,1.997l-18.925-32.14L8.857,71.788c-2.105,0.004-3.811,1.708-3.811,3.814l13.848,42.361v5.09
                L5.047,165.414c-0.002,2.105,1.704,3.814,3.809,3.814l15.885,0.004l19.257-32.713c3.514,1.197,7.455,1.885,11.637,1.885
                l50.288,2.046l-27.698,95.516c0,2.795,2.259,5.05,5.052,5.05h25.474l53.227-98.696l48.84,1.631
                c13.894,0,25.152-10.652,25.152-23.779C235.971,107.041,224.713,96.393,210.818,96.393z"
        ></path>
      </svg>
        </button>
        <span>Đăng nhập</span>       
        </div>
      </header>
      {/* Form tìm kiếm chuyến bay */}
      <div className="search-section" style={{
           background:' rgba(0,0,0,0.6)',
           color:'#fff',
           cursor: 'pointer',
           opacity:'2',
           zIndex:'9',
           textShadow:'1px 1px  10px #fff'
      }}>
        <h2 style={{
           color:' rgb(236, 241, 241)',
          opacity:4,
          zIndex:4,
          textShadow:'1px 1px 8px #fff',
          fontWeight:'bold',
        }}>Tìm Chuyến Bay</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>Điểm đi</label>
            <select
              value={searchForm.from}
              onChange={(e) => setSearchForm({...searchForm, from: e.target.value})}
              required
            >
              <option value="">Chọn sân bay đi</option>
              {airports.map((airport) => (
                <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                  {airport.Ten_san_bay} ({airport.Ma_san_bay})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>Điểm đến</label>
            <select
              value={searchForm.to}
              onChange={(e) => setSearchForm({...searchForm, to: e.target.value})}
              required
            >
              <option value="">Chọn sân bay đến</option>
              {airports.map((airport) => (
                <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                  {airport.Ten_san_bay} ({airport.Ma_san_bay})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>Ngày đi</label>
            <input
              type="date"
              value={searchForm.startDate}
              onChange={(e) => setSearchForm({...searchForm, startDate: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>Ngày đến</label>
            <input
              type="date"
              value={searchForm.arriveDate}
              onChange={(e) => setSearchForm({...searchForm, arriveDate: e.target.value})}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-88">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 2a8 8 0 105.29 14.29l4.7 4.7a1 1 0 001.42-1.42l-4.7-4.7A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      <div className="flights-section" style={{
        background: 'rgba(0,0,0,0.6)',
        color:'#000',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        padding: '32px',
        marginBottom: '30px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
      }}>
        {error && <p className="error-message">{error}</p>}
        
        {flights.length > 0 ? (
          <div className="flights-list">
            {flights.map((flight) => (
              <UserFlightCard
                key={flight.Ma_chuyen_bay}
                flight={flight}
              />
            ))}
          </div>
        ) : (
          <p className="no-flights">Vui lòng tìm kiếm chuyến bay</p>
        )}
      </div>
    </div>
  );
};

export default UserHome; 