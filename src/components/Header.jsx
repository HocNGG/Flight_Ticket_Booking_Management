import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../App.css';
const Header = () => {
    return (
        <div style={{fontFamily: 'Inter, sans-serif'}}>
            {/* Navbar trên - tên,logo web và phần đăng nhập đăng ký */}
            <Navbar expand="lg" className="bg-body-white">
                <Container>
                    <Navbar.Brand href="/home" className='fs-3' style={{fontWeight: 'bold'}}>SE104-Group 21</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    </Navbar.Collapse>
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
