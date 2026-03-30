
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from './../config/firebase';
import { COLLECTIONS } from "@constants/collections"

export const getAllReviewsById = async (id) => {
    try {

        const reviewsRef = collection(database, COLLECTIONS.REVIEWS);

        const q = query(reviewsRef, where("product_id", "==", id));

        const querySnapshot = await getDocs(q);

        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return reviews;
    } catch (error) {
        console.error('Error fetching reviews from server', error);
        return null;
    }
}