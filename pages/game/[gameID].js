import Overview from "../../components/game/overview";
import CriticReviews from "../../components/game/criticReviews";
import UserReviews from "../../components/game/userReviews";
import SystemRequirements from "../../components/game/systemRequirements";

import { useState } from "react";

export default function GameDetails() {
  const [tab, setTab] = useState("overview");

  return (
    <main>
      <section>
        <h1 className="text-3xl underline">Game Details</h1>
        <div className="flex gap-3">
          <button onClick={() => setTab("overview")} className="text-white bg-blue-400">Overview</button>
          <button onClick={() => setTab("criticReviews")} className="text-white bg-blue-400">Critic Reviews</button>
          <button onClick={() => setTab("userReviews")} className="text-white bg-blue-400">User Reviews</button>
          <button onClick={() => setTab("systemRequirements")} className="text-white bg-blue-400">System Requirements</button>
        </div>
        {tab === 'overview' && <Overview />}
        {tab === 'criticReviews' && <CriticReviews />}
        {tab === 'userReviews' && <UserReviews />}
        {tab === 'systemRequirements' && <SystemRequirements />}
      </section>
    </main>
  );
}
