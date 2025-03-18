import { atomWithMutation } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";
import { toast } from "react-toastify";

const registerVehicleMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); // ✅ Get QueryClient instance

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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"]});
    },
  };
});

export { registerVehicleMutationAtom };
