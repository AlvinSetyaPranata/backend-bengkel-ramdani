import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";


const getBadgeColor = (status: string) => {
  switch(status) {
    case "Dalam Antrian":
      return "primary"
    case "Dikerjakan":
      return "warning"
    case "Dibatalkan":
      return "error"
    case "Selesai":
      return "success"
  }
}


interface Orders {
  id: number; 
  name: string; 
  date_in: Date; 
  date_fix: Date; 
  date_finish: Date; 
  budget: string; 
  status: "Dalam Antrian" | "Dikerjakan" | "Dibatalkan" | "Selesai"; 
  information: string; 
}

const tableData: Orders[] = [
  {
    id: 1,
    name: "Alvin Setya Pranata",
    date_in: new Date("2025-03-01"),
    date_fix: new Date("2025-03-03"),
    date_finish: new Date("2025-03-05"),
    budget: "200000",
    status: "Dalam Antrian",
    information: "",
  },
  {
    id: 2,
    name: "Dewi Sari",
    date_in: new Date("2025-03-02"),
    date_fix: new Date("2025-03-04"),
    date_finish: new Date("2025-03-06"),
    budget: "350000",
    status: "Dikerjakan",
    information: "Urgent order",
  },
  {
    id: 3,
    name: "Budi Santoso",
    date_in: new Date("2025-03-03"),
    date_fix: new Date("2025-03-06"),
    date_finish: new Date("2025-03-08"),
    budget: "150000",
    status: "Dibatalkan",
    information: "Customer cancelled",
  },
  {
    id: 4,
    name: "Siti Aminah",
    date_in: new Date("2025-03-04"),
    date_fix: new Date("2025-03-07"),
    date_finish: new Date("2025-03-09"),
    budget: "500000",
    status: "Selesai",
    information: "Completed successfully",
  },
  {
    id: 5,
    name: "Rizky Ramadhan",
    date_in: new Date("2025-03-05"),
    date_fix: new Date("2025-03-08"),
    date_finish: new Date("2025-03-10"),
    budget: "275000",
    status: "Dalam Antrian",
    information: "",
  },
  {
    id: 6,
    name: "Fauzan Akbar",
    date_in: new Date("2025-03-06"),
    date_fix: new Date("2025-03-09"),
    date_finish: new Date("2025-03-11"),
    budget: "320000",
    status: "Dikerjakan",
    information: "Revised order",
  },
  {
    id: 7,
    name: "Laras Wulandari",
    date_in: new Date("2025-03-07"),
    date_fix: new Date("2025-03-10"),
    date_finish: new Date("2025-03-12"),
    budget: "450000",
    status: "Selesai",
    information: "High-priority task",
  },
  {
    id: 8,
    name: "Yoga Pratama",
    date_in: new Date("2025-03-08"),
    date_fix: new Date("2025-03-11"),
    date_finish: new Date("2025-03-13"),
    budget: "210000",
    status: "Dibatalkan",
    information: "Technical issue",
  },
  {
    id: 9,
    name: "Indah Permata",
    date_in: new Date("2025-03-09"),
    date_fix: new Date("2025-03-12"),
    date_finish: new Date("2025-03-14"),
    budget: "390000",
    status: "Dalam Antrian",
    information: "",
  },
  {
    id: 10,
    name: "Hendro Wijaya",
    date_in: new Date("2025-03-10"),
    date_fix: new Date("2025-03-13"),
    date_finish: new Date("2025-03-15"),
    budget: "280000",
    status: "Dikerjakan",
    information: "Additional service requested",
  },
  {
    id: 11,
    name: "Fitri Ayu",
    date_in: new Date("2025-03-11"),
    date_fix: new Date("2025-03-14"),
    date_finish: new Date("2025-03-16"),
    budget: "320000",
    status: "Selesai",
    information: "",
  },
  {
    id: 12,
    name: "Rian Hidayat",
    date_in: new Date("2025-03-12"),
    date_fix: new Date("2025-03-15"),
    date_finish: new Date("2025-03-17"),
    budget: "180000",
    status: "Dibatalkan",
    information: "Insufficient funds",
  },
  {
    id: 13,
    name: "Rika Amelia",
    date_in: new Date("2025-03-13"),
    date_fix: new Date("2025-03-16"),
    date_finish: new Date("2025-03-18"),
    budget: "410000",
    status: "Dalam Antrian",
    information: "",
  },
  {
    id: 14,
    name: "Agus Saputra",
    date_in: new Date("2025-03-14"),
    date_fix: new Date("2025-03-17"),
    date_finish: new Date("2025-03-19"),
    budget: "295000",
    status: "Dikerjakan",
    information: "",
  },
  {
    id: 15,
    name: "Mila Rosiana",
    date_in: new Date("2025-03-15"),
    date_fix: new Date("2025-03-18"),
    date_finish: new Date("2025-03-20"),
    budget: "360000",
    status: "Selesai",
    information: "Customer satisfied",
  },
  {
    id: 16,
    name: "Bayu Purnama",
    date_in: new Date("2025-03-16"),
    date_fix: new Date("2025-03-19"),
    date_finish: new Date("2025-03-21"),
    budget: "470000",
    status: "Dalam Antrian",
    information: "",
  },
  {
    id: 17,
    name: "Eka Susanti",
    date_in: new Date("2025-03-17"),
    date_fix: new Date("2025-03-20"),
    date_finish: new Date("2025-03-22"),
    budget: "250000",
    status: "Dikerjakan",
    information: "Additional request",
  },
  {
    id: 18,
    name: "Dani Firmansyah",
    date_in: new Date("2025-03-18"),
    date_fix: new Date("2025-03-21"),
    date_finish: new Date("2025-03-23"),
    budget: "310000",
    status: "Dibatalkan",
    information: "Cancelled due to delay",
  },
  {
    id: 19,
    name: "Citra Ananda",
    date_in: new Date("2025-03-19"),
    date_fix: new Date("2025-03-22"),
    date_finish: new Date("2025-03-24"),
    budget: "420000",
    status: "Selesai",
    information: "",
  },
  {
    id: 20,
    name: "Reza Mahendra",
    date_in: new Date("2025-03-20"),
    date_fix: new Date("2025-03-23"),
    date_finish: new Date("2025-03-25"),
    budget: "340000",
    status: "Dalam Antrian",
    information: "",
  },
];



export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pesanan Terbaru
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Nama Pelanggan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 hidden xl:table-cell"
              >
                Tanggal Masuk
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 hidden xl:table-cell"
              >
                Tanggal Perbaikan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 hidden xl:table-cell"
              >
                Tanggal Selesai
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 hidden xl:table-cell"
              >
                Total Biaya
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 hidden xl:table-cell"
              >
                Keterangan
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((order) => (
              <TableRow key={order.id} className="">
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.name}
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 hidden xl:table-cell">
                  {Intl.DateTimeFormat("en-GB").format(order.date_in)}
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 hidden xl:table-cell">
                  {Intl.DateTimeFormat("en-GB").format(order.date_fix)}
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 hidden xl:table-cell">
                  {Intl.DateTimeFormat("en-GB").format(order.date_finish)}
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-white font-medium hidden xl:table-cell">
                  {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR"}).format(parseInt(order.budget))}
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={getBadgeColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400 hidden xl:table-cell">
                  {order.information}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
