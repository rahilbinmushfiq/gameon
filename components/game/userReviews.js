import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

export default function UserReviews({ userReviews: { ratingsList } }) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const commentRef = useRef("");

    const getDate = (date) => {
        const formattedDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        return formattedDate;
    }

    const handleUserReview = async () => {
        if (!user) return router.push("/signin");

        let comment = commentRef?.current?.value;

        try {
            await updateDoc(doc(db, "games", "fifa-21"), {
                "reviews.ratings.ratingsList": arrayUnion({
                    comment,
                    postedOn: Timestamp.now(),
                    rating,
                    userFullName: user.displayName,
                    userPhotoURL: user.photoURL,
                    userUID: user.uid
                })
            });
        } catch (error) {
            console.log(error);
        }

        router.push("/game/fifa-21");
    }

    return (
        <>
            <h2 className="text-2xl underline">User Reviews Tab</h2>
            <div className="flex flex-col mb-[2rem]">
                <h4 className="underline">Review this game</h4>
                <div>
                    <label>Your rating:</label>
                    <input type="radio" value="1" name="rating" onChange={(e) => setRating(parseInt(e.target.value))} />
                    <input type="radio" value="2" name="rating" onChange={(e) => setRating(parseInt(e.target.value))} />
                    <input type="radio" value="3" name="rating" onChange={(e) => setRating(parseInt(e.target.value))} />
                    <input type="radio" value="4" name="rating" onChange={(e) => setRating(parseInt(e.target.value))} />
                    <input type="radio" value="5" name="rating" onChange={(e) => setRating(parseInt(e.target.value))} />
                </div>
                <textarea ref={commentRef} className="w-[50rem] mb-2" placeholder="Comment"></textarea>
                <button onClick={() => handleUserReview()} className="w-fit text-white bg-slate-600">comment</button>
            </div>
            <h4 className="text-xl underline">User Reviews</h4>
            {ratingsList.map((review) => {
                return (
                    <div key={review.userUID}>
                        <div className="flex gap-[30rem]">
                            <div className="flex gap-4">
                                <div>
                                    <img className="w-[3rem]" src={review.userPhotoURL} alt="user" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                    <p>by {review.userFullName}</p>
                                    <p>on {getDate(review.postedOn)}</p>
                                </div>
                            </div>
                            <div>
                                <p>Rating: {review.rating}</p>
                            </div>
                        </div>
                        <div className="w-[50rem]">
                            {review.comment}
                        </div>
                    </div>
                )
            })}
        </>
    )
}