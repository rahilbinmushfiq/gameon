import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaUserTie, FaCommentDots, FaArrowRight } from "react-icons/fa";
import { IoStopwatchSharp, IoGameController } from "react-icons/io5";
import hero from "../public/hero.jpg";

export default function Home() {
  const socialProofs = {
    "12K+": "Games",
    "20K+": "Users",
    "10K+": "Reviews"
  };

  return (
    <main>
      <Head>
        <title>Game On</title>
      </Head>
      <section className="min-h-[calc(100vh_-_3.5rem)] flex flex-col">
        <div className="relative flex-grow bg-[#e30e30]/[.8]">
          <Image
            className="object-cover mix-blend-hard-light"
            src={hero}
            alt="hero-image"
            fill
          />
          <div className="absolute inset-0 h-full">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1f1f1f]" />
          </div>
        </div>
        <div className="px-6 py-16 space-y-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-[3rem] after:content-none m-0">
              Get the <span className="text-[#e30e30] font-bold">Ultimate</span> Gaming Experience
            </h1>
            <p className="leading-6">
              Whether you're a seasoned gamer or a newcomer to the scene, we've got you covered. We'll always make sure that you'll know what to expect before making your next game purchase.
            </p>
          </div>
          <div className="flex gap-6 [&>*>button]:font-bold [&>*>button]:w-32 [&>*>button]:h-12">
            <Link href="/search-games">
              <button className="primary-btn primary-btn--hover">
                Explore
              </button>
            </Link>
            <Link href="/signin">
              <button className="border border-[#f1f1f1] text-[#f1f1f1] hover:text-[#1f1f1f] hover:bg-[#f1f1f1]">
                Join us
              </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="px-6 py-32 space-y-16 bg-[#2a2a2a] [&>div]:flex [&>div]:justify-between [&>div>div]:card-container">
        <div>
          <div>
            <IoStopwatchSharp size={30} color="#e30e30" />
            <h3>Time Saver</h3>
            <p>Save time and find the best games with ease by using our efficient filtering tools.</p>
          </div>
          <div>
            <FaUserTie size={30} color="#e30e30" />
            <h3>Expert Analysis</h3>
            <p>Get the in-depth analysis of each game from expert critics before you buy any game.</p>
          </div>
        </div>
        <div>
          <div>
            <FaCommentDots size={30} color="#e30e30" />
            <h3>User Feedbacks</h3>
            <p>Our user feedbacks section offers insights from real gamers to help you choose the right game.</p>
          </div>
          <div>
            <IoGameController size={30} color="#e30e30" />
            <h3>Diverse Games</h3>
            <p>Brwose through the diverse range of games to suit all interests and preferences.</p>
          </div>
        </div>
      </section>
      <section className="px-6 py-32 space-y-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            Join Our Community
          </h2>
          <p className="leading-6">
            Join our platform for free and take your gaming experience to the next level. It's time you become part of the most vibrant gaming community on the web. Share your opinions, connect with other gamers, and discover new titles to play.
          </p>
        </div>
        <div className="inline-block">
          <Link href="/signin">
            <button className="primary-btn primary-btn--hover w-40 h-12">
              <p>Join for free</p>
              <FaArrowRight size={14} color="#f1f1f1" />
            </button>
          </Link>
        </div>
        <div className="flex gap-12">
          {Object.entries(socialProofs).map(([number, topic]) => (
            <div key={number}>
              <h4 className="text-2xl">{number}</h4>
              <p>{topic}</p>
            </div>
          ))}
        </div>
      </section>
    </main >
  );
}
