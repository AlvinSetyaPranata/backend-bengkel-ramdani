import { atomWithMutation } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";
import { toast } from "react-toastify";

const createOrderMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); // ✅ Get QueryClient instance

  return {
    mutationKey: ["orders"],
    mutationFn: async (data: Record<string, any>) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/pesanan`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const content = await response.json();

      if (response.status == 422) {
        toast.error(content.pesan, { position: 'top-right' })
        throw new Error("Failed to create order");
      }
      
      if (!response.ok) {
        console.log(response)
        toast.error("Gagal membuat pesanan", { position: 'top-right' })
        throw new Error("Failed to create order");
      }

      return content;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders']});
      toast.success("Berhasil membuat pesanan", { position: 'top-right' })
    },
    
  };
});


const updateOrderMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); // ✅ Get QueryClient instance

  if (!token) {
    return {
      mutationKey: ["orders"],
      mutationFn: async (data: Record<any, any>) => {
        throw new Error("Token is missing. Cannot create an order.");
      },
    };
  }

  return {
    mutationKey: ["orders"],
    mutationFn: async ({data, id}: {data: Record<string, any>, id: string}) => {


      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/pesanan/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders']});
      toast.success("Berhasil membuat pesanan", { position: 'top-right' })
    },
  };
});


const deleteOrderMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); // ✅ Get QueryClient instance

  if (!token) {
    return {
      mutationKey: ["orders"],
      mutationFn: async (data: Record<any, any>) => {
        throw new Error("Token is missing. Cannot create an order.");
      },
    };
  }

  return {
    mutationKey: ["orders"],
    mutationFn: async (id: string) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/pesanan/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const content = await response.json()

      if (response.status == 422) {
        toast.error(content.errors, { position: 'top-right' })
        throw new Error("Failed to delete order");
        
        return
      }

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      return content;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders']});
      toast.success("Berhasil menghapus pesanan", { position: 'top-right' })
    },

  };
});



export { createOrderMutationAtom, updateOrderMutationAtom, deleteOrderMutationAtom };
