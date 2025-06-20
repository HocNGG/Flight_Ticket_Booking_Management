import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getAuthHeader } from '../utils/authFetch';
const MySwal = withReactContent(Swal);

const CreateAirport = () => {
    const [selectedOption, setSelectedOption] = useState("4");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        Ma_san_bay: '',
        Ten_san_bay: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            MySwal.fire({
                title: 'Đang thêm sân bay...',
                allowOutsideClick: false,
                didOpen: () => { MySwal.showLoading(); }
            });
            const res = await fetch('https://se104-airport.space/api/sanbay/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader()  },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            await MySwal.close();
            if (data.status === 'success') {
                await MySwal.fire({
                    icon: 'success',
                    title: 'Thêm sân bay thành công!',
                    text: data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    navigate('/airport');
                }, 1000);
            } else {
                await MySwal.fire({
                    icon: 'error',
                    title: 'Thêm sân bay thất bại!',
                    text: data.message,
                    showConfirmButton: true
                });
            }
        } catch (error) {
            await MySwal.close();
            await MySwal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra khi thêm sân bay!',
                showConfirmButton: true
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
                    <h2>THÊM SÂN BAY MỚI</h2>
                    <Button 
                        variant="secondary"
                        onClick={() => navigate('/airport')}
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="card p-4">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mã Sân Bay</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.Ma_san_bay}
                                onChange={(e) => setForm({
                                    ...form,
                                    Ma_san_bay: e.target.value.toUpperCase()
                                })}
                                placeholder="Ví dụ: HNOI"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tên Sân Bay</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.Ten_san_bay}
                                onChange={(e) => setForm({
                                    ...form,
                                    Ten_san_bay: e.target.value
                                })}
                                placeholder="Ví dụ: Hà Nội"
                                required
                            />
                        </Form.Group>

                        <div className="text-end">
                            <Button variant="primary" type="submit">
                                Thêm Sân Bay
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CreateAirport; 