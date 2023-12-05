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
  
  console.log(image)

  const onDeleteClick = (event) => {
    // Prevent click event from triggering drag
    event.stopPropagation();
    handleImageRemove(index);
  };

  const imageUrl =
    typeof image === "object"
      ? URL.createObjectURL(image)
      : `${import.meta.env.VITE_API_BASE_URL}/storage/${image}`;

  const imageName = typeof image === "object" ?
  image.name : image.item_name

  return (
    <div ref={setNodeRef} style={style} >
        <span {...attributes} {...listeners} className="cursor-grab">
        <FontAwesomeIcon icon={faBars} />
        </span>
      <img
        src={imageUrl}
        alt={`Preview ${index}`}
        className="w-40"
        onLoad={() => {
          URL.revokeObjectURL(imageUrl);
        }}
      />
      <p>{imageName}</p>
      <button type="button" onClick={onDeleteClick}>
        Delete
      </button>
    </div>
  );
}
