import { combineReducers } from "redux";
import EcommerceReducer from "./EcommerceReducer";
import NavigationReducer from "./NavigationReducer";
import NotificationReducer from "./NotificationReducer";
import ScrumBoardReducer from "./ScrumBoardReducer";

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  scrumboard: ScrumBoardReducer,
  ecommerce: EcommerceReducer,
});

export default RootReducer;
