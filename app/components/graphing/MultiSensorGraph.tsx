import { useEffect, useMemo, useRef, useState } from "react";
import "uplot/dist/uPlot.min.css";
import { AutoResizeUPlotReact } from "~/components/graphing/AutoResizeUPlotReact";
import { convertMultiProducerDataToUPlotArrayAndAppend } from "~/util/convertMultiProducerDataToUPlotArrayAndAppend";
import { limitDataPoints } from "~/util/limitDataPoints";
import { DEFAULT_DATA_POINT_MAXIMUM } from "~/components/DataPointMaximum";
import { type ProducerData } from "~/types/producerData";
import { MultiLinePlotData } from "~/types/graphing";
import { useProducerWebSocketConnectionBuffer } from "~/hooks/useProducerWebSocketConnectionBuffer";
import { GraphStatisticsTable } from "~/components/graphing/GraphStatisticsTable";
import { useUPlotOptions } from "~/hooks/useUPlotOptions";

const getGraphTitle = (windowed: boolean, maximumDataPointValue: number) => {
  if (windowed) {
    return (
      "Multi Sensor Graph, Time Windowed - Maximum Data Points: " +
      maximumDataPointValue
    );
  } else {
    return "Multi Sensor Graph - Maximum Data Points: " + maximumDataPointValue;
  }
};

export type MultiSensorGraphProps = {
  windowed?: boolean;
};
/**
 * Graph which connects to 10 producers and displays their data in a multi-line format.
 * Self limits datapoint count via `dataPointMaximum` localStorage value.
 * @param windowed - If true, the graph will display a time window of data points.
 */
