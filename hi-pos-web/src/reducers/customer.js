import {
   SET_SELECTED_CUSTOMER,
  } from "../actions/types";
  
  const initialState = {customer: null};
  
  export default function customerAction(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case SET_SELECTED_CUSTOMER:
        return {
          ...state,
          customer: payload,
        };
      default:
        return state;
    }
  }