import { getYear } from "../../utils/convertTimestamp";
import { sliceParagraph } from "../../utils/slice";

export default function GameCard({ game: { thumbnailURL, name, summary, platforms, genres, releaseDate, averageRating, averageScore } }) {
    return (
        <div className="mb-6 flex">
            <img width="150px" src={thumbnailURL} alt={`${name} thumbnail`} />
            <div>
                <h3 className="text-2xl">{name}</h3>
                <p className="mb-5">{platforms.join(" • ")} | {getYear(releaseDate)}</p>
                <h4 className="mb-5">{sliceParagraph(summary)}</h4>
                <p>Average rating: {averageRating}/5</p>
                <p>Average score: {averageScore}/50</p>
            </div>
        </div>
    )
}