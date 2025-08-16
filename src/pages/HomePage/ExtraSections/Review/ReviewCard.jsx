import React from "react";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
    const { reviewerName, reviewerImage, rating, comment, date } = review;

    return (
        <div className="w-full bg-base-100 rounded-2xl shadow-sm border border-gray-200/20 hover:shadow-xl transition-all duration-300 p-6 flex items-start gap-5">
            {/* Reviewer Image */}
            <div className="flex-shrink-0">
                <img
                    src={reviewerImage}
                    alt={reviewerName}
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
            </div>

            {/* Right side */}
            <div className="flex flex-col flex-1">
                {/* Name + Date */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold ">{reviewerName}</h3>
                    <span className="text-xs text-gray-400">{date}</span>
                </div>

                {/* Rating */}
                <div className="flex mt-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={18}
                            className={`${i < rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Comment */}
                <p className=" text-sm leading-relaxed">{comment}</p>
            </div>
        </div>
    );
};

export default ReviewCard;
