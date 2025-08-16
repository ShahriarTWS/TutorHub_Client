import React from "react";
import ReviewCard from "./ReviewCard";

const dummyReviews = [
    {
        reviewerName: "Shahriar Hossain",
        reviewerImage: "https://i.pravatar.cc/100?img=11",
        rating: 5,
        comment: "Excellent tutor! Explained everything in a very clear way.",
        date: "Aug 15, 2025",
    },
    {
        reviewerName: "Nusrat Jahan",
        reviewerImage: "https://i.pravatar.cc/100?img=12",
        rating: 4,
        comment: "Very helpful sessions, but could be a bit longer.",
        date: "Aug 12, 2025",
    },
    {
        reviewerName: "Rakibul Islam",
        reviewerImage: "https://i.pravatar.cc/100?img=13",
        rating: 5,
        comment: "Made tough topics really easy to understand. Highly recommend!",
        date: "Aug 10, 2025",
    },
    {
        reviewerName: "Mim Akter",
        reviewerImage: "https://i.pravatar.cc/100?img=14",
        rating: 5,
        comment: "The tutor was very patient and always ready to repeat if needed.",
        date: "Aug 8, 2025",
    },
    {
        reviewerName: "Hasibul Karim",
        reviewerImage: "https://i.pravatar.cc/100?img=15",
        rating: 3,
        comment: "Good sessions, but time management can be improved.",
        date: "Aug 6, 2025",
    },
    {
        reviewerName: "Tahsin Rahman",
        reviewerImage: "https://i.pravatar.cc/100?img=16",
        rating: 4,
        comment: "I really gained confidence after the sessions. Very helpful tutor!",
        date: "Aug 4, 2025",
    },
];

const ReviewsSection = () => {
    return (
        <div className="w-11/12 md:w-10/12 mx-auto py-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">What Students Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyReviews.map((review, idx) => (
                    <ReviewCard key={idx} review={review} />
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;