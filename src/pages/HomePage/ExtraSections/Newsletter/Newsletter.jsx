import React, { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Please enter your email address!",
            });
            return;
        }
        // You can connect this with backend or Mailchimp API later
        Swal.fire({
            icon: "success",
            title: "Subscribed!",
            text: `You have successfully subscribed with ${email}`,
        });
        setEmail("");
    };

    return (
        <div className="w-11/12 md:w-10/12 mx-auto py-12 my-12 bg-base-200 rounded-2xl shadow-lg">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
                <p className="text-lg mb-6">
                    Get the latest updates, tips, and learning resources directly to your inbox.
                </p>
                <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col sm:flex-row items-center gap-4 justify-center px-4"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg  focus:outline-none border border-gray-200"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition duration-300"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;
