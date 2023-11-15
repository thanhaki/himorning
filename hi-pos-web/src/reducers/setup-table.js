import {
  SET_LIST_TABLE,
  UPDATE_LIST_TABLE,
  ADD_NEW_TABLE,
  REMOTE_TABLE,
  SET_TABLE_CURRENT,
} from "../actions/types";

const initialState = { tableList: [], table: {} };


export default function setUpTableAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_LIST_TABLE:
      return {
        ...state,
        tableList: payload,
      };
    case SET_TABLE_CURRENT:
      return {
        ...state,
        table: payload,
      };
    case ADD_NEW_TABLE:
      return {
        ...state,
        tableList: state.tableList.concat(payload)
      };
    case UPDATE_LIST_TABLE:
      const newList = state.tableList.map((item) => {
        if (item.isAddNew) {
          if (payload.idTemp === item.idTemp) {
            const updatedItem = {
              ...item,
              x: payload.x,
              y: payload.y,
            };
            return updatedItem;
          }
        } else if (item.id !== 0 && item.id === payload.id) {
          const updatedItem = {
            ...item,
            x: payload.x,
            y: payload.y,
          };
          return updatedItem;
        }
        return item;
      });
      return { ...state, tableList: newList };
    case REMOTE_TABLE:
      return {
        ...state,
        tableList: state.tableList.filter(item => item !== payload),
      };
    default:
      return state;
  }
}