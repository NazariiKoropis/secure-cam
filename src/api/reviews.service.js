
import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { database } from './../config/firebase';
import { COLLECTIONS } from "@constants/collections"

export const getAllReviewsById = async (id) => {
    try {

        const reviewsRef = collection(database, COLLECTIONS.REVIEWS);

        const q = query(reviewsRef, where("product_id", "==", id), where("isApproved", "==", true));

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

export const createReview = async (review) => {

    try {
        const reviewRef = await addDoc(collection(database, COLLECTIONS.REVIEWS), {
            userId: review.userId,
            userName: review.userName,
            desc: review.desc,
            rating: review.rating,
            product_id: review.product_id,
            isApproved: review.isApproved,
            createdAt: new Date()
        });
        console.log("Review added with ID: ", reviewRef.id);

    } catch (error) {
        console.error('Error adding review on server', error);
        return null;

    }
}

export const getAllReviews = async () => {
    try {
        const querySnapshot = await getDocs(collection(database, COLLECTIONS.REVIEWS));

        const reviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return reviews;
    } catch (error) {
        console.error('Error fetching all reviews from server', error);
        return null;

    }
}

export const updateReviewApproval = async (reviewId, isApproved) => {
    try {
        const reviewRef = doc(database, COLLECTIONS.REVIEWS, reviewId);

        await updateDoc(reviewRef, {
            isApproved,
        });

        return true;
    } catch (error) {
        console.error('Error updating review on server', error);
        return null;
    }
}
