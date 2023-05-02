import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { getYear, timestampConversion } from "../utils/convertTimestamp";
import Search from "../components/searchGames/search";
import Filter from "../components/searchGames/filter";
import GameCard from "../components/searchGames/gameCard";

/*
 * The Search Games component renders a page that displays a search bar and filter options to search and filter games by name, platform, and release date. It renders the list of games that match the user's search and filter criteria. It also provides a quick search section with predefined filter options.
 *
 * @param {Array} games - An array of objects representing all the games available on this app.
 * @returns {JSX.Element} A React JSX element that displays the search games page.
 */
export default function SearchGames({ games }) {
  const router = useRouter();
  const emptyFilter = {
    sort: "",
    platform: "",
    releaseDates: {
      "2019": false,
      "2020": false,
      "2021": false,
      "2022": false,
      "2023": false
    }
  };
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(emptyFilter);

  useEffect(() => {
    /* If the platform is present in the router query string (set from Footer section),
       replace the filter's platform property with the query value.
    */
    if (router?.query?.platform) {
      setFilter({
        sort: "",
        platform: router.query.platform,
        releaseDates: {
          "2019": false,
          "2020": false,
          "2021": false,
          "2022": false,
          "2023": false
        }
      });
    }
  }, [router?.query]);

  // Filter the games array based on the search and filter terms
  const filteredGames = games.filter(game => {
    return game.name.toLowerCase().includes(search.toLowerCase())
      && (filter.platform === "" || game.platforms.some(platform => platform.toLowerCase().includes(filter.platform)))
      && (filter.releaseDates[getYear(game.releaseDate)] || Object.values(filter.releaseDates).every(val => val === false));
  }).sort((a, b) => {
    // Sort the filtered games based on the selected sorting criteria
    if (filter.sort === "releaseDate") {
      return timestampConversion(b.releaseDate) - timestampConversion(a.releaseDate);
    } else if (filter.sort === "topRated") {
      return b.averageRating - a.averageRating;
    } else if (filter.sort === "topScored") {
      return b.averageScore - a.averageScore;
    } else {
      return 0; // Don't sort
    }
  });

  return (
    <main>
      <Head>
        <title>Search Games | Game On</title>
      </Head>
      <section className="relative">
        {/* Add a gradient overlay between nav and page */}
        <div className="absolute inset-0 h-[0.75rem] sm:h-[1.25rem] md:h-[1.75rem]">
          <div className="h-full bg-gradient-to-b from-[#1f1f1f]" />
        </div>
        {/* --Search and filter section-- */}
        <div className="pt-7 pb-12 bg-[#2a2a2a] xl:py-24">
          <div className="lg:grid lg:grid-cols-4 xl:grid-cols-6">
            <div className="space-y-6 lg:col-span-3 lg:pr-6 xl:col-span-4">
              {/* Render search component */}
              <Search setSearch={setSearch} />
              {/* Render filter component (hidden on larger desktop screens) */}
              <div className="xl:hidden">
                <Filter filter={filter} setFilter={setFilter} />
              </div>
            </div>
            {/* --Quick search section-- (hidden on small-to-medium screens) */}
            <div className="hidden mr-14 z-[1] lg:col-span-1 lg:flex lg:flex-col lg:items-end lg:gap-y-2 xl:mr-24 xl:col-span-2 2xl:mr-32">
              {/* Quick search heading */}
              <h2 className="font-bold text-xl">Quick Search</h2>
              {/* List of quick search options */}
              <ul className="flex flex-col items-end gap-y-1 [&>li]:footer--li">
                <li
                  onClick={() => setFilter({
                    ...emptyFilter,
                    releaseDates: {
                      ...emptyFilter.releaseDates,
                      "2023": true
                    }
                  })}
                >
                  Recent Games
                </li>
                <li onClick={() => setFilter({ ...emptyFilter, sort: "topRated" })}>
                  Top Rated by Users
                </li>
                <li onClick={() => setFilter({ ...emptyFilter, sort: "topScored" })}>
                  Top Scored by Critics
                </li>
                <li onClick={() => setFilter({ ...emptyFilter, platform: "pc" })}>
                  Available on PC
                </li>
                <li onClick={() => setFilter({ ...emptyFilter, platform: "playstation" })}>
                  Available on PlayStation
                </li>
                <li onClick={() => setFilter({ ...emptyFilter, platform: "xbox" })}>
                  Available on Xbox
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Check if there are any filtered games */}
        {filteredGames.length ? (
          /* If filtered games array is not empty */
          <div className="mx-6 py-16 sm:mx-10 md:mx-14 xl:mx-24 xl:grid xl:grid-cols-4 xl:gap-x-4 2xl:mx-32">
            {/* Render filter component (hidden on mobile and small descktop screens) */}
            <div className="hidden xl:block xl:col-span-1">
              <Filter filter={filter} setFilter={setFilter} />
            </div>
            {/* --Games list section-- */}
            <div className="xl:col-span-3">
              {/* Display search result status (only if search bar or filter options are used) */}
              <h3 className={`font-bold text-xl text-[#a9a9a9] ${!search && JSON.stringify(filter) === JSON.stringify(emptyFilter) ? "hidden" : "pb-4"}`}>
                Showing {filteredGames.length} Result{filteredGames.length !== 1 && "s"}
              </h3>
              <div>
                {/* Map over filtered games and render game card component for each game */
                  filteredGames.map((filteredGame, index) => (
                    <GameCard key={index} index={index} game={filteredGame} />
                  ))
                }
              </div>
            </div>
          </div>
        ) : (
          /* If filtered games array is empty */
          <div className="space-y-1 py-24 text-center">
            <h3 className="font-bold text-lg text-[#a9a9a9]">No Games Found</h3>
            <p>We couldn&apos;t find what you searched for.</p>
          </div>
        )}
      </section>
    </main>
  );
}

/*
 * Retrieves all games from Firestore and formats their data during server-side rendering.
 * 
 * @returns {object} The server-side props containing an array of game objects.
 * @throws {Object} The server-side redirect containing the redirection destination in case of an error.
 */
export async function getServerSideProps() {
  let games = null;

  try {
    // Get all documents from the 'games' collection
    const gamesSnapshot = await getDocs(collection(db, "games"));

    // Map the retrieved documents to an array of game objects with additional calculated properties
    games = gamesSnapshot.docs.map((doc) => {
      // Calculate the average rating of user reviews for the game, if any
      let averageRating = doc.data().reviews.ratings.length ? (
        doc.data().reviews.ratings.reduce((accumulator, review) => {
          return accumulator + review.rating
        }, 0) / doc.data().reviews.ratings.length
      ) : null;

      // Calculate the average score of critic reviews for the game, if any
      let averageScore = doc.data().reviews.scores.length ? (
        doc.data().reviews.scores.reduce((accumulator, review) => {
          return accumulator + review.score
        }, 0) / doc.data().reviews.scores.length
      ) : null;

      return {
        id: doc.id,
        name: doc.data().name,
        thumbnailURL: doc.data().images.thumbnail,
        ...doc.data().overview,
        releaseDate: JSON.parse(JSON.stringify(doc.data().overview.releaseDate)),
        averageRating,
        averageScore
      };
    });
  } catch (error) {
    console.log(error);

    // Redirect to homepage if an error occurs
    return {
      redirect: {
        destination: "/home",
        permanent: false
      }
    };
  }

  // Return the games data as props for the page
  return {
    props: {
      games
    }
  };
}
