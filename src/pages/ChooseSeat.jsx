import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const ROWS = 20;
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

const ChooseSeat = () => {
  const { flightId } = useParams();
  const location = useLocation();
  // Nhận thông tin cá nhân và vé từ state
  const { classId, price, name, gender, cmnd, phone } = location.state || {};

  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách ghế đã đặt
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await fetch(`https://se104-airport.space/api/vechuyenbay/search/flight/${flightId}`);
        const data = await res.json();
        const seats = Array.isArray(data.tickets)
          ? data.tickets.filter(v => v.Tinh_trang !== false && v.vi_tri)
              .map(v => String(v.vi_tri).trim().toUpperCase())
          : [];
        setBookedSeats(seats);
      } catch {
        setBookedSeats([]);
      }
    };
    fetchBookedSeats();
  }, [flightId]);

  // Tạo danh sách ghế
  const allSeats = [];
  for (let i = 1; i <= ROWS; i++) {
    for (let c of COLS) {
      allSeats.push({
        id: `${i}${c}`,
        row: i,
        col: c
      });
    }
  }

  // Xử lý chọn ghế
  const handleSelect = (seatId) => {
    if (bookedSeats.some(s => String(s).trim().toUpperCase() === String(seatId).trim().toUpperCase())) return;
    setSelectedSeats(seats =>
      seats.includes(seatId)
        ? seats.filter(s => s !== seatId)
        : [seatId] // chỉ cho chọn 1 ghế/lần đặt
    );
  };

  // Gọi API tạo payment
  const handlePayment = async () => {
    setError('');
    if (selectedSeats.length === 0) {
      setError('Vui lòng chọn vị trí ghế!');
      return;
    }
    const orderId = `${flightId}-${selectedSeats[0]}-${Date.now()}`;
    // Save booking info to localStorage for PaymentReturn
    localStorage.setItem('pending_booking', JSON.stringify({
      flightId,
      classId,
      price,
      name,
      gender,
      cmnd,
      phone,
      seat: selectedSeats[0],
      orderId
    }));
    try {
      setLoading(true);
      const res = await fetch('https://se104-airport.space/api/vnpay/create_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, order_id: orderId })
      });
      const data = await res.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setError('Không tạo được link thanh toán!');
      }
    } catch {
      setError('Có lỗi khi tạo thanh toán!');
    } finally {
      setLoading(false);
    }
  };

  // CSS inline cho ghế
  const seatStyle = (seat) => {
    const isBooked = bookedSeats.some(s => String(s).trim().toUpperCase() === String(seat.id).trim().toUpperCase());
    const isSelected = selectedSeats.includes(seat.id);
    let bg = '#22c55e'; // xanh
    if (isBooked) bg = '#aaa'; // ghế đã đặt: xám
    else if (isSelected) bg = '#e11d48'; // ghế đang chọn: đỏ
    return {
      width: 38, height: 38, borderRadius: 8, border: 'none', fontWeight: 'bold',
      background: bg, color: '#fff', margin: 2, cursor: isBooked ? 'not-allowed' : 'pointer',
      position: 'relative', fontSize: 15,
      textAlign: 'center', lineHeight: '38px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: isBooked ? 0.7 : 1,
    };
  };

  // Tooltip mô tả
  const seatTooltip = (seat) => {
    if (bookedSeats.includes(seat.id)) return 'Ghế đã có người';
    if (selectedSeats.includes(seat.id)) return 'Ghế bạn đang chọn';
    return 'Ghế trống';
  };

  return (
    <div style={{display:'flex',gap:32,alignItems:'flex-start',justifyContent:'space-between',backgroundImage: 'url(https://images.pexels.com/photos/1381414/pexels-photo-1381414.jpeg)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
    <div style={{
      display:'flex',
      maxWidth:1000,
      margin:'40px auto',
      borderRadius:'40px 40px 20px 20px', // bo tròn đầu máy bay
      boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Inter, sans-serif',
      position:'relative',
      overflow:'hidden',
      background:'rgba(0,0,0,0.6)',
      color:'#fff',
      fontColor:'#fff',
    }}>
      {/* Cột trái: Thông tin thanh toán */}
      <div style={{flex:1,padding:32,borderRight:'1px solid #eee',minWidth:320}}>
        <h2 style={{textAlign:'center',marginBottom:24, fontWeight:'bold'}}>Thanh toán đặt vé</h2>
        <div style={{marginBottom:16,fontWeight:'bold',fontSize:16}}>
          Họ tên: {name}<br/>
          Giới tính: {gender}<br/>
          SĐT: {phone}<br/>
          CCCD/CMND: {cmnd}<br/>
          Hạng vé: {classId}<br/>
          Giá vé: {price ? price.toLocaleString() + ' VND' : ''}<br/>
          Ghế chọn: {selectedSeats.join(', ') || 'Chưa chọn'}
        </div>
        {!loading && (
          <button
            onClick={handlePayment}
            disabled={selectedSeats.length === 0}
            style={{width:'100%',padding:14,background:'#0ea5e9',color:'#fff',border:'none',borderRadius:6,fontSize:18,fontWeight:'bold',cursor:selectedSeats.length === 0 ? 'not-allowed':'pointer',marginBottom:16}}
          >
            Thanh toán
          </button>
        )}
        {loading && (
          <div style={{color:'#0ea5e9',marginBottom:12}}>Đang đặt vé...</div>
        )}
        {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
      </div>
      {/* Cột phải: Modal chọn ghế */}
      <div style={{flex:1,maxHeight:600,overflowY:'auto',padding:32,position:'relative'}}>
        <h3 style={{textAlign:'center',marginBottom:16}}>Chọn chỗ ngồi</h3>
        {/* Chú thích màu */}
        <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:18,height:18,background:'#22c55e',borderRadius:4,display:'inline-block'}}></span> Ghế trống</div>
          <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:18,height:18,background:'#e11d48',borderRadius:4,display:'inline-block'}}></span> Ghế đang chọn</div>
          <div style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:18,height:18,background:'#aaa',borderRadius:4,display:'inline-block',position:'relative'}}><span style={{position:'absolute',left:2,top:2,fontSize:14,color:'#fff'}}>×</span></span> Đã có người</div>
        </div>
        {/* Mũi máy bay (đường cong đầu) */}
        <div style={{width:320,height:60,background:'radial-gradient(ellipse at center, #e0e0e0 60%, #fff 100%)',borderTopLeftRadius:160,borderTopRightRadius:160,margin:'0 auto -30px auto',position:'relative',zIndex:2}}></div>
        {/* Cửa lên tàu bay căn giữa */}
        <div style={{textAlign:'center',fontSize:15,fontWeight:'bold',color:'#888',margin:'8px 0 8px 0'}}>Cửa lên tàu bay</div>
        {/* Sơ đồ ghế */}
           <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
          <div style={{fontSize:15,fontWeight:'bold',color:'#FFC107',marginLeft:24}}>Cửa lên tàu bay</div>
          <div style={{fontSize:15,fontWeight:'bold',color:'#FFC107',marginRight:24}}>Cửa lên tàu bay</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:24,position:'relative',zIndex:3}}>
          {/* Header cột */}
          <div style={{display:'flex',gap:8,marginBottom:4}}>
            {COLS.slice(0,3).map(col => <div key={col} style={{width:38,textAlign:'center',fontWeight:'bold'}}>{col}</div>)}
            <div style={{width:32}}></div> {/* Lối đi */}
            {COLS.slice(3,6).map(col => <div key={col} style={{width:38,textAlign:'center',fontWeight:'bold'}}>{col}</div>)}
          </div>
          {Array.from({length: ROWS}).map((_, rowIdx) => (
            <div className="seat-row" key={rowIdx} style={{display:'flex',gap:8,justifyContent:'center',alignItems:'center'}}>
              {/* Ghế bên trái */}
              {COLS.slice(0,3).map(col => {
                const seat = allSeats.find(s => s.row === rowIdx+1 && s.col === col);
                return (
                  <button
                    key={seat.id}
                    style={seatStyle(seat)}
                    disabled={bookedSeats.some(s => String(s).trim().toUpperCase() === String(seat.id).trim().toUpperCase())}
                    onClick={() => handleSelect(seat.id)}
                    title={seatTooltip(seat)}
                  >
                    {bookedSeats.some(s => String(s).trim().toUpperCase() === String(seat.id).trim().toUpperCase()) ? <span style={{fontWeight:'bold',fontSize:18}}>×</span> : seat.id}
                  </button>
                );
              })}
              {/* Lối đi */}
              <div style={{width:32}}></div>
              {/* Ghế bên phải */}
              {COLS.slice(3,6).map(col => {
                const seat = allSeats.find(s => s.row === rowIdx+1 && s.col === col);
                return (
                  <button
                    key={seat.id}
                    style={seatStyle(seat)}
                    disabled={bookedSeats.some(s => String(s).trim().toUpperCase() === String(seat.id).trim().toUpperCase())}
                    onClick={() => handleSelect(seat.id)}
                    title={seatTooltip(seat)}
                  >
                    {bookedSeats.some(s => String(s).trim().toUpperCase() === String(seat.id).trim().toUpperCase()) ? <span style={{fontWeight:'bold',fontSize:18}}>×</span> : seat.id}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {/* Cửa lên tàu bay ở cuối */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
          <div style={{fontSize:15,fontWeight:'bold',color:'#FFC107',marginLeft:24}}>Cửa lên tàu bay</div>
          <div style={{fontSize:15,fontWeight:'bold',color:'#FFC107',marginRight:24}}>Cửa lên tàu bay</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChooseSeat; 