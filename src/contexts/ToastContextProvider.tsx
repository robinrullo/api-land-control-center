import {createContext, FC, PropsWithChildren, useCallback, useState} from "react";
import {ToastNotification} from "carbon-components-react";
import {ToastNotificationProps} from "carbon-components-react/lib/components/Notification/Notification";

const ToastContext = createContext<(toast: ToastNotificationProps) => void>(() => undefined)
export default ToastContext

export const ToastContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [toasts, setToasts] = useState<ToastNotificationProps[]>([])
    const addToast = useCallback((toast: ToastNotificationProps) => {
            setToasts((toasts) => [toast, ...toasts])
        },
        [setToasts]
    )

    const handleClose = useCallback((key: number) => {
        setToasts((toasts) => toasts.filter((_, k) => k !== key))
        return false
    }, [setToasts])
    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="toast-container">
                {toasts.map((toast, key) => (
                    <ToastNotification {...toast} key={key} onClose={() => handleClose(key)}/>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
