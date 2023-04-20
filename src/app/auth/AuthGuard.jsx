import useAuth from 'app/hooks/useAuth';
// import { flat } from 'app/utils/utils';
import {Navigate, useLocation} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {getAllConstants} from "../redux/actions/FirebaseContantsActions";
// import AllPages from '../routes';

// const userHasPermission = (pathname, user, routes) => {
//   if (!user) {
//     return false;
//   }
//   const matched = routes.find((r) => r.path === pathname);

//   const authenticated =
//     matched && matched.auth && matched.auth.length ? matched.auth.includes(user.role) : true;
//   return authenticated;
// };

const AuthGuard = ({children}) => {
   const {
      isAuthenticated,
      // user
   } = useAuth();
   const {pathname} = useLocation();
   const dispatch = useDispatch()
   //   const routes = flat(AllPages);

   //   const hasPermission = userHasPermission(pathname, user, routes);
   //   let authenticated = isAuthenticated && hasPermission;

   // // IF YOU NEED ROLE BASED AUTHENTICATION,
   // // UNCOMMENT ABOVE LINES
   // // AND COMMENT OUT BELOW authenticated VARIABLE

   let authenticated = isAuthenticated;

   useEffect(() => {
      if (authenticated) {
         dispatch(getAllConstants())
      }
   }, [authenticated])

   return (
       <>
          {authenticated ? (
              children
          ) : (
              <Navigate replace to="/session/signin" state={{from: pathname}}/>
          )}
       </>
   );
};

export default AuthGuard;
