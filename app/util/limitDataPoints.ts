import { MultiLinePlotData } from "./convertMultiProducerDataToUPlotArrayAndAppend";

/**
 * Limits the number of data points in a multi-line plot dataset.
 *
 * @param data The multi-line plot data to limit
 * @param maximumDataPoints The maximum number of data points to keep
 * @param windowed If true, keeps the latest points (time window mode).
 *                 If false, uses density-based downsampling to maintain data distribution.
 * @returns A new array with the limited data points
 */
export function limitDataPoints(
  data: MultiLinePlotData,
  maximumDataPoints: number,
  windowed: boolean
): MultiLinePlotData {
  if (data[0].length <= maximumDataPoints) {
    return data;
  }

  let newData = [...data];

  if (!windowed) {
    // Density-based downsampling
    const indicesToDelete: Set<number> = new Set();
    const secondsSpan = newData[0][newData[0].length - 1] - newData[0][0];
    const desiredPointDensity = secondsSpan / maximumDataPoints;

    let currTs = newData[0][0];
    newData[0].forEach((curr, index) => {
      if (index === 0) {
        return;
      }
      if (index >= newData[0].length) {
        return;
      }
      const nextTs = curr;

      const timeDelta = Math.abs(nextTs - currTs);
      if (timeDelta < desiredPointDensity) {
        indicesToDelete.add(index);
      } else {
        currTs = nextTs;
      }
    });

    return newData.map((xOrYArray) =>
      xOrYArray.filter((_, index) => !indicesToDelete.has(index))
    );
  } else {
    // Time window mode - keep the most recent points
    return newData.map((xOrYArray) =>
      xOrYArray.slice(Math.max(0, xOrYArray.length - maximumDataPoints))
    );
  }
}
