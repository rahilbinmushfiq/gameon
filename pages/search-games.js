import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SearchGames() {
  return (
    <main>
      <section>
        <h1 className="text-3xl underline">Search Games</h1>
      </section>
    </main>
  );
}

export async function getServerSideProps() {
  let games;

  try {
    const response = await getDocs(collection(db, "games"));

    games = response.docs.map((doc) => {
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
      games
    }
  }
}
