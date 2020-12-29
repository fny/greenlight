import ReactEcharts from 'echarts-for-react'
import {
  Block, List, ListItem, Navbar, Page,
} from 'framework7-react'
import React from 'react'
import { useState } from 'reactn'
import LoadingPageContent from 'src/components/LoadingPageContent'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { Line } from 'react-chartjs-2'

import './AdminDashboardPage.css'
import { dynamicPaths } from 'src/config/routes'

export default function AdminDashboardPage(): JSX.Element {
  const [state, setState] = useState({
    isLoading: true,
  })

  const data = {
    labels: ['W', 'Th', 'F', 'S', 'Su', 'M', 'T'],
    datasets: [
      {
        label: 'Submissions',
        data: [12, 19, 3, 5, 2, 3, 6],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Cleared',
        data: [9, 3, 1, 1, 1, 1, 2],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Pending',
        data: [1, 1, 1, 1, 1, 1, 1],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <Page>
      {/* {
        state.isLoading
          ? <LoadingPageContent />
          : (
            <>
              <Navbar title="">
                <NavbarHomeLink slot="left" />
              </Navbar>
              <div>

              </div>
            </>
          )

      } */}
      <Navbar title="Greenlight Academy (12/29)">
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <div className="stats-squares">
          <div className="stats-square cleared">
            <div className="stats-square-title">
              Cleared
            </div>
            <div className="stats-square-number">
              1,000
            </div>
          </div>

          <div className="stats-square pending">
            <div className="stats-square-title">
              Pending
            </div>
            <div className="stats-square-number">
              1,000
            </div>
          </div>

          <div className="stats-square recovery">
            <div className="stats-square-title">
              Recovery
            </div>
            <div className="stats-square-number">
              1,000
            </div>
          </div>

          <div className="stats-square compliance">
            <div className="stats-square-title">
              Submitted
            </div>
            <div className="stats-square-number">
              87%
            </div>
          </div>
        </div>

        <div className="compliance-chart">
          <Line data={data} options={options} />
        </div>
        <List>
          <ListItem title="Roster" link={dynamicPaths.adminUsersPath('greenlight')} />
        </List>
      </Block>
    </Page>
  )
}
