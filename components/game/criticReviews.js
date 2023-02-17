import { useRouter } from "next/router";
import { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

export default function CriticReviews({ criticReviews: { scoresList } }) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const organizationNameRef = useRef();
    const organizationEmailRef = useRef();
    const scoreRef = useRef();
    const articleLinkRef = useRef();
    const commentRef = useRef();

    const getDate = (date) => {
        const formattedDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        return formattedDate;
    }

    const handleCriticReview = async () => {
        if (!user) return router.push("/signin");

        let organizationName = organizationNameRef?.current?.value;
        let organizationEmail = organizationEmailRef?.current?.value;
        let score = scoreRef?.current?.value;
        let articleLink = articleLinkRef?.current?.value;
        let comment = commentRef?.current?.value;

        try {
            await updateDoc(doc(db, "games", "fifa-21"), {
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
        } catch (error) {
            console.log(error);
        }

        router.push("/game/fifa-21");
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
                    <div key={review.userUID}>
                        <div className="flex gap-[30rem]">
                            <div className="flex gap-4">
                                <div>
                                    <img className="w-[3rem]" src="https://lh3.googleusercontent.com/a/AEdFTp7lFa-o7rKx5aNNxqZY8p1BOfayskkPK12m29TLdw=s288-p-rw-no" alt="user" />
                                </div>
                                <div>
                                    <p>by {review.organizationName}</p>
                                    <p>on {getDate(review.postedOn)}</p>
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