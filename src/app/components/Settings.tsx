"use client";

import { useState, useEffect } from "react";


interface SettingsProps {
    radiusMeters: number;
    onApply: (newRadius: number) => void;
}

export default function Settings({ radiusMeters, onApply }: SettingsProps) {
    const [tempRadius, setTempRadius] = useState(radiusMeters);
    const [showButtons, setShowButtons] = useState(false);

    // Update tempRadius when radiusMeters prop changes
    useEffect(() => {
        setTempRadius(radiusMeters);
        setShowButtons(false);
    }, [radiusMeters]);

    const handleSliderChange = (value: number) => {
        setTempRadius(value);
        setShowButtons(true);
    };

    const handleApply = () => {
        onApply(tempRadius);
        setShowButtons(false);
    };

    const handleReset = () => {
        setTempRadius(radiusMeters);
        setShowButtons(false);
    };

    const links = [
        {
            label: "EMT Madrid Mobility Labs API",
            href: "https://mobilitylabs.emtmadrid.es/",
        },
        {
            label: "Developer Website",
            href: "https://maggie-martin.com",
        },
        {
            label: "Source Code",
            href: "https://github.com/maggie-r-m-88/next-bus",
        },
    ];

    return (

        <section>
            <div className="w-full flex justify-center">
                <div className="w-full">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 py-6 text-center">
                        Settings
                    </h2>

                    <div className="bg-[#ecf1f7]/70 dark:bg-[#020024]/70 md:rounded-lg p-8">
                        {/* Search Radius */}
                        <div>
                            {/* Slider Label + Value Row */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Search Radius
                                    </label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 pr-8 md:pr-0">
                                        Find bus stops within this distance from your location
                                    </p>
                                </div>

                                {/* Slider Value */}
                                <div className="text-right">
                                    <span className="text-xl font-bold text-[var(--brand-blue)]">
                                        {tempRadius}m
                                    </span>

                                </div>
                            </div>
                            {/* Slider */}
                            <div className="mb-8">
                                <input
                                    type="range"
                                    min="50"
                                    max="1000"
                                    step="50"
                                    value={tempRadius}
                                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                                    className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    <span>50m</span>
                                    <span>500m</span>
                                    <span>1000m</span>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            {showButtons && (
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-semibold"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="px-6 py-3 bg-[var(--brand-dark-blue)] text-white rounded-lg hover:bg-[#3F425D] transition-colors font-semibold"
                                    >
                                        Apply Changes
                                    </button>
                                </div>
                            )}

                        </div>

                        <div className="border-t border-gray-300 pt-16 mt-16 flex items-center gap-2">
                            {/* Info Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                                <circle cx="12" cy="8" r=".5" fill="currentColor" />
                            </svg>

                            {/* Label */}
                            <p className="text-base/7 font-semibold text-gray-700 dark:text-gray-300">
                                About this App
                            </p>

                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-500 pb-4">
                                Real-time Madrid bus arrival information powered by EMT Madrid's open data API.
                            </p>

                            {links.map((link) => (
                                <p key={link.href} className="text-sm text-gray-500 flex items-center gap-2">
                                    {/* Share/External Link SVG */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3 h-3 text-[var(--brand-dark-blue)] dark:text-[var(--brand-blue)] flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6m0-6L10 14"
                                        />
                                    </svg>

                                    {/* Link */}
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--brand-dark-blue)] dark:text-[var(--brand-blue)] hover:underline"
                                    >
                                        {link.label}
                                    </a>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>


                <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: var(--brand-blue);
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    background: var(--brand-blue);
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .slider::-webkit-slider-thumb:hover {
                    background: var(--brand-dark-blue);
                }

                .slider::-moz-range-thumb:hover {
                    background: var(--brand-dark-blue);
                }
            `}</style>
            </div>

        </section>

    );
}

