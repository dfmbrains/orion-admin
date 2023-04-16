import useSettings from "app/hooks/useSettings";
import React from "react";
import MatxSuspense from "../MatxSuspense";
import { MatxLayouts } from "./index";

const MatxLayout = (props) => {
  const { settings } = useSettings();
  const Layout = MatxLayouts[settings.activeLayout];

  return (
    <MatxSuspense>
      <Layout {...props} />
    </MatxSuspense>
  );
};

export default MatxLayout;
