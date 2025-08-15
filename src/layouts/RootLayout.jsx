import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../shared/Navbar/Navbar';
import Footer from '../shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div className='bg-base-100'>
            <header className="sticky top-0 z-50">
                <nav className=''>
                    <Navbar />
                </nav>
            </header>
            <section className='inter-font'>
                <Outlet></Outlet>
            </section>

            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default RootLayout;