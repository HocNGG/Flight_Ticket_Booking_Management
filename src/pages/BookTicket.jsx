import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BookTicket = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy state từ navigate (nếu có)
  const navState = location.state || {};
  const [flight, setFlight] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [price, setPrice] = useState(navState.price || null);
  // Thông tin cá nhân
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Nam');
  const [cmnd, setCmnd] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/chuyenbay/get/${flightId}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setFlight(data.data);
          setClasses(data.data.chitiet_hangve?.filter(hv => hv.So_ve_trong > 0) || []);
        } else {
          setError('Không tìm thấy chuyến bay hoặc không có hạng vé trống.');
        }
      } catch {
        setError('Có lỗi xảy ra khi tải thông tin chuyến bay.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  // Khi chọn hạng vé, cập nhật giá nếu có
  const handleClassChange = (hv) => {
    setSelectedClass(hv.Ma_hang_ve);
    setPrice(hv.Gia_ve);
  };

  const handleChooseSeat = (e) => {
    e.preventDefault();
    if (!selectedClass || !name || !cmnd || !phone || !gender) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setError('');
    navigate(`/choose-seat/${flightId}`, {
      state: {
        flightId,
        classId: selectedClass,
        price: price,
        name,
        gender,
        cmnd,
        phone
      }
    });
  };

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>Đang tải...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:40}}>{error}</div>;

  return (
    <div style={{maxWidth:600,margin:'40px auto',background:'#fff',borderRadius:10,boxShadow:'0 2px 8px rgba(0,0,0,0.1)',padding:32}}>
      <h2 style={{textAlign:'center',marginBottom:24}}>Đặt vé chuyến bay #{flight.Ma_chuyen_bay}</h2>
      <div style={{marginBottom:24}}>
        <div><b>Điểm đi:</b> {flight.Ma_san_bay_di}</div>
        <div><b>Điểm đến:</b> {flight.Ma_san_bay_den}</div>
        <div><b>Ngày khởi hành:</b> {flight.ngay_khoi_hanh}</div>
        <div><b>Giờ khởi hành:</b> {flight.gio_khoi_hanh}</div>
        {price && <div style={{marginTop:8}}><b>Giá vé:</b> {price.toLocaleString()} VND</div>}
      </div>
      <form onSubmit={handleChooseSeat}>
        <div style={{marginBottom:24}}>
          <h4>Chọn hạng vé:</h4>
          {classes.length === 0 && <div>Không còn hạng vé trống.</div>}
          {classes.map(hv => (
            <label key={hv.Ma_hang_ve} style={{display:'block',marginBottom:10,cursor:'pointer'}}>
              <input
                type="radio"
                name="class"
                value={hv.Ma_hang_ve}
                checked={selectedClass === hv.Ma_hang_ve}
                onChange={() => handleClassChange(hv)}
                style={{marginRight:8}}
              />
              <b>{hv.Ma_hang_ve}</b> - Giá: {hv.Gia_ve.toLocaleString()} VND - Còn {hv.So_ve_trong} ghế
            </label>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <label><b>Họ tên:</b></label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </div>
        <div style={{marginBottom:16}}>
          <label><b>Giới tính:</b></label>
          <select value={gender} onChange={e => setGender(e.target.value)} style={{width:'100%',padding:8,marginTop:4}}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div style={{marginBottom:16}}>
          <label><b>Số điện thoại:</b></label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </div>
        <div style={{marginBottom:16}}>
          <label><b>CCCD/CMND:</b></label>
          <input type="text" value={cmnd} onChange={e => setCmnd(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
        </div>
        {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
        <button
          type="submit"
          style={{
            width:'100%',
            padding:'12px',
            background:!selectedClass?'#ccc':'#007bff',
            color:'#fff',
            border:'none',
            borderRadius:6,
            fontSize:18,
            fontWeight:'bold',
            cursor:!selectedClass?'not-allowed':'pointer',
            transition:'background 0.2s'
          }}
          disabled={!selectedClass}
        >
          Chọn chỗ ngồi
        </button>
      </form>
    </div>
  );
};

export default BookTicket; 