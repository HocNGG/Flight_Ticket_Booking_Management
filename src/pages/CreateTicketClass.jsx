import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ToastMessage from '../components/ToastMessage';

const CreateTicketClass = () => {
    const [selectedOption, setSelectedOption] = useState("5");
    const [toast, setToast] = useState({
        show: false,
        message: '',
        variant: 'success'
    });
    const navigate = useNavigate();

    const [form, setForm] = useState({
        Ten_hang_ve: '',
        Ti_le_don_gia: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/hangve/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Ten_hang_ve: form.Ten_hang_ve,
                    Ti_le_don_gia: parseFloat(form.Ti_le_don_gia)
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setToast({ show: true, message: data.message, variant: 'success' });
                setTimeout(() => {
                    navigate('/ticket-classes');
                }, 2000);
            } else {
                setToast({ show: true, message: data.message, variant: 'danger' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Có lỗi xảy ra khi thêm hạng vé', variant: 'danger' });
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
                    <h2>THÊM HẠNG VÉ MỚI</h2>
                    <Button 
                        variant="secondary"
                        onClick={() => navigate('/ticket-classes')}
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="card p-4">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên Hạng Vé</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.Ten_hang_ve}
                                onChange={(e) => setForm({
                                    ...form,
                                    Ten_hang_ve: e.target.value
                                })}
                                placeholder="Ví dụ: Hạng 1"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tỷ Lệ Đơn Giá</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={form.Ti_le_don_gia}
                                onChange={(e) => setForm({
                                    ...form,
                                    Ti_le_don_gia: e.target.value
                                })}
                                placeholder="Ví dụ: 1.05"
                                required
                            />
                        </Form.Group>

                        <div className="text-end">
                            <Button variant="primary" type="submit">
                                Thêm Hạng Vé
                            </Button>
                        </div>
                    </Form>
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

export default CreateTicketClass; 