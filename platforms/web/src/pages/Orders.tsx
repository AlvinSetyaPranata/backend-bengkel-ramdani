import { useAtom, useAtomValue } from "jotai";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import DataTable from "./Tables/DataTable";
import { ordersQueryAtom } from "../atoms/queries/ordersQuery";
import { ColumnDef } from "@tanstack/react-table";
import Button from "../components/ui/button/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ModalWithForm,
  ModalWithConfirmation,
} from "../components/atoms/Modal";
import Skeleton from "react-loading-skeleton";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import TextArea from "../components/form/input/TextArea";
import {
  createOrderMutationAtom,
  deleteOrderMutationAtom,
  updateOrderMutationAtom,
} from "../atoms/mutations/ordersMutation";
import { vehiclesQueryAtom } from "../atoms/queries/vehiclesQuery";
import { tokenAtom } from "../atoms/auth";
import { formatCurrency } from "../utils/converter";

function getStatus(value: string) {
  switch (value) {
    case "menunggu":
      return "bg-blue-500 text-white";
    case "proses":
      return "bg-yellow-500 text-white";
    case "selesai":
      return "bg-green-500 text-white";
    case "batal":
      return "bg-red-500 text-white";
  }
}

export default function Orders() {
  const [{ data: orderQuery, isPending }] = useAtom(ordersQueryAtom);
  const [{ data: vehicleQuery }] = useAtom(vehiclesQueryAtom);

  const [iconActive, setIconActive] = useState(false);
  const [input, setInput] = useState("");
  const [modalType, setModalType] = useState("");

  const [{mutate: createOrder}] = useAtom(createOrderMutationAtom);
  const [{mutate: updateOrder}] = useAtom(updateOrderMutationAtom);
  const [{mutate: deleteOrder}] = useAtom(deleteOrderMutationAtom);

  const [selectedInstance, setSelectedInstance] = useState(null);

  const token = useAtomValue(tokenAtom)

  const handleActionPress = (type, instance) => {
    setModalType(type);
    console.log(instance)
    setSelectedInstance(instance);
  };

  const columns: ColumnDef<typeof orderQuery>[] = [
    {
      accessorFn: (row) => row.kendaraan.nama_kendaraan,
      header: "Nama Kendaraan",
      cell: ({ getValue }) =>
        isPending ? (
          <Skeleton
            width={100}
            height={10}
            className="bg-gray-500 animate-pulse"
          />
        ) : (
          (getValue() as string)
        ),
    },
    {
      accessorFn: (row) => row.kendaraan.user.name,
      header: "Pemilik Kendaraan",
      cell: ({ getValue }) =>
        isPending ? (
          <Skeleton
            width={100}
            height={10}
            className="bg-gray-500 animate-pulse"
          />
        ) : (
          (getValue() as string)
        ),
    },
    {
      accessorFn: (row) => row.total_biaya,
      header: "Total Biaya",
      cell: ({ getValue }) =>
        isPending ? (
          <Skeleton
            width={100}
            height={10}
            className="bg-gray-500 animate-pulse"
          />
        ) : (
          formatCurrency(getValue() as number)
        ),
    },
    {
      accessorKey: "tanggal_perbaikan",
      header: "Tanggal Perbaikan",
      cell: ({ getValue }) =>
        isPending ? (
          <Skeleton
            width={100}
            height={10}
            className="bg-gray-500 animate-pulse"
          />
        ) : (
          (getValue() as string)
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) =>
        isPending ? (
          <Skeleton
            width={100}
            height={10}
            className="bg-gray-500 animate-pulse"
          />
        ) : (
          <div
            className={`py-1 rounded-md capitalize ${getStatus(
              getValue() as string
            )}`}
          >
            {getValue() as string}
          </div>
        ),
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ getValue }) =>
        isPending ? (
          <Skeleton
            width={100}
            height={10}
            className="bg-gray-500 animate-pulse"
          />
        ) : (
          (getValue() as string)
        ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <div className="flex gap-x-2 w-full justify-center">
            <Button
              className="bg-blue-500 p-2"
              onClick={() => handleActionPress("update", row.original)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </Button>
            <Button
              className="bg-red-500 p-2"
              onClick={() => handleActionPress("delete", row.original)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </Button>
          </div>
        );
      },
    },
  ];

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 0) {
      setIconActive(false);
    } else {
      setIconActive(true);
    }

    setInput(event.target.value);
  };

  const handleRemove = () => {
    setInput("");
    setIconActive(false);
  };

  // useEffect(() => console.log(selectedInstance), [selectedInstance])
  

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Data Pesanan" />

      <ModalWithConfirmation
        message="Apakah anda ingin mengahapus pesanan ini?"
        title="Peringatan"
        mutation={deleteOrder}
        id={selectedInstance ? selectedInstance.id : null}
        onCancel={() => setModalType("")}
        state={modalType == "delete"}
      />

      {/* update and create modal */}
      <ModalWithForm
        onClose={() => setModalType("")}
        title={modalType == "create" ? "Buat Pesanan" : "Edit Pesanan"}
        mutation={modalType == "create" ? createOrder : updateOrder}
        state={modalType == "create" || modalType == "update"}
        selectedInstance={
          modalType == "update" && selectedInstance ? selectedInstance : {}
        }
        method={modalType.toUpperCase()}
      >
        <div>
          <Label>Kendaraan</Label>
          {/* {JSON.stringify(selectedInstance)} */}
          <div className="relative">
            <Input name="kendaraan_pelanggan_id" searchData={vehicleQuery
                  ? vehicleQuery.data.map((vehicle) => {
                      return {
                        name: `${vehicle.nama_kendaraan} - ${vehicle.plat_nomor} - ${vehicle.user.name}`,
                        value: vehicle.id,
                      };
                    })
                  : []} defaultValue={(selectedInstance && selectedInstance.kendaraan.user) ? `${selectedInstance.kendaraan.nama_kendaraan} - ${selectedInstance.kendaraan.plat_nomor} - ${selectedInstance.kendaraan.user.name}` : ""}/>
          </div>
        </div>
        <div>
          <Label>Tanggal Perbaikan</Label>
          <div className="relative">
            <Input
              type="date"
              className="min-w-[300px]"
              name="tanggal_perbaikan"
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.tanggal_perbaikan
                  : ""
              }
            />
          </div>
        </div>
        <div>
          <Label>Tanggal Keluar</Label>
          <div className="relative">
            <Input
              type="date"
              className="min-w-[300px]"
              name="tanggal_selesai"
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.tanggal_selesai
                  : ""
              }
            />
          </div>
        </div>
        <div>
          <Label>Tanggal Masuk</Label>
          <div className="relative">
            <Input
              type="date"
              className="min-w-[300px]"
              name="tanggal_masuk"
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.tanggal_masuk
                  : ""
              }
            />
          </div>
        </div>
        <div>
          <Label>Total Biaya</Label>
          <div className="relative">
            <Input
              type="number"
              className="min-w-[300px]"
              name="total_biaya"
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.total_biaya
                  : ""
              }
            />
          </div>
        </div>
        <div>
          <Label>Metode Pembayaran</Label>
          <div className="relative">
            <Select
              name="metode_pembayaran"
              options={[
                { label: "Cash", value: "cash" },
                { label: "Transfer / E-Wallet / Qris", value: "transfer" },
              ]}
              placeholder="Pilih Metode Pembayaran"
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.metode_pembayaran
                  : ""
              }
            />
          </div>
        </div>
        <div>
          <Label>Status</Label>
          <div className="relative">
            <Select
              name="status"
              options={[
                { label: "Selesai", value: "selesai" },
                { label: "Dalam Perbaikan", value: "proses" },
                { label: "Dalam Antrian", value: "menunggu" },
                { label: "Batal", value: "batal" },
              ]}
              placeholder="Pilih Status"
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.status
                  : ""
              }
            />
          </div>
        </div>
        <div className="col-span-2">
          <Label>Keterangan</Label>
          <div className="relative">
            <TextArea
              name="keterangan"
              placeholder=""
              disabled={false}
              defaultValue={
                modalType == "update" && selectedInstance
                  ? selectedInstance.keterangan
                  : ""
              }
            ></TextArea>
          </div>
        </div>
      </ModalWithForm>

      {/* update and create modal */}

      {/* Tables */}
      <div className="w-full flex justify-end items-center gap-x-6">
        <button
          onClick={() => setModalType("create")}
          className="bg-brand-600 text-white rounded-md py-2 px-2 text-sm"
        >
          Tambah Pesanan
        </button>
        {/* <div className="relative">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="size-6 dark:stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
              />
            </svg>
          </button>
            <div className="absolute left-0 -bottom-14 bg-white min-w-[200px] rounded-md px-4 py-4">p</div>
        </div> */}
        <div className="bg-white rounded-md py-2 px-3 flex gap-x-4 items-center">
          <input
            type="text"
            className="outline-none text-sm"
            placeholder="Cari Pemilik"
            onChange={onInputChange}
            value={input}
          />
          <button onClick={handleRemove}>
            <FontAwesomeIcon
              icon={iconActive ? faX : faSearch}
              color="gray"
              size="xs"
            />
          </button>
        </div>
      </div>
      <DataTable
        data={orderQuery ? orderQuery.data : []}
        columns={columns}
        pagination={orderQuery ? orderQuery.pagination : []}
        filterBy="Pemilik Kendaraan"
        filterValue={input}
      />
    </div>
  );
}
