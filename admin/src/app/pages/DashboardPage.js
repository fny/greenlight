import React from "react";
import {
  Dashboard
} from "../../_metronic/_partials";

import {useSubheader} from "../../_metronic/layout";

export function DashboardPage() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Dashboard");
  return <Dashboard />;
}
