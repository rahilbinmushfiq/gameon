import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getYear, timestampConversion } from "../utils/convertTimestamp";
import Search from "../components/searchGames/search";
import Filter from "../components/searchGames/filter";
import GameCard from "../components/searchGames/gameCard";
import Head from "next/head";

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
    if (router?.query?.platform) {
      setFilter({
        ...emptyFilter,
        platform: router.query.platform
      });
    }
  }, [router?.query]);

  const filteredGames = games.filter(game => {
    return game.name.toLowerCase().includes(search.toLowerCase())
      && (filter.platform === "" || game.platforms.some(platform => platform.toLowerCase().includes(filter.platform)))
      && (filter.releaseDates[getYear(game.releaseDate)] || Object.values(filter.releaseDates).every(val => val === false));
  }).sort((a, b) => {
    if (filter.sort === "releaseDate") {
      return timestampConversion(b.releaseDate) - timestampConversion(a.releaseDate);
    } else if (filter.sort === "topRated") {
      return b.averageRating - a.averageRating;
    } else if (filter.sort === "topScored") {
      return b.averageScore - a.averageScore;
    } else {
      return 0;
    }
  });

  return (
    <main>
      <Head>
        <title>Search Games | Game On</title>
      </Head>
      <section className="relative">
        <div className="absolute inset-0 h-28 bg-transparent">
          <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
          <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#2a2a2a]" />
        </div>
        <div className="py-16 bg-[#2a2a2a]">
          <div className="space-y-2 pb-12 px-6 sm:px-10 md:px-14">
            <h1>Search Games</h1>
            <p>Find your next favorite game with our easy-to-use search tool. Browse through our extensive library and filter by platform, release date and more.</p>
          </div>
          <div className="lg:grid lg:grid-cols-4">
            <div className="space-y-6 lg:col-span-3 lg:pr-6">
              <Search setSearch={setSearch} />
              <Filter filter={filter} setFilter={setFilter} />
            </div>
            <div className="hidden p-6 mr-14 bg-[#1f1f1f] z-[1] lg:col-span-1 lg:flex lg:flex-col lg:items-end lg:gap-y-2">
              <h2 className="font-bold text-xl">Quick Search</h2>
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
        {filteredGames.length ? (
          <div className="mx-6 py-16 sm:mx-10 md:mx-14">
            <h3 className={`font-bold text-xl text-[#a9a9a9] ${!search && JSON.stringify(filter) === JSON.stringify(emptyFilter) ? "hidden" : ""}`}>Showing {filteredGames.length} Results</h3>
            <div>
              {filteredGames.map((filteredGame, index) => (
                <GameCard key={index} index={index} game={filteredGame} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 py-24 text-center">
            <h3 className="font-bold text-lg text-[#a9a9a9]">No Games Found</h3>
            <p>We couldn't find what you searched for.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  let games = null;

  try {
    const gamesSnapshot = await getDocs(collection(db, "games"));

    games = gamesSnapshot.docs.map((doc) => {
      let averageRating = doc.data().reviews.ratings.length ? (
        doc.data().reviews.ratings.reduce((accumulator, review) => {
          return accumulator + review.rating
        }, 0) / doc.data().reviews.ratings.length
      ) : 0;

      let averageScore = doc.data().reviews.scores.length ? (
        doc.data().reviews.scores.reduce((accumulator, review) => {
          return accumulator + review.score
        }, 0) / doc.data().reviews.scores.length
      ) : 0;

      return {
        id: doc.id,
        name: doc.data().name,
        thumbnailURL: doc.data().images.thumbnail,
        ...doc.data().overview,
        releaseDate: JSON.parse(JSON.stringify(doc.data().overview.releaseDate)),
        averageRating,
        averageScore
      }
    })
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/home",
        permanent: false
      }
    };
  }

  return {
    props: {
      games
    }
  }
}
