import { QueryClient, QueryClientConfig } from "@tanstack/query-core";
import { atom } from "jotai";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0
        }
    }
})

const QueryClientAtom = atom(queryClient);


export default QueryClientAtom