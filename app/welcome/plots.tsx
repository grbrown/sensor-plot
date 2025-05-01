import { Welcome } from "../welcome/welcome";
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
export function Plots() {
  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title: "Chart",
        width: 400,
        height: 300,
        series: [
          {
            label: "Time",
          },
          {
            label: "Value",
            points: { show: true },
            stroke: "blue",
            fill: "blue",
          },
        ],
        plugins: [dummyPlugin()],
        scales: { x: { time: true } },
      }),
      []
    )
  );
  const producer1Data = useProducer("1");
  // useProducer("2");
  // useProducer("3");
  // useProducer("4");
  // if (producer1Data !== undefined) {
  //   debugger;
  // }

  if (producer1Data === undefined) {
    return <div>loading...</div>;
  }

  const dataX = producer1Data?.reduce((acc, curr) => {
    const unixTs = new Date(curr["timestamp"]).getTime() / 1000;
    acc.push(unixTs);
    return acc;
  }, []);
  const dataY = producer1Data?.reduce((acc, curr) => {
    acc.push(curr["value"]);
    return acc;
  }, []);
  const data = [dataX, dataY];
  console.log(data);
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
}
