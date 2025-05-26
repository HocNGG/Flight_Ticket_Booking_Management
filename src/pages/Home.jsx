import ImgSlide
    from '../components/ImgSlide';
import Header from '../components/Header';
import AdsCard from '../components/AdsCard';
import Footer from '../components/Footer';

const Home = () => {
    const images = [
        "https://cf.creatrip.com/original/blog/938/eqfc6p34iow3jra3nwii4vnkwayo8zkw.png",
        "https://static2.gensler.com/uploads/hero_element/84/thumb_desktop/thumbs/project_incheon-airport_01_1024x576.jpg",
        "https://static2.gensler.com/uploads/image/63374/Incheon_08_2000x1125_1521215401.jpg"
    ]
    return (
        <div className='full-container d-block'>
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