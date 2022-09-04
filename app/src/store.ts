import create from "zustand";

type Store = {
  draft: string;
  results: any;
}

type Actions = {
  updateDraft: (draft: string) => void;
  setResults: (results: any) => void;
}


export const useStore = create<Store & Actions>((set, get) => ({
  draft: "",
  updateDraft: (draft) => set({ draft }),
  results: null,
  setResults: (results) => set({ results })
}))