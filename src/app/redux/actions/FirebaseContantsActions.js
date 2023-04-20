import {getAllCollection} from "../../firebase/firestoreFirebase";
import {constantsFirebasePath} from "../../utils/constant";

export const GET_ALL_CONSTANTS = "GET_ALL_CONSTANTS";

export const getAllConstants = () => (dispatch) => {
   getAllCollection(constantsFirebasePath)
       .then((res) => dispatch({type: GET_ALL_CONSTANTS, payload: res[0] ? res[0] : res}))
};
