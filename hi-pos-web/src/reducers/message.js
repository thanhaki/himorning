import { SET_MESSAGE,LOAD_DATA_ORDERED, CLEAR_MESSAGE,SET_TITLE, SHOW_LOADING, HIDE_LOADING, RE_FETCH_DATA } from "../actions/types";

const initialState = {};

export default function messageAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_MESSAGE:
      return { ...state, message: payload };

    case CLEAR_MESSAGE:
      return { ...state, message: "" };
      
    case SET_TITLE:
      return { ...state, title: payload };

    case SHOW_LOADING:
      return { ...state, isShow: payload };

    case HIDE_LOADING:
      return { ...state, isShow: false };

    case RE_FETCH_DATA:
      return {...state, isReFetchData: payload}
    
    case LOAD_DATA_ORDERED:
      return {...state, isLoadDataOrdered: payload}
    
    default:
      return state;
  }
}