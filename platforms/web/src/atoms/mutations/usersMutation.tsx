import { atomWithMutation } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";
import { toast } from "react-toastify";



const updateUserMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); // ✅ Get QueryClient instance

  if (!token) {
    return {
      mutationKey: ["users"],
      mutationFn: async (data: Record<any, any>) => {
        throw new Error("Token is missing. Cannot create an user.");
      },
    };
  }

  return {
    mutationKey: ["users"],
    mutationFn: async ({data, id}: {data: Record<string, any>, id: string}) => {


      const formData = new FormData()

      Object.entries(data).map(([key, value]) => {
        formData.append(key, value)
      })

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create users");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users']});
      toast.success("Berhasil membuat pesanan", { position: 'top-right' })
    },
  };
});


const deleteUserMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); 

  if (!token) {
    return {
      mutationKey: ["orders"],
      mutationFn: async (data: Record<any, any>) => {
        throw new Error("Token is missing. Cannot create an users.");
      },
    };
  }

  return {
    mutationKey: ["orders"],
    mutationFn: async ({id}: {id: string}) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const content = await response.json()

      if (response.status == 422) {
        console.log(content)
        toast.error(content.errors, { position: 'top-right' })
      }

      if (!response.ok) {
        throw new Error("Failed to delete users");
      }

      return content;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders']});
      toast.success("Berhasil menghapus pengguna", { position: 'top-right' })
    },

  };
});



export { updateUserMutationAtom, deleteUserMutationAtom};
