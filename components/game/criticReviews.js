import { useRouter } from "next/router";
import { useRef } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useAuth } from "../../config/auth";
import { useLoading } from "../../contexts/loading";
import Review from "./review";
import { toast } from "react-toastify";
import createErrorMessage from "../../utils/createErrorMessage";

export default function CriticReviews({ criticReviews: { scoresList }, gameID }) {
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
        "reviews.scores.scoresList": arrayUnion({
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
      <section className="max-w-full space-y-2 py-8 bg-[#2a2a2a]">
        <div className="mx-6 pb-8 space-y-2">
          <h4 className="inline-block mb-1 text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
            Submit Your Review
          </h4>
          <p className="text-[#a9a9a9]">
            If you want to submit the article of your blog on this game, you have come to the right place! Fill the the following form and help your fellow gamers with your informative review.
          </p>
        </div>
        <form className="mx-6 space-y-4" onSubmit={handleCriticReview}>
          <input
            className="sign-in--input"
            ref={organizationNameRef}
            type="text"
            placeholder="Name of the organization"
            required
          />
          <input
            className="sign-in--input"
            ref={organizationEmailRef}
            type="email"
            placeholder="Email of the organization"
            required
          />
          <input
            className="sign-in--input"
            ref={scoreRef}
            type="number"
            placeholder="Score (0-50)" min="0" max="50"
            required
          />
          <input
            className="sign-in--input"
            ref={articleLinkRef}
            type="url"
            placeholder="Article link"
            required
          />
          <textarea
            className="py-[16px] w-full px-3 rounded-sm bg-[#2f2f2f] caret-[#f1f1f1] border border-[#4f4f4f] focus:outline-none focus:border focus:border-[#e30e30]/60 placeholder:text-[#9a9a9a]"
            rows="8"
            ref={commentRef}
            placeholder="Comment"
            required
          />
          <button className="w-full h-12 rounded-sm font-semibold text-[#f1f1f1] bg-[#e30e30]">
            Submit
          </button>
        </form>
      </section >
      <section className="max-w-full space-y-2 py-8">
        <h4 className="mx-6 mb-4 inline-block text-lg font-bold relative after:content-[''] after:absolute after:h-[3px] after:w-1/4 after:-bottom-1 after:left-0 after:bg-[#e30e30]">
          Critic Reviews
        </h4>
        {scoresList && scoresList.map((review) => {
          return (
            <Review
              key={review.userUID + review.comment + Math.random()}
              reviewType="critic"
              photoURL="https://static.thenounproject.com/png/2204677-200.png"
              name={review.organizationName}
              postedOn={review.postedOn}
              assessment={review.score}
              comment={review.comment}
              articleLink={review.articleLink}
            />
          )
        })}
      </section >
    </>
  );
}