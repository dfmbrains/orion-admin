import Loadable from "app/components/Loadable";
import React, {lazy} from "react";

const TeamList = Loadable(lazy(() => import('./TeamList')));
const TeamForm = Loadable(lazy(() => import('./TeamForm/TeamForm')));
const TeamMemberViewer = Loadable(lazy(() => import('./TeamMember/TeamMemberViewer')));

const teamRoutes = [
   {path: "/team", element: <TeamList/>},
   {path: "/team/create", element: <TeamForm/>},
   {path: "/team/edit/:id", element: <TeamForm/>},
   {path: "/team/view/:id", element: <TeamMemberViewer/>},
];

export default teamRoutes;
