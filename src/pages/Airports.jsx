import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const Airports = () => {
    const [selectedOption, setSelectedOption] = useState("4");
    const [airports, setAirports] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAirport, setNewAirport] = useState({
        Ma_san_bay: '',
        Ten_san_bay: ''
    });

    // Fetch danh sách sân bay khi component mount
    useEffect(() => {
        fetchAirports();
    }, []);

    const fetchAirports = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/sanbay/get');
            const data = await res.json();
            if (data.status === 'success') {
                setAirports(data.message);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi lấy danh sách sân bay');
        }
    };

    const handleCreateAirport = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/sanbay/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAirport)
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Thêm sân bay thành công!');
                setShowCreateModal(false);
                setNewAirport({ Ma_san_bay: '', Ten_san_bay: '' });
                fetchAirports(); // Refresh danh sách
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi thêm sân bay');
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
                    <h2>SÂN BAY</h2>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Thêm Sân Bay Mới
                    </button>
                </div>

                {/* Danh sách sân bay */}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Mã Sân Bay</th>
                                <th>Tên Sân Bay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {airports.map((airport) => (
                                <tr key={airport.Ma_san_bay}>
                                    <td>{airport.Ma_san_bay}</td>
                                    <td>{airport.Ten_san_bay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal thêm sân bay mới */}
                {showCreateModal && (
                    <div className="modal show fade d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Thêm Sân Bay Mới</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleCreateAirport}>
                                        <div className="mb-3">
                                            <label className="form-label">Mã Sân Bay</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newAirport.Ma_san_bay}
                                                onChange={(e) => setNewAirport({...newAirport, Ma_san_bay: e.target.value.toUpperCase()})}
                                                required
                                                maxLength={5}
                                                placeholder="Ví dụ: HNOI"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tên Sân Bay</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newAirport.Ten_san_bay}
                                                onChange={(e) => setNewAirport({...newAirport, Ten_san_bay: e.target.value})}
                                                required
                                                placeholder="Ví dụ: Hà Nội"
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
            </div>
        </div>
    );
};

export default Airports; 