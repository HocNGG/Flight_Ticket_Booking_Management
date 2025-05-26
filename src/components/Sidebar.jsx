import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ selectedOption, setSelectedOption }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: "1", label: "Trang chủ", path: "/home" },
        { id: "2", label: "Chuyến Bay", path: "/flight" },
        { id: "3", label: "Vé Chuyến Bay", path: "/ticket" },
        { id: "4", label: "Sân Bay", path: "/airport" },
        { id: "5", label: "Hạng Vé", path: "/class" },
        { id: "6", label: "Doanh Thu", path: "/revenue" }
    ];

    return (
        <>
            <div className='container ms-3'>
                {/* Hiển thị role ở đây */}
                <div className='role mt-3'>
                    <h2>STAFF</h2>
                </div>

                <div className="sidebar rounded-4 mt-3 p-2">
                    <div className="p-3">
                        <h3 className="text-center mb-4">Menu</h3>
                        <div className="d-flex flex-column gap-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`btn ${selectedOption === item.id ? 'btn-light' : 'btn-outline-light'}`}
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
        </>
    );
};

export default Sidebar;