import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { ID, databases } from "@/appwrite";
import uploadImage from "@/lib/uploadImage";
// everything contained inside the board
//go to typings and create a Board type
interface BoardState {
  //of type Board
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  deleteTodoInDB: (todo: Todo) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  newTaskType: TypedColumn;
  newTaskInput: string;
  setNewTaskInput: (newTaskInput: string) => void;
  setNewTaskType: (newTaskType: TypedColumn) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
  newTaskInput: "",
  newTaskType: "todo",
  image: null,
  // Fetch todos from the db
  // todo:[...], inp:[...], done:[...]
  getBoard: async () => {
    // Populate board with todo:[...], inp:[...], done:[...]
    const board = await getTodosGroupedByColumn();
    // Set global state
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    // Delete todoId from the new column
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    // Set the new column
    set({ board: { columns: newColumns } });
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (newTaskType) => set({ newTaskType }),
  setImage: (image: File | null) => set({ image }),

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

  deleteTodoInDB: async (todo) => {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    // If image is provided and not null
    if (image) {
      // Upload image to appwrite
      const fileUploaded = await uploadImage(image);

      // If fileUploaded, give file with bucketId and fileId
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    // Create a document
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // Image with stringified ids
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    // Set input to empty
    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)!.todos.push(newTodo);
      }

      return { board: { columns: newColumns } };
    });
  },
}));
