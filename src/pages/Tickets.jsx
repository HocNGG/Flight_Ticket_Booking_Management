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

const MySwal = withReactContent(Swal);

const Tickets = () => {
    const [selectedOption, setSelectedOption] = useState("3");
    const [form, setForm] = useState({ 
        identity: '',
        filterType: 'cmnd' // 'cmnd', 'flightId', 'passengerId', 'date'
    });
    const [tickets, setTickets] = useState([]);
    const [searched, setSearched] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newSeatPosition, setNewSeatPosition] = useState('');
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { identity, filterType } = form;
            let url = '';

            switch (filterType) {
                case 'cmnd':
                    url = `http://localhost:5000/api/vechuyenbay/get_by_hanhkhach/cmnd/${identity}`;
                    break;
                case 'flightId':
                    url = `http://localhost:5000/api/vechuyenbay/get/${identity}`;
                    break;
                case 'passengerId':
                    url = `http://localhost:5000/api/hanhkhach/get/${identity}`;
                    break;
                case 'date':
                    url = `http://localhost:5000/api/vechuyenbay/get/DatHomNay`;
                    break;
                default:
                    url = `http://localhost:5000/api/vechuyenbay/get_by_hanhkhach/cmnd/${identity}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                if (filterType === 'flightId') {
                    const ticketData = {
                        ...data.data,
                        Tien_ve: data.data.Tien_ve || 0,
                        Ma_ve: data.data.Ma_ve || data.data.Ma_chuyen_bay
                    };
                    setTickets([ticketData]);
                } else if (filterType === 'date') {
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
            const url = `http://localhost:5000/api/vechuyenbay/update/vitriGhe/${selectedTicket.Ma_ve}`;
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

    const handleCancelTicket = async (ticketId) => {
        const result = await MySwal.fire({
            title: 'Bạn có chắc chắn muốn hủy vé này?',
            text: `Mã vé: #${ticketId}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hủy vé',
            cancelButtonText: 'Đóng',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            // TODO: Implement cancel ticket API call
            setToast({
                show: true,
                message: 'Chức năng hủy vé đang được phát triển',
                variant: 'info'
            });
        }
    };

    // Khi chuyển tab hoặc rời khỏi trang, làm sạch vé
    useEffect(() => {
        return () => {
            setTickets([]);
            setSearched(false);
        };
    }, []);

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
                    <h2>QUẢN LÝ VÉ CHUYẾN BAY</h2>
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
                                <Button type="submit" variant="primary" className="mb-1">
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
                                key={ticket.Ma_ve}
                                ticket={ticket}
                                onUpdateSeat={(ticket) => {
                                    setSelectedTicket(ticket);
                                    setNewSeatPosition(ticket.vi_tri);
                                    setShowUpdateModal(true);
                                }}
                                onCancelTicket={handleCancelTicket}
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
                            <Form.Control
                                type="text"
                                value={newSeatPosition}
                                onChange={(e) => setNewSeatPosition(e.target.value)}
                                placeholder="Nhập vị trí ghế mới"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSeat}>
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