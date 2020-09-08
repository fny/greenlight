import React, {useMemo} from "react";

import {
  GreenStatsWidget
} from "../../../components/GreenStatsWidget"

import {
  RedUsersTableWidget
} from "../../../components/RedUsersTableWidget"

import {
  TasksWidget
} from "../../../components/TasksWidget"


export function Dashboard() {
  return <>
      <div className="row">
        <div className="col-lg-6 col-xxl-4">
          <GreenStatsWidget className="card-stretch gutter-b" title="Students Cleared" subtitle="94% Reporting" data={[94, 95, 93, 94, 97, 93, 98 ] }/>
        </div>
        <div className="col-lg-6 col-xxl-4">
          <GreenStatsWidget className="card-stretch gutter-b" title="Teachers Cleared" subtitle="100% Reporting" data={[99, 98, 97, 97, 99, 100, 100 ] }/>
        </div>
        <div className="col-lg-6 col-xxl-4">
          <GreenStatsWidget className="card-stretch gutter-b" title="Staff Cleared" subtitle="90% Reporting" data={[99, 95, 99, 100, 100, 99, 98 ] }/>
        </div>
        <div className="col-xxl-8 order-2 order-xxl-1">
          <RedUsersTableWidget className="card-stretch gutter-b"/>
        </div>
        <div className="col-lg-6 col-xxl-4 order-1 order-xxl-1">
          <TasksWidget className="card-stretch gutter-b"/>
        </div>
      </div>
  </>;
}