export function MultiSensorGraph({ windowed = false }: MultiSensorGraphProps) {
  // Main graph data, initialized to 11 empty arrays, 10 data arrays for values and 1 time array for x-axis
  const [graphData, setGraphData] = useState<MultiLinePlotData>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  // Retrieve maximum data points setting
  const maximumDataPointsRef = useRef(DEFAULT_DATA_POINT_MAXIMUM);
  useEffect(() => {
    const storedMaxPoints = localStorage.getItem("dataPointMaximum");
    if (storedMaxPoints) {
      maximumDataPointsRef.current = parseFloat(storedMaxPoints);
      setOptions((prev) => ({
        ...prev,
        title: getGraphTitle(windowed, maximumDataPointsRef.current),
      }));
    }
  }, []);
  // To force reset zoom state
  const needsZoomReset = useRef(false);

  // Store the current scale state (x axis zoom level)
  const scaleStateRef = useRef<{ min: number; max: number } | null>(null);

  // Get graph options from custom hook
  const { options, setOptions } = useUPlotOptions({
    title: getGraphTitle(windowed, maximumDataPointsRef.current),
    windowed,
    needsZoomReset,
    scaleStateRef,
  });

  // Producer data buffers
  const producer1DataBufferRef = useRef<ProducerData[]>([]);
  const producer2DataBufferRef = useRef<ProducerData[]>([]);
  const producer3DataBufferRef = useRef<ProducerData[]>([]);
  const producer4DataBufferRef = useRef<ProducerData[]>([]);
  const producer5DataBufferRef = useRef<ProducerData[]>([]);
  const producer6DataBufferRef = useRef<ProducerData[]>([]);
  const producer7DataBufferRef = useRef<ProducerData[]>([]);
  const producer8DataBufferRef = useRef<ProducerData[]>([]);
  const producer9DataBufferRef = useRef<ProducerData[]>([]);
  const producer10DataBufferRef = useRef<ProducerData[]>([]);

  // Create WebSocket connections for each producer

  // First producer is responsible for updating the graph, the rest just update their buffers
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/producer/1`);

    socket.onmessage = (event) => {
      const dataArray = JSON.parse(event.data);
      producer1DataBufferRef.current = [
        ...producer1DataBufferRef.current,
        ...dataArray,
      ];
      const producersData = [
        producer1DataBufferRef.current,
        producer2DataBufferRef.current,
        producer3DataBufferRef.current,
        producer4DataBufferRef.current,
        producer5DataBufferRef.current,
        producer6DataBufferRef.current,
        producer7DataBufferRef.current,
        producer8DataBufferRef.current,
        producer9DataBufferRef.current,
        producer10DataBufferRef.current,
      ];

      // Check if all buffers have data
      if (!producersData.find((pd) => pd.length === 0)) {
        //Find the least full buffer, extract that many points from each buffer
        const bufferMinLength = Math.min(
          ...producersData.map((pd) => pd.length)
        );
        const bufferData: ProducerData[][] = [];
        producersData.forEach((pd) => {
          bufferData.push(pd.splice(0, bufferMinLength));
        });

        //update graph with buffer points
        setGraphData((curr) => {
          var newData = convertMultiProducerDataToUPlotArrayAndAppend(
            bufferData,
            curr
          );

          newData = limitDataPoints(
            newData,
            maximumDataPointsRef.current,
            windowed
          );

          return newData;
        });
      }
    };
  }, []);

  // Create WebSocket connections for each producer, these only update their buffers
  useProducerWebSocketConnectionBuffer("2", producer2DataBufferRef);
  useProducerWebSocketConnectionBuffer("3", producer3DataBufferRef);
  useProducerWebSocketConnectionBuffer("4", producer4DataBufferRef);
  useProducerWebSocketConnectionBuffer("5", producer5DataBufferRef);
  useProducerWebSocketConnectionBuffer("6", producer6DataBufferRef);
  useProducerWebSocketConnectionBuffer("7", producer7DataBufferRef);
  useProducerWebSocketConnectionBuffer("8", producer8DataBufferRef);
  useProducerWebSocketConnectionBuffer("9", producer9DataBufferRef);
  useProducerWebSocketConnectionBuffer("10", producer10DataBufferRef);

  const zoomEnabled = scaleStateRef.current !== null;
  const zoomedData = (() => {
    if (needsZoomReset.current) {
      return graphData;
    }
    if (!zoomEnabled) {
      return null;
    }
    const xScaleMin = scaleStateRef.current!.min;
    const xScaleMax = scaleStateRef.current!.max;
    const startPointIndex = graphData[0].findIndex((x) => x >= xScaleMin);
    const endPointIndex = graphData[0].findIndex((x) => x >= xScaleMax);
    const zoomedData = graphData.map((arr) =>
      arr.slice(startPointIndex, endPointIndex)
    );
    return zoomedData;
  })();

  const plotData = zoomedData ?? graphData;

  // Derived statistical data from zoomed plot
  const averages = zoomedData?.slice(1).map((arr) => {
    return arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
  });
  const maximums = zoomedData?.slice(1).map((arr) => {
    return Math.max(...arr);
  });
  const minimums = zoomedData?.slice(1).map((arr) => {
    return Math.min(...arr);
  });

  // Override 100% graph width temporarily to allow statistics table to be displayed
  useEffect(() => {
    if (zoomEnabled === true) {
      setOptions((prev) => ({
        ...prev,
        width: prev.width - 300,
      }));
    }
  }, [zoomEnabled]);

  return (
    <div className="w-full flex flex-row flex-nowrap">
      <AutoResizeUPlotReact
        key="hooks-key"
        setOptions={setOptions}
        options={options}
        data={plotData as uPlot.AlignedData}
      />
      {zoomEnabled && (
        <div className="w-[300px] p-2 border-l border-gray-300 dark:border-gray-700 flex flex-col justify-center">
          <button
            onClick={() => {
              //force reset zoom state, close statistics table
              needsZoomReset.current = true;
              setOptions((prev) => ({
                ...prev,
                width: prev.width + 300,
              }));
            }}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2 w-full text-sm"
          >
            Reset zoom
          </button>
          <GraphStatisticsTable
            minimums={minimums}
            maximums={maximums}
            averages={averages}
            producerCount={10}
          />
        </div>
      )}
    </div>
  );
}
