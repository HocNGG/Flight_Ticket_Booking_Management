import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ToastMessage from '../components/ToastMessage';

const CreateTicket = () => {
    const [selectedOption, setSelectedOption] = useState("3");
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.fromPage || '';
    const [basePrice, setBasePrice] = useState(location.state?.price || 0);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        flightId: fromPage === 'tickets' ? '' : location.state?.flightId || '',
        classId: '', name: '', identity: '', phone: '', gene: '', seat: '',
        price: 0
    });

    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });

    useEffect(() => {
        if (location.state?.flightId) {
            fetchFlightInfo(location.state.flightId);
        }
        // eslint-disable-next-line
    }, []);

    const fetchFlightInfo = async (flightId) => {
        if (!flightId) return;
        setLoading(true);
        try {
            const flightRes = await fetch(`http://localhost:5000/api/chuyenbay/get/${flightId}`);
            const flightData = await flightRes.json();
            if (flightRes.ok && flightData.data) {
                setBasePrice(flightData.data.gia_ve || 0);
                if (flightData.data.chitiet_hangve && flightData.data.chitiet_hangve.length > 0) {
                    const availableClasses = flightData.data.chitiet_hangve
                        .filter(classInfo => classInfo.So_ve_trong > 0)
                        .map(classInfo => ({
                            Ma_hang_ve: classInfo.Ma_hang_ve,
                            Ten_hang_ve: `Hạng ${classInfo.Ma_hang_ve}`,
                            he_so_gia: classInfo.Gia_ve / flightData.data.gia_ve,
                            so_ghe_con: classInfo.So_ve_trong
                        }));
                    setAvailableClasses(availableClasses);
                } else {
                    setAvailableClasses([]);
                    setToast({
                        show: true,
                        message: 'Không có thông tin hạng vé cho chuyến bay này',
                        variant: 'warning'
                    });
                }
            } else {
                setBasePrice(0);
                setAvailableClasses([]);
                setToast({
                    show: true,
                    message: 'Không tìm thấy thông tin chuyến bay',
                    variant: 'warning'
                });
            }
        } catch {
            setBasePrice(0);
            setAvailableClasses([]);
            setToast({
                show: true,
                message: 'Có lỗi xảy ra khi lấy thông tin chuyến bay',
                variant: 'danger'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFlightIdChange = (e) => {
        setForm({ ...form, flightId: e.target.value });
    };

    const handleFlightIdBlur = (e) => {
        fetchFlightInfo(e.target.value);
    };

    const handleClassChange = (e) => {
        const classId = e.target.value;
        const selectedClass = availableClasses.find(c => c.Ma_hang_ve.toString() === classId);
        
        if (selectedClass) {
            const calculatedPrice = Math.round(basePrice * selectedClass.he_so_gia);
            setForm((prev) => ({
                ...prev,
                classId,
                price: calculatedPrice,
            }));
        }
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
                }, 2000);
            } else {
                setToast({ 
                    show: true, 
                    message: data.message || 'Không thể tạo vé. Vui lòng thử lại!', 
                    variant: 'danger' 
                });
            }
        } catch (err) {
            console.error(err);
            setToast({ 
                show: true, 
                message: 'Có lỗi xảy ra khi tạo vé. Vui lòng thử lại!', 
                variant: 'danger' 
            });
        }
    }

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
            <div className="p-4 w-100">
                <h2 className="mb-4">TẠO VÉ CHUYẾN BAY</h2>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                    <div className="card p-4" style={{ width: '100%', minWidth: 700, maxWidth: 1200, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                        <form onSubmit={handleSubmit} className="my-3 p-2">
                            <div className='d-flex flex-column flex-md-row'>
                                <div className='info p-3 border rounded-2 flex-fill me-md-3 mb-3 mb-md-0' style={{ background: '#f8f9fa' }}>
                                    <div className='row mt-2'>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="flightId" className="form-label">Mã chuyến bay:</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="flightId" 
                                                placeholder="Nhập mã chuyến bay"
                                                value={form.flightId}
                                                onChange={handleFlightIdChange}
                                                onBlur={handleFlightIdBlur}
                                                required 
                                            />
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="seat" className="form-label">Vị trí ghế:</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="seat" 
                                                placeholder="Nhập vị trí ghế"
                                                value={form.seat}
                                                onChange={(e) => setForm({ ...form, seat: e.target.value })} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="name" className="form-label">Họ tên:</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="name" 
                                                placeholder="Nhập họ và tên"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                                                required 
                                            />
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="identity" className="form-label">Số CCCD:</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="identity" 
                                                placeholder="Nhập số CCCD"
                                                value={form.identity}
                                                onChange={(e) => setForm({ ...form, identity: e.target.value })} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="phone" className="form-label">Số điện thoại:</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="phone" 
                                                placeholder="Nhập số điện thoại"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                                                required 
                                            />
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label htmlFor="gene" className="form-label">Giới tính:</label>
                                            <select 
                                                className="form-select" 
                                                id="gene"
                                                value={form.gene}
                                                onChange={(e) => setForm({ ...form, gene: e.target.value })} 
                                                required
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='ticket-price p-3 border rounded-2 d-flex justify-content-center flex-fill' style={{ background: '#f8f9fa' }}>
                                    <div className='w-100' style={{ maxWidth: '400px' }}>
                                        <div className='mb-3'>
                                            <label htmlFor="classId" className="form-label">Hạng vé:</label>
                                            <select 
                                                className="form-select" 
                                                id="classId"
                                                value={form.classId}
                                                onChange={handleClassChange} 
                                                required
                                                disabled={loading || availableClasses.length === 0}
                                            >
                                                <option value="">Chọn hạng vé</option>
                                                {availableClasses.map((classInfo) => (
                                                    <option key={classInfo.Ma_hang_ve} value={classInfo.Ma_hang_ve}>
                                                        {classInfo.Ten_hang_ve} (Còn {classInfo.so_ghe_con} ghế)
                                                    </option>
                                                ))}
                                            </select>
                                            {loading && <div className="text-muted small mt-1">Đang tải thông tin...</div>}
                                            {!loading && availableClasses.length === 0 && form.flightId && (
                                                <div className="text-danger small mt-1">Không còn ghế trống cho chuyến bay này</div>
                                            )}
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor="price" className="form-label">Giá vé:</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="price" 
                                                value={form.price.toLocaleString()} 
                                                readOnly 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end mt-4">
                                <button 
                                    type="submit" 
                                    className="btn btn-success px-4 py-2"
                                    disabled={loading || availableClasses.length === 0}
                                >
                                    Tạo Vé
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastMessage
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    message={toast.message}
                    variant={toast.variant}
                />
            </div>
        </div>
    )
}
export default CreateTicket;