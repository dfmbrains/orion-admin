import {lazy} from "react";
import AuthGuard from "app/auth/AuthGuard";
import Redirect from "app/auth/Redirect";
import NotFound from "app/views/sessions/NotFound";
import sessionRoutes from "app/views/sessions/SessionRoutes";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import teamRoutes from "./views/team/teamRoutes";
import blogRoutes from "./views/blog/blogRoutes";
import Loadable from "./components/Loadable";
import servicesRoutes from "./views/services/servicesRoutes";
import partnersRoutes from "./views/partners/PartnersRoutes";

const Company = Loadable(lazy(() => import('./views/company')));

const routes = [
   {
      element: (
          <AuthGuard>
             <MatxLayout/>
          </AuthGuard>
      ),
      children: [
         //my routes
         ...teamRoutes,
         ...blogRoutes,
         ...servicesRoutes,
         ...partnersRoutes,
         {path: "/company", element: <Company/>},
         // default routes
         // ...dashboardRoutes,
         // ...calendarRoutes,
         // ...chartsRoute,
         // ...chatRoutes,
         // ...crudRoute,
         // ...dataTableRoutes,
         // ...dragAndDropRoute,
         // ...ecommerceRoutes,
         // ...formsRoutes,
         // ...invoiceRoutes,
         // ...ListRoute,
         // ...mapRoutes,
         // ...materialRoutes,
         // ...inboxRoute,
         // ...pageLayoutRoutes,
         // ...pagesRoutes,
         // ...pricingRoutes,
         // ...scrumBoardRoutes,
         // ...todoRoutes,
         // {path: "/page-layouts/account", element: <Account/>},
      ],
   },
   ...sessionRoutes,
   {path: "/", element: <Redirect/>},
   {path: "*", element: <NotFound/>},
];

export default routes;
