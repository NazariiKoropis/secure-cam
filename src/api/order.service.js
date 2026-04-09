
import {
    collection,
    addDoc,
    getDocs,
    where,
    query,
    doc,
    updateDoc,
} from "firebase/firestore";
import { database } from './../config/firebase';
import { COLLECTIONS } from "@constants/collections"

export const createOrder = async (order) => {
    try {
        const orderRef = await addDoc(collection(database, COLLECTIONS.ORDERS), {
            ...order,
            createdAt: new Date().toISOString(),
        })

        console.log("Review added with ID: ", orderRef.id);
    } catch (error) {
        console.error('Error adding order on server', error);
        return null;
    }
}

export const getOrdersByUserId = async (uid) => {
    try {
        const ordersRef = collection(database, COLLECTIONS.ORDERS);

        const q = query(ordersRef, where("userId", "==", uid));

        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return orders;
    } catch (error) {
        console.error('Error fetching orders from server', error);
        return null;
    }
}

export const getAllOrders = async () => {
    try {
        const querySnapshot = await getDocs(collection(database, COLLECTIONS.ORDERS));

        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return orders;
    } catch (error) {
        console.error('Error fetching all orders from server', error);
        return null;
    }
}

export const updateOrderStatus = async (orderId, status) => {
    try {
        const orderRef = doc(database, COLLECTIONS.ORDERS, orderId);

        await updateDoc(orderRef, {
            status,
        });

        return true;
    } catch (error) {
        console.error('Error updating order status on server', error);
        return null;
    }
}
