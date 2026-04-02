import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import cartReducer from './cart/cartSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer
    },
});

store.subscribe(() => {
    try {
        const currentCartItems = store.getState().cart.items;

        const serializedState = JSON.stringify(currentCartItems);

        localStorage.setItem('cartItems', serializedState);
    } catch (err) {
        console.error('Помилка запису в localStorage', err);
    }
});