
import {
    SHOW_FOOTER,
} from "./types";

export const showFooter = (status) => ({
    type: SHOW_FOOTER,
    payload: status
});
