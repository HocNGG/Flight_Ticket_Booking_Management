import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';
import { useNavigate } from 'react-router-dom';

const Tickets = () => {
    const [selectedOption, setSelectedOption] = useState("3");
    const [form, setForm] = useState({ identity: '' });
    const [tickets, setTickets] = useState([]);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { identity } = form;
            const url = `http://localhost:5000/api/vechuyenbay/get_by_hanhkhach/cmnd/${identity}`;
            const res = await fetch(url);
            const data = await res.json();

            const idHanhKhach = data.id_hanhkhach;

            if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
                const ticketList = data.data.map(ticket => ({
                    ...ticket,
                    id_hanhkhach: idHanhKhach
                }));
                setTickets(ticketList);
            } else {
                // Nếu không có vé
                setTickets([]);
            }
            setSearched(true);
        } catch (err) {
            console.error(err);
            setTickets([]);
            setSearched(true);
        }
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/vechuyenbay/get/DatHomNay`, {
                    method: 'GET',
                });
                const data = await res.json();
                setTickets(data.data);
            } catch (err) {
                console.error(err);
            }
        };
      fetchTickets();
    }
    , []);

    return (
        <div className='full-container d-flex'>
            <div>
                <Sidebar
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            <div className="mt-5 p-4 w-100">
                <div className='d-flex justify-content-between'>
                    <h2>VÉ CHUYẾN BAY</h2>
                    <button className='btn btn-success' onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/create-ticket`, {
                            state: {
                                fromPage: 'tickets'
                            }
                        });
                    }}> + Tạo Vé</button>
                </div>
                <form onSubmit={handleSearch} className="d-flex my-3 justify-content-between align-items-center">
                    <div style={{ minWidth: '500px' }}>
                        <input type="text" className="form-control fs-5" placeholder="Nhập số CCCD của khách hàng" value={form.identity} onChange={(e) => setForm({...form,identity: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 fs-5">Tìm</button>
                </form>
                <div className='ticket-list rounded-3 p-2'>
                    {tickets.length > 0 ? (
                        tickets.map(ticket => (
                            <TicketCard
                                key={ticket.Ma_ve}
                                ticket={ticket}

                            />
                        ))
                    ) : searched ? (
                        <p className="text-center mt-4 fw-bold">Không tìm thấy vé chuyến bay của khách hàng</p>
                    ) : (
                        <p className='text-center mt-4 fw-bold'>Vui lòng nhập thông tin vé chuyến bay muốn tìm</p>
                    )}
                </div>
            </div>
        </div>

    )
}
export default Tickets;