import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router'; // or 'react-router-dom'
import collab from '../../../assets/banner/collab.svg';
import study from '../../../assets/banner/gummy-app-development.svg';
import laptop from '../../../assets/banner/gummy-programming.svg';

const Banner = () => {
    const slides = [
        {
            id: 1,
            title: 'Learn Anytime, Anywhere',
            subtitle: 'Access study materials & live classes from home',
            illustration: laptop,
        },
        {
            id: 2,
            title: 'Collaborate & Grow',
            subtitle: 'Join interactive study sessions with top tutors',
            illustration: collab,
        },
        {
            id: 3,
            title: 'Empower Your Education',
            subtitle: 'Review, rate, and manage your own learning path',
            illustration: study,
        },
    ];

    return (
        <div className="bg-base-200 relative rounded-2xl overflow-hidden">

            {/* 🟠 Triangle behind left text */}
            <div className="md:absolute hidden top-10 left-0 w-40 h-40 bg-orange-300 opacity-20 blur-2xl clip-triangle z-10" />

            {/* 🔷 Hexagon behind right illustration */}
            <div className="md:absolute hidden bottom-10 right-0 w-40 h-40 bg-blue-400 opacity-30 blur-2xl clip-hexagon z-10" />

            {/* 🟣 Circle blob in center */}
            <div className="md:absolute hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 opacity-20 blur-[100px] rounded-full z-0" />


            {/* Swiper */}
            <Swiper
                loop={true}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                navigation={false}
                pagination={{ clickable: true }}
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                className="w-full h-[80vh] relative z-40"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-11/12 max-w-7xl mx-auto h-full py-10 transition-all duration-500">
                            {/* Left Text */}
                            <div className="relative w-full md:w-1/2 space-y-4 z-50">
                                <div className="absolute -top-10 -left-10 w-60 h-60 bg-indigo-300 blur-3xl rounded-full opacity-50 z-[-1]" />
                                <h1 className="text-4xl md:text-5xl font-bold">
                                    {slide.title}
                                </h1>
                                <p className=" text-lg">{slide.subtitle}</p>
                                <Link to="/study-sessions">
                                    <button className="btn btn-primary mt-4">Get Started</button>
                                </Link>
                            </div>

                            {/* Right Illustration */}
                            <div className="w-full md:w-1/2 relative z-50">
                                <div className="absolute bottom-10 -right-10 w-60 h-60 bg-indigo-300 blur-3xl rounded-full opacity-50 z-[-1]" />
                                <img
                                    src={slide.illustration}
                                    alt="Study Illustration"
                                    className="w-full  object-contain transition-opacity duration-500 "
                                />

                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
