import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ToastMessage from '../components/ToastMessage';
import { getAuthHeader } from '../utils/authFetch';
const Regulations = () => {
    const [selectedOption, setSelectedOption] = useState("6");
    const [regulations, setRegulations] = useState({
        soluongsanbaytrunggian: '',
        thoigianbaytoithieu: '',
        thoigiandungtoida: '',
        thoigiandungtoithieu: '',
        thoigianvechuyenbay: ''
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchRegulations();
    }, []);

    const fetchRegulations = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://se104-airport.space/api/quydinh/get', {
                headers: getAuthHeader()
            });
            const data = await res.json();
            if (data.status === 'success') {
                setRegulations(data.data);
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
            }
        } catch {
            setToast({ show: true, message: 'Lỗi khi lấy quy định', variant: 'danger' });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setRegulations({ ...regulations, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://se104-airport.space/api/quydinh/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({
                    ...regulations,
                    soluongsanbaytrunggian: Number(regulations.soluongsanbaytrunggian),
                    thoigianbaytoithieu: Number(regulations.thoigianbaytoithieu),
                    thoigiandungtoida: Number(regulations.thoigiandungtoida),
                    thoigiandungtoithieu: Number(regulations.thoigiandungtoithieu),
                    thoigianvechuyenbay: Number(regulations.thoigianvechuyenbay)
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setToast({ show: true, message: data.message, variant: 'success' });
                setEditing(false);
                fetchRegulations();
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
            }
        } catch {
            setToast({ show: true, message: 'Lỗi khi cập nhật quy định', variant: 'danger' });
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
                    <h2 style={{fontWeight: 'bold', color: '#fff'}}>⚖️  QUY ĐỊNH</h2>
                    <button className={`btn fs-5 ${editing ? 'btn-danger' : 'btn-success'}`} onClick={() => setEditing(!editing)}>
                        {editing ? 'Hủy' : '+ Chỉnh sửa'}
                    </button>
                </div>
                <div className="card p-4">
                    {loading ? (
                        <div>Đang tải quy định...</div>
                    ) : (
                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="form-label">Số lượng sân bay trung gian</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="soluongsanbaytrunggian"
                                    value={regulations.soluongsanbaytrunggian}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Thời gian bay tối thiểu (phút)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="thoigianbaytoithieu"
                                    value={regulations.thoigianbaytoithieu}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Thời gian dừng tối đa (phút)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="thoigiandungtoida"
                                    value={regulations.thoigiandungtoida}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Thời gian đặt vé tối thiểu (giờ)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="thoigianvechuyenbay"
                                    value={regulations.thoigiandatvetoithieu}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Thời gian dừng tối thiểu (phút)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="thoigiandungtoithieu"
                                    value={regulations.thoigiandungtoithieu}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            {editing && (
                                <div className="text-end">
                                    <button type="submit" className="btn btn-success">Lưu</button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
                <ToastMessage
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    message={toast.message}
                    variant={toast.variant}
                />
            </div>
        </div>
    );
};

export default Regulations; 