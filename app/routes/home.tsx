import { Plots } from "~/welcome/plots";
import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
    </div>
  );
}
