"use client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "./Column.jsx";

export default function Board({ board, onAddCard, onCardMove, onEditCard, onDeleteCard }) {
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onCardMove(source, destination, draggableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex space-x-4 overflow-x-auto pb-4"
          >
            {board.stages
              .sort((a, b) => a.order - b.order)
              .map((stage, index) => (
                <Column
                  key={stage.id}
                  stage={stage}
                  index={index}
                  onAddCard={onAddCard}
                  onEditCard={onEditCard}
                  onDeleteCard={onDeleteCard}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}