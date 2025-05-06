import type { ProducerData } from "~/hooks/useProducer";

const MAXIMUM_POINT_WINDOW = 100;

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

  var indicesToDelete: number[] = [];

  if (producerData[0].length > MAXIMUM_POINT_WINDOW) {
    var currTs = new Date(producerData[0][0].timestamp).getTime();
    const msSpan =
      new Date(
        producerData[0][producerData[0].length - 1].timestamp
      ).getTime() - new Date(producerData[0][0].timestamp).getTime();
    const desiredPointDensity = msSpan / MAXIMUM_POINT_WINDOW;
    producerData[0].forEach((curr, index) => {
      if (index === 0) {
        return;
      }
      if (index >= producerData[0].length) {
        return;
      }

      const nextTs = new Date(curr.timestamp).getTime();

      const timeDelta = Math.abs(nextTs - currTs);
      if (timeDelta < desiredPointDensity) {
        indicesToDelete.push(index);
      } else {
        currTs = nextTs;
      }
    });
  }

  producerData.forEach((curr, index) => {
    if (indicesToDelete.includes(index)) {
      curr.splice(index, 1);
    }
  });

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
