import {
  convertMultiProducerDataToUPlotArrayAndAppend,
  MultiLinePlotData,
} from "../convertMultiProducerDataToUPlotArrayAndAppend";
import type { ProducerData } from "~/graphing/multi-sensor-graph";

describe("convertMultiProducerDataToUPlotArrayAndAppend", () => {
  beforeEach(() => {
    // Mock Date to ensure consistent timestamp conversion
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-01-01"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should return empty arrays when producer data contains an empty array", () => {
    const producerData: ProducerData[][] = [[], []];
    const currData: MultiLinePlotData = [[], []];

    const result = convertMultiProducerDataToUPlotArrayAndAppend(
      producerData,
      currData
    );

    expect(result).toEqual([[], [], []]);
  });

  test("should convert producer data to uPlot format and append to existing data", () => {
    const timestamp1 = "2023-01-01T10:00:00Z";
    const timestamp2 = "2023-01-01T10:01:00Z";

    const producerData: ProducerData[][] = [
      [
        { timestamp: timestamp1, value: 10 },
        { timestamp: timestamp2, value: 15 },
      ],
      [
        { timestamp: timestamp1, value: 20 },
        { timestamp: timestamp2, value: 25 },
      ],
    ];

    const currData: MultiLinePlotData = [
      [1672527600], // 2023-01-01T09:00:00Z in seconds
      [5],
      [15],
    ];

    const result = convertMultiProducerDataToUPlotArrayAndAppend(
      producerData,
      currData
    );

    // Calculate expected timestamps in seconds
    const time1 = new Date(timestamp1).getTime() / 1000;
    const time2 = new Date(timestamp2).getTime() / 1000;

    expect(result).toEqual([
      [1672527600, time1, time2],
      [5, 10, 15],
      [15, 20, 25],
    ]);
  });

  test("should handle multiple data points correctly", () => {
    const timestamps = [
      "2023-01-01T10:00:00Z",
      "2023-01-01T10:01:00Z",
      "2023-01-01T10:02:00Z",
    ];

    const producerData: ProducerData[][] = [
      [
        { timestamp: timestamps[0], value: 10 },
        { timestamp: timestamps[1], value: 15 },
        { timestamp: timestamps[2], value: 20 },
      ],
      [
        { timestamp: timestamps[0], value: 30 },
        { timestamp: timestamps[1], value: 35 },
        { timestamp: timestamps[2], value: 40 },
      ],
      [
        { timestamp: timestamps[0], value: 50 },
        { timestamp: timestamps[1], value: 55 },
        { timestamp: timestamps[2], value: 60 },
      ],
    ];

    const currData: MultiLinePlotData = [[], [], [], []];

    const result = convertMultiProducerDataToUPlotArrayAndAppend(
      producerData,
      currData
    );

    // Calculate expected timestamps in seconds
    const times = timestamps.map((ts) => new Date(ts).getTime() / 1000);

    expect(result).toEqual([
      [...times],
      [10, 15, 20],
      [30, 35, 40],
      [50, 55, 60],
    ]);
  });

  test("should append new data to existing data correctly", () => {
    const timestamp = "2023-01-01T10:00:00Z";

    const producerData: ProducerData[][] = [
      [{ timestamp, value: 10 }],
      [{ timestamp, value: 20 }],
    ];

    const existingTime = 1672527600; // 2023-01-01T09:00:00Z in seconds
    const currData: MultiLinePlotData = [[existingTime], [5], [15]];

    const result = convertMultiProducerDataToUPlotArrayAndAppend(
      producerData,
      currData
    );

    const newTime = new Date(timestamp).getTime() / 1000;

    expect(result).toEqual([
      [existingTime, newTime],
      [5, 10],
      [15, 20],
    ]);
  });
});
