import type { ProducerData } from "~/graphing/multi-sensor-graph";

export type MultiLinePlotData = number[][];

export const convertMultiProducerDataToUPlotArrayAndAppend = (
  producerData: ProducerData[][],
  currData: MultiLinePlotData
): MultiLinePlotData => {
  let totalTimeError = 0;
  if (producerData.find((arr) => arr.length === 0)) {
    const ret = [[]];
    for (var i = 0; i < producerData.length; i++) {
      ret.push([]);
    }
    return ret;
  }
  const canonicalXPoints = producerData[0].map((curr) => {
    const unixTs = new Date(curr.timestamp).getTime() / 1000;
    return unixTs;
  });

  let dataY: number[][] = [];

  for (var i = 0; i < producerData.length; i++) {
    const sensorDataY = producerData[i].map((curr, index) => {
      totalTimeError += Math.abs(
        canonicalXPoints[index] - new Date(curr.timestamp).getTime() / 1000
      );
      return curr["value"];
    });
    dataY.push(sensorDataY);
  }

  const newPoints = [canonicalXPoints, ...dataY] as MultiLinePlotData;

  const ret = currData.map((curr, index) => {
    return [...curr, ...newPoints[index]];
  }) as MultiLinePlotData;

  return ret;
};
