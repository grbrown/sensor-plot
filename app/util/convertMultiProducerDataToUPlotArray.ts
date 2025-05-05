import type { ProducerData } from "~/hooks/useProducer";

export type MultiLinePlotData = number[][];

export const convertMultiProducerDataToUPlotArray = (
  producerData: ProducerData[][]
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

  for (var i = 0; i < producerData.length; i++) {
    const graphLen = canonicalXPoints.length;
    const curr = producerData[i][graphLen - 1];
    if (curr === undefined) {
      break;
    }
    const currCanonicalTs = canonicalXPoints[graphLen - 1];
    const currTs = new Date(curr.timestamp).getTime() / 1000;
    const currTsError = currTs - currCanonicalTs;
    console.log(`sensor ${i + 1} ts error `, currTsError);
  }

  console.log("totalTimeError", totalTimeError);
  return [canonicalXPoints, ...dataY] as MultiLinePlotData;
};
