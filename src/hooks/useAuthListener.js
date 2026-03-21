//react
import { useEffect } from 'react';

//redux
import { useDispatch, useSelector } from 'react-redux';

//firebase
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserRoleByID } from '@api/user.service';
import {
    setUser,
    setUserRole,
    removeUser,
    setAuthReady,
} from '@store/user/userSlice';

export const useAuthListener = () => {
    const dispatch = useDispatch();

    const { isAuthReady } = useSelector((state) => state.user);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                dispatch(
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    }),
                );

                const role = await getUserRoleByID(user.uid);
                if (role) {
                    dispatch(setUserRole(role));
                }
            } else {
                dispatch(removeUser());
            }

            dispatch(setAuthReady(true));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return { isAuthReady };
};