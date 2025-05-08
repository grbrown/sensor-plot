import { useIsDarkMode } from "~/hooks/useIsDarkMode";
import { darkColors, lightColors } from "~/constants/graphLineColors";

type GraphStatisticsTableProps = {
  minimums?: number[];
  maximums?: number[];
  averages?: number[];
  producerCount: number;
};

/**
 * A component that displays statistics for graph data
 */
export function GraphStatisticsTable({
  minimums,
  maximums,
  averages,
  producerCount,
}: GraphStatisticsTableProps) {
  const isDarkMode = useIsDarkMode();
  const producerIndices = [...Array(producerCount)].map((_, i) => i + 1);

  return (
    <>
      <h3 className="font-semibold mb-1 text-center text-sm">Statistics</h3>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="py-2 px-2 text-left border border-gray-300 dark:border-gray-700">
              Producer
            </th>
            <th className="py-2 px-2 text-right border border-gray-300 dark:border-gray-700">
              Min
            </th>
            <th className="py-2 px-2 text-right border border-gray-300 dark:border-gray-700">
              Max
            </th>
            <th className="py-2 px-2 text-right border border-gray-300 dark:border-gray-700">
              Avg
            </th>
          </tr>
        </thead>
        <tbody>
          {producerIndices.map((index) => {
            // Get the color for this producer
            const color = isDarkMode
              ? darkColors[index - 1]
              : lightColors[index - 1];
            return (
              <tr
                key={`producer-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <th className="py-2 px-2 text-left border border-gray-300 dark:border-gray-700 font-medium">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: color }}
                    ></div>
                    P{index}
                  </div>
                </th>
                <td className="py-2 px-2 text-right border border-gray-300 dark:border-gray-700">
                  {minimums?.[index - 1]?.toFixed(2) || "-"}
                </td>
                <td className="py-2 px-2 text-right border border-gray-300 dark:border-gray-700">
                  {maximums?.[index - 1]?.toFixed(2) || "-"}
                </td>
                <td className="py-2 px-2 text-right border border-gray-300 dark:border-gray-700">
                  {averages?.[index - 1]?.toFixed(2) || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
