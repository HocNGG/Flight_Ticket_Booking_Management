import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL, LOCAL_API_URL } from '../utils/api';
import { getAuthHeader } from '../utils/authFetch';

const TicketCard = ({ ticket, onUpdateSeat }) => {
    const [detail, setDetail] = useState(null);
    const [passengerInfo, setPassengerInfo] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchFlightDetail = async () => {
            try {
                const res = await fetch(`${BASE_URL}/chuyenbay/get/${ticket.Ma_chuyen_bay}`);
                const data = await res.json();
                setDetail(data.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin chuyến bay:", error);
            }
        };

        const fetchPassengerInfo = async () => {
            try {
                if (ticket.Ma_hanh_khach) {
                    const res = await fetch(`${LOCAL_API_URL}/hanhkhach/get/${ticket.Ma_hanh_khach}`, {
                        headers: getAuthHeader()
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                        setPassengerInfo(data.data);
                    } else {
                        console.error("Lỗi khi tải thông tin hành khách:", data.message);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải thông tin hành khách:", error);
            }
        };

        if (ticket.Ma_chuyen_bay) {
            fetchFlightDetail();
        }
        if (ticket.Ma_hanh_khach) {
            fetchPassengerInfo();
        }
    }, [ticket.Ma_chuyen_bay, ticket.Ma_hanh_khach]);

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

    if (!detail) {
        return (
            <div className="d-flex rounded-4 shadow-sm mb-3 p-4 align-items-center border" style={{ minHeight: '150px', backgroundColor: '#E6F6F3' }}>
                <div className="w-100 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Đang tải thông tin vé...</p>
                </div>
            </div>
        );
    }

    const arrivalTime = calculateArrivalTime(detail.gio_khoi_hanh, detail.Thoi_gian_bay);

    return (
        <>
            <div
                className="d-flex rounded-4 shadow-sm mb-3 p-4 align-items-stretch border"
                style={{
                    minHeight: '150px',
                    backgroundColor: '#E6F6F3',
                    position: 'relative',
                    fontFamily: 'Inter, sans-serif'
                }}
            >
                {/* Cột: Logo */}
                <div
                    style={{ width: '15%', minWidth: '120px', marginRight: '90px' }}
                    className="d-flex align-items-center justify-content-center"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Blue-Air_logo-01.svg/1200px-Blue-Air_logo-01.svg.png"
                        alt="airline"
                        className="img-fluid"
                        style={{ height: '100%', objectFit: 'contain' }}
                    />
                </div>

                {/* Cột: Thông tin chuyến bay + Mã vé */}
                <div className="d-flex flex-grow-1 px-4 align-items-center justify-content-start">
                    {/* Thông tin chuyến bay */}
                    <div className="me-5" style={{ minWidth: '280px' }}>
                        <div className="fw-semibold text-primary fs-5 mb-1">
                            Số hiệu chuyến bay: #{ticket.Ma_chuyen_bay}
                        </div>
                        <div className="small text-dark mb-1">
                            Thời gian bay {Math.floor(detail.Thoi_gian_bay / 60)}h {detail.Thoi_gian_bay % 60} phút
                        </div>
                        <div className="fs-5 d-flex align-items-center mb-1">
                            <div className="me-4 text-nowrap text-center">
                                <div className="fw-bold">{detail.Ma_san_bay_di}</div>
                                <div>{formatHHMM(detail.gio_khoi_hanh)}</div>
                            </div>
                            <div className="fs-1 mx-2">→</div>
                            <div className="ms-4 text-nowrap text-center">
                                <div className="fw-bold">{detail.Ma_san_bay_den}</div>
                                <div>{arrivalTime}</div>
                            </div>
                        </div>
                        <div className="text-muted small">{detail.ngay_khoi_hanh}</div>
                    </div>
                    {/* Mã vé */}
                    <div className="text-nowrap me-4">
                        <div>Mã Vé: {ticket.Ma_ve}</div>
                        <div>Hạng vé: {ticket.Ma_hang_ve}</div>
                        <div>Vị trí ghế: {ticket.vi_tri}</div>
                    </div>
                </div>

                {/* Cột: Giá vé + Nút */}
                <div
                    className="d-flex align-items-center justify-content-end"
                    style={{ minWidth: '150px' }}
                >
                    <div className="d-flex flex-column gap-2 justify-content-center">
                        <button
                            className="btn btn-warning text-dark rounded-3 d-flex flex-column justify-content-center align-items-center p-4"
                            style={{
                                minWidth: '150px',
                                width: '100%',
                                maxWidth: '200px',
                                minHeight: '120px',
                                height: '100%',
                            }}
                        >
                            <div className="fw-semibold text-uppercase text-center">Giá Vé</div>
                            <div className="fw-bold fs-5">{ticket.Tien_ve.toLocaleString()} <br /> VND</div>
                        </button>
                        <div className="d-flex gap-1">
                            <Button 
                                variant="info" 
                                size="sm"
                                onClick={() => setShowDetailModal(true)}
                            >
                                Chi tiết
                            </Button>
                            <Button 
                                variant="warning" 
                                size="sm"
                                onClick={() => onUpdateSeat(ticket)}
                            >
                                Sửa ghế
                            </Button>
    
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal chi tiết vé */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết vé #{ticket.Ma_ve}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Thông tin vé</h5>
                            <p><strong>Mã vé:</strong> {ticket.Ma_ve}</p>
                            <p><strong>Mã chuyến bay:</strong> {ticket.Ma_chuyen_bay}</p>
                            <p><strong>Hạng vé:</strong> {ticket.Ma_hang_ve}</p>
                            <p><strong>Vị trí ghế:</strong> {ticket.vi_tri}</p>
                            <p><strong>Giá vé:</strong> {ticket.Tien_ve.toLocaleString()} VND</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Thông tin chuyến bay</h5>
                            <p><strong>Sân bay đi:</strong> {detail.Ma_san_bay_di}</p>
                            <p><strong>Sân bay đến:</strong> {detail.Ma_san_bay_den}</p>
                            <p><strong>Ngày khởi hành:</strong> {detail.ngay_khoi_hanh}</p>
                            <p><strong>Giờ khởi hành:</strong> {formatHHMM(detail.gio_khoi_hanh)}</p>
                            <p><strong>Thời gian bay:</strong> {Math.floor(detail.Thoi_gian_bay / 60)}h {detail.Thoi_gian_bay % 60} phút</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12">
                            <h5>Thông tin hành khách</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Họ tên:</strong> {passengerInfo ? passengerInfo.Hoten : (ticket.Ho_ten || 'Đang tải...')}</p>
                                    <p><strong>Số điện thoại:</strong> {passengerInfo ? passengerInfo.sdt : (ticket.sdt || 'Đang tải...')}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>CCCD/CMND:</strong> {passengerInfo ? passengerInfo.cmnd : (ticket.cmnd || 'Đang tải...')}</p>
                                    <p><strong>Giới tính:</strong> {passengerInfo ? passengerInfo.gioi_tinh : (ticket.gioi_tinh || 'Đang tải...')}</p>
                                </div>
                            </div>
                            {passengerInfo && (
                                <div className="mt-2">
                                    <small className="text-muted">Mã hành khách: {passengerInfo.id}</small>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TicketCard;

