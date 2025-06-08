import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import FlightCard from '../components/FlightCard';
import ToastMessage from '../components/ToastMessage';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [airports, setAirports] = useState([]);
    const [createForm, setCreateForm] = useState({
        Ma_chuyen_bay: '',
        Ma_san_bay_di: '',
        Ma_san_bay_den: '',
        ngay_khoi_hanh: '',
        gio_khoi_hanh: '',
        thoi_gian_bay: '',
        gia_ve: '',
        chitiet: [
            {
                Ma_san_bay_trung_gian: '',
                thoigian_dung: '',
                ghichu: ''
            }
        ],
        hangve: [
            {
                Ma_hang_ve: 1,
                So_ghe_trong_hang: 50
            },
            {
                Ma_hang_ve: 2,
                So_ghe_trong_hang: 50
            }
        ]
    });

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
        setSelectedFlight(flight);
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
    }, []);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/sanbay/get');
                const data = await res.json();
                if (data.status === 'success' && Array.isArray(data.message)) {
                    setAirports(data.message);
                } else {
                    console.error('Error fetching airports:', data.message);
                }
            } catch (err) {
                console.error('Error fetching airports:', err);
            }
        };
        fetchAirports();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form
            if (!createForm.Ma_chuyen_bay || !createForm.Ma_san_bay_di || !createForm.Ma_san_bay_den || 
                !createForm.ngay_khoi_hanh || !createForm.gio_khoi_hanh || !createForm.thoi_gian_bay || 
                !createForm.gia_ve) {
                setToast({
                    show: true,
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                    variant: 'warning'
                });
                return;
            }

            // Format time to include seconds
            const formattedTime = createForm.gio_khoi_hanh + ':00';

            // Prepare data according to API requirements
            const formData = {
                Ma_chuyen_bay: parseInt(createForm.Ma_chuyen_bay),
                Ma_san_bay_di: createForm.Ma_san_bay_di,
                Ma_san_bay_den: createForm.Ma_san_bay_den,
                ngay_khoi_hanh: createForm.ngay_khoi_hanh,
                gio_khoi_hanh: formattedTime,
                thoi_gian_bay: parseInt(createForm.thoi_gian_bay),
                gia_ve: parseInt(createForm.gia_ve),
                chitiet: createForm.chitiet
                    .filter(item => item.Ma_san_bay_trung_gian) // Only include items with airport selected
                    .map(item => ({
                        Ma_san_bay_trung_gian: item.Ma_san_bay_trung_gian,
                        thoigian_dung: parseInt(item.thoigian_dung) || 0,
                        ghichu: item.ghichu || ''
                    })),
                hangve: createForm.hangve
            };

            const res = await fetch('http://localhost:5000/api/chuyenbay/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.status === 'success') {
                // Refresh flight list
                const allFlightsRes = await fetch('http://localhost:5000/api/chuyenbay/get/all');
                const allFlightsData = await allFlightsRes.json();
                if (allFlightsRes.ok && Array.isArray(allFlightsData.message)) {
                    setFlights(allFlightsData.message);
                }

                setShowCreateModal(false);
                setCreateForm({
                    Ma_chuyen_bay: '',
                    Ma_san_bay_di: '',
                    Ma_san_bay_den: '',
                    ngay_khoi_hanh: '',
                    gio_khoi_hanh: '',
                    thoi_gian_bay: '',
                    gia_ve: '',
                    chitiet: [
                        {
                            Ma_san_bay_trung_gian: '',
                            thoigian_dung: '',
                            ghichu: ''
                        }
                    ],
                    hangve: [
                        {
                            Ma_hang_ve: 1,
                            So_ghe_trong_hang: 50
                        },
                        {
                            Ma_hang_ve: 2,
                            So_ghe_trong_hang: 50
                        }
                    ]
                });
                setToast({
                    show: true,
                    message: data.message,
                    variant: 'success'
                });
            } else {
                setToast({
                    show: true,
                    message: data.message,
                    variant: 'danger'
                });
            }
        } catch (err) {
            console.error('Error creating flight:', err);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi thêm chuyến bay',
                variant: 'danger'
            });
        }
    };

    return (
        <div className='full-container d-flex'>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>CHUYẾN BAY</h2>
                    <Button 
                        variant="success" 
                        size="lg"
                        onClick={() => setShowCreateModal(true)}
                    >
                        +Thêm chuyến bay
                    </Button>
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
                            <input 
                                type="text" 
                                className="form-control fs-5" 
                                placeholder="Nhập điểm khởi hành" 
                                value={form.from} 
                                onChange={(e) => setForm({ ...form, from: e.target.value })} 
                            />
                        </div>
                        <div>
                            <label htmlFor="to" className='mb-2 fs-5'>Đến</label>
                            <input 
                                type="text" 
                                className="form-control fs-5" 
                                placeholder="Nhập điểm đến" 
                                value={form.to} 
                                onChange={(e) => setForm({ ...form, to: e.target.value })} 
                            />
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

            {/* Create Flight Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Chuyến Bay Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã Chuyến Bay</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={createForm.Ma_chuyen_bay}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            Ma_chuyen_bay: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sân Bay Đi</Form.Label>
                                    <Form.Select
                                        value={createForm.Ma_san_bay_di}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            Ma_san_bay_di: e.target.value
                                        })}
                                        required
                                    >
                                        <option value="">Chọn sân bay đi</option>
                                        {airports.map(airport => (
                                            <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                                                {airport.Ten_san_bay} ({airport.Ma_san_bay})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sân Bay Đến</Form.Label>
                                    <Form.Select
                                        value={createForm.Ma_san_bay_den}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            Ma_san_bay_den: e.target.value
                                        })}
                                        required
                                    >
                                        <option value="">Chọn sân bay đến</option>
                                        {airports.map(airport => (
                                            <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                                                {airport.Ten_san_bay} ({airport.Ma_san_bay})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày Khởi Hành</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={createForm.ngay_khoi_hanh}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            ngay_khoi_hanh: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giờ Khởi Hành</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={createForm.gio_khoi_hanh}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            gio_khoi_hanh: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Thời Gian Bay (phút)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={createForm.thoi_gian_bay}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            thoi_gian_bay: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá Vé (VNĐ)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={createForm.gia_ve}
                                        onChange={(e) => setCreateForm({
                                            ...createForm,
                                            gia_ve: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="mt-4">Sân Bay Trung Gian</h5>
                        {createForm.chitiet.map((item, index) => (
                            <Row key={index} className="mb-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Sân Bay</Form.Label>
                                        <Form.Select
                                            value={item.Ma_san_bay_trung_gian}
                                            onChange={(e) => {
                                                const newChitiet = [...createForm.chitiet];
                                                newChitiet[index].Ma_san_bay_trung_gian = e.target.value;
                                                setCreateForm({
                                                    ...createForm,
                                                    chitiet: newChitiet
                                                });
                                            }}
                                        >
                                            <option value="">Chọn sân bay trung gian</option>
                                            {airports.map(airport => (
                                                <option key={airport.Ma_san_bay} value={airport.Ma_san_bay}>
                                                    {airport.Ten_san_bay} ({airport.Ma_san_bay})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Thời Gian Dừng (phút)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={item.thoigian_dung}
                                            onChange={(e) => {
                                                const newChitiet = [...createForm.chitiet];
                                                newChitiet[index].thoigian_dung = e.target.value;
                                                setCreateForm({
                                                    ...createForm,
                                                    chitiet: newChitiet
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Ghi Chú</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={item.ghichu}
                                            onChange={(e) => {
                                                const newChitiet = [...createForm.chitiet];
                                                newChitiet[index].ghichu = e.target.value;
                                                setCreateForm({
                                                    ...createForm,
                                                    chitiet: newChitiet
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={1} className="d-flex align-items-end">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            const newChitiet = createForm.chitiet.filter((_, i) => i !== index);
                                            setCreateForm({
                                                ...createForm,
                                                chitiet: newChitiet
                                            });
                                        }}
                                    >
                                        <i className="fas fa-times">XÓA</i>
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                                setCreateForm({
                                    ...createForm,
                                    chitiet: [
                                        ...createForm.chitiet,
                                        {
                                            Ma_san_bay_trung_gian: '',
                                            thoigian_dung: '',
                                            ghichu: ''
                                        }
                                    ]
                                });
                            }}
                            className="mb-3"
                        >
                            <i className="fas fa-plus"></i> Thêm Sân Bay Trung Gian
                        </Button>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowCreateModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                Thêm Chuyến Bay
                            </Button>
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
    )
}

export default Flights;