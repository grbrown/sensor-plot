import type { Route } from "./+types/home";
import { useState, useEffect } from "react";

export const DEFAULT_DATA_POINT_MAXIMUM = 100000;

function DataPointMaximum() {
  const [maxPoints, setMaxPoints] = useState<number>(
    DEFAULT_DATA_POINT_MAXIMUM
  );

  // Load max points value from localStorage on component mount
  useEffect(() => {
    const storedMaxPoints = localStorage.getItem("dataPointMaximum");
    if (storedMaxPoints) {
      setMaxPoints(parseFloat(storedMaxPoints));
    }
  }, []);

  const saveMaxPoints = () => {
    localStorage.setItem("dataPointMaximum", maxPoints.toString());
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg mt-4 w-full max-w-md bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">
        Data Point Maximum
      </h2>
      <p className="text-xs text-gray-600 mb-2">
        Beyond this limit, graphs will discard points. Use this to prevent
        crashes. Note: one point represents 10 producer values.
      </p>

      <div className="flex mb-4">
        <input
          type="number"
          value={maxPoints}
          onChange={(e) => setMaxPoints(parseFloat(e.target.value) || 0)}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          min="0"
          step="1000"
        />
        <button
          onClick={saveMaxPoints}
          className="bg-green-500 hover:bg-green-600 text-white ml-2 px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
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

      <DataPointMaximum />
    </div>
  );
}
