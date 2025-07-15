import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';

const CheckoutForm = ({ price, userEmail, sessionId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    // ✅ Create payment intent when price is loaded
    useEffect(() => {
        if (price > 0) {
            axiosSecure
                .post('/payments/create-payment-intent', { amount: price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error('Error creating payment intent:', err);
                    setError('Failed to initialize payment.');
                });
        }
    }, [price, axiosSecure]);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true);
        setError('');

        try {
            const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (cardError) {
                setError(cardError.message);
                return;
            }

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: { email: userEmail },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                const paymentData = {
                    email: userEmail,
                    amount: price,
                    transactionId: paymentIntent.id,
                    sessionId,
                    date: new Date(),
                };

                await axiosSecure.post('/payments/store-payment', paymentData);

                // ✅ Show SweetAlert and navigate
                await Swal.fire({
                    title: 'Payment Successful!',
                    html: `<strong>Transaction ID:</strong><br><code>${paymentIntent.id}</code>`,
                    icon: 'success',
                    confirmButtonText: 'Go to Dashboard',
                });

                navigate('/dashboard/booked-sessions');
            } else {
                setError('Payment was not successful. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('Something went wrong during payment.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto bg-base-200 p-6 rounded shadow"
        >
            <div className="text-lg font-semibold text-center mb-2">
                You will be charged: <span className="text-primary">৳{price}</span>
            </div>

            <CardElement className="p-3 border rounded bg-white" />
            {error && <p className="text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="btn btn-primary w-full"
            >
                {processing ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    `Pay ৳${price}`
                )}
            </button>
        </form>
    );
};

export default CheckoutForm;
