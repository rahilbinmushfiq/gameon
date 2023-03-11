import Image from "next/image";
import hero from "../public/hero.jpg";
import { IoStopwatchSharp, IoGameController } from "react-icons/io5";
import { FaUserTie, FaCommentDots, FaArrowRight } from "react-icons/fa";

export default function Home() {
  const socialProofs = {
    "12K+": "Games",
    "20K+": "Users",
    "10K+": "Reviews"
  };

  return (
    <main>
      <section className="min-h-[calc(100vh_-_3.5rem)] flex flex-col">
        <div className="relative max-w-screen flex-grow bg-[#e30e30]/[.8]">
          <Image
            className="object-cover mix-blend-hard-light"
            src={hero}
            alt="hero-image"
            fill
            sizes="640px"
          />
          <div className="absolute h-full inset-0">
            <div className="h-1/2 bg-gradient-to-b from-[#1f1f1f] via-transparent to-transparent" />
            <div className="h-1/2 bg-gradient-to-b from-transparent via-transparent to-[#1f1f1f]" />
          </div>
        </div>
        <div className="max-w-screen px-6 py-16 space-y-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-[3rem]">
              Get the <span className="text-[#e30e30] font-bold">Ultimate</span> Gaming Experience
            </h1>
            <p className="text-[#a9a9a9] leading-6">
              Whether you're a seasoned gamer or a newcomer to the scene, we've got you covered. We'll always make sure that you'll know what to expect before making your next game purchase.
            </p>
          </div>
          <div className="flex gap-6">
            <button className="w-32 h-12 rounded-sm font-bold text-[#f1f1f1] bg-[#e30e30] hover:bg-[#f1f1f1] hover:text-[#e30e30]">
              Explore
            </button>
            <button className="w-32 h-12 rounded-sm font-bold border border-[#f1f1f1] hover:bg-[#f1f1f1] hover:text-[#1f1f1f]">
              Join us
            </button>
          </div>
        </div>
      </section>
      <section className="max-w-screen px-6 py-16 space-y-14 bg-[#2a2a2a]">
        <div className="flex justify-between">
          <div className="home--card">
            <IoStopwatchSharp size={30} color="#e30e30" />
            <h3 className="text-base font-semibold pt-2">Time Saver</h3>
            <p className="text-[#a9a9a9]">Save time and find the best games with ease by using our efficient filtering tools.</p>
          </div>
          <div className="home--card">
            <FaUserTie size={30} color="#e30e30" />
            <h3 className="text-base font-semibold pt-2">Expert Analysis</h3>
            <p className="text-[#a9a9a9]">Get the in-depth analysis of each game from expert critics before you buy any game.</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="home--card">
            <FaCommentDots size={30} color="#e30e30" />
            <h3 className="text-base font-semibold pt-2">User Feedbacks</h3>
            <p className="text-[#a9a9a9]">Our user feedbacks section offers insights from real gamers to help you choose the right game.</p>
          </div>
          <div className="home--card">
            <IoGameController size={30} color="#e30e30" />
            <h3 className="text-base font-semibold pt-2">Diverse Games</h3>
            <p className="text-[#a9a9a9]">Brwose through the diverse range of games to suit all interests and preferences.</p>
          </div>
        </div>
      </section>
      <section className="max-w-screen px-6 py-16 space-y-2">
        <div className="space-y-12">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-10">
              Join Our Community
            </h1>
            <p className="text-[#a9a9a9] leading-6">
              Join our platform for free and take your gaming experience to the next level. It's time you become part of the most vibrant gaming community on the web. Share your opinions, connect with other gamers, and discover new titles to play.
            </p>
          </div>
          <button className="flex justify-center items-center gap-2 w-40 h-12 rounded-sm bg-[#e30e30] hover:bg-[#f1f1f1] [&>*]:hover:text-[#e30e30] [&>*]:hover:fill-[#e30e30]">
            <p className="font-bold text-[#f1f1f1]">Join for free</p>
            <FaArrowRight size={14} color="#f1f1f1" />
          </button>
          <div className="flex gap-12">
            {Object.entries(socialProofs).map(([number, topic]) => (
              <div key={number}>
                <h4 className="text-2xl">{number}</h4>
                <p className="text-[#a9a9a9]">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main >
  );
}
