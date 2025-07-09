import React from 'react';
import { motion } from 'framer-motion';

const shapeVariants = {
    animate: {
        y: [0, -20, 0],
        opacity: [0.6, 1, 0.6],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const LoadingShapes = () => {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-base-200">
            <h2 className="text-xl font-semibold mb-6 text-primary">Loading...</h2>
            <div className="flex gap-10 items-end">
                {/* Circle */}
                <motion.div
                    className="w-12 h-12 border-4 border-primary rounded-full"
                    variants={shapeVariants}
                    animate="animate"
                />

                {/* Triangle */}
                <motion.div
                    className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[42px] 
                        border-l-transparent border-r-transparent border-b-primary"
                    variants={shapeVariants}
                    animate="animate"
                />

                {/* Square */}
                <motion.div
                    className="w-12 h-12 border-4 border-primary"
                    variants={shapeVariants}
                    animate="animate"
                />
            </div>
        </div>
    );
};

export default LoadingShapes;
