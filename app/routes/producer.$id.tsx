import React, { useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import uPlot from "uplot";
import UPlotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";

const dummyPlugin = (): uPlot.Plugin => ({
  hooks: {
    init(u: uPlot, opts: uPlot.Options) {
      void u;
      void opts;
    },
  },
});

//const root: HTMLElement = document.querySelector("#graph")!;

export default function Producer({ params }: LoaderFunctionArgs) {
  console.log(params);
  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 400,
        height: 300,
        series: [
          {
            label: "Date",
          },
          {
            label: "",
            points: { show: false },
            stroke: "blue",
            fill: "blue",
          },
        ],
        plugins: [dummyPlugin()],
        scales: { x: { time: false } },
      }),
      []
    )
  );
  const initialState = useMemo<uPlot.AlignedData>(
    () => [
      [...new Array(100000)].map((_, i) => i),
      [...new Array(100000)].map((_, i) => i % 1000),
    ],
    []
  );
  const [data, setData] = useState<uPlot.AlignedData>(initialState);

  //   setTimeout(() => {
  //     const newOptions = {
  //       ...options,
  //       title: "Rendered with hooks"
  //     };
  //     const newData: uPlot.AlignedData = [
  //       [...data[0], data[0].length],
  //       [...data[1], data[0].length % 1000]
  //     ];

  //     unstable_batchedUpdates(() => {
  //       setData(newData);
  //       setOptions(newOptions);
  //     });
  //   }, 100);
  return (
    <UPlotReact
      key="hooks-key"
      options={options}
      data={data}
      //target={root}
      onDelete={(/* chart: uPlot */) => console.log("Deleted from hooks")}
      onCreate={(/* chart: uPlot */) => console.log("Created from hooks")}
    />
  );
  //   return (
  //     <UplotReact
  //       options={options}
  //       data={data}
  //       target={target}
  //       onCreate={(chart) => {}}
  //       onDelete={(chart) => {}}
  //     />
  //   );
}
