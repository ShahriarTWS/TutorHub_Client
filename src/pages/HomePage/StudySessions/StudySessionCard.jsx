import React from 'react';

const StudySessionCard = ({ title, description, registrationDeadline, image }) => {
    const now = new Date();
    const deadline = new Date(registrationDeadline);
    const isOngoing = now <= deadline;

    return (
        <div className="group bg-base-200 rounded-2xl overflow-hidden shadow-md transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer hover:bg-gradient-to-br ">
            {/* Image */}
            <div className="h-40 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between h-[calc(100%-10rem)]">
                <h2 className="text-xl font-bold mb-2 text-primary">{title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

                <div className="flex items-center justify-between">
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${isOngoing
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {isOngoing ? 'Ongoing' : 'Closed'}
                    </span>

                    <button className="btn btn-sm btn-primary hover:scale-105 transition-transform duration-300">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudySessionCard;
