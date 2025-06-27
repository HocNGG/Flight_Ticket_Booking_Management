import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ToastMessage from '../components/ToastMessage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { authFetch } from '../utils/authFetch';
import { BASE_URL } from '../utils/api';

const MySwal = withReactContent(Swal);

// Constants for seat generation
const ROWS = 20;
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const allSeats = [];
for (let i = 1; i <= ROWS; i++) {
  for (let c of COLS) {
    allSeats.push(`${i}${c}`);
  }
}

const Tickets = () => {
    const [selectedOption, setSelectedOption] = useState("3");
    const [form, setForm] = useState({ 
        identity: '',
        filterType: 'date' // Mặc định là 'date'
    });
    const [tickets, setTickets] = useState([]);
    const [searched, setSearched] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newSeatPosition, setNewSeatPosition] = useState('');
    const [bookedSeats, setBookedSeats] = useState([]);
    const [loadingSeats, setLoadingSeats] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });
    const [loading, setLoading] = useState(true);
    const [showUI, setShowUI] = useState(false);
    const navigate = useNavigate();

    // Fetch booked seats for a specific flight
    const fetchBookedSeats = async (flightId) => {
        if (!flightId) return;
        setLoadingSeats(true);
        try {
            const res = await fetch(`${BASE_URL}/vechuyenbay/search/flight/${flightId}`);
            const data = await res.json();
            const seats = Array.isArray(data.tickets)
                ? data.tickets.filter(v => v.Tinh_trang !== false && v.vi_tri)
                    .map(v => String(v.vi_tri).trim().toUpperCase())
                : [];
            setBookedSeats(seats);
        } catch {
            setBookedSeats([]);
        } finally {
            setLoadingSeats(false);
        }
    };
    

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { identity, filterType } = form;
            let url = '';
            let useAuth = false;

            switch (filterType) {
                case 'cmnd':
                    url = `${BASE_URL}/vechuyenbay/get_by_hanhkhach/cmnd/${identity}`;
                    useAuth = true;
                    break;
                case 'flightId':
                    url = `${BASE_URL}/vechuyenbay/search/flight/${identity}`;
                    useAuth = true;
                    break;
                case 'passengerId':
                    url = `${BASE_URL}/hanhkhach/get/${identity}`;
                    break;
                case 'date':
                    url = `${BASE_URL}/vechuyenbay/get/DatHomNay`;
                    break;
                default:
                    url = `${BASE_URL}/vechuyenbay/get_by_hanhkhach/cmnd/${identity}`;
                    useAuth = true;
            }

            let res, data;
            if (useAuth) {
                res = await authFetch(url, { method: 'GET' });
                data = await res.json();
                if (res.ok && data.status === 'success') {
                    if (filterType === 'cmnd') {
                        // Lấy danh sách vé từ CMND
                        const ticketList = data.data || [];
                        
                        // Lấy chi tiết từng vé để có Ma_hanh_khach
                        const detailedTickets = await Promise.all(
                            ticketList.map(async (ticket) => {
                                try {
                                    const detailRes = await authFetch(`${BASE_URL}/vechuyenbay/get/${ticket.Ma_ve}`, { method: 'GET' });
                                    const detailData = await detailRes.json();
                                    if (detailRes.ok && detailData.status === 'success') {
                                        return {
                                            ...ticket,
                                            Ma_hanh_khach: detailData.data.Ma_hanh_khach,
                                            vi_tri: detailData.data.vi_tri || ticket.vi_tri
                                        };
                                    }
                                    return ticket;
                                } catch (error) {
                                    console.error(`Error fetching ticket detail for ${ticket.Ma_ve}:`, error);
                                    return ticket;
                                }
                            })
                        );
                        
                        setTickets(detailedTickets);
                    } else if (filterType === 'flightId') {
                        setTickets((data.tickets || []).map(ticket => ({
                            ...ticket,
                            Ma_ve: ticket.id,
                            Ma_chuyen_bay: identity
                        })));
                    }
                } else {
                    setTickets([]);
                    setToast({
                        show: true,
                        message: data.message || 'Không tìm thấy vé',
                        variant: 'warning'
                    });
                }
            } else {
                res = await fetch(url);
                data = await res.json();
                if (res.ok) {
                    if (filterType === 'date') {
                        setTickets(data.data || []);
                    } else {
                        const ticketList = Array.isArray(data.data) ? data.data : [data.data];
                        setTickets(ticketList);
                    }
                } else {
                    setTickets([]);
                    setToast({
                        show: true,
                        message: data.message || 'Không tìm thấy vé',
                        variant: 'warning'
                    });
                }
            }
            setSearched(true);
        } catch (err) {
            console.error('Error searching tickets:', err);
            setTickets([]);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi tìm kiếm',
                variant: 'danger'
            });
        }
    };

    const handleUpdateSeat = async () => {
        if (!selectedTicket || !newSeatPosition) return;

        try {
            const url = `${BASE_URL}/vechuyenbay/update/vitriGhe/${selectedTicket.Ma_ve}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vitri: newSeatPosition })
            });
            const data = await res.json();

            if (res.ok && data.status === 'success') {
                // Cập nhật lại danh sách vé
                setTickets(prevTickets => 
                    prevTickets.map(ticket => 
                        ticket.Ma_ve === selectedTicket.Ma_ve 
                            ? { ...ticket, vi_tri: newSeatPosition }
                            : ticket
                    )
                );
                setShowUpdateModal(false);
                setToast({
                    show: true,
                    message: 'Cập nhật vị trí ghế thành công',
                    variant: 'success'
                });
            } else {
                setToast({
                    show: true,
                    message: data.message || 'Không thể cập nhật vị trí ghế',
                    variant: 'danger'
                });
            }
        } catch (err) {
            console.error('Error updating seat:', err);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi cập nhật vị trí ghế',
                variant: 'danger'
            });
        }
    };

    // Khi chuyển tab hoặc rời khỏi trang, làm sạch vé
    useEffect(() => {
        // Hiện SweetAlert khi bắt đầu load
        MySwal.fire({
            title: 'Đang tải dữ liệu...',
            allowOutsideClick: false,
            didOpen: () => { MySwal.showLoading(); }
        });
        // Tự động tìm vé hôm nay khi vào trang
        const fetchTodayTickets = async () => {
            try {
                const url = `${BASE_URL}/vechuyenbay/get/DatHomNay`;
                const res = await fetch(url);
                const data = await res.json();
                if (res.ok) {
                    setTickets(data.data || []);
                } else {
                    setTickets([]);
                    setToast({
                        show: true,
                        message: data.message || 'Không tìm thấy vé',
                        variant: 'warning'
                    });
                }
                setSearched(true);
            } catch {
                setTickets([]);
                setToast({
                    show: true,
                    message: 'Có lỗi xảy ra khi tìm kiếm',
                    variant: 'danger'
                });
            } finally {
                setLoading(false);
            }
        };
        if (form.filterType === 'date') {
            fetchTodayTickets();
        }
        return () => {
            setTickets([]);
            setSearched(false);
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            MySwal.close();
            setShowUI(true);
        }
    }, [loading]);

    if (loading || !showUI) return (
        <div className='full-container d-flex' style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1535557597501-0fee0a500c57?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'top'
        }}>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100 d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
                <div className="spinner-border text-primary" role="status" style={{width: '4rem', height: '4rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className='full-container d-flex' style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1535557597501-0fee0a500c57?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'top'
        }}>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h2 style={{fontWeight: 'bold', color:'#fff'}}>🎫 VÉ CHUYẾN BAY</h2>
                    <button 
                        className='btn btn-success fs-5' 
                        onClick={() => navigate('/create-ticket', { state: { fromPage: 'tickets' } })}
                    >
                        + Tạo Vé
                    </button>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <form onSubmit={handleSearch} className="d-flex flex-column gap-3">
                            <div className="d-flex gap-3 align-items-end">
                                <div className="flex-grow-1">
                                    <Form.Label>Tìm kiếm theo</Form.Label>
                                    <Form.Select
                                        value={form.filterType}
                                        onChange={(e) => setForm({...form, filterType: e.target.value})}
                                    >
                                        <option value="cmnd">CMND/CCCD</option>
                                        <option value="flightId">Mã chuyến bay</option>
                                        <option value="date">Vé đặt hôm nay</option>
                                    </Form.Select>
                                </div>
                                {form.filterType !== 'date' && (
                                    <div className="flex-grow-1">
                                        <Form.Label>Nhập thông tin tìm kiếm</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={
                                                form.filterType === 'cmnd' ? 'Nhập CMND/CCCD' :
                                                form.filterType === 'flightId' ? 'Nhập mã chuyến bay' :
                                                'Nhập mã hành khách'
                                            }
                                            value={form.identity}
                                            onChange={(e) => setForm({...form, identity: e.target.value})}
                                            required
                                        />
                                    </div>
                                )}
                                <Button type="submit" variant="primary" className="">
                                    Tìm kiếm
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='ticket-list rounded-3 p-2'>
                    {tickets.length > 0 ? (
                        tickets.map(ticket => (
                            <TicketCard
                                key={ticket.id || ticket.Ma_ve}
                                ticket={ticket}
                                onUpdateSeat={(ticket) => {
                                    setSelectedTicket(ticket);
                                    setNewSeatPosition(ticket.vi_tri);
                                    setShowUpdateModal(true);
                                    // Fetch booked seats when opening modal
                                    fetchBookedSeats(ticket.Ma_chuyen_bay);
                                }}
                                onCancelTicket={() => {}}
                            />
                        ))
                    ) : searched ? (
                        <div className="text-center p-4 bg-white rounded-3 shadow-sm">
                            <h4>Không tìm thấy vé chuyến bay</h4>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Modal cập nhật vị trí ghế */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật vị trí ghế</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Vị trí ghế mới</Form.Label>
                            <Form.Select
                                value={newSeatPosition}
                                onChange={(e) => setNewSeatPosition(e.target.value)}
                                disabled={loadingSeats}
                            >
                                <option value="">Chọn vị trí ghế</option>
                                {allSeats.filter(seat => !bookedSeats.includes(seat) || seat === selectedTicket?.vi_tri).map(seat => (
                                    <option key={seat} value={seat}>
                                        {seat} {seat === selectedTicket?.vi_tri ? '(Ghế hiện tại)' : ''}
                                    </option>
                                ))}
                            </Form.Select>
                            {loadingSeats && (
                                <div className="text-muted small mt-1">Đang tải danh sách ghế...</div>
                            )}
                            {!loadingSeats && bookedSeats.length > 0 && (
                                <div className="text-info small mt-1">
                                    Đã loại bỏ {bookedSeats.length} ghế đã được đặt
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSeat} disabled={!newSeatPosition}>
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastMessage
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </div>
    );
};

export default Tickets;