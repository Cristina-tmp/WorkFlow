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
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard,
  ]);

  // fetch board data and use it everywhere
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  //let go of the dnd operation
  const handldeOnDragEnd = (result: DropResult) => {
    //console.log(result);
  };

  console.log(board);
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
