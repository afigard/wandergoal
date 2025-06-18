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

        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4CAF50" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
