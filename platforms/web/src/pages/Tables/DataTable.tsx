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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

const data: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
];

const columns: ColumnDef<User>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

const DataTable = () => {
  const [iconActive, setIconActive] = useState(false)
  const [input, setInput] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 5;
  
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setIconActive(true)
    } else {
      setIconActive(false)
    }

    setInput(event.target.value)
  }

  return (
    <div>
      <div className="w-full flex justify-end">
        <div className="bg-white rounded-md py-2 px-3 flex gap-x-4 items-center">
          <input type="text" className="outline-none text-sm" placeholder="Cari bedasarkan" onChange={onInputChange} value={input}/>
          <button onClick={() => iconActive ? setInput("") : ""}>
            <FontAwesomeIcon icon={iconActive ? faX : faSearch} color="gray" size="xs"/>
          </button>
        </div>
      </div>
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
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
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
                        className="px-5 py-4 sm:px-6 text-start dark:text-white"
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
        <span className="px-4 py-2 dark:text-gray-400">{currentPage} / {totalPages}</span>
        <button
          className="px-4 py-2 dark:bg-brand-600  dark:text-white rounded hover:cursor-pointer text-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
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
