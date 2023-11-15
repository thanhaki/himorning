import { Button } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

const MenuItem = ({ menu, index,handleDelete, handleRowClick}) => {
  const handleClick = () => {
      handleRowClick(menu);
  };

  const handleDeleteClick = (event) => {
      event.stopPropagation(); // Ngăn chặn sự kiện onClick lan ra handleClick
      handleDelete(menu.id);
  };

  return (
    <Draggable draggableId={menu.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
        >
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <p><strong>{menu.ten_TD} </strong> | Số lượng mặt hàng: {menu.soLuong}</p>
                      <Button variant="outlined" onClick={handleDeleteClick}>
                          Delete
                      </Button>
                  </div>
              </div>
          )}
      </Draggable>
  );
};

export default MenuItem;
