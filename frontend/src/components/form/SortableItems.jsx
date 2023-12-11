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
    position: 'relative',
    display: 'inline-block',
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onDeleteClick = (event) => {
    event.stopPropagation();
    handleImageRemove(index);
  };

  const imageUrl =
    typeof image === "object"
      ? URL.createObjectURL(image)
      : `${import.meta.env.VITE_API_BASE_URL}/storage/${image}`;

  const imageName = typeof image === "object" ? image.name : image.item_name;

  return (
    <div ref={setNodeRef} style={style}>
      <span {...attributes} {...listeners} className="cursor-move">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          id="draggabledots"
          className="w-10"
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            margin: '0.2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Background color with opacity
          }}
        >
          <path
            fill="#D71313"
            d="M8.5,10a2,2,0,1,0,2,2A2,2,0,0,0,8.5,10Zm0,7a2,2,0,1,0,2,2A2,2,0,0,0,8.5,17Zm7-10a2,2,0,1,0-2-2A2,2,0,0,0,15.5,7Zm-7-4a2,2,0,1,0,2,2A2,2,0,0,0,8.5,3Zm7,14a2,2,0,1,0,2,2A2,2,0,0,0,15.5,17Zm0-7a2,2,0,1,0,2,2A2,2,0,0,0,15.5,10Z"
          ></path>
        </svg>
      </span>
      <img
        src={imageUrl}
        alt={`Preview ${index}`}
        className="w-40"
        onLoad={() => {
          URL.revokeObjectURL(imageUrl);
        }}
      />
      <button type="button" onClick={onDeleteClick}>
        Delete
      </button>
    </div>
  );
}
