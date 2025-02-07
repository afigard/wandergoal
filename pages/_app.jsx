import "../styles/global.css";
import Head from "next/head";

if (typeof window !== "undefined") {
  const existingGuestId = localStorage.getItem("guestId");
  if (!existingGuestId) {
    // Generate a new guest ID between 0 and 1 billion and store it in localStorage
    const newGuestId = Math.floor(Math.random() * 1e9);
    localStorage.setItem("guestId", newGuestId.toString());
  }
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WanderGoal - Your Personalized Travel Planner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
