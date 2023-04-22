import Loadable from "app/components/Loadable";
import {lazy} from "react";

const ReviewsTable = Loadable(lazy(() => import("./ReviewsTable")));

const reviewsRoute = [{path: "/reviews", element: <ReviewsTable/>}];

export default reviewsRoute;
