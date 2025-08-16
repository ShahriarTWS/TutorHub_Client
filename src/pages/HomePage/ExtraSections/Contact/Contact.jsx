import React, { useState } from "react";
import Swal from "sweetalert2";
import { FiCopy, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        if (!name || !email || !message) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill out all fields!",
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Message Sent!",
            text: `Thank you, ${name}. We'll get back to you soon.`,
        });

        setFormData({ name: "", email: "", message: "" });
    };

    const copyEmailToClipboard = () => {
        navigator.clipboard.writeText("admin@tutorhub.com");
        Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Email copied to clipboard.",
            timer: 1500,
            showConfirmButton: false,
        });
    };

    const whatsappNumber = "+8801234567890"; // replace with actual number
    const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

    return (
        <div className="w-11/12 md:w-10/12 mx-auto py-16 transition-all">
            <h2 className="text-4xl font-bold text-center mb-12">
                Get in Touch
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    {/* Email */}
                    <div className="bg-base-200 rounded-2xl p-6 shadow-lg flex items-center justify-between hover:shadow-xl transition">
                        <div className="flex items-center gap-4">
                            <span className="text-primary text-3xl">📧</span>
                            <div>
                                <p className="font-semibold text-lg">Email</p>
                                <p className="">admin@tutorhub.com</p>
                            </div>
                        </div>
                        <button
                            onClick={copyEmailToClipboard}
                            className="text-primary hover:text-primary/80 transition text-xl"
                            title="Copy Email"
                        >
                            <FiCopy />
                        </button>
                    </div>

                    {/* Phone */}
                    <div className="bg-base-200 rounded-2xl p-6 shadow-lg flex items-center justify-between hover:shadow-xl transition">
                        <div className="flex items-center gap-4">
                            <span className="text-primary text-3xl">📞</span>
                            <div>
                                <p className="font-semibold text-lg">Phone</p>
                                <p className="">{whatsappNumber}</p>
                            </div>
                        </div>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-600 transition text-2xl"
                            title="Chat on WhatsApp"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>

                    <div className="bg-base-200 rounded-2xl p-6 shadow-lg flex items-center justify-between hover:shadow-xl transition">
                        <div className="flex items-center gap-4">
                            <span className="text-primary text-3xl">📍</span>
                            <div>
                                <p className="font-semibold text-lg">Location</p>
                                <p className="">Rajshahi, Bangladesh</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 mt-4">
                        Feel free to reach out via email or phone, or send us a message using the form.
                    </p>
                </div>

                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-base-200 p-8 rounded-2xl shadow-lg space-y-4 hover:shadow-xl transition"
                >
                    <h3 className="text-2xl font-bold text-primary mb-4">Send a Message</h3>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    />
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition duration-300 font-semibold"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
