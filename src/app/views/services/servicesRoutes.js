import Loadable from "app/components/Loadable";
import React, {lazy} from "react";

const Service = Loadable(lazy(() => import("./Service")));
const ServiceForm = Loadable(lazy(() => import("./ServiceForm")));

const servicesRoutes = [
   {path: "/services", element: <Service/>},
   {path: "/services/create", element: <ServiceForm/>},
   {path: "/services/edit/:id", element: <ServiceForm/>},
];

export default servicesRoutes;
