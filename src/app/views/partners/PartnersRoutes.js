import Loadable from "app/components/Loadable";
import React, {lazy} from "react";
import PartnersForm from "./PartnersForm";

const PartnersList = Loadable(lazy(() => import("./PartnersList")));

const partnersRoutes = [
   {path: "/partners", element: <PartnersList/>},
   {path: "/partners/create", element: <PartnersForm/>},
   {path: "/partners/edit/:id", element: <PartnersForm/>}
];

export default partnersRoutes;
