import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const ChooseSeat = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Nhận thông tin cá nhân và vé từ state
  const { classId, price, name, gender, cmnd, phone } = location.state || {};

  // Placeholder cho chọn ghế
  const [seat, setSeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!seat) {
      setError('Vui lòng chọn vị trí ghế!');
      return;
    }
    setLoading(true);
    try {
      const body = {
        Ma_chuyen_bay: flightId,
        Ma_hang_ve: classId,
        vitri: seat,
        Ho_ten: name,
        cmnd: cmnd,
        sdt: phone,
        gioi_tinh: gender
      };
      const res = await fetch('http://localhost:5000/api/vechuyenbay/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSuccess('Đặt vé thành công!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.message || 'Đặt vé thất bại!');
      }
    } catch {
      setError('Có lỗi xảy ra khi đặt vé!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:500,margin:'40px auto',background:'#fff',borderRadius:10,boxShadow:'0 2px 8px rgba(0,0,0,0.1)',padding:32}}>
      <h2 style={{textAlign:'center',marginBottom:24}}>Chọn chỗ ngồi</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:16}}>
          <label><b>Chọn vị trí ghế:</b></label>
          <input type="text" value={seat} onChange={e => setSeat(e.target.value)} placeholder="VD: B4.1" style={{width:'100%',padding:8,marginTop:4}} />
          <div style={{fontSize:12,color:'#888'}}>Bạn sẽ làm UI chọn ghế sau, hiện tại nhập mã ghế thủ công.</div>
        </div>
        {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
        {success && <div style={{color:'green',marginBottom:12}}>{success}</div>}
        <button type="submit" disabled={loading} style={{width:'100%',padding:12,background:'#007bff',color:'#fff',border:'none',borderRadius:6,fontSize:18,fontWeight:'bold',cursor:loading?'not-allowed':'pointer'}}>
          {loading ? 'Đang đặt vé...' : 'Đặt vé'}
        </button>
      </form>
      <div style={{marginTop:24,fontSize:15,color:'#555'}}>
        <b>Thông tin vé:</b><br/>
        Họ tên: {name}<br/>
        Giới tính: {gender}<br/>
        SĐT: {phone}<br/>
        CCCD/CMND: {cmnd}<br/>
        Hạng vé: {classId}<br/>
        Giá vé: {price ? price.toLocaleString() + ' VND' : ''}
      </div>
    </div>
  );
};

export default ChooseSeat; 