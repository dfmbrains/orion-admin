import NotificationContext from "app/contexts/NotificationContext";
import { useContext } from "react";

const useNotification = () => useContext(NotificationContext);

export default useNotification;
