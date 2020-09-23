import React from "react";
import { Route } from "react-router-dom";
import { ProductsLoadingDialog } from "./users-loading-dialog/UsersLoadingDialog";
import { ProductDeleteDialog } from "./user-delete-dialog/UserDeleteDialog";
import { ProductsDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog";
import { ProductsFetchDialog } from "./users-fetch-dialog/UsersFetchDialog";
import { ProductsUpdateStatusDialog } from "./users-update-status-dialog/UsersUpdateStatusDialog";
import { ProductsCard } from "./UsersCard";
import { ProductsUIProvider } from "./UsersUIContext";

export function ProductsPage({ history }) {
  const productsUIEvents = {
    newProductButtonClick: () => {
      history.push("/users/new");
    },
    openEditProductPage: (id) => {
      history.push(`/users/${id}/edit`);
    },
    openDeleteProductDialog: (id) => {
      history.push(`/users/${id}/delete`);
    },
    openDeleteProductsDialog: () => {
      history.push(`/users/delete`);
    },
    openFetchProductsDialog: () => {
      history.push(`/users/fetch`);
    },
    openUpdateProductsStatusDialog: () => {
      history.push("/users/update-status");
    },
  };

  return (
    <ProductsUIProvider productsUIEvents={productsUIEvents}>
      <ProductsLoadingDialog />
      <Route path="/users/delete">
        {({ history, match }) => (
          <ProductsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/users");
            }}
          />
        )}
      </Route>
      <Route path="/users/:id/delete">
        {({ history, match }) => (
          <ProductDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/users");
            }}
          />
        )}
      </Route>
      <Route path="/users/fetch">
        {({ history, match }) => (
          <ProductsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/users");
            }}
          />
        )}
      </Route>
      <Route path="/users/update-status">
        {({ history, match }) => (
          <ProductsUpdateStatusDialog
            show={match != null}
            onHide={() => {
              history.push("/users");
            }}
          />
        )}
      </Route>
      <ProductsCard />
    </ProductsUIProvider>
  );
}
