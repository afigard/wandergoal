import "../styles/global.css";
import Head from "next/head";
import { Geist } from "next/font/google";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";

const geist = Geist({ subsets: ["latin"] });

if (typeof window !== "undefined") {
  const existingGuestId = localStorage.getItem("guestId");
  if (!existingGuestId) {
    const newGuestId = Math.floor(Math.random() * 1e9);
    localStorage.setItem("guestId", newGuestId.toString());
  }
}

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  if (dark === null) return null;

  return (
    <main className={geist.className}>
      <Head>
        <title>WanderGoal – Your Personalized Travel Planner</title>
        <meta
          name="description"
          content="Plan and track your travel goals with a personalized, interactive planner built for globetrotters and dreamers."
        />
        <meta
          name="keywords"
          content="travel planner, wanderlust, travel goals, trip planning, WanderGoal"
        />
        <meta name="author" content="Adrien Figard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#4CAF50" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>

      <Header dark={dark} toggleDark={toggleDark} />
      <Component {...pageProps} dark={dark} toggleDark={toggleDark} />
      <Footer dark={dark} toggleDark={toggleDark} />
    </main>
  );
}
