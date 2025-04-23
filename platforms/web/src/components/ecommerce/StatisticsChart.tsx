import { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type TrenBulananItem = {
  bulan: string; // e.g. "Mar 2025"
  total_pesanan: number;
  pesanan_selesai: number;
  pendapatan: number;
};

type StatisticsChartProps = {
  trenBulanan: TrenBulananItem[];
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function StatisticsChart({ trenBulanan }: StatisticsChartProps) {
  const availableYears = Array.from(
    new Set(trenBulanan.map((item) => item.bulan.split(" ")[1]))
  );

  const [selectedYear, setSelectedYear] = useState(availableYears[0] || "");

  const dataPerMonth = useMemo(() => {
    const monthMap = Object.fromEntries(MONTHS.map((m) => [m, {
      total_pesanan: 0,
      pesanan_selesai: 0,
      pendapatan: 0,
    }]));

    trenBulanan.forEach((item) => {
      const [month, year] = item.bulan.split(" ");
      if (year === selectedYear && MONTHS.includes(month)) {
        monthMap[month] = {
          total_pesanan: item.total_pesanan,
          pesanan_selesai: item.pesanan_selesai,
          pendapatan: item.pendapatan,
        };
      }
    });

    return MONTHS.map((m) => monthMap[m]);
  }, [trenBulanan, selectedYear]);

  const options: ApexOptions = {
    legend: { show: true },
    colors: ["#465FFF", "#9CB9FF", "#FF5733"],
    chart: { type: "line", height: 310, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
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
      categories: MONTHS,
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
    },
  };

  const series = [
    {
      name: "Total Pesanan",
      data: dataPerMonth.map((d) => d.total_pesanan),
    },
    {
      name: "Pesanan Selesai",
      data: dataPerMonth.map((d) => d.pesanan_selesai),
    },
    {
      name: "Pendapatan",
      data: dataPerMonth.map((d) => d.pendapatan),
    },
  ];

  if (!trenBulanan || trenBulanan.length === 0) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Statistik Pesanan per Bulan - {selectedYear}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border p-2 rounded-md dark:bg-gray-800 dark:text-white text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
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
