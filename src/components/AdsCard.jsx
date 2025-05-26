import Card from 'react-bootstrap/Card';

const AdsCard = () => {
    return (
        <div className='d-flex justify-content-around'>
            <Card style={{ width: '25rem', height: '25rem' }}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>Giao Diện Trực Quan</Card.Title>
                    <Card.Text>
                        Chúng tôi cung cấp một dịch vụ quản lý được thiết kế với giao diện trực quan, giúp người dùng dễ dàng thao tác
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card style={{ width: '25rem', height: '25rem' }}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>Giao Diện Trực Quan</Card.Title>
                    <Card.Text>
                        Chúng tôi cung cấp một dịch vụ quản lý được thiết kế với giao diện trực quan, giúp người dùng dễ dàng thao tác
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card style={{ width: '25rem', height: '25rem' }}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>Giao Diện Trực Quan</Card.Title>
                    <Card.Text>
                        Chúng tôi cung cấp một dịch vụ quản lý được thiết kế với giao diện trực quan, giúp người dùng dễ dàng thao tác
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AdsCard;