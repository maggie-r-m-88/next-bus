export default function Header() {

    return (
        <div className="flex-shrink-0 bg-white dark:bg-[#111827] px-2 md:px-6 py-4 z-50 touch-none">

            <h1
                className="text-4xl text-black dark:text-zinc-50 text-center flex justify-center tracking-tighter font-bold"
                style={{ fontFamily: "Stack Sans Notch, sans-serif" }}
            >
                EMT Near Me
            </h1>
            <h2 className="text-center tracking-widest text-md" style={{ fontFamily: "Chulapa, sans-serif" }}>Madrid bus arrivals</h2>


        </div>
    );
}
