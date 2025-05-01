import { Welcome } from "./welcome";
import { useEffect, useMemo, useState } from "react";
import { useProducer } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import { data } from "react-router";

const dummyPlugin = (): uPlot.Plugin => ({
  hooks: {
    init(u: uPlot, opts: uPlot.Options) {
      void u;
      void opts;
    },
  },
});
export function PlotsThree() {
  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 600,
        height: 600,
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
        scales: { x: { time: true }, y: { auto: false, range: [-100, 100] } },
      }),
      []
    )
  );
  const data = [
    [1746070048.405, 1746070049.406, 1746070050.406],
    [58.046204, 57.848854, 57.390514],
  ];
  return (
    <div>
      <UPlotReact
        key="hooks-key"
        options={options}
        data={data}
        //target={root}
        onDelete={(/* chart: uPlot */) => console.log("Deleted from hooks")}
        onCreate={(/* chart: uPlot */) => console.log("Created from hooks")}
      />
    </div>
  );
}
