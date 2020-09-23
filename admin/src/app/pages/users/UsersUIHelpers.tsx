import { SortOrder } from 'react-bootstrap-table-next'

export const UserStatusCssClasses = ["success", "info", ""];

export const UserStatusTitles = ["Selling", "Sold"];

export const UserConditionCssClasses = ["success", "danger", ""];

export const defaultSorted = [{ dataField: "lastName", order: "asc" as SortOrder }];

export const sizePerPageList = [
  { text: "10", value: 10 },
  { text: "25", value: 25 },
  { text: "50", value: 50 }
];

export const initialQueryParams = {
  filter: {
    cohort: "",
    role: "",
    greenlightStatus: ""
  },
  sortOrder: "asc", // asc||desc
  sortField: "lastName",
  pageNumber: 1,
  pageSize: 10
}

export type QueryParams = typeof initialQueryParams