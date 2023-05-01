import { useRef } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { HiMail, HiUsers, HiClipboardCheck, HiGlobeAlt, HiChat } from "react-icons/hi";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/auth";
import { useLoading } from "../../contexts/loading";
import createErrorMessage from "../../utils/createErrorMessage";
import Review from "./review";

/*
 * Renders the Critic Reviews section of the Game Details page, which is responsible for displaying the form to allow critics to submit their short review on the game from their own blog post, and for displaying the list of reviews submitted by other critics. The component is rendered when users select the `Critic Reviews` tab on the Game Details page.
 * 
 * @param {string} gameID - The unique ID of the game.
 * @param {Object} criticReviews - The critic reviews data for the game.
 * @param {Array<Object>} criticReviews.scores - The list of critic reviews for the game.
 * @param {string} criticReviews.scores.organizationName - The name of the critic's blog or organization.
 * @param {string} criticReviews.scores.organizationEmail - The email of the critic's blog or organization.
 * @param {number} criticReviews.scores.score - The score given by the critic in the review.
 * @param {string} criticReviews.scores.articleLink - The URL of the critic's blog post.
 * @param {string} criticReviews.scores.comment - The comment given in the review.
 * @param {firebase.firestore.Timestamp} criticReviews.scores.postedOn - The date and time when the review was posted.
 * @param {string} criticReviews.scores.userUID - The user ID of the critic.
 * 
 * @returns {JSX.Element} A React JSX element that displays the Critic Reviews section of Game Details page.
 */
