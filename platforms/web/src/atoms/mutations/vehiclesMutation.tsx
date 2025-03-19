import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";
import { toast } from "react-toastify";

const registerVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); 
  

  if (!token) {
    return {
      mutationKey: ["vehicles"],
      mutationFn: async () => {
        throw new Error("Token is missing. Cannot create an order.");
      },
    };
  }

  return {
    mutationKey: ["vehicles"],
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

      if (!response.ok) {
        console.log(response)

        toast.error("Gagal dalam menambahkan kendaraan")
        return
      }
      
      toast.success("Berhasil menambahkan kendaraan")
      return response.json();
    },
    staleTime: 0,
    queryClient: get(queryClientAtom),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"]});
      queryClient.invalidateQueries({ queryKey: ["vehicles", null]});
    },

  };
});


const updateVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom);

  if (!token) {
    return {
      mutationKey: ["vehicles"],
      mutationFn: async () => {
        throw new Error("Token is missing. Cannot update the vehicle.");
      },
    };
  }

  return {
    mutationKey: ["vehicles"],
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

      if (!response.ok) {
        console.log(response);
        toast.error("Gagal dalam memperbarui kendaraan");
        return;
      }

      toast.success("Berhasil memperbarui kendaraan");
      return response.json();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles", null] });
    },
  };
});


const deleteVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom);

  if (!token) {
    return {
      mutationKey: ["vehicles"],
      mutationFn: async () => {
        throw new Error("Token is missing. Cannot update the vehicle.");
      },
    };
  }

  return {
    mutationKey: ["vehicles"],
    mutationFn: async ({ id }: { id: string }) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/kendaraan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log(response);
        toast.error("Gagal dalam menghapus kendaraan");
        return;
      }

      toast.success("Berhasil menghapus kendaraan");
      return response.json();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles", null] });
    },
  };
})

export { registerVehicleMutationAtom, updateVehicleMutationAtom, deleteVehicleMutationAtom };
