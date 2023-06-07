"use client";
import { useBoardStore } from "@/store/BoardStore";
import React, { use, useEffect } from "react";
import Column from "./Column";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type Props = {};

const Board = (props: Props) => {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  // fetch board data and use it everywhere
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  //let go of the dnd operation
  const handldeOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    //handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      //remove the index from source
      const [removed] = entries.splice(source.index, 1);
      //push the removed col to the destination index in the correct position
      entries.splice(destination.index, 0, removed);
      const reArrangeCols = new Map(entries);
      setBoardState({
        ...board,
        columns: reArrangeCols,
      });
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    };

    if (!startCol || !endCol) return;
    if (source.index === destination.index && startCol === endCol) return;

    const newTodos = startCol.todos;
    const [removedTodo] = newTodos.splice(source.index, 1);

    //drag in same col
    if (startCol.id === endCol.id) {
      newTodos.splice(destination.index, 0, removedTodo);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns.set(newCol.id, newCol));
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      //drag task in another col
      const newEndTodos = Array.from(endCol.todos);
      newEndTodos.splice(destination.index, 0, removedTodo);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: newEndTodos,
      });

      //update db

      updateTodoInDB(removedTodo, endCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  //console.log(board);
  return (
    <>
      <DragDropContext onDragEnd={handldeOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            // render the cols
            <div
              className="grid grid-col-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* convert board cols to array loop through key/value, destructure id,col */}
              {Array.from(board.columns.entries()).map(
                ([id, column], index) => (
                  <Column key={id} id={id} todos={column.todos} index={index} />
                )
              )}
              {/* rendering all the columns */}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Board;
