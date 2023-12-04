import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function SortableItem({ id, index, handleImageRemove, image }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = {
    display: "inline-block", // or 'inline-flex'
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onDeleteClick = (event) => {
    // Prevent click event from triggering drag
    event.stopPropagation();
    handleImageRemove(index);
  };

  return (
    <div ref={setNodeRef} style={style} >
        <span {...attributes} {...listeners} className="cursor-grab">
        <FontAwesomeIcon icon={faBars} />
        </span>
      <img
        src={URL.createObjectURL(image)}
        alt={`Preview ${index}`}
        className="w-40"
        onLoad={() => {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }}
      />
      <p>{image.name}</p>
      <button type="button" onClick={onDeleteClick}>
        Delete
      </button>
    </div>
  );
}
