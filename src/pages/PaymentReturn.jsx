import React, { useEffect, useState, useRef } from 'react';
import { BASE_URL, LOCAL_API_URL } from '../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PaymentReturn = () => {
  const [result, setResult] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('processing'); // 'processing', 'success', 'fail'
  const [bookingMsg, setBookingMsg] = useState('');
  const [ticketInfo, setTicketInfo] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Tránh gọi API nhiều lần bằng useRef
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    console.log('PaymentReturn useEffect called - processing payment result');

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

    console.log('Payment params:', { vnp_ResponseCode, amount, orderId, vnp_TransactionNo });

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
      console.log('Booking info from localStorage:', info);
      
      // Gọi API đặt vé
      console.log('Calling API to add ticket...');
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
          console.log('API response:', data);
          if (data.status === 'success') {
            setBookingStatus('success');
            setBookingMsg('Đặt vé thành công!');
            // Lấy thông tin chuyến bay
            fetch(`${LOCAL_API_URL}/chuyenbay/get/${info.flightId}`)
              .then(res => res.json())
              .then(flightData => {
                if (flightData.data) {
                  // Kết hợp thông tin vé từ API đặt vé, localStorage và thông tin chuyến bay
                  const ve = data.ve || {};
                  setTicketInfo({
                    Ma_ve: ve.Ma_ve,
                    Ho_ten: info.name,
                    cmnd: info.cmnd,
                    sdt: info.phone,
                    gioi_tinh: info.gender,
                    vi_tri: ve.vi_tri || info.seat,
                    Ma_hang_ve: ve.hang_ve || info.classId,
                    Tien_ve: ve.Tien_ve,
                    Ma_hanh_khach: ve.Ma_hanh_khach,
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
        .catch((error) => {
          console.error('Error adding ticket:', error);
          MySwal.close();
          setBookingStatus('fail');
          setBookingMsg('Có lỗi xảy ra khi đặt vé!');
        });
    } else {
      MySwal.close();
      setBookingStatus('fail');
      setBookingMsg('Thanh toán thất bại hoặc bị hủy. Vui lòng thử lại.');
    }
  }, []); // Empty dependency array để chỉ chạy một lần

  const handleCancelTicket = async () => {
    if (!ticketInfo?.Ma_ve) return;

    const result = await MySwal.fire({
      title: 'Bạn có chắc chắn muốn hủy vé này?',
      text: `Mã vé: #${ticketInfo.Ma_ve}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hủy vé',
      cancelButtonText: 'Không'
    });

    if (!result.isConfirmed) return;

    try {
      MySwal.fire({
        title: 'Đang hủy vé...',
        allowOutsideClick: false,
        didOpen: () => { MySwal.showLoading(); }
      });

      const res = await fetch(`${BASE_URL}/vechuyenbay/delete/ticket/${ticketInfo.Ma_ve}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      await MySwal.close();

      if (res.ok && data.status === 'success') {
        setBookingStatus('cancelled');
        setBookingMsg('Vé đã được hủy thành công!');
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
      <h2 style={{color: bookingStatus === 'success' ? '#22c55e' : bookingStatus === 'cancelled' ? '#ff9800' : '#e53935', marginBottom: 16}}>
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
              <p style={{color: 'red'}}><b>Mã vé:</b> {ticketInfo.Ma_ve}</p>
              <p style={{color: 'red'}}><b>Mã hành khách:</b> {ticketInfo.Ma_hanh_khach}</p>
              <p><b>Họ tên:</b> {ticketInfo.Ho_ten}</p>
              <p style={{color: 'red'}}><b>CMND/CCCD:</b> {ticketInfo.cmnd}</p>
              <p style={{color: 'red'}}><b>Số điện thoại:</b> {ticketInfo.sdt}</p>
              <p><b>Giới tính:</b> {ticketInfo.gioi_tinh}</p>
              <p><b>Tiền vé:</b> {ticketInfo.Tien_ve ? Number(ticketInfo.Tien_ve).toLocaleString() + ' VND' : 'N/A'}</p>
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
      <div style={{color: 'red', fontSize: 16, fontWeight: 'bold'}}>
        Quý khách ghi nhớ mã vé, cccd, số điện thoại, đặc biệt là mã hành khách để hủy vé!
      </div>

      <div style={{marginTop: 24}}>
        <a href='/' style={{
          background: '#218838',
          color: '#fff',
          padding: '10px 28px',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>Về trang chủ</a>

        {bookingStatus === 'success' && ticketInfo && (
          <button
            onClick={handleCancelTicket}
            style={{
              background: '#e53935',
              color: '#fff',
              padding: '10px 28px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 'bold',
              marginLeft: 16,
              cursor: 'pointer'
            }}
          >
            Hủy vé
          </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default PaymentReturn; 