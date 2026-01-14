import Header from "./components/Header";
import BusFinder from "./components/BusFinder";

export default function Home() {
  return (
    <div className="flex h-screen justify-center bg-zinc-50 dark:bg-black overflow-hidden">
     <main className="w-full md:max-w-6xl flex flex-col md:px-6 bg-white dark:bg-black rounded-lg shadow-lg h-full overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main bus finder component */}
        <BusFinder />
      </main>
    </div>
  );
}
