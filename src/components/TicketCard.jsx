import { useState, useEffect } from "react";

const TicketCard = ({ ticket }) => {
    const [detail, setDetail] = useState(null); // đổi từ [] sang null để dễ kiểm tra

    useEffect(() => {
        const fetchFlightDetail = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/chuyenbay/get/${ticket.Ma_chuyen_bay}`);
                const data = await res.json();
                setDetail(data.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin chuyến bay:", error);
            }
        };

        if (ticket.Ma_chuyen_bay) {
            fetchFlightDetail();
        }
    }, [ticket.Ma_chuyen_bay]);

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
        return <div className="text-center text-muted">Vui lòng chờ trong giây lát...</div>;
    }

    const arrivalTime = calculateArrivalTime(detail.gio_khoi_hanh, detail.Thoi_gian_bay);

    return (
        <div className="d-flex rounded-4 shadow-sm mb-3 p-3 align-items-center justify-content-between border" style={{ minHeight: '100px', backgroundColor: '#E6F6F3'}}>
            <div className="d-flex align-items-center flex-grow-1">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Blue-Air_logo-01.svg/1200px-Blue-Air_logo-01.svg.png"
                    alt="airline"
                    style={{ width: '20%', height: '100%', objectFit: 'contain' }}
                    className="me-5"
                />
                <div className='ms-5'>
                    <div className="fw-semibold text-primary fs-5">Số hiệu chuyến bay: #{ticket.Ma_chuyen_bay}</div>
                    <div className="small text-dark mt-2">Thời gian bay {Math.floor(detail.Thoi_gian_bay / 60)}h {detail.Thoi_gian_bay % 60} phút</div>
                    <div className="mt-2 fs-5 d-flex">
                        <div className='d-block me-5'>
                            <span className='fw-bold'>{detail.Ma_san_bay_di}</span>
                            <br />
                            <span>{formatHHMM(detail.gio_khoi_hanh)}</span>
                        </div>
                        <span className="mx-auto fs-1">→</span>
                        <div className='ms-5 me-4'>
                            <span className='fw-bold'>{detail.Ma_san_bay_den}</span>
                            <br />
                            <span>{arrivalTime}</span>
                        </div>
                    </div>
                    <div className="text-muted small mt-1">{detail.ngay_khoi_hanh}</div>
                </div>
                <div className="text-start mt-3 mt-md-0 border-start ps-4">
                    <div>Mã Vé: {ticket.Ma_ve}</div>
                    <div>Mã Hành Khách: {ticket.id_hanhkhach}</div>
                    <div>Hạng vé: {ticket.Ma_hang_ve}</div>
                    <div>Vị trí ghế: {ticket.vi_tri}</div>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
