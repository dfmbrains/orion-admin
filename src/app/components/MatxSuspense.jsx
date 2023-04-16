import MatxLoading from "app/components/MatxLoading";
import React, { Suspense } from "react";

const MatxSuspense = ({ children }) => {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
};

export default MatxSuspense;