export default function CriticReviews({ criticReviews: { scores }, gameID }) {
  const { user } = useAuth(); // Retrieve current user from Auth context
  const { setIsPageLoading } = useLoading(); // Retrieve setIsPageLoading function from Loading context
  const router = useRouter();
  const organizationNameRef = useRef();
  const organizationEmailRef = useRef();
  const scoreRef = useRef();
  const articleLinkRef = useRef();
  const commentRef = useRef();

  // Function to handle critic review submission
  const handleCriticReview = async (event) => {
    event.preventDefault();

    // If user is not authenticated, display error and redirect user to sign-in page
    if (!user) {
      toast.error("You must be signed in to post your review.");
      return router.push("/signin");
    }

    // Get the form input fields
    let organizationName = organizationNameRef?.current?.value;
    let organizationEmail = organizationEmailRef?.current?.value;
    let score = parseInt(scoreRef?.current?.value);
    let articleLink = articleLinkRef?.current?.value;
    let comment = commentRef?.current?.value;

    // Regular expressions to validate the form input fields
    const emailRegEx = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    const urlRegEx = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;

    // Validate form input fields
    if (!organizationName || !organizationEmail || !score || !articleLink || !comment) {
      toast.error("Please fill up the form first.");
      return;
    } else if (organizationName.length < 2) {
      toast.error("Please provide a valid name.");
      return;
    } else if (!emailRegEx.test(organizationEmail)) {
      toast.error("Please provide a valid email.");
      return;
    } else if (score < 0 || score > 50) {
      toast.error("Score must be within 0 to 50.");
      return;
    } else if (!urlRegEx.test(articleLink)) {
      toast.error("Please provide a valid link of your article.");
      return;
    } else if (comment.length > 1000) {
      toast.error("Comment field must not exceed 1000 characters.");
      return;
    }

    setIsPageLoading(true); // Set page loading state to true to show loading spinner

    try {
      // Update game document with the new critic review in the database
      await updateDoc(doc(db, "games", gameID), {
        "reviews.scores": arrayUnion({
          organizationName,
          organizationEmail,
          score,
          articleLink,
          comment,
          postedOn: Timestamp.now(),
          userUID: user.uid
        })
      });

      // Clear the form input fields
      organizationNameRef.current.value = "";
      organizationEmailRef.current.value = "";
      scoreRef.current.value = "";
      articleLinkRef.current.value = "";
      commentRef.current.value = "";

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
      {/* --Critic Review Submission Section-- */}
      <section className="space-y-8 py-8">
        {/* Section header */}
        <div className="space-y-2 mx-6 sm:mx-10 md:mx-14 xl:mx-24 2xl:mx-32">
          <h2 className="text-xl font-bold">Submit Your Review</h2>
          <p>If you want to submit the article of your blog on this game, you have come to the right place! Fill the the following form and help your fellow gamers with your informative review.</p>
        </div>
        {/* Critic review form */}
        <form className="space-y-8 mx-6 sm:mx-10 sm:w-3/5 md:mx-14 xl:mx-24 xl:w-1/3 2xl:mx-32 2xl:w-1/4" onSubmit={handleCriticReview}>
          {/* Form input fields */}
          <div className="space-y-4 [&>div]:relative [&>div>input]:typing-input [&>div>input]:pl-12">
            {/* Input field for the name of organization/blog/website */}
            <div>
              <input
                className="peer"
                ref={organizationNameRef}
                type="text"
                placeholder="Name of the Organization"
                required
              />
              <HiUsers
                className="typing-input--icon"
                size={48}
                onClick={() => organizationNameRef.current.focus()}
              />
            </div>
            {/* Input field for the email of organization/blog/website */}
            <div>
              <input
                className="peer"
                ref={organizationEmailRef}
                type="email"
                placeholder="Email of the Organization"
                required
              />
              <HiMail
                className="typing-input--icon"
                size={48}
                onClick={() => organizationEmailRef.current.focus()}
              />
            </div>
            {/* Score input field */}
            <div>
              <input
                className="peer"
                ref={scoreRef}
                type="number"
                min="0"
                max="50"
                placeholder="Score (0-50)"
                required
              />
              <HiClipboardCheck
                className="typing-input--icon"
                size={48}
                onClick={() => scoreRef.current.focus()}
              />
            </div>
            {/* Article link input field */}
            <div>
              <input
                className="peer"
                ref={articleLinkRef}
                type="url"
                placeholder="Article Link"
                required
              />
              <HiGlobeAlt
                className="typing-input--icon"
                size={48}
                onClick={() => articleLinkRef.current.focus()}
              />
            </div>
            {/* Comment input field */}
            <div>
              <textarea
                className="typing-input h-auto pl-12 py-3.5 peer"
                ref={commentRef}
                rows="8"
                placeholder="Comment"
                required
              />
              <HiChat
                className="typing-input--icon"
                size={48}
                onClick={() => articleLinkRef.current.focus()}
              />
            </div>
          </div>
          {/* Form submit button */}
          <button className="primary-btn primary-btn--hover w-full h-12 sm:w-1/3">
            Submit
          </button>
        </form>
      </section >
      <hr className="w-1/2 mx-auto my-6 border-[1.5px] border-[#3f3f3f]" />
      {/* --Critic Reviews Section-- */}
      <section className="space-y-4 pt-8 pb-20">
        {// Check if critic reviews are available
          scores ? (
            // If available, render the list of critic reviews
            <>
              {/* Display header with the number of reviews */}
              <h2 className="mx-6 font-bold text-xl sm:mx-10 md:mx-14 xl:mx-24 2xl:mx-32">
                {`Read Reviews (${scores.length})`}
              </h2>
              {/* Render the critic reviews */}
              <div className="space-y-2">
                {// Map through all critic reviews and render the Review component for each critic review
                  scores.map((review) => {
                    return (
                      <Review
                        key={review.userUID + review.comment + Math.random()}
                        reviewType="critic"
                        photoURL="https://firebasestorage.googleapis.com/v0/b/gameon-game-database.appspot.com/o/userPhotos%2Fdefault%2Fdefault_group.png?alt=media&token=f4b1d20b-f059-4781-bde2-a23e25dd366b"
                        name={review.organizationName}
                        postedOn={review.postedOn}
                        assessment={review.score}
                        comment={review.comment}
                        articleLink={review.articleLink}
                      />
                    )
                  })
                }
              </div>
            </>
          ) : (
            // If critic reviews are not available, display the unavailable message
            <div className="space-y-1 py-24 text-center">
              <h3 className="font-bold text-lg text-[#a9a9a9]">No Reviews Available</h3>
              <p>Be the first one to review this game.</p>
            </div>
          )
        }
      </section >
    </>
  );
}
