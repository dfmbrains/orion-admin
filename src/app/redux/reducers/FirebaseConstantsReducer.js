import {GET_ALL_CONSTANTS} from "../actions/FirebaseContantsActions";

const initialState = {
   constants: {},
};

const FirebaseConstantsReducer = function (state = initialState, action) {
   switch (action.type) {
      case GET_ALL_CONSTANTS: {
         return {...state, constants: action.payload};
      }

      default: {
         return {...state};
      }
   }
};

export default FirebaseConstantsReducer;
