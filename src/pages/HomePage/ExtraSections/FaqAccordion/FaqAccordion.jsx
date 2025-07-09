import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "What is TutorHub?",
        answer: "TutorHub is a collaborative study platform connecting students with tutors for interactive sessions and resource sharing.",
    },
    {
        question: "How can I join a study session?",
        answer: "You can join an ongoing session by registering through the 'Study Sessions' page before the registration ends.",
    },
    {
        question: "Can I become a tutor?",
        answer: "Yes! Sign up as a tutor during registration and get access to create sessions, upload materials, and more.",
    },
    {
        question: "What happens after booking a session?",
        answer: "Once booked, you can access session materials, join classes, and interact with your tutor and peers.",
    },
    {
        question: "Is TutorHub free to use?",
        answer: "Most sessions are free, but some may require a registration fee, which is displayed on the session details page.",
    },
];

const FaqAccordion = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border bg-base-200 border-base-300 rounded-xl">
                        <button
                            className="w-full flex justify-between items-center p-4 text-left font-semibold"
                            onClick={() => toggle(index)}
                        >
                            {faq.question}
                            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {openIndex === index && (
                            <div className="px-4 pb-4 text-base text-base-content">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FaqAccordion;
