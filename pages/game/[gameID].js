import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FaInfoCircle, FaUser, FaUserTie, FaDesktop } from "react-icons/fa";
import { db } from "../../config/firebase";
import Overview from "../../components/game/overview";
import CriticReviews from "../../components/game/criticReviews";
import UserReviews from "../../components/game/userReviews";
import SystemRequirements from "../../components/game/systemRequirements";

/*
 * The Game Details component is a page that renders the details for a specific game based on the URL parameter. The component displays a cover image with the game title and navigation tabs that allow users to switch between the Overview, Critic Reviews, User Reviews, and System Requirements tabs.
 *
 * @param {string} gameID - The unique ID of the game.
 * @param {string} coverImage - The URL of the game's cover image.
 * @param {string} name - The name of the game.
 * @param {Object} overview - The overview data for the game.
 * @param {Object} criticReviews - The critic reviews data for the game.
 * @param {Object} userReviews - The users reviews data for the game.
 * @param {Object} systemRequirements - The minimum and recommended system requirements for the game.
 * @param {Array<Object>} users - The users registered on this app.
 *
 * @returns {JSX.Element} A React JSX element that displays the game details page.
 */
export default function GameDetails({ gameID, coverImage, name, overview, criticReviews, userReviews, systemRequirements, users }) {
  const [tab, setTab] = useState("overview"); // state hook for tracking the current active tab

  return (
    <main>
      <Head>
        {/* Set the page title based on the current active tab and the game name */}
        <title>
          {`${(tab[0].toUpperCase() + tab.slice(1)) // Make fist character uppercase and concatenate the rest
            .split(/(?=[A-Z])/) // Split the concatenated string by uppercase letters
            .join(" ") // Join the array of substrings by a space (" ")
            } - ${name} | Game On`
          }
        </title>
      </Head>
      <div>
        {/* Render the cover image of the game */}
        <div className="relative w-full h-[33.33vh] z-[-1] lg:h-[60vh] xl:h-[66.66vh]">
          <Image
            className="object-cover"
            src={coverImage}
            alt={`${name} cover`}
            fill
            sizes="100vh"
            priority
          />
          {/* Add a heading to the cover image */}
          <div className="absolute bottom-0 px-6 z-[1] sm:px-10 md:px-14 xl:px-24 2xl:px-32">
            <h1 className="text-3xl">{name}</h1>
          </div>
          {/* Add a gradient overlay to the cover image */}
          <div className="absolute inset-0 h-full">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]" />
          </div>
        </div>
      </div>
      {/* Render the navigation tabs */}
      <section className="px-6 py-12 flex gap-2 overflow-auto bg-[#1a1a1a] [&>button]:game-tab sm:px-10 md:px-14 xl:px-24 2xl:px-32">
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
      {/* Render one of the components of game details page based on the current active tab */
        tab === "overview" ? (
          <Overview overview={overview} />
        ) : (
          tab === "criticReviews" ? (
            <CriticReviews criticReviews={criticReviews} gameID={gameID} />
          ) : (
            tab === "userReviews" ? (
              <UserReviews userReviews={userReviews} users={users} gameID={gameID} />
            ) : (
              <SystemRequirements systemRequirements={systemRequirements} />
            )
          )
        )
      }
    </main>
  );
}

/* Retrieves data for all users and a specific game from Firestore during server-side rendering.
 * 
 * @param {object} context - The context object containing information about the incoming HTTP request.
 * @returns {object} The server-side props containing the game and all users data.
 * @returns {Object} The server-side redirect when either the game or users data is missing.
 * @throws {Object} The server-side redirect containing the redirection destination in case of an error.
 */
export async function getServerSideProps(context) {
  // Extract the gameID parameter from the context
  const { params: { gameID } } = context;

  let game;
  let users;

  try {
    // Retrieve the game from the database
    const gameSnapshot = await getDoc(doc(db, "games", gameID));
    game = gameSnapshot.data();

    // Retrieve all users from the database
    const usersSnapshot = await getDocs(collection(db, "users"));
    users = usersSnapshot.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id }
    });
  } catch (error) {
    console.log(error);

    // Redirect to search games page if an error occurs
    return {
      redirect: {
        destination: "/search-games",
        permanent: false
      }
    };
  }

  // Redirect to search games page if either the game or users data is missing
  if (!game || !users) {
    return {
      redirect: {
        destination: "/search-games",
        permanent: false
      }
    };
  }

  // Calculate the average rating of user reviews for the game, if any
  let averageRating = game.reviews.ratings.length ? (
    game.reviews.ratings.reduce((accumulator, review) => {
      return accumulator + review.rating
    }, 0) / game.reviews.ratings.length
  ) : null;

  // Calculate the average score of critic reviews for the game, if any
  let averageScore = game.reviews.scores.length ? (
    game.reviews.scores.reduce((accumulator, review) => {
      return accumulator + review.score
    }, 0) / game.reviews.scores.length
  ) : null;

  // Return the game and users data as props for the page
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
      systemRequirements: game.systemRequirements || null
    }
  };
}
