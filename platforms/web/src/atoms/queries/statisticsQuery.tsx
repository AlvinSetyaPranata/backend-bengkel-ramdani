import { atomWithQuery } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";

export const statisticQueryAtom = atomWithQuery((get) => {
  const token = get(tokenAtom);

  if (!token) {
    return {
      queryKey: ["statistic", null],
      queryFn: async () => {
        throw new Error("Unauthorized !");
      },
    };
  }

  return {
    queryKey: ["statistic"],
    queryFn: async () => {
      const token = get(tokenAtom);

      if (!token) {
        return;
      }

      return await fetch(`${import.meta.env.VITE_BASE_API_URL}/pesanan/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(
        (res) => {
          if (res.status == 401) {
            return [];
          }
          
          return res.json();
        }
      );
    },
    queryClient: get(QueryClientAtom),
  };
});
