import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import FlightCard from '../components/FlightCard';
import ToastMessage from '../components/ToastMessage';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Flights = () => {
    const [selectedOption, setSelectedOption] = useState("2");
    const [form, setForm] = useState({ from: '', to: '', startDate: '', arriveDate: '', flightId: '' });
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);
    const [detail, setDetail] = useState(null);
    const [show, setShow] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        Ma_chuyen_bay: '',
        Ma_san_bay_di: '',
        Ma_san_bay_den: '',
        ngay_khoi_hanh: '',
        gio_khoi_hanh: '',
        Thoi_gian_bay: '',
        gia_ve: ''
    });
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });
    const [airports, setAirports] = useState([]);
    const navigate = useNavigate();

    const handleSearchById = async (e) => {
        e.preventDefault();
        try {
            const { flightId } = form;
            if (!flightId) {
                setToast({
                    show: true,
                    message: 'Vui lòng nhập mã chuyến bay',
                    variant: 'warning'
                });
                return;
            }

            const url = `http://localhost:5000/api/chuyenbay/get/${flightId}`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok && data.data) {
                setFlights([data.data]);
                setToast({
                    show: true,
                    message: 'Tìm kiếm thành công',
                    variant: 'success'
                });
            } else {
                setFlights([]);
                setToast({
                    show: true,
                    message: 'Không tìm thấy chuyến bay với ID này',
                    variant: 'danger'
                });
            }
            setSearched(true);
        } catch (err) {
            console.error(err);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi tìm kiếm',
                variant: 'danger'
            });
        }
    };

    const handleSearchByCriteria = async (e) => {
        e.preventDefault();
        try {
            const { from, to, startDate, arriveDate } = form;
            if (!from || !to || !startDate || !arriveDate) {
                setToast({
                    show: true,
                    message: 'Vui lòng điền đầy đủ thông tin tìm kiếm',
                    variant: 'warning'
                });
                return;
            }

            const url = `http://localhost:5000/api/chuyenbay/search?start_time=${startDate}T00:00:00&end_time=${arriveDate}T23:59:59&sanbay_di=${from}&sanbay_den=${to}`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
                setFlights(data.data);
                setToast({
                    show: true,
                    message: 'Tìm kiếm thành công',
                    variant: 'success'
                });
            } else {
                setFlights([]);
                setToast({
                    show: true,
                    message: 'Không tìm thấy chuyến bay phù hợp',
                    variant: 'warning'
                });
            }
            setSearched(true);
        } catch (err) {
            console.error(err);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi tìm kiếm',
                variant: 'danger'
            });
        }
    };

    const handleDelete = (flightId) => {
        setFlights((prev) => prev.filter((f) => f.Ma_chuyen_bay !== flightId));
    };

    const handleEditClick = (flight) => {
        setUpdateForm({
            Ma_chuyen_bay: flight.Ma_chuyen_bay,
            Ma_san_bay_di: flight.Ma_san_bay_di,
            Ma_san_bay_den: flight.Ma_san_bay_den,
            ngay_khoi_hanh: flight.ngay_khoi_hanh,
            gio_khoi_hanh: flight.gio_khoi_hanh,
            Thoi_gian_bay: flight.Thoi_gian_bay,
            gia_ve: flight.gia_ve
        });
        setShowUpdateModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:5000/api/chuyenbay/update/${updateForm.Ma_chuyen_bay}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateForm)
            });
            const data = await res.json();

            if (res.ok) {
                // Cập nhật lại danh sách chuyến bay
                setFlights(prevFlights =>
                    prevFlights.map(flight =>
                        flight.Ma_chuyen_bay === updateForm.Ma_chuyen_bay ? updateForm : flight
                    )
                );
                setShowUpdateModal(false);
                setToast({
                    show: true,
                    message: 'Cập nhật chuyến bay thành công',
                    variant: 'success'
                });
            } else {
                setToast({
                    show: true,
                    message: data.message || 'Cập nhật thất bại',
                    variant: 'danger'
                });
            }
        } catch (err) {
            console.error(err);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi cập nhật',
                variant: 'danger'
            });
        }
    };

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/chuyenbay/get/all`, {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.ok && Array.isArray(data.message) && data.message.length > 0) {
                    setFlights(data.message);
                } else {
                    console.warn("Dữ liệu chuyến bay không hợp lệ hoặc không phải mảng:", data);
                    setFlights([]);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFlights();
        // Fetch danh sách sân bay
        const fetchAirports = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/sanbay/get');
                const data = await res.json();
                if (data.status === 'success') {
                    setAirports(data.message);
                }
            } catch (err) {
                console.error('Lỗi lấy danh sách sân bay:', err);
            }
        };
        fetchAirports();
    }, []);

    return (
        <div className='full-container d-flex' style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1535557597501-0fee0a500c57?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{fontWeight: 'bold'}}>✈️  CHUYẾN BAY</h2>
                    <div>
                        <Button 
                            className='btn btn-success fs-5'
                            onClick={() => navigate('/create-flight')}
                        >
                            + Thêm chuyến bay
                        </Button>
                    </div>
                </div>
                <div className="d-flex flex-column my-3">
                    <form onSubmit={handleSearchById} className="d-flex justify-content-between align-items-center mb-3">
                        <div className="flex-grow-1 me-3">
                            <label htmlFor="flightId" className='mb-2 fs-5'>Mã chuyến bay</label>
                            <input 
                                type="text" 
                                className="form-control fs-5" 
                                placeholder="Nhập mã chuyến bay" 
                                value={form.flightId} 
                                onChange={(e) => setForm({ ...form, flightId: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-4 fs-5 px-4">Tìm theo mã</button>
                    </form>
                    
                    <form onSubmit={handleSearchByCriteria} className="d-flex justify-content-between align-items-center">
                        <div>
                            <label htmlFor="from" className='mb-2 fs-5'>Từ</label>
                            <Form.Select
                                className="form-control fs-5"
                                value={form.from}
                                onChange={(e) => setForm({ ...form, from: e.target.value })}
                                required
                            >
                                <option value="">Chọn sân bay đi</option>
                                {airports.map((airport) => (
                                    <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                                        {airport.Ten_san_bay} ({airport.Ma_san_bay})
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                        <div>
                            <label htmlFor="to" className='mb-2 fs-5'>Đến</label>
                            <Form.Select
                                className="form-control fs-5"
                                value={form.to}
                                onChange={(e) => setForm({ ...form, to: e.target.value })}
                                required
                            >
                                <option value="">Chọn sân bay đến</option>
                                {airports.map((airport) => (
                                    <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                                        {airport.Ten_san_bay} ({airport.Ma_san_bay})
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                        <div>
                            <label htmlFor="startDate" className='mb-2 fs-5'>Ngày khởi hành</label>
                            <input 
                                type="date" 
                                className="form-control fs-5" 
                                placeholder="Ngày đi" 
                                value={form.startDate} 
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label htmlFor="arriveDate" className='mb-2 fs-5'>Ngày đến</label>
                            <input 
                                type="date" 
                                className="form-control fs-5" 
                                placeholder="Ngày đến" 
                                value={form.arriveDate} 
                                onChange={(e) => setForm({ ...form, arriveDate: e.target.value })} 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-4 fs-5 px-4">Tìm kiếm</button>
                    </form>
                </div>

                    <div className='flight-list rounded-3 p-2'>
                        {flights.length > 0 ? (
                            flights.map(flight => (
                                <FlightCard
                                    key={flight.Ma_chuyen_bay}
                                    flight={flight}
                                    detail={detail}
                                    setDetail={setDetail}
                                    show={show}
                                    setShow={setShow}
                                    onDelete={handleDelete}
                                    onEdit={handleEditClick}
                                />
                            ))
                        ) : searched ? (
                            <div className="text-center p-4">
                                <h4>Không tìm thấy chuyến bay phù hợp</h4>
                            </div>
                        ) : null}
                    </div>
                </div>

            {/* Modal cập nhật chuyến bay */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật chuyến bay #{updateForm.Ma_chuyen_bay}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Ngày khởi hành</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={updateForm.ngay_khoi_hanh}
                                        onChange={(e) => setUpdateForm({...updateForm, ngay_khoi_hanh: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Giờ khởi hành</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={updateForm.gio_khoi_hanh}
                                        onChange={(e) => setUpdateForm({...updateForm, gio_khoi_hanh: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Thời gian bay (phút)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={updateForm.Thoi_gian_bay}
                                        onChange={(e) => setUpdateForm({...updateForm, Thoi_gian_bay: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group>
                                    <Form.Label>Giá vé (VND)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={updateForm.gia_ve}
                                        onChange={(e) => setUpdateForm({...updateForm, gia_ve: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Cập nhật
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
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

export default Flights;