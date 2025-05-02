import type { ProducerData } from "~/hooks/useProducer";

export type LinePlotData = [number[], number[]];

const b: LinePlotData = [
  [1, 4],
  [2, 3],
];

export const convertProducerDataToUPlotArray = (
  producer1Data: ProducerData[]
): LinePlotData => {
  const dataX = producer1Data.map((curr) => {
    const unixTs = new Date(curr.timestamp).getTime() / 1000;
    return unixTs;
  });
  const dataY = producer1Data.map((curr) => {
    return curr["value"];
  });
  const data: LinePlotData = [dataX, dataY];
  return data;
};
