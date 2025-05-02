import { useMemo, useState } from "react";
import { useProducer } from "~/hooks/useProducer";
import UPlotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { convertProducerDataToUPlotArray } from "~/util/convertProducerDataToUPlotArray";
import { useColorScheme } from "~/hooks/useColorScheme";
import { darkColors, lightColors } from "~/constants/colors";
import { convertMultiProducerDataToUPlotArray } from "~/util/convertMultiProducerDataToUPlotArray";

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
  live?: boolean;
};

export function MultiSensorGraph({ live }: SensorGraphProps) {
  const oneToTen = [...Array(10)].map((_, i) => i + 1);
  const colorScheme = useColorScheme();

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
          ...oneToTen.map((i) => ({
            label: "Value" + i,
            points: { show: false },
            stroke: colorScheme ? darkColors[i - 1] : lightColors[i - 1],
          })),
        ],
        plugins: [dummyPlugin()],
        scales: { x: { time: true } },
      }),
      []
    )
  );
  const producer1Data = useProducer("1", live);
  const producer2Data = useProducer("2", live);
  const producer3Data = useProducer("3", live);
  const producer4Data = useProducer("4", live);
  const producer5Data = useProducer("5", live);
  const producer6Data = useProducer("6", live);
  const producer7Data = useProducer("7", live);
  const producer8Data = useProducer("8", live);
  const producer9Data = useProducer("9", live);
  const producer10Data = useProducer("10", live);
  const producersData = [
    producer1Data,
    producer2Data,
    producer3Data,
    producer4Data,
    producer5Data,
    producer6Data,
    producer7Data,
    producer8Data,
    producer9Data,
    producer10Data,
  ];
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

  const data = convertMultiProducerDataToUPlotArray(producersData);

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
