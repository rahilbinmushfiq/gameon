import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/auth";
import Review from "./review";
import { FaRegStar, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import createErrorMessage from "../../utils/createErrorMessage";
import { useLoading } from "../../contexts/loading";

export default function UserReviews({ userReviews: { ratings }, users, gameID }) {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const router = useRouter();
  const [rating, setRating] = useState(null);
  const commentRef = useRef("");

  const handleUserReview = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("You must be signed in to post your review.");
      return router.push("/signin");
    }

    let comment = commentRef?.current?.value;

    if (!rating) {
      toast.error("Please provide a rating.");
      return;
    } else if (!comment) {
      toast.error("Comment field cannot be empty.");
      return;
    } else if (comment.length > 1000) {
      toast.error("Comment field must not exceed 1000 characters.");
      return;
    }

    setIsPageLoading(true);

    try {
      await updateDoc(doc(db, "games", gameID), {
        "reviews.ratings": arrayUnion({
          comment,
          rating,
          postedOn: Timestamp.now(),
          userUID: user.uid
        })
      });

      commentRef.current.value = "";
      setRating(null);

      toast.success("Thank you for submitting you review.");
      setIsPageLoading(false);
      router.push(router.asPath, undefined, { scroll: false });
    } catch (error) {
      toast.error(createErrorMessage(error));
      setIsPageLoading(false);
    }
  }

  return (
    <>
      <section className="space-y-8 py-8 bg-[#2a2a2a]">
        <div className="space-y-2 mx-6">
          <h2 className="text-lg font-bold">Submit Your Review</h2>
          <p>Have anything to say about this game? Don't feel shy. Share your thoughts and experience on this game.</p>
        </div>
        <form className="mx-6 space-y-8" onSubmit={handleUserReview}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <p className="font-bold">Rating:</p>
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="hover:cursor-pointer">
                    <input
                      className="hidden"
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(parseInt(value))}
                    />
                    {rating >= value ? (
                      <FaStar size={20} color="#e30e30" />
                    ) : (
                      <FaRegStar size={20} color="#e30e30" />
                    )}
                  </label>
                ))}
              </div>
            </div>
            <textarea
              className="typing-input h-auto py-3"
              ref={commentRef}
              rows="4"
              placeholder="Comment"
              required
            />
          </div>
          <button className="primary-btn primary-btn--hover w-full h-12">
            Submit
          </button>
        </form>
      </section>
      <section className="space-y-4 py-8 bg-[#1a1a1a]">
        {ratings.length ? (
          <>
            <h2 className="heading mx-6">User Reviews</h2>
            <div className="space-y-2">
              {ratings.map((review) => {
                let [{ photoURL, fullName }] = users.filter(user => user.uid === review.userUID);

                return (
                  <Review
                    key={review.userUID + review.comment + Math.random()}
                    reviewType="user"
                    photoURL={photoURL}
                    name={fullName}
                    postedOn={review.postedOn}
                    assessment={review.rating}
                    comment={review.comment}
                  />
                )
              })}
            </div>
          </>
        ) : (
          <div className="space-y-1 py-24 text-center">
            <h3 className="font-bold text-base text-[#a9a9a9]">No Reviews Available</h3>
            <p>Be the first one to review this game.</p>
          </div>
        )}
      </section>
    </>
  )
}