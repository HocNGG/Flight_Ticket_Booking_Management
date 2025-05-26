import React, { useState } from 'react';

const ImgSlide = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('next');

    const nextSlide = () => {
        setDirection('next');
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setDirection('prev');
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setDirection(index > currentIndex ? 'next' : 'prev');
        setCurrentIndex(index);
    };

    return (
        <div className="img-slide-container position-relative">
            <div className="img-slide-frame">
                <div className={`img-slide-wrapper ${direction}`}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className={`img-slide-image ${index === currentIndex ? 'active' : ''}`}
                            style={{
                                transform: `translateX(${(index - currentIndex) * 100}%)`
                            }}
                        />
                    ))}
                </div>
            </div>
            <button
                className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2"
                onClick={prevSlide}
            >
                &lt;
            </button>
            <button
                className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={nextSlide}
            >
                &gt;
            </button>
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`mx-1 ${index === currentIndex ? 'text-light' : 'text-secondary'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => goToSlide(index)}
                    >
                        ●
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ImgSlide;
