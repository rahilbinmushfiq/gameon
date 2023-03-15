import Overview from "../../components/game/overview";
import CriticReviews from "../../components/game/criticReviews";
import UserReviews from "../../components/game/userReviews";
import SystemRequirements from "../../components/game/systemRequirements";
import { db } from "../../config/firebase";
import { useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { FaInfoCircle, FaUser, FaUserTie, FaDesktop } from "react-icons/fa";

export default function GameDetails({ gameID, coverImage, name, overview, criticReviews, userReviews, systemRequirements, users }) {
  const [tab, setTab] = useState("overview");

  return (
    <main>
      <div className="py-6">
        <div className="relative max-w-full h-72">
          <Image className="object-cover" src={coverImage} fill sizes="35rem" alt={`${name} cover`} />
          <h2 className="absolute bottom-0 px-6 z-[1] text-2xl font-bold">
            {name}
          </h2>
          <div className="absolute h-full inset-0">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1f1f1f]" />
          </div>
        </div>
      </div>
      <section className="max-w-full px-6 py-4 rounded-md">
        <div className="flex justify-between rounded-[4px] overflow-hidden">
          <button
            className={`game--tab ${tab === 'overview' && "bg-[#e30e30]"}`}
            onClick={() => setTab("overview")}
          >
            <FaInfoCircle
              size={14}
              color={`${tab === 'overview' && "#f1f1f1"}`}
            />
          </button>
          <button
            className={`game--tab ${tab === 'criticReviews' && "bg-[#e30e30]"}`}
            onClick={() => setTab("criticReviews")}
          >
            <FaUserTie
              size={14}
              color={`${tab === 'criticReviews' && "#f1f1f1"}`}
            />
          </button>
          <button
            className={`game--tab ${tab === 'userReviews' && "bg-[#e30e30]"}`}
            onClick={() => setTab("userReviews")}
          >
            <FaUser
              size={14}
              color={`${tab === 'userReviews' && "#f1f1f1"}`}
            />
          </button>
          <button
            className={`game--tab ${tab === 'systemRequirements' && "bg-[#e30e30]"}`}
            onClick={() => setTab("systemRequirements")}
          >
            <FaDesktop
              size={14}
              color={`${tab === 'systemRequirements' && "#f1f1f1"}`}
            />
          </button>
        </div>
      </section>
      {tab === 'overview' && <Overview overview={overview} />}
      {tab === 'criticReviews' && <CriticReviews criticReviews={criticReviews} gameID={gameID} />}
      {tab === 'userReviews' && <UserReviews userReviews={userReviews} users={users} gameID={gameID} />}
      {tab === 'systemRequirements' && <SystemRequirements systemRequirements={systemRequirements} />}
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