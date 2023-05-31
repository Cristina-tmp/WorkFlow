"use client";
import { useBoardStore } from "@/store/BoardStore";
import React, { use, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type Props = {};

const Board = (props: Props) => {
  const getBoard = useBoardStore((state) => state.getBoard);
  useEffect(() => {
    // get board and use it everywhere
    getBoard();
  }, [getBoard]);
  return (
    <h1></h1>
    // <DragDropContext>
    //   <Droppable droppableId="board" direction="horizontal" type="column">
    //     {(provided) => (
    //       <div className="">{/* rendering all the columns */}</div>
    //     )}
    //   </Droppable>
    // </DragDropContext>
  );
};

export default Board;
