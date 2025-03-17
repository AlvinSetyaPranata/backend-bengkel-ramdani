import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useState } from "react";
import { useAtom } from "jotai";
import { selectedItemAtom } from "../../atoms/components/datatable";


type paginationType = {
  total: number,
  per_halaman: number,
  halaman_sekarang: number,
  halaman_terakhir: number,
  dari: number,
  sampai: number
}

interface DataTableProps<D>{
  data: D[],
  columns: ColumnDef<D>[],
  pagination: paginationType,
}

const DataTable = <D,>({ data, columns, pagination }: DataTableProps<D>) => {
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });




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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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

      {/* pagination controls */}
      <div className="w-full flex justify-end">
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="px-4 py-2 dark:bg-brand-600  dark:text-white rounded hover:cursor-pointer text-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 dark:text-gray-400">{pagination.halaman_sekarang} / {pagination.halaman_terakhir}</span>
        <button
          className="px-4 py-2 dark:bg-brand-600  dark:text-white rounded hover:cursor-pointer text-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.total))}
          disabled={currentPage === pagination.total}
        >
          Next
        </button>
      </div>
      </div>
      {/* pagination controls */}
    </div>
  );
};

export default DataTable;
