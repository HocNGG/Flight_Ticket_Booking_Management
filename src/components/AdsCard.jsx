import Card from 'react-bootstrap/Card';
import '../App.css';

const AdsCard = () => {
    return (
        <div className='d-flex justify-content-around'>
            <Card className="feature-card">
                <Card.Img variant="top" src="https://images.pexels.com/photos/1260991/pexels-photo-1260991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className="card-image" />
                <Card.Body className="card-content">
                    <Card.Title>🛫 Giao Diện Trực Quan</Card.Title>
                    <Card.Text className="card-description">
                    Trong xã hội hiện đại, sự trực quan và dễ sử dụng là yếu tố cốt lõi của mọi hệ thống phần mềm. Website quản lý chuyến bay này được thiết kế với giao diện tối giản, dễ thao tác, giúp người dùng tra cứu và quản lý thông tin chuyến bay một cách nhanh chóng và thuận tiện.
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="feature-card">
                <Card.Img variant="top" src="https://images.pexels.com/photos/1510492/pexels-photo-1510492.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-image" />
                <Card.Body className="card-content">
                    <Card.Title>⏱ Cập Nhật Thời Gian Thực</Card.Title>
                    <Card.Text className="card-description">
                    Tất cả thông tin về chuyến bay như giờ cất cánh, hạ cánh, trễ chuyến hay hủy chuyến đều được cập nhật liên tục theo thời gian thực. Điều này giúp hành khách và nhân viên sân bay luôn chủ động trong mọi tình huống.
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="feature-card">
                <Card.Img variant="top" src="https://images.pexels.com/photos/726233/pexels-photo-726233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className="card-image" />
                <Card.Body className="card-content">
                    <Card.Title>📋 Quản Lý Dữ Liệu Tập Trung</Card.Title>
                    <Card.Text className="card-description">
                    Hệ thống cho phép quản lý dữ liệu hành khách, hãng bay, lịch trình và sân bay một cách đồng bộ và tập trung. Nhờ đó, các thao tác như tìm kiếm, sắp xếp hay thống kê trở nên dễ dàng và chính xác hơn bao giờ hết.
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="feature-card">
                <Card.Img variant="top" src="https://images.pexels.com/photos/1010079/pexels-photo-1010079.jpeg?auto=compress&cs=tinysrgb&w=600" className="card-image" />
                <Card.Body className="card-content">
                    <Card.Title>🔐 Bảo Mật & Phân Quyền</Card.Title>
                    <Card.Text className="card-description">
                    Với hệ thống đăng nhập bảo mật và phân quyền rõ ràng giữa quản trị viên, nhân viên và hành khách, website đảm bảo an toàn thông tin và quyền truy cập phù hợp với từng đối tượng sử dụng.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AdsCard;