import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const formatCurrency = (num) => num ? num.toLocaleString('vi-VN') + ' VND' : '0 VND';

const calculateArrivalTime = (departure, durationMinutes) => {
    const [hours, minutes] = departure.split(':').map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes, 0);

    const arrivalDate = new Date(departureDate.getTime() + durationMinutes * 60000);
    const arrivalHours = arrivalDate.getHours().toString().padStart(2, '0');
    const arrivalMinutes = arrivalDate.getMinutes().toString().padStart(2, '0');

    return `${arrivalHours}:${arrivalMinutes}`;
};

const TICKET_CLASS_LABELS = {
  'BUSINESS': 'BUSINESS',
  'SKYBOSS': 'skyBOSS',
  'DELUXE': 'Deluxe',
  'ECO': 'Eco',
};

const TICKET_CLASS_COLORS = {
  'BUSINESS': '#bfa13a',
  'SKYBOSS': '#e53935',
  'DELUXE': '#ffb300',
  'ECO': '#4caf50',
};

// Mô tả chi tiết từng hạng vé (có thể lấy từ backend nếu có)
const TICKET_CLASS_DETAILS = {
  '1': {
    baggage: 'Hành lý xách tay: 18kg, ký gửi: 40kg',
    services: [
      'Phòng chờ sang trọng',
      'Ưu tiên làm thủ tục',
      'Bữa ăn miễn phí',
      'Chọn chỗ ngồi miễn phí',
      'Ưu đãi dịch vụ trên chuyến bay',
    ],
  },
  '2': {
    baggage: 'Hành lý xách tay: 14kg, ký gửi: 30kg',
    services: [
      'Phòng chờ sang trọng',
      'Ưu tiên làm thủ tục',
      'Chọn chỗ ngồi miễn phí',
      'Ưu đãi dịch vụ trên chuyến bay',
    ],
  },
  '3': {
    baggage: 'Hành lý xách tay: 10kg, ký gửi: 23kg',
    services: [
      'Ưu tiên làm thủ tục',
      'Chọn chỗ ngồi miễn phí',
      'Ưu đãi dịch vụ trên chuyến bay',
    ],
  },
  '4': {
    baggage: 'Hành lý xách tay: 7kg, ký gửi: 20kg',
    services: [
      'Chọn chỗ ngồi có phí',
      'Dịch vụ cơ bản trên chuyến bay',
    ],
  },
};

// Hàm tiện ích lấy headers có Bearer token
function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('access_token');
  return {
    ...extraHeaders,
    Authorization: token ? `Bearer ${token}` : '',
  };
}

