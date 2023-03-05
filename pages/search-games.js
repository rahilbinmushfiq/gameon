import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { getYear, timestampConversion } from "../utils/convertTimestamp";
import Search from "../components/searchGames/search";
import Filter from "../components/searchGames/filter";
import GameCard from "../components/searchGames/gameCard";

export default function SearchGames({ gamesData }) {
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

  const games = gamesData.filter(gameData => {
    return gameData.name.toLowerCase().includes(search.toLowerCase())
      && (filter.platform === '' || gameData.platforms.some(platform => platform.toLowerCase().includes(filter.platform)))
      && (filter.releaseDates[getYear(gameData.releaseDate)] || Object.values(filter.releaseDates).every(val => val === false));
  }).sort((a, b) => {
    if (filter.sort === 'releaseDate') {
      return timestampConversion(b.releaseDate) - timestampConversion(a.releaseDate);
    } else if (filter.sort === 'topRated') {
      return b.averageRating - a.averageRating;
    } else if (filter.sort === 'topScored') {
      return b.averageScore - a.averageScore;
    } else {
      return 0;
    }
  });

  return (
    <main>
      <section>
        <Search setSearch={setSearch} />
        <Filter filter={filter} setFilter={setFilter} />
        {
          games.map(game => (
            <GameCard key={game.name} game={game} />
          ))
        }
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  let gamesData;

  try {
    const response = await getDocs(collection(db, "games"));

    gamesData = response.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        thumbnailURL: doc.data().images.thumbnail,
        ...doc.data().overview,
        releaseDate: JSON.parse(JSON.stringify(doc.data().overview.releaseDate)),
        averageRating: doc.data().reviews?.ratings?.averageRating || null,
        averageScore: doc.data().reviews?.scores?.averageScore || null
      }
    })
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      gamesData
    }
  }
}
