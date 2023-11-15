import { SET_OUTLET, SET_LIST_OUTLET } from "../actions/types";

const initialState = { outlet: {}, listOutlet: [] };
export default function mdataAction(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_OUTLET:
      return { ...state, outlet: payload };
    case SET_LIST_OUTLET:
      return { ...state, listOutlet: payload };
    default:
      return state;
  }
}