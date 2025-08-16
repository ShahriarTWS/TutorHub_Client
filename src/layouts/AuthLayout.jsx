import React from 'react';
import { Outlet } from 'react-router';
import LearnTogetherLogo from '../shared/LearnTogetherLogo/LearnTogetherLogo';
import studying from '../assets/AuthImage/studying.svg';

const AuthLayout = () => {
    return (
        <div className='flex  mx-auto'>
            <div className='flex-1 py-10 w-11/12 mx-auto'>
                
                <div className='mb-6 px-4'>
                    <LearnTogetherLogo></LearnTogetherLogo>
                </div>
                <Outlet></Outlet>
            </div>
            <div className='flex-1 bg-base-200 md:flex justify-center hidden'>
                
                <img
                    className='w-96'
                    src={studying} alt="" />
            </div>
        </div>
    );
};

export default AuthLayout;