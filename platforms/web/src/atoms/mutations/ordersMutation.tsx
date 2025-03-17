import { atomWithMutation } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";

const createOrderMutationAtom = atomWithMutation((get) => {
  const token = get(tokenAtom);
  const queryClient = get(QueryClientAtom); // ✅ Get QueryClient instance

  if (!token) {
    return;
  }

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

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);QueryClient
    },
  };
});

export { createOrderMutationAtom };
