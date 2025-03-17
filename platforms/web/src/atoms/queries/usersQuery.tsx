import { atom } from "jotai";
import { QueryClient } from "@tanstack/query-core";
import { atomWithQuery } from "jotai-tanstack-query";
import { tokenAtom } from "../auth";

const QueryClientAtom = atom(new QueryClient());

export const usersQueryAtom = atomWithQuery((get) => {
  const token = get(tokenAtom);

  if (!token) {
    return {
      queryKey: ["users", null],
      queryFn: async () => {
        throw new Error("Unauthorized !");
      },
    };
  }

  return {
    queryKey: ["users"],
    queryFn: async () => {
      const token = get(tokenAtom);

      if (!token) {
        return;
      }

      return await fetch(`${import.meta.env.VITE_BASE_API_URL}/users`).then(
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
