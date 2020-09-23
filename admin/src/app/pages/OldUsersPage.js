import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
// import { CustomersPage } from "./customers/CustomersPage";
import { ProductsPage } from "./x-users/UsersPage";
import { ProductEdit } from "./x-users/user-edit/UserEdit";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function UPage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from eCommerce root URL to /customers */
          <Redirect
            exact={true}
            from="/u"
            to="/u/customers"
          />
        }
        {/* <ContentRoute path="/u/customers" component={CustomersPage} /> */}
        <ContentRoute path="/u/users/new" component={ProductEdit} />
        <ContentRoute
          path="/u/users/:id/edit"
          component={ProductEdit}
        />

        <ContentRoute path="/u/users" component={ProductsPage} />
      </Switch>
    </Suspense>
  );
}
