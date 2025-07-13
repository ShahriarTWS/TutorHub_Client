import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router';
import CheckoutForm from './CheckoutForm';
import useAuth from '../../hooks/useAuth';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const session = location.state?.session;

    if (!session) {
        // Redirect if no session data passed
        navigate('/study-sessions');
        return null;
    }

    const price = session.registrationFee || 0;
    const userEmail = user?.email || 'unknown@student.com';

    return (
        <div className="min-h-screen p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Complete Payment</h2>
            <Elements stripe={stripePromise}>
                <CheckoutForm price={price} userEmail={userEmail} sessionId={session._id} />
            </Elements>
        </div>
    );
};

export default Payment;
