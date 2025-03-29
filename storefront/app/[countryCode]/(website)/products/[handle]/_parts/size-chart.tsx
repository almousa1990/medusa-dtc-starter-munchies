import {MerchifyProductSizeChart} from "@/types";

interface SizeChartProps {
  data: MerchifyProductSizeChart;
}

export const SizeChart: React.FC<SizeChartProps> = ({data}) => {
  const {rows, columns} = data;
  return (
    <table className="w-full table-auto border-collapse overflow-hidden text-center">
      <thead>
        <tr className="">
          {columns.map((col, index) => (
            <th key={col} className="text-muted-foreground p-4 font-medium">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-border divide-y">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td className="p-4" key={col}>
                {row[col] || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
