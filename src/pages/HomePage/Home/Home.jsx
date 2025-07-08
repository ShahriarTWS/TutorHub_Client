import React from 'react';
import Banner from '../Banner/Banner';
import StudySessions from '../StudySessions/StudySessions ';
import WhyJoin from '../ExtraSections/WhyJoin/WhyJoin';
import OurServices from '../ExtraSections/OurServices/OurServices';
import HowTutorHubWorks from '../ExtraSections/HowTutorHubWorks/HowTutorHubWorks';

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
        </div>
    );
};

export default Home;