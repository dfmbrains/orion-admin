import Loadable from "app/components/Loadable";
import React, {lazy} from "react";

const Blog = Loadable(lazy(() => import("./Blog")));
const BlogForm = Loadable(lazy(() => import("./BlogForm")));

const blogRoutes = [
   {path: "/blog", element: <Blog/>},
   {path: "/blog/create", element: <BlogForm/>},
   {path: "/blog/edit/:id", element: <BlogForm/>},
];

export default blogRoutes;
