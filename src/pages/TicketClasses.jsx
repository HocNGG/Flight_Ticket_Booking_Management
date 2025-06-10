import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ToastMessage from '../components/ToastMessage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const TicketClasses = () => {
    const [selectedOption, setSelectedOption] = useState("5");
    const [ticketClasses, setTicketClasses] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTicketClass, setEditTicketClass] = useState({ id: '', Ten_hang_ve: '', Ti_le_don_gia: '' });
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const navigate = useNavigate();

    // Fetch danh sách hạng vé khi component mount
    useEffect(() => {
        fetchTicketClasses();
    }, []);

    const fetchTicketClasses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/hangve/get');
            const data = await res.json();
            if (data.status === 'success') {
                setTicketClasses(data.message);
            } else {
                alert(data.message);
            }
        } catch {
            console.error('Có lỗi xảy ra khi lấy danh sách hạng vé');
        }
    };

    const handleEditClick = (ticketClass) => {
        setEditTicketClass({ ...ticketClass });
        setShowEditModal(true);
    };

    const handleEditTicketClass = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/hangve/update/${editTicketClass.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Ten_hang_ve: editTicketClass.Ten_hang_ve,
                    Ti_le_don_gia: editTicketClass.Ti_le_don_gia
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setToast({ show: true, message: data.message, variant: 'success' });
                setShowEditModal(false);
                fetchTicketClasses();
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
            }
        } catch {
            setToast({ show: true, message: 'Có lỗi xảy ra khi cập nhật hạng vé', variant: 'danger' });
        }
    };

    const handleDeleteTicketClass = async (id) => {
        const result = await MySwal.fire({
            title: 'Bạn có chắc chắn muốn xóa hạng vé này?',
            text: `ID: #${id}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            reverseButtons: true
        });
        if (!result.isConfirmed) return;
        try {
            MySwal.fire({
                title: 'Đang xóa...',
                allowOutsideClick: false,
                didOpen: () => { MySwal.showLoading(); }
            });
            const res = await fetch(`http://localhost:5000/api/hangve/delete/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            await MySwal.close();
            if (data.status === 'success') {
                setToast({ show: true, message: data.message, variant: 'success' });
                fetchTicketClasses();
                await MySwal.fire({
                    title: 'Thành công!',
                    text: 'Hạng vé đã được xóa thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
                await MySwal.fire({
                    title: 'Lỗi!',
                    text: data.message || 'Không thể xóa hạng vé!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch {
            setToast({ show: true, message: 'Có lỗi xảy ra khi xóa hạng vé', variant: 'danger' });
            await MySwal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi xóa hạng vé!',
                icon: 'error',
                confirmButtonText: 'OK'
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
                    <h2>HẠNG VÉ</h2>
                    <button 
                        className="btn btn-success fs-5"
                        onClick={() => navigate('/create-ticket-class')}
                    >
                        + Thêm Hạng Vé Mới
                    </button>
                </div>

                {/* Danh sách hạng vé */}
                <div className="table-responsive bg-white p-4 shadow-sm text-center rounded-2">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Hạng Vé</th>
                                <th>Tỷ Lệ Đơn Giá</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticketClasses.map((ticketClass) => (
                                <tr key={ticketClass.id}>
                                    <td>{ticketClass.id}</td>
                                    <td>{ticketClass.Ten_hang_ve}</td>
                                    <td>{ticketClass.Ti_le_don_gia}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-warning fw-bold me-2"
                                            onClick={() => handleEditClick(ticketClass)}
                                        >
                                            Cập nhật
                                        </button>
                                        <button 
                                            className='btn btn-danger fs-4 p-0 px-2' 
                                            onClick={() => handleDeleteTicketClass(ticketClass.id)}
                                        >
                                            🗑︎
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal sửa hạng vé */}
                {showEditModal && (
                    <div className="modal show fade d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Cập nhật hạng vé</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleEditTicketClass}>
                                        <div className="mb-3">
                                            <label className="form-label">ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editTicketClass.id}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tên Hạng Vé</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editTicketClass.Ten_hang_ve}
                                                onChange={(e) => setEditTicketClass({...editTicketClass, Ten_hang_ve: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tỷ Lệ Đơn Giá</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={editTicketClass.Ti_le_don_gia}
                                                onChange={(e) => setEditTicketClass({...editTicketClass, Ti_le_don_gia: parseFloat(e.target.value)})}
                                                required
                                            />
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                                                Hủy
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Cập nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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

export default TicketClasses; 