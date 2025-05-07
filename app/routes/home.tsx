import { Plots } from "~/welcome/plots";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useState, useEffect } from "react";

// DataThreshold component demonstrating numeric localStorage
function DataThreshold() {
  const [threshold, setThreshold] = useState<number>(50);
  const [savedThreshold, setSavedThreshold] = useState<number | null>(null);

  // Load threshold from localStorage on component mount
  useEffect(() => {
    const storedThreshold = localStorage.getItem("dataThreshold");
    if (storedThreshold) {
      setSavedThreshold(parseFloat(storedThreshold));
      setThreshold(parseFloat(storedThreshold));
    }
  }, []);

  // Handle saving threshold to localStorage
  const saveThreshold = () => {
    localStorage.setItem("dataThreshold", threshold.toString());
    setSavedThreshold(threshold);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg mt-4 w-full max-w-md bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">
        Data Threshold (Numeric localStorage Demo)
      </h2>

      <div className="flex mb-4">
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value) || 0)}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          min="0"
          max="100"
          step="0.5"
        />
        <button
          onClick={saveThreshold}
          className="bg-green-500 hover:bg-green-600 text-white ml-2 px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      {savedThreshold !== null && (
        <div className="mt-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Retrieved threshold from localStorage:{" "}
            <span className="font-semibold">{savedThreshold}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Access this in other components with:
            <br />
            <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded dark:text-gray-200">
              const threshold = parseFloat(localStorage.getItem("dataThreshold")
              || "50");
            </code>
          </p>
        </div>
      )}
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Multi Sensor Plotting" },
    { name: "description", content: "Graphing options" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <a
        className="text-blue-600 hover:text-blue-800 hover:underline"
        href="/multi-sensor-live"
      >
        Multi Sensor Graph
      </a>
      <p>
        Collect data until datapoint maximum reached, then trim resolution from
        the data set to maintain consistent dataset size
      </p>
      <a
        className="text-blue-600 hover:text-blue-800 hover:underline"
        href="/multi-sensor-live-windowed"
      >
        Multi Sensor Windowed Graph
      </a>
      <p>
        Collect data until datapoint maximum reached, then proceed as constant
        time window
      </p>

      {/* Added localStorage demo components */}
      <DataThreshold />
    </div>
  );
}
