import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../../config/auth";
import Review from "./review";
import { FaRegStar, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import createErrorMessage from "../../utils/createErrorMessage";
import { useLoading } from "../../contexts/loading";

export default function UserReviews({ userReviews: { ratingsList }, users, gameID }) {
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
        "reviews.ratings.ratingsList": arrayUnion({
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
      <section className="max-w-full space-y-2 py-8 bg-[#2a2a2a]">
        <div className="mx-6 pb-8 space-y-2">
          <h4 className="inline-block mb-1 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
            Submit Your Review
          </h4>
          <p className="text-[#a9a9a9]">
            Have anything to say about this game? Don't feel shy. Share your thoughts and experience on this game.
          </p>
        </div>
        <form className="mx-6 space-y-4" onSubmit={handleUserReview}>
          <div className="flex gap-2">
            <h5 className="font-bold text-[#a9a9a9]">Rating: </h5>
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
                  {rating >= value ? <FaStar size={20} color="#e30e30" /> : <FaRegStar size={20} color="#e30e30" />}
                </label>
              ))}
            </div>
          </div>
          <textarea
            className="py-[16px] w-full px-3 rounded-sm bg-[#2f2f2f] caret-[#f1f1f1] border border-[#4f4f4f] focus:outline-none focus:border focus:border-[#e30e30]/60 placeholder:text-[#9a9a9a]"
            rows="4"
            ref={commentRef}
            placeholder="Comment"
          />
          <button className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]">
            Submit
          </button>
        </form>
      </section>
      <section className="max-w-full space-y-2 py-8">
        <h4 className="mx-6 mb-4 inline-block text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">User Reviews</h4>
        {ratingsList && ratingsList.map((review) => {
          let [userData] = users.filter(user => user.uid === review.userUID);
          let { photoURL, fullName } = userData;

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
      </section>
    </>
  )
}