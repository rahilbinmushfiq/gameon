export default function CriticReviews({ criticReviews: { scoresList } }) {
    const getDate = (date) => {
        const formattedDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        return formattedDate;
    }

    return (
        <>
            <h2 className="text-2xl underline">Critic Reviews Tab</h2>
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