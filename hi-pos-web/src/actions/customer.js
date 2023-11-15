
import {
    SET_SELECTED_CUSTOMER,
} from "./types";

export const setSelectedCustomer = (data) => ({
    type: SET_SELECTED_CUSTOMER,
    payload: data
});
