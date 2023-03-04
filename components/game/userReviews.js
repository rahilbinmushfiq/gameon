import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { getDateAndTime } from "../../utils/convertTimestamp";
import { useAuth } from "../../config/auth";

export default function UserReviews({ userReviews: { ratingsList } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(null);
  const commentRef = useRef("");

  const handleUserReview = async () => {
    if (!user) return router.push("/signin");

    try {
      await updateDoc(doc(db, "games", "fifa-21"), {
        "reviews.ratings.ratingsList": arrayUnion({
          comment: commentRef?.current?.value,
          postedOn: Timestamp.now(),
          rating: rating,
          userFullName: user.displayName,
          userPhotoURL: user.photoURL,
          userUID: user.uid
        })
      });

      commentRef.current.value = "";
      setRating(null);
    } catch (error) {
      console.log(error);
    }

    router.push("/game/fifa-21", undefined, { scroll: false });
  }

  return (
    <>
      <h2 className="text-2xl underline">User Reviews Tab</h2>
      <div className="flex flex-col mb-[2rem]">
        <h4 className="underline">Review this game</h4>
        <div>
          <label>Your rating:</label>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => setRating(parseInt(value))}
              />
            </label>
          ))}
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
                  <p>on {getDateAndTime(review.postedOn)}</p>
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