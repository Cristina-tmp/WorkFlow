const formatTodoForAI = (board: Board) => {
  const flatArrayCounted = Array.from(board.columns.entries()).reduce(
    (map, [key, value]) => {
      map[key] = value.todos.length;
      return map;
    },
    {} as { [key in TypedColumn]: number }
  );

  return flatArrayCounted;
};

export default formatTodoForAI;
