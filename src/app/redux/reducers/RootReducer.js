import { combineReducers } from "redux";
import EcommerceReducer from "./EcommerceReducer";
import NavigationReducer from "./NavigationReducer";
import NotificationReducer from "./NotificationReducer";
import ScrumBoardReducer from "./ScrumBoardReducer";
import FirebaseConstantsReducer from "./FirebaseConstantsReducer";

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  scrumboard: ScrumBoardReducer,
  ecommerce: EcommerceReducer,
  constants: FirebaseConstantsReducer,
});

export default RootReducer;
