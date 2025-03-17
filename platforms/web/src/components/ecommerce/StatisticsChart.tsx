import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useAtom } from "jotai";
import { statisticQueryAtom } from "../../atoms/queries/statisticsQuery";

type dataType = {
  ringkasan: {
    total_pesanan: number;
    menunggu: number;
    proses: number;
    selesai: number;
    batal: number;
  };
  keuangan: {
    pendapatan_total: number;
    pendapatan_bulan_ini: number;
    rata_rata_biaya: number;
  };
  performa: {
    rata_rata_waktu_tunggu: number;
    rata_rata_waktu_perbaikan: number;
  };
  tren_bulanan: [
    {
      bulan: string;
      total_pesanan: number;
      pesanan_selesai: number;
      pendapatan: number;
    },
    {
      bulan: string;
      total_pesanan: number;
      pesanan_selesai: number;
      pendapatan: number;
    },
    {
      bulan: string;
      total_pesanan: number;
      pesanan_selesai: number;
      pendapatan: number;
    },
    {
      bulan: string;
      total_pesanan: number;
      pesanan_selesai: number;
      pendapatan: number;
    },
    {
      bulan: string;
      total_pesanan: number;
      pesanan_selesai: number;
      pendapatan: number;
    },
    {
      bulan: string;
      total_pesanan: number;
      pesanan_selesai: number;
      pendapatan: number;
    }
  ];
};

export default function StatisticsChart() {
  const [{ data, isPending }] = useAtom(statisticQueryAtom)

  const [selectedMonth, setSelectedMonth] = useState();

  const filteredData =
    data ? data.data.tren_bulanan.find((item) => item.bulan === selectedMonth): {};

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF", "#FF5733"],
    chart: {
      type: "line",
      height: 310,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [2, 2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: { yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories: [filteredData ? filteredData.bulan : ''],
      tooltip: { enabled: false },
    },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] } } },
  };

  const series = [
    { name: "Total Pesanan", data: [filteredData ? filteredData.total_pesanan : 0] },
    { name: "Pesanan Selesai", data: [filteredData ? filteredData.pesanan_selesai : 0] },
    { name: "Pendapatan", data: [filteredData ? filteredData.pendapatan : 0] },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Statistik Pesanan
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border p-2 rounded-md dark:bg-gray-800 dark:text-white text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {data ? data.data.tren_bulanan.map((item) => (
              <option key={item.bulan} value={item.bulan}>
                {item.bulan}
              </option>
            )) : ''}
          </select>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar mt-5">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
