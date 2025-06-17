const Footer = () => {
    return (
        <div className="container-fluid position-relative" style={{ 
            backgroundImage: 'url("https://images.pexels.com/photos/587063/pexels-photo-587063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '200px',
            padding: '2rem 0',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(2px)'
            }}></div>
            <div className="container position-relative">
                <div className="d-flex align-items-center">
                    <img 
                        style={{ 
                            width: '10%',
                            filter: 'brightness(0) invert(1)',
                            opacity: 0.9
                        }} 
                        src="https://pngimg.com/d/github_PNG65.png" 
                        alt="GitHub Logo" 
                    />
                    <div className="d-flex gap-4 ms-4">
                        <a 
                            href="https://github.com/huypro2005/airport" 
                            className="text-white text-decoration-none d-flex align-items-center"
                            style={{
                                padding: '0.8rem 1.5rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <span className="me-2">📍</span>
                            https://github.com/huypro2005/airport
                        </a>
                        <a 
                            href="https://github.com/antss50/SE104" 
                            className="text-white text-decoration-none d-flex align-items-center"
                            style={{
                                padding: '0.8rem 1.5rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <span className="me-2">📍</span>
                            https://github.com/antss50/SE104
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer;