import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserFlightCard from '../components/UserFlightCard';
import TicketCard from '../components/TicketCard';
import '../UserHome.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { BASE_URL } from '../utils/api';

const MySwal = withReactContent(Swal);

const UserHome = () => {
  const [flights, setFlights] = useState([]);
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    startDate: '',
    arriveDate: ''
  });
  const [ticketSearchForm, setTicketSearchForm] = useState({
    cmnd: '',
    phone: '',
    ticketId: ''
  });
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchedTickets, setSearchedTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let airportsLoaded = false;
    let flightsLoaded = false;
    // Hiện SweetAlert khi bắt đầu load
    MySwal.fire({
      title: 'Đang tải dữ liệu...',
      allowOutsideClick: false,
      didOpen: () => { MySwal.showLoading(); }
    });
    // Fetch danh sách sân bay
    const fetchAirports = async () => {
      try {
        const res = await fetch(`${BASE_URL}/sanbay/get`);
        const data = await res.json();
        if (data.status === 'success') {
          setAirports(data.message);
        }
      } catch {
        console.error('Lỗi lấy danh sách sân bay');
      } finally {
        airportsLoaded = true;
        if (airportsLoaded && flightsLoaded) {
          setLoading(false);
        }
      }
    };
    fetchAirports();

    // Fetch tất cả chuyến bay khi vào trang
    const fetchAllFlights = async () => {
      try {
        const res = await fetch(`${BASE_URL}/chuyenbay/get/all`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.message)) {
          // Lọc các chuyến bay chưa khởi hành (sau ngày hiện tại ít nhất 1 ngày)
          const today = new Date();
          today.setHours(0,0,0,0);
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const filteredFlights = data.message.filter(flight => {
            const flightDate = new Date(flight.ngay_khoi_hanh);
            return flightDate >= tomorrow;
          });
          setFlights(filteredFlights);
          setError('');
        } else {
          setFlights([]);
          setError('Không tìm thấy chuyến bay');
        }
      } catch {
        setFlights([]);
        setError('Có lỗi xảy ra khi tải chuyến bay');
      } finally {
        flightsLoaded = true;
        if (airportsLoaded && flightsLoaded) {
          setLoading(false);
        }
      }
    };
    fetchAllFlights();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Đã load xong cả hai API, hiện thông báo cho người dùng xác nhận
      MySwal.fire({
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      });
    }
  }, [loading]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { from, to, startDate, arriveDate } = searchForm;
      if (!from || !to || !startDate || !arriveDate) {
        setError('Vui lòng điền đầy đủ thông tin tìm kiếm');
        return;
      }
      setSearching(true);
      MySwal.fire({
        title: 'Đang tìm kiếm chuyến bay...',
        allowOutsideClick: false,
        didOpen: () => { MySwal.showLoading(); }
      });
      const url = `${BASE_URL}/chuyenbay/search?start_time=${startDate}T00:00:00&end_time=${arriveDate}T23:59:59&sanbay_di=${from}&sanbay_den=${to}`;
      const res = await fetch(url);
      const data = await res.json();
      await MySwal.close();
      if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
        // Lọc các chuyến bay chưa khởi hành (sau ngày hiện tại ít nhất 1 ngày)
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const filteredFlights = data.data.filter(flight => {
          const flightDate = new Date(flight.ngay_khoi_hanh);
          return flightDate >= tomorrow;
        });
        setFlights(filteredFlights);
        setError('');
        MySwal.fire({
          icon: 'success',
          title: 'Tìm kiếm thành công',
          showConfirmButton: false,
          timer: 1200
        });
      } else {
        setFlights([]);
        setError('Không tìm thấy chuyến bay phù hợp');
        MySwal.fire({
          icon: 'warning',
          title: 'Không tìm thấy chuyến bay phù hợp',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch {
      setError('Có lỗi xảy ra khi tìm kiếm');
      MySwal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra khi tìm kiếm',
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setSearching(false);
    }
  };

  const handleTicketSearch = async (e) => {
    e.preventDefault();
    const { cmnd, phone, ticketId } = ticketSearchForm;
    
    if (!cmnd || !phone || !ticketId) {
      setError('Vui lòng điền đầy đủ thông tin tra cứu vé');
      return;
    }

    try {
      setSearching(true);
      MySwal.fire({
        title: 'Đang tra cứu vé...',
        allowOutsideClick: false,
        didOpen: () => { MySwal.showLoading(); }
      });

      // Gọi API tìm vé theo CMND
      const res = await fetch(`${BASE_URL}/vechuyenbay/get_by_hanhkhach/cmnd/${cmnd}`);
      const data = await res.json();

      if (res.ok && data.status === 'success' && data.data) {
        const ticketList = data.data;
        
        // Lọc vé theo số điện thoại và mã vé
        const matchedTickets = ticketList.filter(ticket => {
          // Lấy chi tiết vé để có thông tin hành khách
          return ticket.Ma_ve.toString() === ticketId;
        });

        if (matchedTickets.length === 0) {
          setSearchedTickets([]);
          setError('Không tìm thấy vé phù hợp với thông tin đã nhập');
          MySwal.fire({
            icon: 'warning',
            title: 'Không tìm thấy vé',
            text: 'Vui lòng kiểm tra lại thông tin CMND, số điện thoại và mã vé',
            confirmButtonText: 'OK'
          });
          return;
        }

        // Lấy chi tiết từng vé để có Ma_hanh_khach
        const detailedTickets = await Promise.all(
          matchedTickets.map(async (ticket) => {
            try {
              const detailRes = await fetch(`${BASE_URL}/vechuyenbay/get/${ticket.Ma_ve}`);
              const detailData = await detailRes.json();
              if (detailRes.ok && detailData.status === 'success') {
                return {
                  ...ticket,
                  Ma_hanh_khach: detailData.data.Ma_hanh_khach,
                  vi_tri: detailData.data.vi_tri || ticket.vi_tri
                };
              }
              return ticket;
            } catch (error) {
              console.error(`Error fetching ticket detail for ${ticket.Ma_ve}:`, error);
              return ticket;
            }
          })
        );

        // Lấy thông tin hành khách để so sánh số điện thoại
        const verifiedTickets = [];
        for (const ticket of detailedTickets) {
          if (ticket.Ma_hanh_khach) {
            try {
              const passengerRes = await fetch(`${BASE_URL}/hanhkhach/get/${ticket.Ma_hanh_khach}`);
              const passengerData = await passengerRes.json();
              if (passengerRes.ok && passengerData.status === 'success') {
                const passenger = passengerData.data;
                // So sánh số điện thoại
                if (passenger.sdt === phone) {
                  verifiedTickets.push({
                    ...ticket,
                    Ho_ten: passenger.Hoten,
                    cmnd: passenger.cmnd,
                    sdt: passenger.sdt,
                    gioi_tinh: passenger.gioi_tinh
                  });
                }
              }
            } catch (error) {
              console.error(`Error fetching passenger info for ${ticket.Ma_hanh_khach}:`, error);
            }
          }
        }

        if (verifiedTickets.length === 0) {
          setSearchedTickets([]);
          setError('Thông tin không chính xác. Vui lòng kiểm tra lại số điện thoại và mã vé');
          MySwal.fire({
            icon: 'warning',
            title: 'Thông tin không chính xác',
            text: 'Vui lòng kiểm tra lại số điện thoại và mã vé',
            confirmButtonText: 'OK'
          });
        } else {
          setSearchedTickets(verifiedTickets);
          setError('');
          MySwal.fire({
            icon: 'success',
            title: 'Tra cứu thành công',
            text: `Tìm thấy ${verifiedTickets.length} vé`,
            confirmButtonText: 'OK'
          });
        }
      } else {
        setSearchedTickets([]);
        setError('Không tìm thấy vé với CMND này');
        MySwal.fire({
          icon: 'warning',
          title: 'Không tìm thấy vé',
          text: 'Không tìm thấy vé với CMND này',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error searching tickets:', error);
      setSearchedTickets([]);
      setError('Có lỗi xảy ra khi tra cứu vé');
      MySwal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Có lỗi xảy ra khi tra cứu vé',
        confirmButtonText: 'OK'
      });
    } finally {
      setSearching(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    // Tìm vé để lấy mã hành khách
    const ticket = searchedTickets.find(t => t.Ma_ve === ticketId);
    if (!ticket) return;

    const result = await MySwal.fire({
      title: 'Xác nhận hủy vé',
      html: `<div style='margin-bottom:8px'>Mã vé: <b>${ticketId}</b></div>` +
            `<div style='margin-bottom:8px'>Vui lòng nhập mã hành khách để xác nhận:</div>` +
            `<input id='maHanhKhachInput' class='swal2-input' placeholder='Nhập mã hành khách' type='text' />`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hủy vé',
      cancelButtonText: 'Không',
      preConfirm: () => {
        const input = document.getElementById('maHanhKhachInput').value;
        if (!input) {
          MySwal.showValidationMessage('Vui lòng nhập mã hành khách');
          return false;
        }
        if (input !== String(ticket.Ma_hanh_khach)) {
          MySwal.showValidationMessage('Mã hành khách không đúng!');
          return false;
        }
        return input;
      }
    });

    if (!result.isConfirmed) return;

    try {
      MySwal.fire({
        title: 'Đang hủy vé...',
        allowOutsideClick: false,
        didOpen: () => { MySwal.showLoading(); }
      });

      const res = await fetch(`${BASE_URL}/vechuyenbay/delete/ticket/${ticketId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      await MySwal.close();

      if (res.ok && data.status === 'success') {
        // Xóa vé khỏi danh sách
        setSearchedTickets(prev => prev.filter(ticket => ticket.Ma_ve !== ticketId));
        
        MySwal.fire({
          title: 'Thành công!',
          text: 'Vé đã được hủy thành công, chúng tôi sẽ liên lạc với bạn sau để hoàn trả tiền!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        MySwal.fire({
          title: 'Lỗi!',
          text: data.message || 'Không thể hủy vé!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error canceling ticket:', error);
      MySwal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi hủy vé!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
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
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
             <span>Đăng nhập</span>
             <span>(Chỉ admin)</span>         
        </div>
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
          <div style={{ display: 'flex',flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <button type="submit" className="btn-88" disabled={searching}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 2a8 8 0 105.29 14.29l4.7 4.7a1 1 0 001.42-1.42l-4.7-4.7A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
              </svg>
            </button>
            <span>Tìm kiếm</span>     
          </div>
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
          <p className="no-flights">Không tìm thấy chuyến bay</p>
        )}
      </div>

      {/* Form tìm kiếm vé */}
      <div className="ticket-search-section" style={{
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        cursor: 'pointer',
        opacity: '2',
        zIndex: '9',
        textShadow: '1px 1px  10px #fff'
      }}>
        <h2 style={{
          color: 'rgb(236, 241, 241)',
          opacity: 4,
          zIndex: 4,
          textShadow: '1px 1px 8px #fff',
          fontWeight: 'bold',
        }}>Tra Cứu Vé</h2>
        <form onSubmit={handleTicketSearch} className="ticket-search-form">
          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>CMND</label>
            <input
              type="text"
              value={ticketSearchForm.cmnd}
              onChange={(e) => setTicketSearchForm({...ticketSearchForm, cmnd: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>Số Điện Thoại</label>
            <input
              type="text"
              value={ticketSearchForm.phone}
              onChange={(e) => setTicketSearchForm({...ticketSearchForm, phone: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label style={{
              color: 'rgb(236, 241, 241)',
              opacity: 4,
              zIndex: 4,
              textShadow: '1px 1px 8px #fff',
            }}>Mã Vé</label>
            <input
              type="text"
              value={ticketSearchForm.ticketId}
              onChange={(e) => setTicketSearchForm({...ticketSearchForm, ticketId: e.target.value})}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <button type="submit" className="btn-88" disabled={searching}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M10 2a8 8 0 105.29 14.29l4.7 4.7a1 1 0 001.42-1.42l-4.7-4.7A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
                </svg>
              </button>
              <span>Tra Cứu</span>
            </div>
          </div>
        </form>
      </div>

      {/* Hiển thị kết quả tìm kiếm vé */}
      <div className="ticket-results-section" style={{
        background: 'rgba(0,0,0,0.6)',
        color: '#000',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        padding: '32px',
        marginBottom: '30px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
      }}>
        {error && <p className="error-message">{error}</p>}
        
        {searchedTickets.length > 0 ? (
          <div className="ticket-results-list">
            {searchedTickets.map((ticket) => (
              <TicketCard
                key={ticket.Ma_ve}
                ticket={ticket}
                onCancel={handleCancelTicket}
              />
            ))}
          </div>
        ) : (
          <p className="no-tickets">Không tìm thấy vé</p>
        )}
      </div>
    </div>
  );
};

export default UserHome; 