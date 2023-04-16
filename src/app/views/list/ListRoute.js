import Loadable from "app/components/Loadable";
import React, { lazy } from "react";

const AppList = Loadable(lazy(() => import("./AppList")));

const ListRoute = [{ path: "/matx-list", element: <AppList /> }];

export default ListRoute;
