/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./pages/MetronicPages";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";


import { UsersPage } from "./pages/UsersPage"
import { ProductEdit } from "./pages/users/user-edit/UserEdit"
import { LayoutSplashScreen } from "../components/SplashScreen"
import { ContentRoute } from "../components/ContentRoute"

export function Routes() {
    const {isAuthorized} = useSelector(
        (state) => ({
            isAuthorized: (state as any).auth.user != null,
        }),
        shallowEqual
    );

    return (
        <Switch>
            {!isAuthorized ? (
                /*Render auth page when user at `/auth` and not authorized.*/
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                /*Otherwise redirect to root page (`/`)*/
                <Redirect from="/auth" to="/"/>
            )}

            <Route path="/error" component={ErrorsPage}/>
            <Route path="/logout" component={Logout}/>

            {!isAuthorized ? (
                /*Redirect to `/auth` when user is not authorized*/
                <Redirect to="/auth/login"/>
            ) : (
                <Layout>
                    <BasePage />
                    <ContentRoute path="/users" component={UsersPage} />
                    <ContentRoute path="/users/new" component={ProductEdit} />
                    <ContentRoute
                      path="users/:id/edit"
                      component={ProductEdit}
                    />
                </Layout>
            )}
        </Switch>
    );
}
