import type { ProducerData } from "~/graphing/multi-sensor-graph";

export type MultiLinePlotData = number[][];

/**
 * Converts producer data to uPlot array format and appends it to the existing graph data.
 * @param producerData
 * @param currData
 * @returns new graph data
 */
export const convertMultiProducerDataToUPlotArrayAndAppend = (
  producerData: ProducerData[][],
  currData: MultiLinePlotData
): MultiLinePlotData => {
  if (producerData.find((arr) => arr.length === 0)) {
    const ret = [[]];
    for (var i = 0; i < producerData.length; i++) {
      ret.push([]);
    }
    return ret;
  }
  const canonicalXPoints = producerData[0].map((curr) => {
    // convert ms to seconds for uPlot
    const unixTs = new Date(curr.timestamp).getTime() / 1000;
    return unixTs;
  });

  let dataY: number[][] = [];

  for (var i = 0; i < producerData.length; i++) {
    const sensorDataY = producerData[i].map((curr) => {
      return curr["value"];
    });
    dataY.push(sensorDataY);
  }

  // convert to uPlot 2d array format with x values as first row
  const newPoints = [canonicalXPoints, ...dataY] as MultiLinePlotData;

  // append to existing graph data
  const ret = currData.map((curr, index) => {
    return [...curr, ...newPoints[index]];
  }) as MultiLinePlotData;

  return ret;
};
