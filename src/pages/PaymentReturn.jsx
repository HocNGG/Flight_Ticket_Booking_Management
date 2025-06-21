import React, { useEffect, useState } from 'react';
import { BASE_URL, LOCAL_API_URL } from '../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PaymentReturn = () => {
  const [result, setResult] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('processing'); // 'processing', 'success', 'fail'
  const [bookingMsg, setBookingMsg] = useState('');
  const [ticketInfo, setTicketInfo] = useState(null);

  useEffect(() => {
    // Hiển thị SweetAlert khi bắt đầu xử lý
    MySwal.fire({
      title: 'Đang xử lý kết quả thanh toán...',
      allowOutsideClick: false,
      didOpen: () => { MySwal.showLoading(); }
    });

    // Lấy query params từ URL
    const params = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = params.get('vnp_ResponseCode');
    const amount = params.get('vnp_Amount')?.slice(0, -2); // Bỏ 2 số 0 ở cuối
    const orderId = params.get('vnp_TxnRef') || params.get('vnp_OrderInfo');
    const vnp_TransactionNo = params.get('vnp_TransactionNo');

    setResult({
      amount,
      orderId,
      vnp_TransactionNo,
      vnp_ResponseCode
    });

    if (vnp_ResponseCode === '00') {
      // Thanh toán thành công, gọi API đặt vé
      const booking = localStorage.getItem('pending_booking');
      if (!booking) {
        MySwal.close();
        setBookingStatus('fail');
        setBookingMsg('Không tìm thấy thông tin đặt vé. Vui lòng liên hệ hỗ trợ.');
        return;
      }
      const info = JSON.parse(booking);
      // Gọi API đặt vé
      fetch(`${BASE_URL}/vechuyenbay/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Ma_chuyen_bay: parseInt(info.flightId),
          Ma_hang_ve: parseInt(info.classId),
          vitri: info.seat,
          Ho_ten: info.name,
          cmnd: info.cmnd,
          sdt: info.phone,
          gioi_tinh: info.gender,
          Tinh_trang: true
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setBookingStatus('success');
            setBookingMsg('Đặt vé thành công!');
            // Lấy thông tin chuyến bay
            fetch(`${LOCAL_API_URL}/chuyenbay/get/${info.flightId}`)
              .then(res => res.json())
              .then(flightData => {
                if (flightData.data) {
                  // Kết hợp thông tin vé từ API đặt vé, localStorage và thông tin chuyến bay
                  const ticket = data.ticket || {};
                  setTicketInfo({
                    Ma_ve: ticket.Ma_ve,
                    Ho_ten: ticket.Ho_ten || info.name,
                    cmnd: ticket.cmnd || info.cmnd,
                    sdt: ticket.sdt || info.phone,
                    gioi_tinh: ticket.gioi_tinh || info.gender,
                    vi_tri: ticket.vi_tri || ticket.vitri || info.seat,
                    Ma_hang_ve: ticket.Ma_hang_ve || info.classId,
                    flight: flightData.data
                  });
                }
                // Đóng SweetAlert sau khi hoàn thành tất cả API calls
                MySwal.close();
              })
              .catch(() => {
                MySwal.close();
              });
            localStorage.removeItem('pending_booking');
          } else {
            MySwal.close();
            setBookingStatus('fail');
            setBookingMsg(data.message || 'Đặt vé thất bại!');
          }
        })
        .catch(() => {
          MySwal.close();
          setBookingStatus('fail');
          setBookingMsg('Có lỗi xảy ra khi đặt vé!');
        });
    } else {
      MySwal.close();
      setBookingStatus('fail');
      setBookingMsg('Thanh toán thất bại hoặc bị hủy. Vui lòng thử lại.');
    }
  }, []);

  if (!result || bookingStatus === 'processing') return (
    <div style={{display:'flex',gap:32,alignItems:'flex-start',justifyContent:'space-between',backgroundImage: 'url(https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
      <div style={{flex:1}} />
      <div style={{flex:1,minWidth:320,maxWidth:400,marginLeft:'auto', marginRight:100}} />
      <div className="d-flex justify-content-center align-items-center w-100" style={{position:'absolute',top:0,left:0,height:'100vh',zIndex:10}}>
        <div className="spinner-border text-primary" role="status" style={{width: '4rem', height: '4rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:'flex',gap:32,alignItems:'flex-start',justifyContent:'space-between',backgroundImage: 'url(https://images.pexels.com/photos/949587/pexels-photo-949587.jpeg)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
    <div style={{
      maxWidth: 800,
      margin: '60px auto',
      background: 'rgba(0,0,0, 0.9)',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      padding: 32,
      textAlign: 'center',
      color: '#fff',
    }}>
      <h2 style={{color: bookingStatus === 'success' ? '#22c55e' : '#e53935', marginBottom: 16}}>
        Kết quả thanh toán
      </h2>
      <div style={{fontSize: 20, fontWeight: 'bold', marginBottom: 16}}>
        {bookingMsg}
      </div>
      <div style={{marginBottom: 8}}>Mã giao dịch: <b>{result.vnp_TransactionNo}</b></div>
      <div style={{marginBottom: 8}}>Mã đơn hàng: <b>{result.orderId}</b></div>
      <div style={{marginBottom: 8}}>Số tiền: <b>{Number(result.amount).toLocaleString()} VND</b></div>
      <div style={{marginBottom: 8}}>Mã phản hồi: <b>{result.vnp_ResponseCode}</b></div>

      {bookingStatus === 'success' && ticketInfo && (
        <div style={{
          marginTop: 32,
          padding: 24,
          background: '#f8fafc',
          borderRadius: 12,
          textAlign: 'left'
        }}>
          <h3 style={{color: '#0f172a', marginBottom: 16, textAlign: 'center'}}>Thông tin vé đã đặt</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, color: '#000' }}>
            <div>
              <p><b>Mã vé:</b> {ticketInfo.Ma_ve}</p>
              <p><b>Họ tên:</b> {ticketInfo.Ho_ten}</p>
              <p><b>CMND/CCCD:</b> {ticketInfo.cmnd}</p>
              <p><b>Số điện thoại:</b> {ticketInfo.sdt}</p>
              <p><b>Giới tính:</b> {ticketInfo.gioi_tinh}</p>
            </div>
            <div>
              <p><b>Chuyến bay:</b> {ticketInfo.flight.Ma_chuyen_bay}</p>
              <p><b>Từ:</b> {ticketInfo.flight.Ten_san_bay_di} ({ticketInfo.flight.Ma_san_bay_di})</p>
              <p><b>Đến:</b> {ticketInfo.flight.Ten_san_bay_den} ({ticketInfo.flight.Ma_san_bay_den})</p>
              <p><b>Ngày bay:</b> {ticketInfo.flight.ngay_khoi_hanh}</p>
              <p><b>Giờ bay:</b> {ticketInfo.flight.gio_khoi_hanh}</p>
              <p><b>Vị trí ghế:</b> {ticketInfo.vi_tri}</p>
              <p><b>Hạng vé:</b> {ticketInfo.Ma_hang_ve}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{marginTop: 24}}>
        <a href='/' style={{
          background: '#218838',
          color: '#fff',
          padding: '10px 28px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Về trang chủ</a>
      </div>
    </div>
    </div>
  );
};

export default PaymentReturn; 