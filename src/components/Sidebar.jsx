import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ selectedOption, setSelectedOption }) => {
    const navigate = useNavigate();
    const menuItems = [
        { id: "1", label: <><i className="fa-solid fa-house icon-bordered"></i> Trang chủ</>, path: "/home" },
        { id: "2", label: <><i className="fa-solid fa-plane-departure icon-bordered"></i> Chuyến Bay</>, path: "/flights" },
        { id: "3", label: <><i className="fa-solid fa-ticket-alt icon-bordered"></i> Vé Chuyến Bay</>, path: "/tickets" },
        { id: "4", label: <><i className="fa-solid fa-building icon-bordered"></i> Sân Bay</>, path: "/airport" },
        { id: "5", label: <><i className="fa-solid fa-chair icon-bordered"></i> Hạng Vé</>, path: "/class" },
        { id: "6", label: <><i className="fa-solid fa-scale-balanced icon-bordered"></i> Quy Định</>, path: "/regulations" },
        { id: "7", label: <><i className="fa-solid fa-chart-line icon-bordered"></i> Doanh Thu</>, path: "/overall-revenue" }
    ];

    return (
        <div style={{fontFamily: 'Inter, sans-serif'}}>
            <div className='container ms-3' style={{ color: '#000', minHeight: '100vh' }}>
                {/* Hiển thị role ở đây */}
                <div className='role mt-3'>
                    <h2>ADMIN</h2>
                </div>

                <div className="sidebar rounded-4 mt-3 p-2" style={{ backgroundColor: '#fff', minHeight: '80vh', height: '80%', width:'100%' }}>
                    <div className="p-3">
                        <h3 className="text-center mb-4">Menu</h3>
                        <div className="d-flex flex-column gap-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`btn w-100 text-start px-4 py-3 mb-2 rounded-3 transition-all ${
                                        selectedOption === item.id 
                                        ? 'bg-primary text-white shadow-sm font-weight-bold border-light' 
                                        : 'bg-white text-dark hover-bg-light'
                                    }`}
                                    style={{
                                        border: '2px solid #e0e0e0',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => {
                                        setSelectedOption(item.id);
                                        navigate(item.path);
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;