import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ToastMessage from '../components/ToastMessage';

const CreateTicket = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.fromPage || '';
    const [basePrice, setBasePrice] = useState(location.state?.price || 0); // có thể update khi chọn mã chuyến bay

    const [form, setForm] = useState({
        flightId: fromPage === 'tickets' ? '' : location.state?.flightId || '',
        classId: '', name: '', identity: '', phone: '', gene: '', seat: '',
        price: 0
    })
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });

    const handleFlightIdChange = async (e) => {
        const flightId = e.target.value;
        setForm({ ...form, flightId });

        if (fromPage === 'tickets') {
            try {
                const res = await fetch(`http://localhost:5000/api/chuyenbay/get/${flightId}`, {
                    method: 'GET'
            });
                const data = await res.json();

                if (res.ok) {
                    setBasePrice(data.data.gia_ve || 0); // Lưu giá gốc để tính hạng vé
                } else {
                    setBasePrice(0);
                }
            } catch (error) {
                console.error("Lỗi fetch chuyến bay:", error);
                setBasePrice(0);
            }
        }
    };

    const handleClassChange = (e) => {
        const classId = e.target.value;
        let multiplier = 1;

        switch (classId) {
            case '1':
                multiplier = 1.1;
                break;
            case '2':
                multiplier = 1.0;
                break;
            case '3':
                multiplier = 1.2;
                break;
            case '4':
                multiplier = 1.3;
                break;
            default:
                multiplier = 1;
        }

        const calculatedPrice = Math.round(basePrice * multiplier);

        setForm((prev) => ({
            ...prev,
            classId,
            price: calculatedPrice,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:5000/api/vechuyenbay/add`
            const body = {
                Ma_chuyen_bay: parseInt(form.flightId),
                Ma_hang_ve: parseInt(form.classId),
                vitri: form.seat,
                Ho_ten: form.name,
                cmnd: form.identity,
                sdt: form.phone,
                gioi_tinh: form.gene
            };
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                setToast({ show: true, message: 'Tạo vé thành công!', variant: 'success' });
                setTimeout(() => {
                    if (fromPage === 'tickets') {
                        navigate('/tickets');
                    } else {
                        navigate('/flights');
                    }
                }, 1000);
            } else {
                setToast({ show: true, message: 'Chuyến bay đã khởi hành!', variant: 'danger' });
            }
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className="p-4 w-100">
            <h2>Tạo Vé Chuyến Bay</h2>
            <div className=' mt-5 h-75 rounded-2 p-3 border w-75 mx-auto' style={{ backgroundColor: '#E6F6F3' }}>
                <form onSubmit={handleSubmit} className="my-3 p-4">
                    <div className='d-flex'>
                        <div className='info p-3 border rounded-2 '>
                            <div className='row mt-2'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="flightId" className="form-label">Mã chuyến bay:</label>
                                    <input type="text" className="form-control" id="flightId" placeholder="Nhập mã chuyến bay"
                                        value={form.flightId}
                                        onChange={handleFlightIdChange} required />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="seat" className="form-label">Vị trí ghế:</label>
                                    <input type="text" className="form-control" id="seat" placeholder="Nhập vị trí ghế"
                                        value={form.seat}
                                        onChange={(e) => setForm({ ...form, seat: e.target.value })} required />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="name" className="form-label">Họ tên:</label>
                                    <input type="text" className="form-control" id="name" placeholder="Nhập họ và tên"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="identity" className="form-label">Số CCCD:</label>
                                    <input type="text" className="form-control" id="identity" placeholder="Nhập số CCCD"
                                        value={form.identity}
                                        onChange={(e) => setForm({ ...form, identity: e.target.value })} required />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="phone" className="form-label">Số điện thoại:</label>
                                    <input type="text" className="form-control" id="phone" placeholder="Nhập số điện thoại"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="gene" className="form-label">Giới tính:</label>
                                    <select className="form-select" id="gene"
                                        value={form.gene}
                                        onChange={(e) => setForm({ ...form, gene: e.target.value })} required>
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='ticket-price p-3 border rounded-2 d-flex justify-content-center'>
                            <div className='w-75' style={{ maxWidth: '400px' }}>
                                <div className='mb-3'>
                                    <label htmlFor="classId" className="form-label">Hạng vé:</label>
                                    <select className="form-select" id="classId"
                                        value={form.classId}
                                        onChange={handleClassChange} required>
                                        <option value="">Chọn hạng vé</option>
                                        <option value="1">Hạng 1</option>
                                        <option value="2">Hạng 2</option>
                                        <option value="3">Hạng 3</option>
                                        <option value="4">Hạng 4</option>
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="price" className="form-label">Giá vé:</label>
                                    <input type="text" className="form-control" id="price" placeholder="Nhập giá vé"
                                        value={form.price} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-end mt-5">
                        <button type="submit" className="btn btn-success p-3 me-4">Tạo Vé</button>
                    </div>
                </form>
            </div>

            {/* Hiển thị Toast */}
            <ToastMessage
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                message={toast.message}
                variant={toast.variant}
            />
        </div>

    )
}
export default CreateTicket;