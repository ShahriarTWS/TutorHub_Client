import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const backendLogin = async (firebaseUser) => {
        if (!firebaseUser) return;

        try {
            const token = await firebaseUser.getIdToken();
            // Send token to backend to set HTTP-only cookie
            await axios.post(
                'https://learn-together-server-sigma.vercel.app/login',
                { token },
                { withCredentials: true } // important for cookie!
            );
        } catch (error) {
            console.error('Backend login error:', error);
        }
    };

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = async (email, password) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        await backendLogin(result.user); // Call backend to save cookie
        return result;
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);
        await backendLogin(result.user); // Call backend to save cookie
        return result;
    };

    const updateUserProfile = (name, photo) => {
        if (auth.currentUser) {
            return updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photo,
            });
        } else {
            return Promise.reject('No user is currently signed in.');
        }
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            // Optional: keep backend session in sync when auth state changes
            if (currentUser) {
                await backendLogin(currentUser);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        updateUserProfile,
        logOut,
        resetPassword
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
