import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SharedStore {
    userId: string;
}

const useSharedStore = create(
    immer<SharedStore>(() => ({
        userId: undefined
    }))
)

export { useSharedStore }