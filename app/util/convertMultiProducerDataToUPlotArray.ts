import type { ProducerData } from "~/hooks/useProducer";

export type MultiLinePlotData = number[][];

export const convertMultiProducerDataToUPlotArray = (
  producerData: ProducerData[][]
): MultiLinePlotData => {
  let timeError = 0;
  if (producerData.length === 0) {
    return [[], []];
  }
  const canonicalXPoints = producerData[0].map((curr) => {
    const unixTs = new Date(curr.timestamp).getTime() / 1000;
    return unixTs;
  });

  let dataY: number[][] = [];

  for (var i = 0; i < producerData.length; i++) {
    const sensorDataY = producerData[i].map((curr, index) => {
      timeError += Math.abs(
        canonicalXPoints[index] - new Date(curr.timestamp).getTime() / 1000
      );
      return curr["value"];
    });
    dataY.push(sensorDataY);
  }

  console.log("timeError", timeError);
  return [canonicalXPoints, ...dataY] as MultiLinePlotData;
};
