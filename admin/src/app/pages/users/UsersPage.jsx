import React from 'reactn'
import { t, Trans } from "@lingui/macro"
import i18n from '../../../i18n'

import UsersTable from './UsersTable'

import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
  } from "../../../components";
import { UsersUIProvider } from './UsersUIContext';

  
// TODO: Low priority. Fix type error here.
export default function UsersPage() {
  
    return <UsersUIProvider>
        <Card>
          <CardHeader title={i18n._(t`Users`)}>
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
              >
                <Trans>Add User</Trans>
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            <UsersTable />
          </CardBody>
        </Card>
      </UsersUIProvider>
}