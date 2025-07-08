import React from 'react';

const StudySessionCard = ({ title, description, registrationDeadline }) => {
    const now = new Date();
    const deadline = new Date(registrationDeadline);
    const isOngoing = now <= deadline;

    return (
        <div
            className="bg-base-200 rounded-xl   shadow-md p-6 flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer"
        >
            <div>
                <h2 className="text-2xl font-semibold mb-3 ">{title}</h2>
                <p className=" mb-5 line-clamp-3 text-gray-500">{description}</p>
            </div>

            <div className="flex items-center justify-between">
                <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${isOngoing
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                >
                    {isOngoing ? 'Ongoing' : 'Closed'}
                </span>

                <button
                    className="bg-indigo-600 text-white px-4 py-1 rounded-md font-semibold hover:bg-indigo-700 transition"
                    type="button"
                    aria-label={`Read more about ${title}`}
                >
                    Read More
                </button>
            </div>
        </div>
    );
};

export default StudySessionCard;
