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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    sort: "",
    platform: "",
    releaseDates: {
      "2019": false,
      "2020": false,
      "2021": false,
      "2022": false,
      "2023": false
    }
  });

  useEffect(() => {
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
      <section>
        <div className="space-y-6 py-16 bg-[#2a2a2a]">
          <Search setSearch={setSearch} />
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        {filteredGames.length ? (
          <div className="mx-6 py-16">
            {filteredGames.map((filteredGame, index) => (
              <GameCard key={index} index={index} game={filteredGame} />
            ))}
          </div>
        ) : (
          <div className="space-y-1 py-24 text-center">
            <h3 className="font-bold text-base text-[#a9a9a9]">No Games Found</h3>
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
