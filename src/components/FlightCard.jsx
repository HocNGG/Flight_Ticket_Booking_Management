import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight }) => {
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [show, setShow] = useState(false);
    // Chuyển sang định dạng 00:00 để hiển thị ngắn gọn hơn
    const formatHHMM = (timeString) => {
        const [hh, mm] = timeString.split(':');
        return `${hh}:${mm}`;
    };

    const calculateArrivalTime = (departure, durationMinutes) => {
        const [hours, minutes] = departure.split(':').map(Number);
        const departureDate = new Date();
        departureDate.setHours(hours, minutes, 0);

        const arrivalDate = new Date(departureDate.getTime() + durationMinutes * 60000);
        const arrivalHours = arrivalDate.getHours().toString().padStart(2, '0');
        const arrivalMinutes = arrivalDate.getMinutes().toString().padStart(2, '0');

        return `${arrivalHours}:${arrivalMinutes}`;
    };
    const arrivalTime = calculateArrivalTime(flight.gio_khoi_hanh, flight.Thoi_gian_bay);
    const handleDetailClick = async (e) => {
        // e.prevenDefault();
        try {
            const url = `http://localhost:5000/api/chuyenbay/get/${flight.Ma_chuyen_bay}`
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                setDetail(data.data);
                setShow(true);
            } else {
                console.log(`Lỗi: ${data.message || 'Không thể xem chuyến bay'}`);
            }
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            <div onClick={handleDetailClick} className="d-flex rounded-4 shadow-sm mb-3 p-3 align-items-center justify-content-between border" style={{ minHeight: '100px', backgroundColor: '#E6F6F3', cursor: 'pointer' }}>
                {/* Logo và thông tin */}
                <div className="d-flex align-items-center flex-grow-1">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Blue-Air_logo-01.svg/1200px-Blue-Air_logo-01.svg.png"
                        alt="airline"
                        style={{ width: '20%', height: '100%', objectFit: 'contain' }}
                        className="me-5"
                    />
                    <div className='ms-5'>
                        <div className="fw-semibold text-primary fs-5">Số hiệu chuyến bay: #{`${flight.Ma_chuyen_bay}`}</div>
                        <div className="small text-dark mt-2">Thời gian bay {Math.floor(flight.Thoi_gian_bay / 60)}h {flight.Thoi_gian_bay % 60} phút</div>
                        <div className="mt-2 fs-5 d-flex">
                            <div className='d-block me-5'>
                                <span className='fw-bold'>{flight.Ma_san_bay_di}</span>
                                <br />
                                <span>{formatHHMM(flight.gio_khoi_hanh)}</span>
                            </div>
                            <span className="mx-auto fs-1">→</span>
                            <div className='ms-5'>
                                <span className='fw-bold'>{flight.Ma_san_bay_den}</span>
                                <br />
                                <span>{arrivalTime}</span>
                            </div>
                        </div>
                        <div className="text-muted small mt-1">{flight.ngay_khoi_hanh}</div>
                    </div>
                </div>

                {/* Giá và nút */}
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-warning text-center text-dark rounded-3 me-3 d-flex flex-column justify-content-center align-items-center p-4"
                        style={{
                            minWidth: '150px',
                            width: '100%',
                            maxWidth: '200px',
                            minHeight: '120px',
                            height: '100%',
                        }}
                    >
                        <div className="fw-semibold text-uppercase">Giá chỉ<br />Từ</div>
                        <div className="fw-bold fs-5">{flight.gia_ve.toLocaleString()} VND</div>
                    </button>
                    <div>
                        {/* <button
                            type="button"
                            className="btn btn-warning px-3 py-2 fw-bold"
                            onClick={(e) => {
                                navigate(`/update-ticket`, {
                                    state: {
                                        flightId: flight.Ma_chuyen_bay
                                    }
                                });
                            }}
                        >
                            Cập Nhật Chuyến Bay
                        </button> */}
                        <button
                            type="button"
                            className="btn btn-success px-3 py-2 fw-bold"
                            onClick={(e) => {
                                navigate(`/create-ticket`, {
                                    state: {
                                        flightId: flight.Ma_chuyen_bay
                                    }
                                });
                            }}
                        >
                            Tạo Vé
                        </button>
                    </div>

                </div>
            </div>

            {show && detail && (
                <div className="modal show fade d-block align-items-center">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết chuyến bay #{flight.Ma_chuyen_bay}</h5>
                                <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
                            </div>
                            <div className="modal-body">
                                {detail.chitiet_hangve?.map((hv, idx) => (
                                    <div key={idx}>
                                        <p><strong>Hạng Vé:</strong> {hv.Ma_hang_ve} &nbsp;&nbsp;&nbsp; <strong>Giá:</strong> {hv.Gia_ve.toLocaleString()} VND</p>
                                        <p><strong>Số ghế trống:</strong> {hv.So_ve_trong} &nbsp;&nbsp;&nbsp; <strong>Số ghế đã đặt:</strong> {hv.So_ve_da_dat}</p>
                                        <hr />
                                    </div>
                                ))}

                                {detail.chitiet_sanbay_trung_gian?.map((tg, idx) => (
                                    <div key={idx}>
                                        <p><strong>Mã sân bay trung gian:</strong> {tg.Ma_san_bay || 'Không có'}</p>
                                        <p><strong>Thời gian dừng:</strong> {tg.Thoi_gian_dung || '0'} phút &nbsp;&nbsp;&nbsp; <strong>Ghi chú:</strong> {tg.Ghi_chu || 'Không có'}</p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FlightCard;