const BookTicket = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Thông tin hành khách
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Nam');
  const [cmnd, setCmnd] = useState('');
  const [phone, setPhone] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Đóng loading khi trang BookTicket đã load xong
    MySwal.close();
    const fetchFlight = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://se104-airport.space/api/chuyenbay/get/${flightId}`, {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (res.ok && data.data) {
          console.log('Flight data:', data.data);
          console.log('San bay trung gian:', data.data.chitiet_sanbay_trung_gian);
          
          setFlight(data.data);
          setClasses(data.data.chitiet_hangve || []);
        } else {
          setError('Không tìm thấy chuyến bay hoặc không có hạng vé.');
        }
      } catch {
        setError('Có lỗi xảy ra khi tải thông tin chuyến bay.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  // Tính giá, thuế, tổng tiền
  const getSummary = () => {
    if (!selectedClass) return { price: 0, tax: 0, service: 0, total: 0 };
    const price = selectedClass.Gia_ve || 0;
    const tax = Math.round(price * 0.02); // ví dụ thuế 30%
    const service = 0;
    return { price, tax, service, total: price + tax + service };
  };
  const summary = getSummary();

  // Xử lý submit tạo vé
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass || !name.trim() || !cmnd.trim() || !phone.trim() || !gender) {
      setSubmitError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    setSubmitError('');
    navigate(`/choose-seat/${flightId}`, {
      state: {
        flightId,
        classId: selectedClass.Ma_hang_ve,
        price: selectedClass.Gia_ve,
        name: name.trim(),
        gender,
        cmnd: cmnd.trim(),
        phone: phone.trim(),
      }
    });
  };

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>Đang tải...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:40}}>{error}</div>;

  return (
    <div style={{display:'flex',gap:32,alignItems:'flex-start',justifyContent:'space-between',backgroundImage: 'url(https://images.pexels.com/photos/1115358/pexels-photo-1115358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',backgroundSize: 'cover',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
      {/* LEFT: Chọn hạng vé và xem chi tiết */}
      <div style={{flex:1.5, maxWidth: '900px', padding: '2%'}}>
        <div style={{textAlign:'center',marginBottom:16}}>
          <h2 style={{margin:0,color:'#fff',fontWeight:'bold'}}>{flight.Ma_san_bay_di} <span style={{fontSize:28}}> →</span> {flight.Ma_san_bay_den}</h2>
          <div style={{color:'#666',fontWeight:500}}>
            {flight.Ten_san_bay_di} → {flight.Ten_san_bay_den}
          </div>
        </div>
        {/* Card các hạng vé */}
        <div style={{display:'flex',gap:16,marginBottom:24,justifyContent:'center', maxWidth: '650px', margin: '0 auto 24px'}}>
          {classes.map(hv => (
            <div
              key={hv.Ma_hang_ve}
              onClick={() => hv.So_ve_trong > 0 && setSelectedClass(hv)}
              style={{
                minWidth:130,
                flex:1,
                background: '#218838',
                color: '#fff',
                borderRadius: '10px 10px 0 0',
                padding: '14px 0',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                cursor: hv.So_ve_trong > 0 ? 'pointer' : 'not-allowed',
                opacity: hv.So_ve_trong > 0 ? 1 : 0.5,
                border: selectedClass && selectedClass.Ma_hang_ve === hv.Ma_hang_ve ? '4px solid #2196f3' : '4px solid transparent',
                position: 'relative',
                transition: 'border 0.2s',
              }}
            >
              {TICKET_CLASS_LABELS[hv.Ma_hang_ve] || hv.Ma_hang_ve}
              <div style={{fontSize:15,marginTop:4}}>
                {hv.So_ve_trong > 0 ? formatCurrency(hv.Gia_ve) : 'Hết chỗ'}
              </div>
              {selectedClass && selectedClass.Ma_hang_ve === hv.Ma_hang_ve && (
                <div style={{position:'absolute',top:-20,right:10,fontSize:12,color:'#fff',fontWeight:'bold'}}>Đã chọn</div>
              )}
            </div>
          ))}
        </div>
        {/* Chi tiết hạng vé đã chọn */}
        {selectedClass && (
          <div style={{background:'#fff',borderRadius:10,padding:24,marginBottom:24,border:`2px solid #218838`, maxWidth: '650px', margin: '0 auto 24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:24,marginBottom:12}}>
              <div style={{background:'#218838',color:'#fff',borderRadius:8,padding:'8px 16px',fontWeight:'bold'}}>
                {TICKET_CLASS_LABELS[selectedClass.Ma_hang_ve] || selectedClass.Ma_hang_ve}
              </div>
              <div style={{fontSize:18,fontWeight:'bold',color:'#333'}}>
                {flight.gio_khoi_hanh} - {calculateArrivalTime(flight.gio_khoi_hanh, flight.Thoi_gian_bay)} | {flight.loai_may_bay}
              </div>
              {flight.chitiet_sanbay_trung_gian && flight.chitiet_sanbay_trung_gian.length > 0 ? (
                <div style={{color:'#e53935',fontWeight:'bold',display:'flex',flexDirection:'column'}}>
                  <span>Quá cảnh tại: {
                    flight.chitiet_sanbay_trung_gian.map((sb, index) => (
                      <span key={index}>
                        {sb.ma_san_bay_trung_gian}
                        {sb.ghi_chu && <span style={{fontSize:13,fontWeight:'normal',color:'#b71c1c'}}> ({sb.ghi_chu})</span>}
                        {index < flight.chitiet_sanbay_trung_gian.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  }</span>
                  <span style={{color:'#b71c1c',fontWeight:'normal',fontSize:13,marginTop:2}}>
                    Hành khách sẽ dừng tại các sân bay này trước khi đến nơi.
                  </span>
                </div>
              ) : (
                <div style={{color:'#e53935',fontWeight:'bold'}}>Bay thẳng</div>
              )}
            </div>
            <div style={{marginBottom:8}}>
              <b>{flight.Ma_san_bay_di}</b> ({flight.Ten_san_bay_di}) → <b>{flight.Ma_san_bay_den}</b> ({flight.Ten_san_bay_den})<br/>
              {flight.gio_khoi_hanh}, {flight.ngay_khoi_hanh}
            </div>
            <div style={{margin:'12px 0'}}>
              <b>{TICKET_CLASS_DETAILS[selectedClass.Ma_hang_ve]?.baggage || ''}</b>
              <ul style={{margin:'8px 0 0 20px',padding:0,fontSize:15,listStyle:'none'}}>
                {TICKET_CLASS_DETAILS[selectedClass.Ma_hang_ve]?.services.map((s, i) => (
                  <li key={i} style={{display:'flex',alignItems:'center',marginBottom:4}}>
                    <FiCheckCircle style={{color:'#28a745',fontSize:20,marginRight:8}} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
                        {/* Slide ảnh mô tả hạng vé */}
                        <div style={{margin:'20px 0',borderRadius:8,overflow:'hidden'}}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                style={{
                  '--swiper-navigation-color': '#218838',
                  '--swiper-pagination-color': '#218838',
                }}
              >
                {selectedClass.Ma_hang_ve === 1 && (
                  <>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="Business Class" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="Business Class Service" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                  </>
                )}
                {selectedClass.Ma_hang_ve === 2 && (
                  <>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="SkyBOSS Class" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="SkyBOSS Class Service" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                  </>
                )}
                {selectedClass.Ma_hang_ve === 3 && (
                  <>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="Deluxe Class" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="Deluxe Class Service" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                  </>
                )}
                {selectedClass.Ma_hang_ve === 4 && (
                  <>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="Eco Class" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img 
                        src="https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg" 
                        alt="Eco Class Service" 
                        style={{width:'100%',height:300,objectFit:'cover'}}
                      />
                    </SwiperSlide>
                  </>
                )}
              </Swiper>
            </div>
            {/* Form nhập thông tin hành khách */}
            <form onSubmit={handleSubmit} style={{marginTop:24}}>
              <div style={{display:'flex',gap:16,marginBottom:16}}>
                <div style={{flex:1}}>
                  <label><b>Họ tên:</b></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} style={{width:'100%',padding:8,marginTop:4,backgroundColor: '#fff', borderRadius:10,color: 'black'}} required/>
                </div>
                <div style={{flex:1}}>
                  <label><b>Giới tính:</b></label>
                  <select value={gender} onChange={e => setGender(e.target.value)} style={{width:'100%',padding:8,marginTop:4,backgroundColor: '#fff', borderRadius:10,color: 'black'}}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              <div style={{display:'flex',gap:16,marginBottom:16}}>
                <div style={{flex:1}}>
                  <label><b>Số điện thoại:</b></label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} pattern="0[2-9][0-9]{8}" title="Số điện thoại phải có 10 chữ số, bắt đầu bằng 0 và chữ số thứ hai từ 2-9" style={{width:'100%',padding:8,marginTop:4,backgroundColor: '#fff', borderRadius:10,color: 'black'}} required/>
                </div>
                <div style={{flex:1}}>
                  <label><b>CCCD:</b></label>
                  <input type="text" value={cmnd} onChange={e => setCmnd(e.target.value)} pattern="\d{12}" style={{width:'100%',padding:8,marginTop:4,backgroundColor: '#fff', borderRadius:10,color: 'black'}} required/>
                </div>
              </div>
              {submitError && <div style={{color:'red',marginBottom:12}}>{submitError}</div>}
              <button
                type="submit"
                style={{
                  width:'100%',
                  padding:'14px',
                  background:'#218838',
                  color:'#fff',
                  border:'none',
                  borderRadius:6,
                  fontSize:18,
                  fontWeight:'bold',
                  cursor:'pointer',
                  transition:'background 0.2s',
                  letterSpacing:1
                }}
              >
                Tiếp tục
              </button>
            </form>
          </div>
        )}
      </div>
      {/* RIGHT: Bảng tổng hợp đặt chỗ */}
      <div style={{flex:1,minWidth:320,maxWidth:400,background:'#fff',borderRadius:10,boxShadow:'0 2px 8px rgba(0,0,0,0.12)',padding:'2%',position:'sticky',top:75,alignSelf:'flex-start',marginLeft:'auto', marginRight:100}}>
        <div style={{background:'#e53935',color:'#fff',borderRadius:'8px 8px 0 0',padding:'12px 16px',fontWeight:'bold',fontSize:20,letterSpacing:1,marginBottom:16}}><span className='d-flex justify-content-center'>THÔNG TIN ĐẶT CHỖ</span></div>
        <div style={{background:'#e0f7fa',padding:'8px 12px',borderRadius:6,marginBottom:16}}>
          <div style={{fontWeight:'bold',color:'#e53935',fontSize:18,textAlign:'right'}}>{formatCurrency(summary.total)}</div>
        </div>
        <div style={{marginBottom:8}}>
          <b>Chuyến đi</b>
          <div style={{fontSize:15}}>
            {flight.Ten_san_bay_di} ({flight.Ma_san_bay_di})  ✈️ → {flight.Ten_san_bay_den} ({flight.Ma_san_bay_den})<br/>
            {flight.ngay_khoi_hanh} | {flight.gio_khoi_hanh} - {calculateArrivalTime(flight.gio_khoi_hanh, flight.Thoi_gian_bay)} | {flight.loai_may_bay}
          </div>
          {flight.chitiet_sanbay_trung_gian && flight.chitiet_sanbay_trung_gian.length > 0 && (
            <div style={{fontSize:13,color:'#e53935',marginTop:4}}>
              <b>Quá cảnh tại:</b> {
                flight.chitiet_sanbay_trung_gian.map((sb, index) => (
                  <span key={index}>
                    {sb.ma_san_bay_trung_gian}
                    {sb.ghi_chu && <span style={{color:'#b71c1c'}}> ({sb.ghi_chu})</span>}
                    {index < flight.chitiet_sanbay_trung_gian.length - 1 ? ', ' : ''}
                  </span>
                ))
              }
            </div>
          )}
          <div style={{fontSize:13,color:'#666',marginTop:4}}>
            Thời gian bay: {Math.floor(flight.Thoi_gian_bay / 60)}h {flight.Thoi_gian_bay % 60} phút
          </div>
        </div>
        <div style={{margin:'12px 0'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span>Giá vé</span>
            <span>{formatCurrency(summary.price)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span>Thuế, phí dịch vụ Online</span>
            <span>{formatCurrency(summary.tax)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span>Dịch vụ</span>
            <span>{formatCurrency(summary.service)}</span>
          </div>
        </div>
        <div style={{background:'#e53935',color:'#fff',borderRadius:6,padding:'10px 0',fontWeight:'bold',fontSize:20,display:'flex',justifyContent:'space-around',alignItems:'center',marginTop:12}}>
          <span>Tổng tiền</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookTicket; 