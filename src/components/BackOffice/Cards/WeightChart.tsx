"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, ZoomOut } from "lucide-react";
import React, { useCallback, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Sample weight data (expanded for different time periods)
const generateSampleData = () => {
  const data = [];
  const startDate = new Date("2023-01-01");
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split("T")[0],
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      weight: 70 - Math.random() * 3,
    });
  }
  return data;
};

const allData = generateSampleData();

const formatXAxis = (period: string, value: string | number | Date): string => {
  const date = new Date(value);
  switch (period) {
    case "day":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    case "week":
      return date.toLocaleDateString("en-US", { weekday: "short" });
    case "month":
      return date.getDate().toString();
    case "6month":
    case "year":
    case "all":
      return date.toLocaleDateString("en-US", { month: "short" });
    default:
      return value.toString();
  }
};

const getDataForPeriod = (period: string) => {
  const now = new Date(allData[allData.length - 1].date);
  const msPerDay = 24 * 60 * 60 * 1000;
  let startDate;

  switch (period) {
    case "day":
      startDate = new Date(now.getTime() - 1 * msPerDay);
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * msPerDay);
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * msPerDay);
      break;
    case "6month":
      startDate = new Date(now.getTime() - 180 * msPerDay);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * msPerDay);
      break;
    default:
      return allData;
  }

  return allData.filter((item) => new Date(item.date) >= startDate);
};

export const WeightChart = () => {
  const [activeTab, setActiveTab] = useState("month");
  const [showList, setShowList] = useState(false);

  const chartData = getDataForPeriod(activeTab);

  return (
    <div className="w-full max-w-3xl rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <CardHeader>
        <CardTitle>Weight Tracking Chart</CardTitle>
        <CardDescription>Weight measurements over time (in kg)</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="6month">6 Months</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={() => setShowList(!showList)} className="mb-4">
          {showList ? "Show Chart" : "Show List"}
        </Button>

        {showList ? (
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 w-[100px] bg-background">
                    Date
                  </TableHead>
                  <TableHead className="sticky top-0 w-[100px] bg-background">
                    Time
                  </TableHead>
                  <TableHead className="sticky top-0 w-[100px] bg-background">
                    Weight (kg)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.weight.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <ChartContainer
            config={{
              weight: {
                label: "Weight",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatXAxis(activeTab, value)}
                />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-weight)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </div>
  );
};
