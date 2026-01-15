interface OutOfAreaProps {
    onRetry: () => void;
    isTestMode?: boolean;
}

export default function OutOfArea({ onRetry, isTestMode = false }: OutOfAreaProps) {
    return (
        <div className="w-full h-full md:h-[80vh] flex items-center justify-center bg-gray-300/40 dark:bg-gray-700/40 md:rounded-lg">
            <div className="text-center max-w-full items-center p-12 md:p-6">
                <div className="mb-6">
                    <svg
                        className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                    Out of Service Area
                </h2>
                <p className="text-lg/6 md:text-xl/7 mb-6">
                    No EMT bus stops were found near your location.
                </p>
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-dark-blue)] text-white rounded-lg hover:bg-[#3F425D] transition-colors font-semibold"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
                    </svg>
                    Retry Location
                </button>
            </div>
        </div>
    );
}

