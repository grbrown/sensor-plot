import { Welcome } from "./welcome";
import { useEffect, useMemo, useState } from "react";
import { useProducer } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import { data } from "react-router";
import "uplot/dist/uPlot.min.css";

export function PlotsThree() {
  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 300,
        height: 400,
        series: [
          {
            label: "Date",
          },
          {
            label: "Sensor",
            points: { show: true }, // Show points for better hover interaction
            stroke: "blue",
            fill: "rgba(0, 0, 255, 0.1)", // Semi-transparent fill
            width: 2, // Line width
          },
        ],
      }),
      []
    )
  );

  const initialState = useMemo<uPlot.AlignedData>(
    () => [
      [1, 2, 3],
      [58.046204, 57.848854, 57.390514],
    ],
    []
  );
  const [data, setData] = useState<uPlot.AlignedData>(initialState);

  return (
    <div>
      <UPlotReact
        key="hooks-key2"
        options={options}
        data={data}
        //target={root}
        onDelete={(/* chart: uPlot */) => console.log("Deleted from hooks")}
        onCreate={(/* chart: uPlot */) => console.log("Created from hooks")}
      />
    </div>
  );
}
