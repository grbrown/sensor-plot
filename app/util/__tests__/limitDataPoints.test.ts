import { limitDataPoints } from "../limitDataPoints";
import { MultiLinePlotData } from "../convertMultiProducerDataToUPlotArrayAndAppend";

describe("limitDataPoints", () => {
  // Create test data with 100 points
  const createTestData = (): MultiLinePlotData => {
    const xValues = Array.from({ length: 100 }, (_, i) => i * 10); // 0, 10, 20, ..., 990
    const y1Values = Array.from({ length: 100 }, (_, i) => i * 2); // 0, 2, 4, ..., 198
    const y2Values = Array.from({ length: 100 }, (_, i) => i * 3); // 0, 3, 6, ..., 297

    return [xValues, y1Values, y2Values];
  };

  it("returns the original data if it is below the maximum data points", () => {
    const testData = createTestData();
    const result = limitDataPoints(testData, 200, false);

    expect(result).toEqual(testData);
  });

  it("limits data points using windowed mode", () => {
    const testData = createTestData();
    const maxPoints = 50;
    const result = limitDataPoints(testData, maxPoints, true);

    // Should get the last 50 points from each array
    expect(result[0].length).toBe(maxPoints);
    expect(result[1].length).toBe(maxPoints);
    expect(result[2].length).toBe(maxPoints);

    // Check that we got the last 50 points
    expect(result[0][0]).toBe(testData[0][50]); // First point should be the 51st point in original data
    expect(result[0][49]).toBe(testData[0][99]); // Last point should be the last point in original data
  });

  it("limits data points using density-based downsampling", () => {
    const testData = createTestData();
    const maxPoints = 20;
    const result = limitDataPoints(testData, maxPoints, false);

    // Should reduce the number of points but keep beginning and end points
    expect(result[0].length).toBeLessThan(testData[0].length);
    expect(result[0][0]).toBe(testData[0][0]); // First point should be preserved
  });

  it("maintains equal length across all arrays in the dataset", () => {
    const testData = createTestData();
    const result = limitDataPoints(testData, 30, false);

    const lengths = result.map((array) => array.length);
    const allSameLength = lengths.every((length) => length === lengths[0]);

    expect(allSameLength).toBe(true);
  });
});
