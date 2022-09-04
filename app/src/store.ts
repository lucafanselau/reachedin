import create from "zustand";
import { ReadabilityScores } from "./functions/readability";

type Results = { 
  scores: ReadabilityScores;
  // E2E engagement
  // engagement: never;
}

type Store = {
  draft: string;
  results?: Results;
}

type Actions = {
  updateDraft: (draft: string) => void;
  setResults: (results?: Results) => void;
}


export const useStore = create<Store & Actions>((set, get) => ({
  draft: "",
  updateDraft: (draft) => set({ draft }),
  results: undefined,
  setResults: (results) => set({ results })
}))