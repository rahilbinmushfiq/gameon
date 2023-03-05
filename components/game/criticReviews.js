import { useRouter } from "next/router";
import { useRef } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { getDateAndTime } from "../../utils/convertTimestamp";
import { useAuth } from "../../config/auth";

export default function CriticReviews({ criticReviews: { scoresList } }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const organizationNameRef = useRef();
  const organizationEmailRef = useRef();
  const scoreRef = useRef();
  const articleLinkRef = useRef();
  const commentRef = useRef();

  if (isLoading) return <h1>Loading...</h1>;

  const handleCriticReview = async () => {
    if (!user) return router.push("/signin");

    try {
      await updateDoc(doc(db, "games", "fifa-21"), {
        "reviews.scores.scoresList": arrayUnion({
          organizationName: organizationNameRef?.current?.value,
          organizationEmail: organizationEmailRef?.current?.value,
          score: scoreRef?.current?.value,
          articleLink: articleLinkRef?.current?.value,
          comment: commentRef?.current?.value,
          postedOn: Timestamp.now(),
          userUID: user.uid
        })
      });

      organizationNameRef.current.value = "";
      organizationEmailRef.current.value = "";
      scoreRef.current.value = "";
      articleLinkRef.current.value = "";
      commentRef.current.value = "";
    } catch (error) {
      console.log(error);
    }

    router.push("/game/fifa-21", undefined, { scroll: false });
  }

  return (
    <>
      <h2 className="text-2xl underline">Critic Reviews Tab</h2>
      <div className="flex flex-col mb-[2rem]">
        <h4 className="underline">Review this game</h4>
        <input ref={organizationNameRef} type="text" placeholder="Name of the organization" required />
        <input ref={organizationEmailRef} type="email" placeholder="Email of the organization" required />
        <input ref={scoreRef} type="number" placeholder="Score (0-50)" min="0" max="50" required />
        <input ref={articleLinkRef} type="url" placeholder="Article link" required />
        <textarea ref={commentRef} className="w-[50rem] mb-2" placeholder="Comment" required></textarea>
        <button onClick={() => handleCriticReview()} className="w-fit text-white bg-slate-600">Review</button>
      </div>
      <h4 className="text-xl underline">Critic Reviews</h4>
      {scoresList.map((review) => {
        return (
          <div key={review.userUID + review.comment + Math.random()}>
            <div className="flex gap-[30rem]">
              <div className="flex gap-4">
                <div>
                  <img className="w-[3rem]" src="https://static.thenounproject.com/png/2204677-200.png" alt="group" />
                </div>
                <div>
                  <p>by {review.organizationName}</p>
                  <p>on {getDateAndTime(review.postedOn)}</p>
                </div>
              </div>
              <div>
                <p>Score: {review.score}</p>
              </div>
            </div>
            <div className="w-[50rem]">
              {review.comment}
            </div>
            <a href={review.articleLink} target="_blank" rel="noopener noreferrer">Read full review</a>
          </div>
        )
      })}
    </>
  );
}