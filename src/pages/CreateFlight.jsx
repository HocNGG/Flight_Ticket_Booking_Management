import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../components/ToastMessage';

const CreateFlight = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        flightId: '', srcAirport: '', desAirport: '', price: 0,
        date: '', time: '', duration: 0,
        detail: [
            {
                Ma_san_bay_trung_gian: '',
                thoigian_dung: 0,
                ghichu: ''
            }
        ],
        class: [
            {
                Ma_hang_ve: '',
                So_ghe_trong_hang: 0
            }
        ]

    })
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });

     const validDetails = form.detail.filter(
        det => det.Ma_san_bay_trung_gian.trim() !== ''
    );


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedTime = form.time.length === 5 ? form.time + ':00' : form.time;
        try {
            const url = `http://localhost:5000/api/chuyenbay/add`
            const body = {
                Ma_chuyen_bay: parseInt(form.flightId),
                Ma_san_bay_di: form.srcAirport,
                Ma_san_bay_den: form.desAirport,
                gia_ve: parseInt(form.price),
                ngay_khoi_hanh: form.date,
                gio_khoi_hanh: formattedTime,
                thoi_gian_bay: parseInt(form.duration),
                chitiet: validDetails,
                hangve: form.class
            };
            console.log("Body gửi lên:", body);
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.text();

            if (res.ok) {
                setToast({ show: true, message: 'Tạo chuyến bay thành công!', variant: 'success' });
                setTimeout(() => navigate('/flights'), 3000);
            } else {
                console.error("Lỗi backend:", data);
                setToast({ show: true, message: `Lỗi khi tạo chuyến bay`, variant: 'danger' });
            }
        } catch (err) {
            console.error(err);
        }
    }
    const handleNewClass = async (e) => {
        setForm({
            ...form,
            class: [...form.class, { Ma_hang_ve: '', So_ghe_trong_hang: 0 }]
        });
    }
    const handleNewDetail = async (e) => {
        setForm({
            ...form,
            detail: [...form.detail, { Ma_san_bay_trung_gian: '', thoigian_dung: 0, ghichu: '' }]

        });
    }
    return (

        <>
        <h2 className='p-4'>Tạo Chuyến Bay</h2>
        <div className="add-flight p-4 w-100">
            
            <div className=' mt-5 h-75 rounded-2 p-3 border w-75 mx-auto' style={{ backgroundColor: '#E6F6F3' }}>
                <form onSubmit={handleSubmit} className="my-3 p-4">
                    <div className=''>
                        <div className='p-3 border rounded-2 '>
                            <div className='row mt-2'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="flightId" className="form-label">Mã chuyến bay:</label>
                                    <input type="text" className="form-control" id="flightId" placeholder="Nhập mã chuyến bay"
                                        value={form.flightId}
                                        onChange={(e) => setForm({ ...form, flightId: e.target.value })}
                                        required />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="duration" className="form-label">Thời gian bay:</label>
                                    <input type="text" className="form-control" id="duration" placeholder="Nhập thời gian bay"
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="date" className="form-label">Ngày khởi hành:</label>
                                    <input type="date" className="form-control" id="date" placeholder="Nhập ngày khởi hành"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="time" className="form-label">Giờ khởi hành:</label>
                                    <input type="time" className="form-control" id="time" placeholder="Nhập giờ khởi hành"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="srcAirport" className="form-label">Mã sân bay đi:</label>
                                    <input type="text" className="form-control" id="srcAirport" placeholder="Nhập mã sân bay đi"
                                        value={form.srcAirport}
                                        onChange={(e) => setForm({ ...form, srcAirport: e.target.value })} required />
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="desAirport" className="form-label">Mã sân bay đến:</label>
                                    <input type="text" className="form-control" id="desAirport" placeholder="Nhập mã sân bay đến"
                                        value={form.desAirport}
                                        onChange={(e) => setForm({ ...form, desAirport: e.target.value })} required>
                                    </input>
                                </div>
                            </div>
                            <div>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="price" className="form-label">Giá vé:</label>
                                    <input type="text" className="form-control" id="price" placeholder="Nhập giá vé"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                                </div>
                            </div>
                        </div>

                        <div className='p-3 border rounded-2 mt-3'>
                            {form.class.map((cls, index) => (
                                <div className='row' key={index}>
                                    <div className='col-md-6 mb-3'>
                                        <label className='form-label'>Hạng vé:</label>
                                        <input type="text" className="form-control" placeholder="Mã hạng vé"
                                            value={cls.Ma_hang_ve}
                                            onChange={(e) => {
                                                const updated = [...form.class];
                                                updated[index].Ma_hang_ve = e.target.value;
                                                setForm({ ...form, class: updated });
                                            }}
                                            required />
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <label className='form-label'>Số ghế:</label>
                                        <input type="text" className="form-control" placeholder="Số ghế"
                                            value={cls.So_ghe_trong_hang}
                                            onChange={(e) => {
                                                const updated = [...form.class];
                                                updated[index].So_ghe_trong_hang = parseInt(e.target.value) || 0;
                                                setForm({ ...form, class: updated });
                                            }}
                                            required />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className='btn btn-success rounded-5' onClick={handleNewClass}>+</button>
                        </div>

                        <div className='p-3 border rounded-2 mt-3'>
                            {form.detail.map((det, index) => (
                                <div key={index}>
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label'>Sân bay trung gian:</label>
                                            <input type="text" className="form-control" placeholder="Mã sân bay trung gian"
                                                value={det.Ma_san_bay_trung_gian}
                                                onChange={(e) => {
                                                    const updated = [...form.detail];
                                                    updated[index].Ma_san_bay_trung_gian = e.target.value;
                                                    setForm({ ...form, detail: updated });
                                                }}
                                            />
                                        </div>
                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label'>Thời gian dừng:</label>
                                            <input type="text" className="form-control" placeholder="Thời gian dừng"
                                                value={det.thoigian_dung}
                                                onChange={(e) => {
                                                    const updated = [...form.detail];
                                                    updated[index].thoigian_dung = parseInt(e.target.value) || 0;
                                                    setForm({ ...form, detail: updated });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Ghi chú:</label>
                                        <input type="text" className="form-control" placeholder="Ghi chú"
                                            value={det.ghichu}
                                            onChange={(e) => {
                                                const updated = [...form.detail];
                                                updated[index].ghichu = e.target.value;
                                                setForm({ ...form, detail: updated });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className='btn btn-success rounded-5' onClick={handleNewDetail}>+</button>
                        </div>


                        <div className="text-end mt-5">
                            <button type="submit" className="btn btn-success p-3 me-4">Tạo Vé</button>
                        </div>
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
        </>
    )
}
export default CreateFlight;