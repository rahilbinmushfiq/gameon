import Overview from "../../components/game/overview";
import CriticReviews from "../../components/game/criticReviews";
import UserReviews from "../../components/game/userReviews";
import SystemRequirements from "../../components/game/systemRequirements";
import { db } from "../../config/firebase";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function GameDetails({ isGameFound, coverImage, name, overview, criticReviews, userReviews, systemRequirements }) {
  const router = useRouter();

  useEffect(() => {
    if (!isGameFound) {
      router.push('/search-games');
    }
  }, [])

  const [tab, setTab] = useState("overview");

  return (
    <main>
      {isGameFound && (<section>
        <h1 className="text-3xl underline">Game Details</h1>
        <div>
          <img className="w-[72rem]" src={coverImage} alt={`${name} cover`} />
          <h2>{name}</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setTab("overview")} className="text-white bg-blue-400">Overview</button>
          <button onClick={() => setTab("criticReviews")} className="text-white bg-blue-400">Critic Reviews</button>
          <button onClick={() => setTab("userReviews")} className="text-white bg-blue-400">User Reviews</button>
          <button onClick={() => setTab("systemRequirements")} className="text-white bg-blue-400">System Requirements</button>
        </div>
        {tab === 'overview' && <Overview overview={overview} />}
        {tab === 'criticReviews' && <CriticReviews criticReviews={criticReviews} />}
        {tab === 'userReviews' && <UserReviews userReviews={userReviews} />}
        {tab === 'systemRequirements' && <SystemRequirements systemRequirements={systemRequirements} />}
      </section>)}
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params: { gameID } } = context;

  const response = await getDoc(doc(db, "games", gameID));

  let isGameFound = false;
  let averageRating = null;
  let averageScore = null;
  let coverImage = null;
  let name = null;
  let overview = null;
  let criticReviews = null;
  let userReviews = null;
  let systemRequirements = null;

  if (response.data()) {
    isGameFound = true;

    averageRating = response.data().reviews.ratings.allRatings.reduce((accumulator, rating) => {
      return accumulator + rating
    }, 0) / response.data().reviews.ratings.allRatings.length;
    averageScore = response.data().reviews.scores.allScores.reduce((accumulator, score) => {
      return accumulator + score
    }, 0) / response.data().reviews.scores.allScores.length;

    coverImage = response.data().images.cover;
    name = response.data().name;
    overview = { ...response.data().overview, releaseDate: JSON.parse(JSON.stringify(response.data().overview.releaseDate)), averageRating, averageScore };
    criticReviews = {
      allScores: response.data().reviews.scores.allScores,
      scoresList: response.data().reviews.scores.scoresList.map((userScore) => {
        return { ...userScore, postedOn: JSON.parse(JSON.stringify(userScore.postedOn)) }
      })
    };
    userReviews = {
      allRatings: response.data().reviews.ratings.allRatings,
      ratingsList: response.data().reviews.ratings.ratingsList.map((userRating) => {
        return { ...userRating, postedOn: JSON.parse(JSON.stringify(userRating.postedOn)) }
      })
    };
    systemRequirements = response.data().systemRequirements;
  }

  return {
    props: {
      isGameFound, coverImage, name, overview, criticReviews, userReviews, systemRequirements
    }
  }
}