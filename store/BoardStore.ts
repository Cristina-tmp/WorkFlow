import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";

// everything contained inside the board
//go to typings and create a Board type
interface BoardState {
  //of type Board
  board: Board;
  getBoard: () => void;
}

//initial
export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  //fetch todos from the db
  //todo:[...], inp:[...], done:[...]
  getBoard: async () => {
    //populate board with todo:[...], inp:[...], done:[...]
    const board = await getTodosGroupedByColumn();
    //set global state
    set({ board });
  },
}));
