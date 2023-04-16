import Loadable from "app/components/Loadable";
import React, {lazy} from "react";

const Blog = Loadable(lazy(() => import("./Blog")));

const blogRoutes = [
   {path: "/blog", element: <Blog/>},
];

export default blogRoutes;
