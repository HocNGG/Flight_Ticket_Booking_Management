import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToastMessage from '../components/ToastMessage';

const CreateFlight = () => {
    const [selectedOption, setSelectedOption] = useState("2");
    const [airports, setAirports] = useState([]);
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form
            if (!form.Ma_chuyen_bay || !form.Ma_san_bay_di || !form.Ma_san_bay_den || 
                !form.ngay_khoi_hanh || !form.gio_khoi_hanh || !form.thoi_gian_bay || 
                !form.gia_ve) {
                setToast({
                    show: true,
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                    variant: 'warning'
                });
                return;
            }

            // Format time to include seconds
            const formattedTime = form.gio_khoi_hanh + ':00';

            // Prepare data according to API requirements
            const formData = {
                Ma_chuyen_bay: parseInt(form.Ma_chuyen_bay),
                Ma_san_bay_di: form.Ma_san_bay_di,
                Ma_san_bay_den: form.Ma_san_bay_den,
                ngay_khoi_hanh: form.ngay_khoi_hanh,
                gio_khoi_hanh: formattedTime,
                thoi_gian_bay: parseInt(form.thoi_gian_bay),
                gia_ve: parseInt(form.gia_ve),
                chitiet: form.chitiet
                    .filter(item => item.Ma_san_bay_trung_gian)
                    .map(item => ({
                        Ma_san_bay_trung_gian: item.Ma_san_bay_trung_gian,
                        thoigian_dung: parseInt(item.thoigian_dung) || 0,
                        ghichu: item.ghichu || ''
                    })),
                hangve: form.hangve
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
                setToast({
                    show: true,
                    message: data.message,
                    variant: 'success'
                });
                // Reset form
                setForm({
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
                // Navigate back to flights page after 2 seconds
                setTimeout(() => {
                    navigate('/flights');
                }, 2000);
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>THÊM CHUYẾN BAY MỚI</h2>
                    <Button 
                        variant="secondary"
                        onClick={() => navigate('/flights')}
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="card p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã Chuyến Bay</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={form.Ma_chuyen_bay}
                                        onChange={(e) => setForm({
                                            ...form,
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
                                        value={form.Ma_san_bay_di}
                                        onChange={(e) => setForm({
                                            ...form,
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
                                        value={form.Ma_san_bay_den}
                                        onChange={(e) => setForm({
                                            ...form,
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
                                        value={form.ngay_khoi_hanh}
                                        onChange={(e) => setForm({
                                            ...form,
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
                                        value={form.gio_khoi_hanh}
                                        onChange={(e) => setForm({
                                            ...form,
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
                                        value={form.thoi_gian_bay}
                                        onChange={(e) => setForm({
                                            ...form,
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
                                        value={form.gia_ve}
                                        onChange={(e) => setForm({
                                            ...form,
                                            gia_ve: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="mt-4">Hạng Vé</h5>
                        {form.hangve.map((item, index) => (
                            <Row key={index} className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Hạng Vé</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={item.Ma_hang_ve}
                                            onChange={(e) => {
                                                const newHangve = [...form.hangve];
                                                newHangve[index].Ma_hang_ve = parseInt(e.target.value);
                                                setForm({
                                                    ...form,
                                                    hangve: newHangve
                                                });
                                            }}
                                            required
                                            min="1"
                                            placeholder="Nhập mã hạng vé"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={5}>
                                    <Form.Group>
                                        <Form.Label>Số Ghế Trống</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={item.So_ghe_trong_hang}
                                            onChange={(e) => {
                                                const newHangve = [...form.hangve];
                                                newHangve[index].So_ghe_trong_hang = parseInt(e.target.value);
                                                setForm({
                                                    ...form,
                                                    hangve: newHangve
                                                });
                                            }}
                                            required
                                            min="1"
                                            placeholder="Nhập số ghế trống"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={1} className="d-flex align-items-end">
                                    {index > 0 && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => {
                                                const newHangve = form.hangve.filter((_, i) => i !== index);
                                                setForm({
                                                    ...form,
                                                    hangve: newHangve
                                                });
                                            }}
                                        >
                                            <i className="fas fa-times">XÓA</i>
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        ))}
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                                setForm({
                                    ...form,
                                    hangve: [
                                        ...form.hangve,
                                        {
                                            Ma_hang_ve: 1,
                                            So_ghe_trong_hang: 50
                                        }
                                    ]
                                });
                            }}
                            className="mb-3"
                        >
                            <i className="fas fa-plus"></i> Thêm Hạng Vé
                        </Button>

                        <h5 className="mt-4">Sân Bay Trung Gian</h5>
                        {form.chitiet.map((item, index) => (
                            <Row key={index} className="mb-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Sân Bay</Form.Label>
                                        <Form.Select
                                            value={item.Ma_san_bay_trung_gian}
                                            onChange={(e) => {
                                                const newChitiet = [...form.chitiet];
                                                newChitiet[index].Ma_san_bay_trung_gian = e.target.value;
                                                setForm({
                                                    ...form,
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
                                                const newChitiet = [...form.chitiet];
                                                newChitiet[index].thoigian_dung = e.target.value;
                                                setForm({
                                                    ...form,
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
                                                const newChitiet = [...form.chitiet];
                                                newChitiet[index].ghichu = e.target.value;
                                                setForm({
                                                    ...form,
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
                                            const newChitiet = form.chitiet.filter((_, i) => i !== index);
                                            setForm({
                                                ...form,
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
                                setForm({
                                    ...form,
                                    chitiet: [
                                        ...form.chitiet,
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
                            <Button variant="secondary" className="me-2" onClick={() => navigate('/flights')}>
                                Hủy
                            </Button>
                            <Button variant="primary" type="submit">
                                Thêm Chuyến Bay
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>

            <ToastMessage
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </div>
    );
};

export default CreateFlight; 