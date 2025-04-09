import {
  useReactTable,
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";

type paginationType = {
  total: number;
  per_halaman: number;
  halaman_sekarang: number;
  halaman_terakhir: number;
  dari: number;
  sampai: number;
};

interface DataTableProps<D> {
  data: D[];
  columns: ColumnDef<D>[];
  pagination: paginationType;
  page: number;
  pageSetter: (page: string) => void;
  filterBy?: string;
  filterValue?: string;
}

const DataTable = <D,>({
  data,
  columns,
  pagination,
  page,
  pageSetter,
  filterBy,
  filterValue,
}: DataTableProps<D>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [enabledSort, setEnableSort] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Update filters when filterBy or filterValue changes
  useEffect(() => {
    if (filterBy && filterValue !== undefined) {
      setColumnFilters([{ id: filterBy, value: filterValue }]);
    } else {
      setColumnFilters([]);
    }
  }, [filterBy, filterValue]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters, // Required for filtering
    enableColumnFilters: true,
  });

  const enableSortHandler = (header) => {
    header.column.toggleSorting(header.column.getIsSorted() === "asc");

    if (header.id === enabledSort) {
      setEnableSort("");
      return;
    }
    setEnableSort(header.id);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-x-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <button onClick={() => enableSortHandler(header)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              className={`size-4 stroke-black ${
                                enabledSort === header.id
                                  ? "dark:stroke-amber-500"
                                  : "dark:stroke-white"
                              }`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                              />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-5 py-4 sm:px-6 text-center dark:text-white text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="w-full flex justify-end">
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 dark:bg-brand-600 dark:text-white rounded hover:cursor-pointer text-sm"
            onClick={() => pageSetter((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 dark:text-gray-400">
            {pagination.halaman_sekarang} / {pagination.halaman_terakhir}
          </span>
          <button
            className="px-4 py-2 dark:bg-brand-600 dark:text-white rounded hover:cursor-pointer text-sm"
            onClick={() =>
              pageSetter((prev) => Math.min(prev + 1, pagination.total))
            }
            disabled={page === pagination.total}
          >
            Next
          </button>
        </div>
      </div>
      {/* Pagination Controls */}
    </div>
  );
};

export default DataTable;
