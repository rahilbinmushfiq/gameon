import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import GameCard from "../components/searchGames/gameCard";

export default function SearchGames({ gamesData }) {
  const [games, setGames] = useState(gamesData);

  return (
    <main>
      <section>
        {games.map(game => {
          return <GameCard key={game.name} game={game} />
        })}
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
