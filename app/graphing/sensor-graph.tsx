import { useMemo, useState } from "react";
import { useProducer } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { convertProducerDataToUPlotArray } from "~/util/convertProducerDataToUPlotArray";
import { useColorScheme } from "~/hooks/useColorScheme";
import { darkColors, lightColors } from "~/constants/colors";

const loadStartTime = performance.now();

const dummyPlugin = (): uPlot.Plugin => ({
  hooks: {
    init(u: uPlot, opts: uPlot.Options) {
      void u;
      void opts;
    },
  },
});

export type SensorGraphProps = {
  sensorNum: number;
};

export function SensorGraph({ sensorNum }: SensorGraphProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme
    ? darkColors[sensorNum - 1]
    : lightColors[sensorNum - 1];
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
            points: { show: false },
            stroke: color,
          },
        ],
        plugins: [dummyPlugin()],
        scales: { x: { time: true } },
      }),
      []
    )
  );
  const producer1Data = useProducer(String(sensorNum), true);
  // useProducer("2");
  // useProducer("3");
  // useProducer("4");
  // if (producer1Data !== undefined) {
  //   debugger;
  // }

  console.log("datapointCount", producer1Data.length);
  const dataSamplingTime = performance.now();
  console.log(
    "DataSamplingRateAvg",
    (1000 * producer1Data.length) / (dataSamplingTime - loadStartTime)
  );

  const data = convertProducerDataToUPlotArray(producer1Data);

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
