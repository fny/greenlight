import React from "react";
import {Route, RouteProps} from "react-router-dom";
import {ReactRouterRender} from "../types";
import { Content} from "./Content";

export function ContentRoute({ children, component, render, ...props }: RouteProps) {

  return (
    <Route {...props}>
      {routeProps => {
        if (typeof children === "function") {
          return <Content>{children(routeProps)}</Content>;
        }

        if (!routeProps.match) {
          return null;
        }

        if (children) {
          return <Content>{children}</Content>;
        }

        if (component) {
          return (
            <Content>{React.createElement(component as any, routeProps)}</Content>
          );
        }

        if (render) {
          return <Content>{render(routeProps as any)}</Content>;
        }

        return null;
      }}
    </Route>
  );
}
