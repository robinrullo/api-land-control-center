import {useContext} from "react";
import ToastContext from "../contexts/ToastContextProvider";

export const useToastContext = () => {
    return useContext(ToastContext)
}
