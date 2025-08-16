import React from "react";
import CountUp from "react-countup";

const StatsPage = () => {
    const stats = [
        { end: 1000, label: "Students" },
        { end: 50, label: "Tutors" },
        { end: 120, label: "Sessions" },
    ];

    return (
        <div className=" flex items-center justify-center bg-base-100">
            <div className="w-11/12 md:w-10/12 mx-auto py-16">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Our Growing Community
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {stats.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl bg-base-200 py-20 text-center shadow-md"
                        >
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">
                                <CountUp end={item.end} duration={2} separator="," />+
                            </div>
                            <p className="mt-3 text-lg font-medium ">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
