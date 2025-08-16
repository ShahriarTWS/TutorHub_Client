import React from 'react';
import Banner from '../Banner/Banner';
import StudySessions from '../StudySessions/StudySessions ';
import WhyJoin from '../ExtraSections/WhyJoin/WhyJoin';
import OurServices from '../ExtraSections/OurServices/OurServices';
import HowTutorHubWorks from '../ExtraSections/HowTutorHubWorks/HowTutorHubWorks';
import FaqAccordion from '../ExtraSections/FaqAccordion/FaqAccordion';
import BeTutorCard from '../../../shared/BeTutorCard/BeTutorCard';
import FeaturedStudySessions from '../StudySessions/FeaturedStudySessions';
import ReviewsSection from '../ExtraSections/Review/ReviewsSection ';
import Newsletter from '../ExtraSections/Newsletter/Newsletter';
import StatsPage from '../ExtraSections/StatsPage/StatsPage';
import Contact from '../ExtraSections/Contact/Contact';

const Home = () => {
    return (
        <div>
            <section className=''>
                <Banner></Banner>
            </section>
            <section>
                <FeaturedStudySessions></FeaturedStudySessions>
            </section>
            <section>
                <OurServices></OurServices>
            </section>
            <section>
                <HowTutorHubWorks></HowTutorHubWorks>
            </section>
            <section>
                <ReviewsSection></ReviewsSection>
            </section>
            <section>
                <BeTutorCard></BeTutorCard>
            </section>
            <section>
                <WhyJoin></WhyJoin>
            </section>
            <section>
                <StatsPage></StatsPage>
            </section>
            <section>
                <FaqAccordion></FaqAccordion>
            </section>
            <section>
                <Contact></Contact>
            </section>
            <section>
                <Newsletter></Newsletter>
            </section>
        </div>
    );
};

export default Home;