// TODO: Fix child is a function
import React, { useEffect, useMemo, useGlobal } from "reactn";
import reactn from 'reactn'

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";

import * as uiHelpers from "./UsersUIHelpers";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../components";
import { useUsersUIContext } from "./UsersUIContext";
import { i18n, t } from "../../../i18n"
import { findUsersForLocation } from "../../../common/stores";

import GL from '../../../common/GL'
import { User } from "../../../common/models";
import { Trans } from "@lingui/macro";


const loadUsers = (global: any, dispatch: any, action: any) => ({
  count: global.count + action.amount,
});


export default function UsersTable() {
  // Products UI Context
  const usersUIContext = useUsersUIContext();
  const usersUIProps = useMemo(() => {
    return {
      ids: usersUIContext.ids,
      setIds: usersUIContext.setIds,
      queryParams: usersUIContext.queryParams,
      setQueryParams: usersUIContext.setQueryParams,
    };
  }, [usersUIContext]);

  
  const [global, setGlobal] = useGlobal()
  
  useEffect(() => {
    console.log(global.users)
    if (global.users.length > 0) return
    findUsersForLocation(GL.locationId).then(users => { 
      setGlobal({ users })
    }).catch(err => ({ error: err }))
  })


  const totalCount = global.users.length
  const entities = global.users
  const listLoading = false

  const columns = [
    {
      dataField: 'lastName',
      text: i18n._("Last"),
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'firstName',
      text: i18n._("First"),
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: 'role',
      text: i18n._("Role"),
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent: undefined, row: User, rowId: number) => {
        return <span style={{textTransform: 'capitalize'}}>
          <Trans>{row.roleFor(GL.locationId)}</Trans>
        </span>
      }
    },
    {
      dataField: 'greenlightStatus',
      text: i18n._("Status"),
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent: undefined, row: User, rowId: number) => {
        return <span style={{textTransform: 'capitalize'}}>
          <Trans>{row.lastGreenlightStatus ? row.lastGreenlightStatus.status : 'Unknown'}</Trans>
        </span>
      }
    },
    {
      dataField: 'action',
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ]

  console.log(columns)

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: usersUIContext.queryParams.pageSize,
    page: usersUIContext.queryParams.pageNumber,
  }

  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                {...paginationTableProps}
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                bordered={false}
                // remote
                keyField="id"
                data={entities === null ? [] : entities}
                columns={columns}
                // defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  usersUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: usersUIProps.ids,
                  setIds: usersUIProps.setIds,
                })}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
