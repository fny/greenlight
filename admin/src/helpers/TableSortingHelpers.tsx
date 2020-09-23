/* Pagination Helprs */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "./AssetsHelpers";

export const sortCaret = (order: "asc" | "desc", column: any) => {
  if (!order) return (
    <span className="svg-icon svg-icon-sm svg-icon-primary ml-1 svg-icon-sort">
      <SVG src={toAbsoluteUrl("/images/svg/icons/Shopping/Sort1.svg")}/>
    </span>
  );
  else if (order === "asc")
    return (
      <span className="svg-icon svg-icon-sm svg-icon-primary ml-1">
        <SVG src={toAbsoluteUrl("/images/svg/icons/Navigation/Up-2.svg")}/>
      </span>
    );
  else if (order === "desc")
    return (
      <span className="svg-icon svg-icon-sm svg-icon-primary ml-1">
        <SVG src={toAbsoluteUrl("/images/svg/icons/Navigation/Down-2.svg")}/>
      </span>
    );
  return null;
};

export const headerSortingClasses = (column: any, sortOrder:  "asc" | "desc", isLastSorting: any, colIndex: any) => (
  (sortOrder === 'asc' || sortOrder === "desc") ? 'sortable-active' : ''
);
