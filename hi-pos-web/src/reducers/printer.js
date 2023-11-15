import {
   SHOW_FOOTER,
  } from "../actions/types";
  
  const initialState = {isShowFooter: true};
  
  export default function printAction(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case SHOW_FOOTER:
        return {
          ...state,
          isShowFooter: payload,
        };
      default:
        return state;
    }
  }