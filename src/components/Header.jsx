import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div style={{fontFamily: 'Inter, sans-serif'}}>
            {/* Navbar trên - tên,logo web và phần đăng nhập đăng ký */}
            <Navbar expand="lg" className="bg-body-white">
                <Container style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Navbar.Brand href="/home" className='fs-3' style={{fontWeight:'bold',fontSize:28,color:'#000',letterSpacing:2,textShadow:'1px 1px 8px #666'}}>SE104-Group 21</Navbar.Brand>
                    <div style={{marginLeft:'auto'}}>
                        <button
                            onClick={() => {
                                localStorage.clear(); // Xóa tất cả dữ liệu trong localStorage
                                navigate('/');
                            }}
                            style={{
                                background:'none',
                                border:'none',
                                color:'#e53935',
                                fontSize:28,
                                cursor:'pointer',
                                padding:0,
                                marginLeft:24,
                                transition: 'transform 0.2s ease',
                                transform: 'scale(1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            title="Logout"
                        >
                            <i className="fa-solid fa-right-from-bracket" style={{fontSize:28,color:'#e53935',textShadow:'1px 1px 8px #666', marginRight:8}}></i>
                            <span style={{fontSize:16,fontWeight:'bold',color:'#e53935',textShadow:'1px 1px 8px #666'}}>Logout</span>
                        </button>
                    </div>
                </Container>
            </Navbar>

            {/* Navbar dưới - điều hướng chính */}
            <Navbar expand="lg" className="bg-body-white">
                <Container>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <div className="nav-buttons-container">
                            <Nav.Link href="/flights" className="nav-button">
                                <span className="button-text">Chuyến Bay</span>
                            </Nav.Link>
                            <Nav.Link href="/tickets" className="nav-button">
                                <span className="button-text">Vé Chuyến Bay</span>
                            </Nav.Link>
                            <Nav.Link href="/airport" className="nav-button">
                                <span className="button-text">Sân Bay</span>
                            </Nav.Link>
                            <Nav.Link href="/class" className="nav-button">
                                <span className="button-text">Hạng Vé</span>
                            </Nav.Link>
                            <Nav.Link href="/regulations" className="nav-button">
                                <span className="button-text">Quy Định</span>
                            </Nav.Link>
                            <Nav.Link href="/overall-revenue" className="nav-button">
                                <span className="button-text">Doanh Thu</span>
                            </Nav.Link>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;
