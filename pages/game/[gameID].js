import Overview from "../../components/game/overview";
import CriticReviews from "../../components/game/criticReviews";
import UserReviews from "../../components/game/userReviews";
import SystemRequirements from "../../components/game/systemRequirements";
import { db } from "../../config/firebase";
import { useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export default function GameDetails({ gameID, coverImage, name, overview, criticReviews, userReviews, systemRequirements, users }) {
  const [tab, setTab] = useState("overview");

  return (
    <main>
      <section>
        <h1 className="text-3xl underline">Game Details</h1>
        <div>
          <img className="w-[72rem]" src={coverImage} alt={`${name} cover`} />
          <h2>{name}</h2>
        </div>
        <div className="flex gap-3">
          <button className="text-white bg-blue-400" onClick={() => setTab("overview")}>
            Overview
          </button>
          <button className="text-white bg-blue-400" onClick={() => setTab("criticReviews")}>
            Critic Reviews
          </button>
          <button className="text-white bg-blue-400" onClick={() => setTab("userReviews")}>
            User Reviews
          </button>
          <button className="text-white bg-blue-400" onClick={() => setTab("systemRequirements")}>
            System Requirements
          </button>
        </div>
        {tab === 'overview' && <Overview overview={overview} />}
        {tab === 'criticReviews' && <CriticReviews criticReviews={criticReviews} gameID={gameID} />}
        {tab === 'userReviews' && <UserReviews userReviews={userReviews} users={users} gameID={gameID} />}
        {tab === 'systemRequirements' && <SystemRequirements systemRequirements={systemRequirements} />}
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params: { gameID } } = context;
  let game;
  let usersList;

  try {
    const gameSnapshot = await getDoc(doc(db, "games", gameID));
    game = gameSnapshot.data();

    const usersSnapshot = await getDocs(collection(db, "users"));
    usersList = usersSnapshot.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id }
    });
  } catch (error) {
    console.log(error);
  }

  if (!game || !usersList) {
    return {
      redirect: {
        destination: "/search-games",
        permanent: false
      }
    }
  }

  let averageRating = game.reviews.ratings.ratingsList ? (
    game.reviews.ratings.ratingsList.reduce((accumulator, review) => {
      return accumulator + review.rating
    }, 0) / game.reviews.ratings.ratingsList.length
  ) : 0;

  let averageScore = game.reviews.scores.scoresList ? (
    game.reviews.scores.scoresList.reduce((accumulator, review) => {
      return accumulator + review.score
    }, 0) / game.reviews.scores.scoresList.length
  ) : 0;

  return {
    props: {
      gameID,
      users: usersList,
      coverImage: game.images.cover,
      name: game.name,
      overview: {
        ...game.overview,
        releaseDate: JSON.parse(JSON.stringify(game.overview.releaseDate)),
        averageRating,
        averageScore
      },
      criticReviews: {
        averageScore,
        scoresList: game.reviews.scores.scoresList ? game.reviews.scores.scoresList.map((userScore) => {
          return { ...userScore, postedOn: JSON.parse(JSON.stringify(userScore.postedOn)) }
        }) : null
      },
      userReviews: {
        averageRating,
        ratingsList: game.reviews.ratings.ratingsList ? game.reviews.ratings.ratingsList.map((userRating) => {
          return { ...userRating, postedOn: JSON.parse(JSON.stringify(userRating.postedOn)) }
        }) : null
      },
      systemRequirements: game.systemRequirements || null,
    }
  }
}