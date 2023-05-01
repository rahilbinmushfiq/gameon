import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaRegStar, FaStar } from "react-icons/fa";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/auth";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import Review from "./review";

/*
 * Renders the User Reviews section of the Game Details page, which is responsible for displaying the form to allow users to submit their own review of a game, and for displaying the list of reviews submitted by other users. The component is rendered when users select the `User Reviews` tab on the Game Details page.
 * 
 * @param {Array<Object>} users - The users registered on this app.
 * @param {string} gameID - The unique ID of the game.
 * @param {Object} userReviews - The user reviews data for the game.
 * @param {Array<Object>} userReviews.ratings - The list of user reviews for the game.
 * @param {number} userReviews.ratings.rating - The rating given by the user in the review.
 * @param {string} userReviews.ratings.comment - The comment given in the review.
 * @param {firebase.firestore.Timestamp} userReviews.ratings.postedOn - The date and time when the review was posted.
 * @param {string} userReviews.ratings.userUID - The user ID of the user.
 * 
 * @returns {JSX.Element} A React JSX element that displays the User Reviews section of Game Details page.
 */
export default function UserReviews({ userReviews: { ratings }, users, gameID }) {
  const { user } = useAuth(); // Retrieve current user from Auth context
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const router = useRouter();
  const [rating, setRating] = useState(null);
  const commentRef = useRef("");

  // Function to handle user review submission
  const handleUserReview = async (event) => {
    event.preventDefault();

    // If user is not authenticated, display error and redirect user to sign-in page
    if (!user) {
      toast.error("You must be signed in to post your review.");
      return router.push("/signin");
    }

    let comment = commentRef?.current?.value;

    // Validate form input fields
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

    setIsPageLoading(true); // Set page loading state to true to show loading spinner

    try {
      // Update game document with the new user review in the database
      await updateDoc(doc(db, "games", gameID), {
        "reviews.ratings": arrayUnion({
          comment,
          rating,
          postedOn: Timestamp.now(),
          userUID: user.uid
        })
      });

      // Clear the form input fields
      commentRef.current.value = "";
      setRating(null);

      toast.success("Thank you for submitting you review.");
      setIsPageLoading(false); // Set page loading state to false to hide loading spinner
      router.push(router.asPath, undefined, { scroll: false }); // Refresh the page without scrolling to top
    } catch (error) {
      toast.error(createErrorMessage(error));
      setIsPageLoading(false); // Set page loading state to false to hide loading spinner
    }
  };

  return (
    <>
      {/* --User Review Submission Section-- */}
      <section className="space-y-8 py-8">
        {/* Section header */}
        <div className="space-y-2 mx-6 sm:mx-10 md:mx-14 xl:mx-24 2xl:mx-32">
          <h2 className="text-xl font-bold">Submit Your Review</h2>
          <p>Have anything to say about this game? Don't feel shy. Share your thoughts and experience on this game.</p>
        </div>
        {/* User review form */}
        <form className="space-y-8 mx-6 sm:mx-10 sm:w-3/5 md:mx-14 xl:mx-24 xl:w-1/3 2xl:mx-32 2xl:w-1/4" onSubmit={handleUserReview}>
          {/* Form input fields */}
          <div className="space-y-4">
            {/* Ratings input field */}
            <div className="flex gap-2">
              <p className="font-bold">Rating:</p>
              <div className="flex gap-[2px]">
                {/* Render radio buttons as stars for ratings input field */
                  [1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="hover:cursor-pointer">
                      <input
                        className="hidden"
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={() => setRating(parseInt(value))}
                      />
                      {/* Render filled or empty star icon based on the selected rating value */
                        rating >= value ? (
                          <FaStar size={20} color="#e30e30" />
                        ) : (
                          <FaRegStar size={20} color="#e30e30" />
                        )
                      }
                    </label>
                  ))}
              </div>
            </div>
            {/* Comment input field */}
            <textarea
              className="typing-input h-auto py-3"
              ref={commentRef}
              rows="4"
              placeholder="Comment"
              required
            />
          </div>
          {/* Form submit button */}
          <button className="primary-btn primary-btn--hover w-full h-12 sm:w-1/3">
            Submit
          </button>
        </form>
      </section>
      <hr className="w-1/2 mx-auto my-6 border-[1.5px] border-[#3f3f3f]" />
      {/* --User Reviews Section-- */}
      <section className="space-y-4 pt-8 pb-20">
        {// Check if user reviews are available
          ratings ? (
            // If available, render the list of user reviews
            <>
              {/* Display header with the number of reviews */}
              <h2 className="mx-6 font-bold text-xl sm:mx-10 md:mx-14 xl:mx-24 2xl:mx-32">
                {`Read Reviews (${ratings.length})`}
              </h2>
              {/* Render the user reviews */}
              <div className="space-y-2">
                {// Map through all user reviews and render the Review component for each user review
                  ratings.map((review) => {
                    // Find the user who posted the review
                    let user = users.find(user => user.uid === review.userUID);

                    /* If the user associated with the review exists,
                       use the user's full name and photo URL,
                       otherwise (if user is deleted), use default values
                    */
                    let fullName = user?.fullName || "Deleted User";
                    let photoURL = user?.photoURL || "https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Fdefault%2Fdefault_user.png?alt=media&token=d0ac1eec-2da7-44c6-b969-094cebdba599";

                    // Render the Review component with the review and user data
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
                  })
                }
              </div>
            </>
          ) : (
            // If user reviews are not available, display the unavailable message
            <div className="space-y-1 py-24 text-center">
              <h3 className="font-bold text-lg text-[#a9a9a9]">No Reviews Available</h3>
              <p>Be the first one to review this game.</p>
            </div>
          )
        }
      </section>
    </>
  );
}
