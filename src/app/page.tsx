import Header from "./components/Header";
import BusFinder from "./components/BusFinder";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full md:max-w-6xl flex flex-col py-8 md:px-6 bg-white dark:bg-black rounded-lg shadow-lg">
        {/* Header */}
        <Header />


        {/* Main bus finder component */}
        <BusFinder />
      </main>
    </div>
  );
}
