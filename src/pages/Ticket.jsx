import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Ticket = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({
        flightId: location.state?.flightId || '',
        classId: '', name: '', identity: '', phone: '', gene: '', seat: '',
        price: location.state?.price || ''
    })
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
                alert('Tạo vé thành công!');
                navigate('/flight');
            } else {
                console.log(`Lỗi: ${data.message || 'Không thể tạo vé'}`);
            }
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className="p-4 w-100">
            <h2>STAFF</h2>
            <div className=' mt-5 h-75 rounded-2 p-3 border' style={{ backgroundColor: '#E6F6F3' }}>
                <form onSubmit={handleSubmit} className="my-3 p-4">
                    <div className='row mt-4'>
                        <div className='col-md-6 mb-3'>
                            <label htmlFor="flightId" className="form-label">Mã chuyến bay:</label>
                            <input type="text" className="form-control" id="flightId" placeholder="Nhập mã chuyến bay"
                                value={form.flightId}
                                onChange={(e) => setForm({ ...form, flightId: e.target.value })} required />
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label htmlFor="classId" className="form-label">Hạng vé:</label>
                            <select className="form-select" id="classId"
                                value={form.classId}
                                onChange={(e) => setForm({ ...form, classId: e.target.value })} required>
                                <option value="">Chọn hạng vé</option>
                                <option value="1">Hạng 1</option>
                                <option value="2">Hạng 2</option>
                                <option value="3">Hạng 3</option>
                            </select>
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

                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label htmlFor="seat" className="form-label">Vị trí ghế:</label>
                            <input type="text" className="form-control" id="seat" placeholder="Nhập vị trí ghế"
                                value={form.seat}
                                onChange={(e) => setForm({ ...form, seat: e.target.value })} required />
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label htmlFor="price" className="form-label">Giá vé:</label>
                            <input type="text" className="form-control" id="price" placeholder="Nhập giá vé"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                                {}
                        </div>
                    </div>

                    <div className="text-end">
                        <button type="submit" className="btn btn-success mt-3 p-3">Tạo Vé</button>
                    </div>
                </form>
            </div>
        </div>

    )
}
export default Ticket;