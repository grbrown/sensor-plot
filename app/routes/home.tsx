import type { Route } from "./+types/home";
import DataPointMaximum from "~/components/DataPointMaximum";

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
      <br></br>
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

      <br></br>
      <DataPointMaximum />
    </div>
  );
}
