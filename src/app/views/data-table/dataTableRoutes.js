import Loadable from "app/components/Loadable";
import { lazy } from "react";

const SimpleMuiTable = Loadable(lazy(() => import("./SimpleMuiTable")));
const ExpandableMuiDataTable = Loadable(lazy(() => import("./ExpandableMuiDataTable")));

const dataTableRoutes = [
  { path: "/data-table/simple-mui-table", element: <SimpleMuiTable /> },
  { path: "/data-table/expandable-mui-table", element: <ExpandableMuiDataTable /> },
];

export default dataTableRoutes;
