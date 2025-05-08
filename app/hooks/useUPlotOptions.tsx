import { useState, useMemo } from "react";
import { useIsDarkMode } from "./useIsDarkMode";
import { darkColors, lightColors } from "~/constants/graphLineColors";

interface UseUPlotOptionsProps {
  title: string;
  windowed?: boolean;
  needsZoomReset: React.RefObject<boolean>;
  scaleStateRef: React.RefObject<{ min: number; max: number } | null>;
}

export function useUPlotOptions({
  title,
  windowed = false,
  needsZoomReset,
  scaleStateRef,
}: UseUPlotOptionsProps) {
  const isDarkMode = useIsDarkMode();
  const oneToTen = [...Array(10)].map((_, i) => i + 1);

  const colorSchemeOptions = isDarkMode
    ? {
        axes: [
          {
            // x-axis
            grid: {
              stroke: "#607d8b",
              width: 1,
            },
            ticks: {
              stroke: "#607d8b",
              width: 1,
            },
            stroke: "#c7d0d9",
          },
          {
            // y-axis
            grid: {
              stroke: "#607d8b",
              width: 1,
            },
            ticks: {
              stroke: "#607d8b",
              width: 1,
            },
            stroke: "#c7d0d9",
          },
        ],
      }
    : {};

  const [options, setOptions] = useState<uPlot.Options>(
    useMemo(
      () => ({
        title,
        ...colorSchemeOptions,
        width: 400,
        height: 300,
        series: [
          {
            label: "Time",
          },
          ...oneToTen.map((i) => ({
            label: "Producer " + i,
            points: { show: false },
            stroke: isDarkMode ? darkColors[i - 1] : lightColors[i - 1],
          })),
        ],
        scales: { x: { time: true } },
        // Add custom handling for auto-ranging to preserve zoom
        hooks: {
          // Track when user zooms in
          setScale: [
            (u) => {
              // Get x-scale min/max
              const xScaleMin = u.scales.x.min!;
              const xScaleMax = u.scales.x.max!;

              // Get full data range
              const xData = u.data[0];
              const dataMin = Math.min(...xData);
              const dataMax = Math.max(...xData);

              // Check if we're zoomed in (allowing for small floating point differences)
              const isZoomed =
                Math.abs(xScaleMin - dataMin) > 0.001 ||
                Math.abs(xScaleMax - dataMax) > 0.001;

              if (needsZoomReset.current) {
                needsZoomReset.current = false;
                scaleStateRef.current = null;
              } else {
                if (isZoomed) {
                  // Save the current scale state
                  if (!scaleStateRef.current) {
                    scaleStateRef.current = {
                      min: xScaleMin,
                      max: xScaleMax,
                    };
                  }
                }
              }
            },
          ],

          setSelect: [
            (u) => {
              if (scaleStateRef.current != null) {
                scaleStateRef.current = null;
              }
            },
          ],
        },
      }),
      [isDarkMode, title, windowed]
    )
  );

  return { options, setOptions };
}
