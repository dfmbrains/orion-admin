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
import reviewsRoutes from "./views/reviews/ReviewsRoutes";
//default routes
// import {dashboardRoutes} from "./views/dashboard/DashboardRoutes";
// import calendarRoutes from "./views/calendar/CalendarRoutes";
// import chartsRoute from "./views/charts/ChartsRoute";
// import chatRoutes from "./views/chat-box/ChatRoutes";
// import dataTableRoutes from "./views/data-table/dataTableRoutes";
// import dragAndDropRoute from "./views/Drag&Drop/DragAndDropRoute";
// import ecommerceRoutes from "./views/ecommerce/EcommerceRoutes";
// import formsRoutes from "./views/forms/FormsRoutes";
// import invoiceRoutes from "./views/invoice/InvoioceRoutes";
// import ListRoute from "./views/list/ListRoute";
// import mapRoutes from "./views/map/MapRoutes";
// import materialRoutes from "./views/material-kit/MaterialRoutes";
// import inboxRoute from "./views/inbox/InboxRoutes";
// import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
// import pagesRoutes from "./views/pages/pagesRoutes";
// import pricingRoutes from "./views/pricing/PricingRoutes";
// import scrumBoardRoutes from "./views/scrum-board/ScrumBoardRoutes";
// import Account from "./views/account";
// import crudRoute from "./views/CRUD/CrudRoutes";

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
         ...reviewsRoutes,
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
