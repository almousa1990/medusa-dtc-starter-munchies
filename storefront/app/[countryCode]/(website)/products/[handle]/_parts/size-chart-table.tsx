"use client";

import {Tabs, TabsList, TabsTrigger} from "@/components/shared/tabs";
import Body from "@/components/shared/typography/body";
import {MerchifyProductSizeChart} from "@/types";
import {cn} from "@merchify/ui";

import {useState} from "react";

interface SizeChartTableProps extends MerchifyProductSizeChart {}

export function SizeChartTable({columns, rows}: SizeChartTableProps) {
  const [unit, setUnit] = useState("cm");

  return (
    <div className="text-sm">
      <Body className="pb-4">
        جميع القياسات في الجدول تشير إلى أبعاد المنتج.
      </Body>
      <Tabs onValueChange={setUnit} value={unit}>
        <TabsList>
          <TabsTrigger value="cm">سم</TabsTrigger>
          <TabsTrigger value="inch">إنش</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-2 rounded-md border">
        <table className="w-full table-fixed border-collapse overflow-hidden text-center">
          <thead className="border-b">
            <tr className="divide-x">
              {columns.map((col, colIndex) => (
                <th
                  key={col}
                  className={cn("p-4 font-medium", {"w-32": colIndex == 0})}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="odd:bg-accent even:bg-background divide-x"
              >
                {columns.map((col, colIndex) => {
                  const rawValue = row[col];
                  const num = parseFloat(rawValue);
                  const displayValue = isNaN(num)
                    ? rawValue
                    : (unit === "inch" ? num / 2.54 : num).toFixed(2);

                  return (
                    <td
                      key={col}
                      className={cn("p-4", {"w-32 font-medium": colIndex == 0})}
                    >
                      {displayValue || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
