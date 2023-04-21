import {lazy} from "react";
import AuthGuard from "app/auth/AuthGuard";
import Redirect from "app/auth/Redirect";
import Account from "app/views/account";
import calendarRoutes from "app/views/calendar/CalendarRoutes";
import chartsRoute from "app/views/charts/ChartsRoute";
import chatRoutes from "app/views/chat-box/ChatRoutes";
import crudRoute from "app/views/CRUD/CrudRoutes";
import {dashboardRoutes} from "app/views/dashboard/DashboardRoutes";
import dataTableRoutes from "app/views/data-table/dataTableRoutes";
import dragAndDropRoute from "app/views/Drag&Drop/DragAndDropRoute";
import ecommerceRoutes from "app/views/ecommerce/EcommerceRoutes";
import formsRoutes from "app/views/forms/FormsRoutes";
import inboxRoute from "app/views/inbox/InboxRoutes";
import invoiceRoutes from "app/views/invoice/InvoioceRoutes";
import ListRoute from "app/views/list/ListRoute";
import mapRoutes from "app/views/map/MapRoutes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import pageLayoutRoutes from "app/views/page-layouts/PageLayoutRoutees";
import pagesRoutes from "app/views/pages/pagesRoutes";
import pricingRoutes from "app/views/pricing/PricingRoutes";
import scrumBoardRoutes from "app/views/scrum-board/ScrumBoardRoutes";
import NotFound from "app/views/sessions/NotFound";
import sessionRoutes from "app/views/sessions/SessionRoutes";
import todoRoutes from "app/views/todo/TodoRoutes";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import teamRoutes from "./views/team/teamRoutes";
import blogRoutes from "./views/blog/blogRoutes";
import Loadable from "./components/Loadable";
import servicesRoutes from "./views/services/servicesRoutes";

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
         {path: "/company", element: <Company/>},
         //default routes
         ...dashboardRoutes,
         ...calendarRoutes,
         ...chartsRoute,
         ...chatRoutes,
         ...crudRoute,
         ...dataTableRoutes,
         ...dragAndDropRoute,
         ...ecommerceRoutes,
         ...formsRoutes,
         ...invoiceRoutes,
         ...ListRoute,
         ...mapRoutes,
         ...materialRoutes,
         ...inboxRoute,
         ...pageLayoutRoutes,
         ...pagesRoutes,
         ...pricingRoutes,
         ...scrumBoardRoutes,
         ...todoRoutes,
         {path: "/page-layouts/account", element: <Account/>},
      ],
   },
   ...sessionRoutes,
   {path: "/", element: <Redirect/>},
   {path: "*", element: <NotFound/>},
];

export default routes;
