import React from 'react';
import { format } from 'date-fns';

const StudySessionCard = ({
    title = 'Untitled',
    description = 'No description available.',
    registrationEnd,
    image,
    registrationFee,
    classStart,
    classEnd
}) => {
    const now = new Date();
    const deadline = new Date(registrationEnd);
    const isOngoing = now <= deadline;

    const formattedClassStart = classStart ? format(new Date(classStart), 'MMM d, yyyy') : 'N/A';
    const formattedClassEnd = classEnd ? format(new Date(classEnd), 'MMM d, yyyy') : 'N/A';

    return (
        <div className="group rounded-xl overflow-hidden bg-base-200 shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-base-200 flex flex-col">
            {/* Image */}
            <div className="h-44 bg-gray-100 overflow-hidden flex justify-center items-center">
                <img
                    src={image}
                    alt={title}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-semibold  mb-1 line-clamp-1">{title}</h3>

                {/* Description */}
                <p className=" text-sm mb-3 line-clamp-2">{description}</p>

                {/* Info Section */}
                <div className="text-sm  mb-4 space-y-1">
                    <p><span className="font-medium">Class:</span> {formattedClassStart} → {formattedClassEnd}</p>
                    <p><span className="font-medium">Fee:</span> {registrationFee > 0 ? `${registrationFee}৳` : 'Free'}</p>
                </div>

                {/* Status + Button Footer */}
                <div className="flex items-center justify-between mt-auto pt-4">
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full 
                            ${isOngoing
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {isOngoing ? 'Ongoing' : 'Closed'}
                    </span>
                    <button className="btn btn-sm btn-primary hover:scale-105 transition-transform duration-200">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudySessionCard;
