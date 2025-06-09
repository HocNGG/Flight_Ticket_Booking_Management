import ImgSlide
    from '../components/ImgSlide';
import Header from '../components/Header';
import AdsCard from '../components/AdsCard';
import Footer from '../components/Footer';

const Home = () => {
    const images = [
        "https://images.pexels.com/photos/1115358/pexels-photo-1115358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3768652/pexels-photo-3768652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
    return (
        <div className='full-container d-block' style={{
            backgroundImage: 'url("https://images.pexels.com/photos/19670/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh'
        }}>
            <div>

            </div>
            <div className='mb-4'>
                <Header />
            </div>
            <div className='container-fluid mb-5'>
                <ImgSlide
                    images={images}
                />
            </div>
            <div className='mb-5'>
                <AdsCard></AdsCard>
            </div>
            <div><Footer></Footer></div>
        </div>
    )
}
export default Home