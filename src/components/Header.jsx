import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
    return (
        <>
            {/* Navbar trên - tên,logo web và phần đăng nhập đăng ký */}
            <Navbar expand="lg" className="bg-body-white">
                <Container>
                    <Navbar.Brand href="/home" className='fs-3'>SE104-Group 21</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className='ms-auto'>
                            <Nav.Link href="/login">Đăng nhập</Nav.Link>
                            <Nav.Link href="/signup">Đăng ký</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Navbar dưới - điều hướng chính */}
            <Navbar expand="lg" className="bg-body-white">
                <Container>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="d-flex justify-content-between mx-auto fs-5 w-100">
                            <Nav.Link href="/ticket">Vé Chuyến Bay</Nav.Link>
                            <Nav.Link href="/flight">Chuyến Bay</Nav.Link>
                            <Nav.Link href="/airport">Sân Bay</Nav.Link>
                            <Nav.Link href="/class">Hạng Vé</Nav.Link>
                            <Nav.Link href="/home">Quy Định</Nav.Link>
                            <Nav.Link href="/revenue">Doanh Thu</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
