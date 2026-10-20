"use client";

import { AreaChart, type Series } from "@/components/charts/AreaChart";
import { moneyCompact } from "@/lib/data/format";

/** Client wrapper so server pages can pass plain data and get money formatting. */
export function TrendChart({ labels, series, height }: { labels: string[]; series: Series[]; height?: number }) {
  return <AreaChart labels={labels} series={series} height={height} format={(v) => moneyCompact(v)} />;
}
