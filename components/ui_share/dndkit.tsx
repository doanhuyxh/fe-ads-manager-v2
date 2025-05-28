import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


// Component Tiêu đề kéo thả
const DraggableColumnHeader = ({ index, title, columnKey }: { index: number, title: string; columnKey: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: columnKey });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
        userSelect: "none" as React.CSSProperties['userSelect'],
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span
                className='text-black hover:text-blue-500 font-bold px-2 py-1 mx-2 my-3 border-2 rounded-lg'>
                {index}.{title}
            </span>
        </div>
    );
};

export default DraggableColumnHeader