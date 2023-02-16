export default function Overview({ overview: { summary, genre, platform, releaseDate, averageRating, averageScore } }) {
    releaseDate = new Date(releaseDate.seconds * 1000 + releaseDate.nanoseconds / 1000000).toLocaleDateString('en-US', {
        // weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <h2 className="text-2xl underline">Overview Tab</h2>
            <div className="flex gap-16">
                <div className="w-[35rem]">
                    <h3 className="underline">Summary</h3>
                    <p>{summary}</p>
                </div>
                <div>
                    <h3 className="underline">About</h3>
                    <div>
                        <p>Genres: {genre.map(g => g)}</p>
                        <p>Platforms: {platform.map(p => p)}</p>
                        <p>Release date: {releaseDate}</p>
                    </div>
                </div>
                <div>
                    <h3 className="underline">Review</h3>
                    <p>Average rating: {averageRating.toFixed(2)}</p>
                    <p>Average score: {averageScore.toFixed(1)}</p>
                </div>
            </div>
        </>
    );
}