import { atomWithMutation } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";
import { toast } from "react-toastify";

const registerVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); 
  

  if (!token) {
    return {
      mutationKey: ["createVehicle"],
      mutationFn: async () => {
        throw new Error("Token is missing. Cannot create an order.");
      },
    };
  }

  return {
    mutationKey: ["createVehicle"],
    mutationFn: async (data: Record<string, any>[]) => {
    
      const formData = new FormData();

      Object.entries(data).map(([key, value]) => formData.append(key, value))

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/kendaraan`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const content = await response.json()

      if (response.status == 409) {
        toast.error(content.errors, { position: 'top-right' })
        throw new Error("Failed to add vehicle")
        return
      }


      if (!response.ok) {
        toast.error("Gagal dalam menambahkan kendaraan")
        throw new Error("Failed to add vehicle")
        return
      }
      
      toast.success("Berhasil menambahkan kendaraan")
      return content;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"]});
    },

  };
});


const updateVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom);

  if (!token) {
    return {
      mutationKey: ["updateVehicles"],
      mutationFn: async () => {
        throw new Error("Token is missing. Cannot update the vehicle.");
      },
    };
  }

  return {
    mutationKey: ["updateVehicles"],
    mutationFn: async ({ data, id }: { data: Record<string, any>; id: string }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/kendaraan/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const content = await response.json()

      if (response.status == 422) {
        toast.error(content.errors, { position: 'top-right' })
        throw new Error("Failed to update vehicle")
        return
      }
      
      if (!response.ok) {
        toast.error("Gagal dalam memperbarui kendaraan");
        throw new Error("Failed to update vehicle")
        return;
      }

      toast.success("Berhasil memperbarui kendaraan");
      return content;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  };
});


const deleteVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom);

  if (!token) {
    return {
      mutationKey: ["deleteVehicles"],
      mutationFn: async () => {
        throw new Error("Token is missing. Cannot update the vehicle.");
      },
    };
  }

  return {
    mutationKey: ["deleteVehicles"],
    mutationFn: async (id: string) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/kendaraan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Gagal dalam menghapus kendaraan");
        throw new Error("Failed to delete vehicle")
      }
      
      toast.success("Berhasil menghapus kendaraan");
      return response.json();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });

    },
  };
})

export { registerVehicleMutationAtom, updateVehicleMutationAtom, deleteVehicleMutationAtom };
