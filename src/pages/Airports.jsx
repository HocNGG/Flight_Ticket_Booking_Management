import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ToastMessage from '../components/ToastMessage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Modal from 'react-bootstrap/Modal';

const MySwal = withReactContent(Swal);

const Airports = () => {
    const [selectedOption, setSelectedOption] = useState("4");
    const [airports, setAirports] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAirport, setEditAirport] = useState({ Ma_san_bay: '', Ten_san_bay: '' });
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [selectedAirport, setSelectedAirport] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const navigate = useNavigate();

    // Map mã sân bay -> mảng ảnh
    const AIRPORT_IMAGES = {
        'HNOI': [
            'https://images.pexels.com/photos/163792/model-planes-airplanes-miniatur-wunderland-hamburg-163792.jpeg',
            'https://images.pexels.com/photos/3943882/pexels-photo-3943882.jpeg',
        ],
        'SGON': [
            'https://images.pexels.com/photos/2767767/pexels-photo-2767767.jpeg',
            'https://images.pexels.com/photos/804463/pexels-photo-804463.jpeg',
        ],
        'DNANG': [
            'https://images.pexels.com/photos/2523644/pexels-photo-2523644.jpeg',
            'https://images.pexels.com/photos/2610756/pexels-photo-2610756.jpeg',
        ],
        // Thêm các mã khác nếu muốn
    };

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
        } catch {
            console.error('Có lỗi xảy ra khi lấy danh sách sân bay');
        }
    };

    const handleEditClick = (airport) => {
        setEditAirport({ ...airport });
        setShowEditModal(true);
    };

    const handleEditAirport = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/sanbay/update/${editAirport.Ma_san_bay}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ten_san_bay: editAirport.Ten_san_bay })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setToast({ show: true, message: data.message, variant: 'success' });
                setShowEditModal(false);
                fetchAirports();
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
            }
        } catch {
            setToast({ show: true, message: 'Có lỗi xảy ra khi cập nhật sân bay', variant: 'danger' });
        }
    };

    const handleDeleteAirport = async (maSanBay) => {
        const result = await MySwal.fire({
            title: 'Bạn có chắc chắn muốn xóa sân bay này?',
            text: `Mã sân bay: #${maSanBay}`,
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
            const res = await fetch(`http://localhost:5000/api/sanbay/delete/${maSanBay}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            await MySwal.close();
            if (data.status === 'success') {
                setToast({ show: true, message: data.message, variant: 'success' });
                fetchAirports();
                await MySwal.fire({
                    title: 'Thành công!',
                    text: 'Sân bay đã được xóa thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
                await MySwal.fire({
                    title: 'Lỗi!',
                    text: data.message || 'Không thể xóa sân bay!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch {
            setToast({ show: true, message: 'Có lỗi xảy ra khi xóa sân bay', variant: 'danger' });
            await MySwal.fire({
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra khi xóa sân bay!',
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
            backgroundPosition: 'top',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{fontWeight: 'bold'}}>🏢  SÂN BAY</h2>
                    <button 
                        className="btn btn-success fs-5"
                        onClick={() => navigate('/create-airport')}
                    >
                        + Thêm Sân Bay Mới
                    </button>
                </div>

                {/* Danh sách sân bay */}
                <div className="table-responsive bg-white p-4 shadow-sm text-center rounded-2">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Mã Sân Bay</th>
                                <th>Tên Sân Bay</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {airports.map((airport) => (
                                <tr key={airport.Ma_san_bay}>
                                    <td style={{cursor:'pointer',color:'#1976d2',fontWeight:'bold'}} onClick={() => { setSelectedAirport(airport); setShowImageModal(true); }}>{airport.Ma_san_bay}</td>
                                    <td style={{cursor:'pointer',color:'#1976d2'}} onClick={() => { setSelectedAirport(airport); setShowImageModal(true); }}>{airport.Ten_san_bay}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-warning fw-bold me-2"
                                            onClick={() => handleEditClick(airport)}
                                        >
                                            Cập nhật
                                        </button>
                                        <button 
                                            className='btn btn-danger fs-4 p-0 px-2' 
                                            onClick={() => handleDeleteAirport(airport.Ma_san_bay)}
                                        >
                                            🗑︎
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal popup slider ảnh sân bay */}
                <Modal show={showImageModal && !!selectedAirport} onHide={() => setShowImageModal(false)} size="lg" centered
                    contentClassName="border-0 shadow-lg rounded-4 airport-image-modal-content" 
                    dialogClassName="airport-image-modal-dialog"
                >
                    <Modal.Header closeButton style={{border:'none', borderRadius: '1.5rem 1.5rem 0 0', background: '#f5f7fa', padding: '1.5rem 2rem'}}>
                        <Modal.Title as="h4" style={{width:'100%', textAlign:'center', fontWeight:700, color:'#1976d2', letterSpacing:1, fontSize: '1.5rem'}}>
                            Hình ảnh sân bay {selectedAirport?.Ten_san_bay} ({selectedAirport?.Ma_san_bay})
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{background:'#fafdff', borderRadius:'0 0 1.5rem 1.5rem', padding:'2rem 2.5rem'}}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3500 }}
                            style={{'--swiper-navigation-color': '#1976d2','--swiper-pagination-color': '#1976d2'}}
                        >
                            {(AIRPORT_IMAGES[selectedAirport?.Ma_san_bay] || [
                                'https://images.pexels.com/photos/2574091/pexels-photo-2574091.jpeg',
                                'https://images.pexels.com/photos/2073082/pexels-photo-2073082.jpeg',
                            ]).map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img 
                                        src={img} 
                                        alt={selectedAirport?.Ten_san_bay} 
                                        style={{width:'100%',height:360,objectFit:'cover',borderRadius:16,boxShadow:'0 4px 24px rgba(25, 118, 210, 0.10)',margin:'0 auto'}} 
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Modal.Body>
                </Modal>

                {/* Modal sửa tên sân bay */}
                {showEditModal && (
                    <div className="modal show fade d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Cập nhật tên sân bay</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleEditAirport}>
                                        <div className="mb-3">
                                            <label className="form-label">Mã Sân Bay</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editAirport.Ma_san_bay}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tên Sân Bay</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editAirport.Ten_san_bay}
                                                onChange={(e) => setEditAirport({...editAirport, Ten_san_bay: e.target.value})}
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

export default Airports; 