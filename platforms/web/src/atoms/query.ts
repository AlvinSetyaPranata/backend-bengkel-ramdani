import { QueryClient } from "@tanstack/query-core";
import { atom } from "jotai";


const queryClient = new QueryClient()

const QueryClientAtom = atom(queryClient);


export default QueryClientAtom