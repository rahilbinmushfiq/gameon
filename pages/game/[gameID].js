import Overview from "../../components/game/overview";
import CriticReviews from "../../components/game/criticReviews";
import UserReviews from "../../components/game/userReviews";
import SystemRequirements from "../../components/game/systemRequirements";
import { db } from "../../config/firebase";
import { useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import { FaInfoCircle, FaUser, FaUserTie, FaDesktop } from "react-icons/fa";
import Head from "next/head";

export default function GameDetails({ gameID, coverImage, name, overview, criticReviews, userReviews, systemRequirements, users }) {
  const [tab, setTab] = useState("overview");

  return (
    <main>
      <Head>
        <title>
          {`${(tab[0].toUpperCase() + tab.slice(1))
            .split(/(?=[A-Z])/)
            .join(" ")
            } - ${name} | Game On`
          }
        </title>
      </Head>
      <div>
        <div className="relative w-full h-72 z-[-1]">
          <Image
            className="object-cover"
            src={coverImage}
            alt={`${name} cover`}
            fill
            sizes="100vh"
            priority
          />
          <div className="absolute bottom-0 px-6 z-[1]">
            <h1 className="text-2xl">{name}</h1>
          </div>
          <div className="absolute inset-0 h-full">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]" />
          </div>
        </div>
      </div>
      <section className="px-6 py-12 flex gap-2 overflow-auto bg-[#1a1a1a] [&>button]:game-tab">
        <button
          className={tab === "overview" ? "active" : "inactive"}
          onClick={() => setTab("overview")}
        >
          <FaInfoCircle size={14} />
          <p>Overview</p>
        </button>
        <button
          className={tab === "criticReviews" ? "active" : "inactive"}
          onClick={() => setTab("criticReviews")}
        >
          <FaUserTie size={14} />
          <p>Critic Reviews</p>
        </button>
        <button
          className={tab === "userReviews" ? "active" : "inactive"}
          onClick={() => setTab("userReviews")}
        >
          <FaUser size={14} />
          <p>User Reviews</p>
        </button>
        <button
          className={tab === "systemRequirements" ? "active" : "inactive"}
          onClick={() => setTab("systemRequirements")}
        >
          <FaDesktop size={14} />
          <p>System Requirements</p>
        </button>
      </section>
      {tab === "overview" && <Overview overview={overview} />}
      {tab === "criticReviews" && <CriticReviews criticReviews={criticReviews} gameID={gameID} />}
      {tab === "userReviews" && <UserReviews userReviews={userReviews} users={users} gameID={gameID} />}
      {tab === "systemRequirements" && <SystemRequirements systemRequirements={systemRequirements} />}
    </main>
  );
}

export async function getServerSideProps(context) {
  const { params: { gameID } } = context;
  let game;
  let users;

  try {
    const gameSnapshot = await getDoc(doc(db, "games", gameID));
    game = gameSnapshot.data();

    const usersSnapshot = await getDocs(collection(db, "users"));
    users = usersSnapshot.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id }
    });
  } catch (error) {
    console.log(error);
  }

  if (!game || !users) {
    return {
      redirect: {
        destination: "/search-games",
        permanent: false
      }
    }
  }

  let averageRating = game.reviews.ratings.length ? (
    game.reviews.ratings.reduce((accumulator, review) => {
      return accumulator + review.rating
    }, 0) / game.reviews.ratings.length
  ) : 0;

  let averageScore = game.reviews.scores.length ? (
    game.reviews.scores.reduce((accumulator, review) => {
      return accumulator + review.score
    }, 0) / game.reviews.scores.length
  ) : 0;

  return {
    props: {
      gameID,
      users,
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
        scores: game.reviews.scores.length ? game.reviews.scores.map((score) => {
          return { ...score, postedOn: JSON.parse(JSON.stringify(score.postedOn)) }
        }) : null
      },
      userReviews: {
        averageRating,
        ratings: game.reviews.ratings.length ? game.reviews.ratings.map((rating) => {
          return { ...rating, postedOn: JSON.parse(JSON.stringify(rating.postedOn)) }
        }) : null
      },
      systemRequirements: game.systemRequirements || null,
    }
  }
}