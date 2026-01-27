import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { logger } from '../../backend/shared/logger'; // Or use frontend logger if available

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Check and create user profile in Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                try {
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        // Create new user profile
                        await setDoc(userRef, {
                            email: currentUser.email,
                            role: 'user', // Default role
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                        console.log('Created new user profile for', currentUser.uid);
                    } else {
                        // Check if admin
                        const userData = userSnap.data();
                        setIsAdmin(userData?.role === 'admin');
                    }
                } catch (error) {
                    console.error('Error fetching/creating user profile:', error);
                }
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
