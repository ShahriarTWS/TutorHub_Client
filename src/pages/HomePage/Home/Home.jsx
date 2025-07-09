import React from 'react';
import Banner from '../Banner/Banner';
import StudySessions from '../StudySessions/StudySessions ';
import WhyJoin from '../ExtraSections/WhyJoin/WhyJoin';
import OurServices from '../ExtraSections/OurServices/OurServices';
import HowTutorHubWorks from '../ExtraSections/HowTutorHubWorks/HowTutorHubWorks';
import FaqAccordion from '../ExtraSections/FaqAccordion/FaqAccordion';
import BeTutorCard from '../../../shared/BeTutorCard/BeTutorCard';

const Home = () => {
    return (
        <div>
            <section className='w-11/12 md:w-10/12 mx-auto mb-6'>
                <Banner></Banner>
            </section>
            <section>
                <StudySessions></StudySessions>
            </section>
            <section>
                <OurServices></OurServices>
            </section>
            <section>
                <HowTutorHubWorks></HowTutorHubWorks>
            </section>
            <section>
                <FaqAccordion></FaqAccordion>
            </section>
            <section>
                <BeTutorCard></BeTutorCard>
            </section>
        </div>
    );
};

export default Home;