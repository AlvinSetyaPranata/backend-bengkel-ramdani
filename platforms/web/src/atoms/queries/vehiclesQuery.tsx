import { atomWithQuery } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";
import QueryClientAtom from "../query";
import { atom } from "jotai";


export const vehiclesPagination = atom(1);

export const vehiclesQueryAtom = atomWithQuery((get) => {
  const token = get(tokenAtom);

  if (!token) {
    return {
      queryKey: ["vehicles", null, get(vehiclesPagination)],
      queryFn: async () => {
        throw new Error("Unauthorized !");
      },
    };
  }

  return {
    queryKey: ["vehicles", get(vehiclesPagination)],
    queryFn: async () => {
      const token = get(tokenAtom);

      if (!token) {
        return;
      }

      const page = get(vehiclesPagination);

      return await fetch(`${import.meta.env.VITE_BASE_API_URL}/kendaraan?page=${page}`, {
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
