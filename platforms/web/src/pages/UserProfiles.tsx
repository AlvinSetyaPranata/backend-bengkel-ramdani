import { useAtom } from "jotai";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import DataTable from "./Tables/DataTable";
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

import { vehiclesQueryAtom } from "../atoms/queries/vehiclesQuery";
import { usersQueryAtom } from "../atoms/queries/usersQuery";
import FileInput from "../components/form/input/FileInput";

import { deleteUserMutationAtom, updateUserMutationAtom } from "../atoms/mutations/usersMutation";
import ImageField from "../components/form/input/ImageField";



const getStatus = (status: string) => {
  if (status == "active") {
    return "bg-green-500 text-white"
  } else {
    return "bg-red-500 text-white"
  }
}

const Users: React.FC = () => {
  const [{ data, isPending }] = useAtom(vehiclesQueryAtom);
  const [iconActive, setIconActive] = useState(false);
  const [input, setInput] = useState("");
  const [modalType, setModalType] = useState("");

  const [selectedInstance, setSelectedInstance] = useState({})


  const [{ mutate: updateUser }] = useAtom(updateUserMutationAtom);
  const [{ mutate: deleteUser }] = useAtom(deleteUserMutationAtom)

  const [{ data: userData }] = useAtom(usersQueryAtom);

  const handleActionButton = (type, instance ) => {
    setModalType(type)
    setSelectedInstance(instance)
  }

  const columns: ColumnDef<typeof data>[] = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ getValue }) => {
        const avatarUrl = getValue() as string | null;
        return isPending ? (
          <Skeleton width={50} height={50} />
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a8.25 8.25 0 0 1 15 0"
              />
            </svg>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.name,
      header: "Nama",
      cell: ({ getValue }) =>
        isPending ? <Skeleton width={100} /> : (getValue() as string),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) =>
        isPending ? <Skeleton width={80} /> : (
          <div className={`w-max rounded-md mx-auto px-4 py-1 ${getStatus(getValue() as string)}`}>
            {getValue() as string}
          </div>
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
              onClick={() => handleActionButton("update", row.original)}
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
              onClick={() => handleActionButton("delete", row.original)}
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
    if (event.target.value) {
      setIconActive(true);
    } else {
      setIconActive(false);
    }

    setInput(event.target.value);
  };

  const handleRemove = () => {
    setInput("");
    setIconActive(false);
  };

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Data Pengguna" />

      <ModalWithConfirmation
        messege="Apakah anda ingin menghapus pengguna ini?"
        title="Peringatan"
        onOk={() => null}
        id={selectedInstance ? selectedInstance.id : null}
        onCancel={() => setModalType("")}
        state={modalType == "delete"}
        mutation={deleteUser}
      />

      {/* update and create modal */}
      <ModalWithForm
        onClose={() => setModalType("")}
        title={modalType == "create" ? "Tambahkan Pengguna" : "Edit Pengguna"}
        mutation={updateUser}
        method="UPDATE"
        selectedInstance={selectedInstance ? selectedInstance : {}}
        state={modalType == "update"}
      >
        <div>
          <Label>Avatar</Label>
          <div className="relative">
          {(selectedInstance && selectedInstance.avatar) ? (
              <ImageField name="avatar" src={selectedInstance.avatar} />
            ) : (
              <FileInput name="avatar" />
            )}
          </div>
        </div>
        <div>
          <Label>Nama</Label>
          <div className="relative">
            <Input
              type="text"
              className="min-w-[300px]"
              name="name"
              defaultValue={selectedInstance ? selectedInstance.name : ""}
              />
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <div className="relative">
            <Select
              options={[{label: "Aktif", value: "active"}, {label: "Tidak Aktif", value: "inactive"}]}
              name="status"
              placeholder="Status"
              defaultValue={selectedInstance ? selectedInstance.status : ""}
            />
          </div>
        </div>
        
      </ModalWithForm>

      {/* update and create modal */}

      {/* Tables */}
      <div className="w-full flex justify-end gap-x-6">
        <div className="bg-white rounded-md py-2 px-3 flex gap-x-4 items-center">
          <input
            type="text"
            className="outline-none text-sm"
            placeholder="Cari bedasarkan Nama"
            onChange={onInputChange}
            value={input}
          />
        </div>

        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="size-4 dark:stroke-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
            />
          </svg>
        </button>
      </div>
      <DataTable
        data={userData ? userData.data : []}
        columns={columns}
        pagination={userData ? userData.pagination : []}
        filterBy="Nama"
        filterValue={input}
      />
    </div>
  );
};

export default Users;
