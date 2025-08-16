import React from 'react';
import learnTogetherLogo from '../../assets/Logo/learnTogetherLogo.png';
import vectorLogo from '../../assets/Logo/vectorLogo.png';
import { Link } from 'react-router';

const LearnTogetherLogo = () => {
    return (
        <Link to={'/'}>
            <div className='flex items-center'>
                {/* <img className='md:h-12 h-6' src={vectorLogo} alt="" /> */}
                <p className='md:text-5xl text-2xl  font-extrabold text-primary'>TutorHub</p>
            </div>
        </Link>
    );
};

export default LearnTogetherLogo;