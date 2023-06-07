import { databases } from "@/appwrite";
import { todo } from "node:test";

export const getTodosGroupedByColumn = async () => {
  //pull todos from the db
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  console.log(data);

  //pull data first from docs
  const todos = data.documents;
  //group todos by status in the Map format (key, value)
  //todos: [...], inp: [...], done: [...]
  const columns = todos.reduce((acc, todo) => {
    //if empty, create a key
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    //push todos/values to the key
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      //if has todo.image, then append image: todo.image
      //parse back to obj
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });
    return acc;
  }, new Map<TypedColumn, Column>());
  //console.log(columns);

  // add with empty todos if columns do not have any inprogress todo and done

  // create empty columns, always has a map of 3 columns

  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    // if no column, set empty todos
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  // sorting columns by types
  const sortedColumns = new Map(
    //get key/value and create an array from it and sort it
    //always fix the order when refresh
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );
  const board: Board = {
    columns: sortedColumns,
  };
  return board;
};
