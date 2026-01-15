import Header from "./components/Header";
import BusFinder from "./components/BusFinder";

export default function Home() {
  return (
    <div className="flex h-screen justify-center overflow-hidden">
     <main className="w-full md:max-w-6xl flex flex-col md:px-6 rounded-lgh-full overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main bus finder component */}
      <BusFinder /> 
      </main>
    </div>
  );
}
