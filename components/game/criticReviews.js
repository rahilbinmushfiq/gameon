import { useRouter } from "next/router";
import { useRef } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../../contexts/auth";
import { useLoading } from "../../contexts/loading";
import Review from "./review";
import { toast } from "react-toastify";
import createErrorMessage from "../../utils/createErrorMessage";
import { HiMail, HiUsers, HiClipboardCheck, HiGlobeAlt, HiChat } from "react-icons/hi";

export default function CriticReviews({ criticReviews: { scores }, gameID }) {
  const { user } = useAuth();
  const { setIsPageLoading } = useLoading();
  const router = useRouter();
  const organizationNameRef = useRef();
  const organizationEmailRef = useRef();
  const scoreRef = useRef();
  const articleLinkRef = useRef();
  const commentRef = useRef();

  const handleCriticReview = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error("You must be signed in to post your review.");
      return router.push("/signin");
    }

    let organizationName = organizationNameRef?.current?.value;
    let organizationEmail = organizationEmailRef?.current?.value;
    let score = parseInt(scoreRef?.current?.value);
    let articleLink = articleLinkRef?.current?.value;
    let comment = commentRef?.current?.value;

    if (!organizationName || !organizationEmail || !score || !articleLink || !comment) {
      toast.error("Please fill up the form first.");
      return;
    } else if (organizationName.length < 2) {
      toast.error("Please provide a valid name.");
      return;
    } else if (!(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(organizationEmail))) {
      toast.error("Please provide a valid email.");
      return;
    } else if (score < 0 || score > 50) {
      toast.error("Score must be within 0 to 50.");
      return;
    } else if (!(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/.test(articleLink))) {
      toast.error("Please provide a valid link of your article.");
      return;
    } else if (comment.length > 1000) {
      toast.error("Comment field must not exceed 1000 characters.");
      return;
    }

    setIsPageLoading(true);

    try {
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

      organizationNameRef.current.value = "";
      organizationEmailRef.current.value = "";
      scoreRef.current.value = "";
      articleLinkRef.current.value = "";
      commentRef.current.value = "";

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
      <section className="space-y-8 py-8">
        <div className="space-y-2 mx-6 sm:mx-10 md:mx-14">
          <h2 className="text-xl font-bold">Submit Your Review</h2>
          <p>If you want to submit the article of your blog on this game, you have come to the right place! Fill the the following form and help your fellow gamers with your informative review.</p>
        </div>
        <form className="mx-6 space-y-8 sm:mx-10 sm:w-3/5 md:mx-14" onSubmit={handleCriticReview}>
          <div className="space-y-4 [&>div]:relative [&>div>input]:typing-input [&>div>input]:pl-12">
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
          <button className="primary-btn primary-btn--hover w-full h-12 sm:w-1/3">
            Submit
          </button>
        </form>
      </section >
      <hr className="w-1/2 mx-auto my-6 border-[1.5px] border-[#3f3f3f]" />
      <section className="space-y-4 pt-8 pb-20">
        {scores ? (
          <>
            <h2 className="mx-6 font-bold text-xl sm:mx-10 md:mx-14">
              {`Read Reviews (${scores.length})`}
            </h2>
            <div className="space-y-2">
              {scores.map((review) => {
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
              })}
            </div>
          </>
        ) : (
          <div className="space-y-1 py-24 text-center">
            <h3 className="font-bold text-lg text-[#a9a9a9]">No Reviews Available</h3>
            <p>Be the first one to review this game.</p>
          </div>
        )}
      </section >
    </>
  );
}