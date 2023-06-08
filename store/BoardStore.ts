import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { databases } from "@/appwrite";
// everything contained inside the board
//go to typings and create a Board type
interface BoardState {
  //of type Board
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  newTaskInput: string;
  setNewTaskInput: (newTaskInput: string) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (newTaskType: TypedColumn) => void;
}

//initial
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
  newTaskInput: "",
  newTaskType: "todo",
  //fetch todos from the db
  //todo:[...], inp:[...], done:[...]
  getBoard: async () => {
    //populate board with todo:[...], inp:[...], done:[...]
    const board = await getTodosGroupedByColumn();
    //set global state
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    //delete todoId from the newcolumn
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    //set the new column
    set({ board: { columns: newColumns } });
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (newTaskType) => set({ newTaskType }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
}));
