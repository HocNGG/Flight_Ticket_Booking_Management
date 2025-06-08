import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const Classes = () => {
    const [selectedOption, setSelectedOption] = useState("5");
    const [classes, setClasses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newClass, setNewClass] = useState({
        Ten_hang_ve: '',
        Ti_le_don_gia: ''
    });
    const [updateClass, setUpdateClass] = useState({
        Ten_hang_ve: '',
        Ti_le_don_gia: ''
    });
    const [selectedClassId, setSelectedClassId] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/hangve/get');
            const data = await res.json();
            if (data.status === 'success') {
                setClasses(data.message);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi lấy danh sách hạng vé');
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            const body = {
                Ten_hang_ve: newClass.Ten_hang_ve,
                Ti_le_don_gia: parseFloat(newClass.Ti_le_don_gia)
            };
            const res = await fetch('http://localhost:5000/api/hangve/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Thêm hạng vé thành công!');
                setShowCreateModal(false);
                setNewClass({ Ten_hang_ve: '', Ti_le_don_gia: '' });
                fetchClasses();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi thêm hạng vé');
        }
    };

    const handleUpdateClass = async (e) => {
        e.preventDefault();
        try {
            // Chỉ gửi trường thay đổi
            const body = {};
            if (updateClass.Ten_hang_ve) body.Ten_hang_ve = updateClass.Ten_hang_ve;
            if (updateClass.Ti_le_don_gia) body.Ti_le_don_gia = parseFloat(updateClass.Ti_le_don_gia);
            const res = await fetch(`http://localhost:5000/api/hangve/update/${selectedClassId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Cập nhật hạng vé thành công!');
                setShowUpdateModal(false);
                setUpdateClass({ Ten_hang_ve: '', Ti_le_don_gia: '' });
                setSelectedClassId(null);
                fetchClasses();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi cập nhật hạng vé');
        }
    };

    const openUpdateModal = (cls) => {
        setSelectedClassId(cls.id);
        setUpdateClass({
            Ten_hang_ve: cls.Ten_hang_ve,
            Ti_le_don_gia: cls.Ti_le_don_gia
        });
        setShowUpdateModal(true);
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
                    <h2>HẠNG VÉ</h2>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Thêm Hạng Vé Mới
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Tên Hạng Vé</th>
                                <th>Tỉ Lệ Đơn Giá</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls.id}>
                                    <td>{cls.Ten_hang_ve}</td>
                                    <td>{cls.Ti_le_don_gia}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm" onClick={() => openUpdateModal(cls)}>
                                            Cập Nhật
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal thêm hạng vé mới */}
                {showCreateModal && (
                    <div className="modal show fade d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm Hạng Vé Mới</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleCreateClass}>
                                        <div className="mb-3">
                                            <label className="form-label">Tên Hạng Vé</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newClass.Ten_hang_ve}
                                                onChange={(e) => setNewClass({...newClass, Ten_hang_ve: e.target.value})}
                                                required
                                                placeholder="Ví dụ: Hạng 1"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tỉ Lệ Đơn Giá</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={newClass.Ti_le_don_gia}
                                                onChange={(e) => setNewClass({...newClass, Ti_le_don_gia: e.target.value})}
                                                required
                                                placeholder="Ví dụ: 1.05"
                                            />
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowCreateModal(false)}>
                                                Hủy
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Thêm
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal cập nhật hạng vé */}
                {showUpdateModal && (
                    <div className="modal show fade d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Cập Nhật Hạng Vé</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleUpdateClass}>
                                        <div className="mb-3">
                                            <label className="form-label">Tên Hạng Vé</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={updateClass.Ten_hang_ve}
                                                onChange={(e) => setUpdateClass({...updateClass, Ten_hang_ve: e.target.value})}
                                                placeholder="Ví dụ: Hạng 1"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tỉ Lệ Đơn Giá</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                value={updateClass.Ti_le_don_gia}
                                                onChange={(e) => setUpdateClass({...updateClass, Ti_le_don_gia: e.target.value})}
                                                placeholder="Ví dụ: 1.05"
                                            />
                                        </div>
                                        <div className="text-end">
                                            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowUpdateModal(false)}>
                                                Hủy
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Cập Nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classes; 