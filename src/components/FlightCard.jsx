import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import ToastMessage from './ToastMessage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getAuthHeader } from '../utils/authFetch';

const MySwal = withReactContent(Swal);

const FlightCard = ({ flight, onDelete, onEdit }) => {
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [show, setShow] = useState(false);
    // const [toast, setToast] = useState({
    //     show: false,
    //     message: '',
    //     variant: 'success'
    // });
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
        e.preventDefault();
        try {
            const url = `https://se104-airport.space/api/chuyenbay/get/${flight.Ma_chuyen_bay}`
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
    const handleDeleteFlight = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            // SweetAlert2 confirm
            const result = await MySwal.fire({
                title: 'Bạn có chắc chắn muốn xóa chuyến bay này?',
                text: `Số hiệu chuyến bay: #${flight.Ma_chuyen_bay}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
                reverseButtons: true
            });

            if (!result.isConfirmed) {
                return;
            }

            // Hiển thị loading
            MySwal.fire({
                title: 'Đang xóa...',
                allowOutsideClick: false,
                didOpen: () => {
                    MySwal.showLoading();
                }
            });

            const url = `https://se104-airport.space/api/chuyenbay/delete/${flight.Ma_chuyen_bay}`;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            const data = await res.json();

            // Đóng loading
            await MySwal.close();

            if (res.ok && data.status === 'success') {
                setShow(false);
                onDelete?.(flight.Ma_chuyen_bay);

                // Hiển thị thông báo thành công
                await MySwal.fire({
                    title: 'Thành công!',
                    text: 'Chuyến bay đã được xóa thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                // Hiển thị thông báo lỗi
                await MySwal.fire({
                    title: 'Lỗi!',
                    text: data.message || 'Không thể xóa chuyến bay!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error deleting flight:', error);
            // Hiển thị thông báo lỗi
            await MySwal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi xóa chuyến bay!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    return (
        <>
            <div
                onClick={handleDetailClick}
                className="d-flex rounded-4 shadow-sm mb-3 p-4 align-items-center border"
                style={{
                    minHeight: '150px',
                    backgroundColor: '#E6F6F3',
                    cursor: 'pointer',
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

                {/* Cột: Thông tin chuyến bay */}
                <div className="d-flex flex-grow-1 px-4 align-items-center justify-content-start">
                    <div className="me-5" style={{ minWidth: '280px' }}>
                        <div className="fw-semibold text-primary fs-5 mb-1">
                            Số hiệu chuyến bay: #{flight.Ma_chuyen_bay}
                        </div>
                        <div className="small text-dark mb-1">
                            Thời gian bay {Math.floor(flight.Thoi_gian_bay / 60)}h {flight.Thoi_gian_bay % 60} phút
                        </div>
                        <div className="fs-5 d-flex align-items-center mb-1">
                            <div className="me-4 text-nowrap text-center">
                                <div className="fw-bold">{flight.Ma_san_bay_di}</div>
                                <div>{formatHHMM(flight.gio_khoi_hanh)}</div>
                            </div>
                            <div className="fs-1 mx-2">→</div>
                            <div className="ms-4 text-nowrap text-center">
                                <div className="fw-bold">{flight.Ma_san_bay_den}</div>
                                <div>{arrivalTime}</div>
                            </div>
                        </div>
                        <div className="text-muted small">{flight.ngay_khoi_hanh}</div>
                    </div>
                </div>

                {/* Cột: Giá vé + Nút */}
                <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ minWidth: '150px' }}
                >

                    <div
                        className="btn btn-warning text-dark rounded-3 p-4 me-5"
                        style={{
                            minWidth: '140px',
                            width: '100%',
                            maxWidth: '200px',
                            minHeight: '120px',
                            height: '100%',
                            backgroundColor: '#F2BB05',
                        }}
                    >
                        <div className="fw-semibold text-uppercase text-center">Giá chỉ  từ</div>
                        <div className="fw-bold fs-5">{Number(flight.gia_ve).toLocaleString()} <br /> VND</div>
                    </div>


                    <div className='mt-5 me-3'>
                        <div className='d-flex mt-1 ' style={{ position: 'absolute', top: '25%', right: '1%' }}>
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-warning fw-bold me-2 text-white"
                                    style={{
                                        backgroundColor: '#E58507',
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(flight);
                                    }}
                                >
                                    Cập nhật
                                </button>
                                <button
                                    className='btn btn-danger fs-4 p-0 px-2'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFlight(e);
                                    }}
                                >
                                    🗑︎
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-success px-3 py-2 fw-bold ms-5"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/create-ticket`, {
                                    state: {
                                        flightId: flight.Ma_chuyen_bay,
                                        price: flight.gia_ve,
                                        fromPage: 'flights'
                                    }
                                });
                            }}
                            style={{ whiteSpace: 'nowrap' }}
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
                                        <p><strong>Mã sân bay trung gian:</strong> {tg.ma_san_bay_trung_gian || 'Không có'}</p>
                                        <p><strong>Thời gian dừng:</strong> {tg.thoi_gian_dung || '0'} phút &nbsp;&nbsp;&nbsp; <strong>Ghi chú:</strong> {tg.ghi_chu || 'Không có'}</p>
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
