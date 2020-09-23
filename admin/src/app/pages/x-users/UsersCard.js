import React, {useMemo} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { ProductsFilter } from "./users-filter/UsersFilter";
import { ProductsTable } from "./users-table/UsersTable";
import { ProductsGrouping } from "./users-grouping/UsersGrouping";
import { useProductsUIContext } from "./UsersUIContext";

export function ProductsCard() {
  const productsUIContext = useProductsUIContext();
  const productsUIProps = useMemo(() => {
    return {
      ids: productsUIContext.ids,
      queryParams: productsUIContext.queryParams,
      setQueryParams: productsUIContext.setQueryParams,
      newProductButtonClick: productsUIContext.newProductButtonClick,
      openDeleteProductsDialog: productsUIContext.openDeleteProductsDialog,
      openEditProductPage: productsUIContext.openEditProductPage,
      openUpdateProductsStatusDialog:
        productsUIContext.openUpdateProductsStatusDialog,
      openFetchProductsDialog: productsUIContext.openFetchProductsDialog,
    };
  }, [productsUIContext]);

  return (
    <Card>
      <CardHeader title="Products list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={productsUIProps.newProductButtonClick}
          >
            New Product
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ProductsFilter />
        {productsUIProps.ids.length > 0 && (
          <>
            <ProductsGrouping />
          </>
        )}
        <ProductsTable />
      </CardBody>
    </Card>
  );
}
