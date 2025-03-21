import { atomWithStorage, createJSONStorage } from "jotai/utils"

const storage = createJSONStorage(() => localStorage)

export const profileAtom = atomWithStorage("profile", null, storage)
export const tokenAtom = atomWithStorage("token", null, storage)
