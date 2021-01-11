import {
  Block, List, ListItem, Navbar, Page,
} from 'framework7-react'
import React from 'react'
import { useEffect, useState } from 'reactn'
import LoadingPageContent from 'src/components/LoadingPageContent'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { Line } from 'react-chartjs-2'

import './AdminDashboardPage.css'
import { dynamicPaths, paths } from 'src/config/routes'
import { UsersFilter } from 'src/components/UsersFilter'
import { assertNotUndefined } from 'src/helpers/util'
import { F7Props } from 'src/types'
import { getLocation, store, v1 } from 'src/api'
import { GreenlightStatus, Location } from 'src/models'
import { GreenlightStatusTypes } from 'src/models/GreenlightStatus'
import logger from 'src/helpers/logger'

interface StatsSquareProps {
  title: string
  number: string | number
  view: 'cleared' | 'pending' | 'recovery' | 'submitted'
  selected?: boolean
  onClick: () => void
}

function pad(n: number) {
  return String(`0${n}`).slice(-2)
}

function fetchCount(summary: WeeklySummary, date: string, status: GreenlightStatusTypes): number {
  const values = summary[date]
  if (!values) return 0
  const value = values[status]
  if (!value) return 0
  return value
}

function fetchSubmitted(summary: WeeklySummary, date: string): number {
  const values = summary[date]
  if (!values) return 0
  return (values.cleared || 0) + (values.recovery || 0) + (values.pending || 0)
}

function fetchCounts(summary: WeeklySummary, dates: string[], status: GreenlightStatusTypes | 'submitted'): number[] {
  if (status === 'submitted') {
    return dates.map((date) => fetchSubmitted(summary, date))
  }
  return dates.map((date) => fetchCount(summary, date, status))
}

function StatsSquare(props: StatsSquareProps): JSX.Element {
  return (
    <div onClick={props.onClick} className={`stats-square ${props.view} ${props.selected ? 'selected' : ''}`}>
      <div className="stats-square-title">
        {props.title}
      </div>
      <div className="stats-square-number">
        {props.number}
      </div>
    </div>
  )
}

type WeeklySummary = { [k: string]: {[k in GreenlightStatusTypes]: number} }

class State {
  location: Location | null = null

  view: GreenlightStatusTypes | 'submitted' = GreenlightStatusTypes.CLEARED

  weeklySummary: WeeklySummary | null = null
}

function chartColor(view: GreenlightStatusTypes | 'submitted'): string {
  const colors: { [k in GreenlightStatusTypes | 'submitted']: string } = {
    unknown: 'gray',
    absent: 'gray',
    cleared: '#00A183',
    pending: '#FFD034',
    recovery: '#FF3494',
    submitted: '#8accff',
  }
  return colors[view]
}

export default function AdminDashboardPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  assertNotUndefined(locationId)
  const [state, setState] = useState({ ...new State(), location: store.findEntity<Location>(Location.uuid(locationId)) })

  useEffect(() => {
    if (state.location === null) {
      getLocation(locationId).then((loc) => setState({ ...state, location: loc }))
    }

    v1.get(`/locations/${locationId}/stats-overview/today`).then(
      (res) => setState({ ...state, weeklySummary: res.data.data.attributes.weeklyStatusSummary }),
    ).catch(logger.error)
  }, [])

  let content
  if (!state.location || !state.weeklySummary) {
    content = <LoadingPageContent />
  } else {
    const weekdays = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']

    const dates = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d
    }).reverse()

    const datesStr = dates.map((d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
    const labels = dates.map(
      (d) => weekdays[d.getDay()],
    )

    weekdays
    const todayStr = datesStr[datesStr.length - 1]
    const data = {
      labels,
      datasets: [
        {
          label: null,
          data: fetchCounts(state.weeklySummary, datesStr, state.view || 'submitted'),

          fill: false,
          backgroundColor: chartColor(state.view),
          borderColor: chartColor(state.view),
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
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
    content = (
      <>
        <Navbar title={`${state.location.name} Overview`}>
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>

          <div className="stats-squares">
            <StatsSquare
              onClick={() => {
                setState({ ...state, view: GreenlightStatusTypes.CLEARED })
              }}
              view="cleared"
              title="Cleared"
              number={fetchCount(state.weeklySummary, todayStr, GreenlightStatusTypes.CLEARED)}
            />
            <StatsSquare
              onClick={() => {
                setState({ ...state, view: GreenlightStatusTypes.PENDING })
              }}
              view="pending"
              title="Pending"
              number={fetchCount(state.weeklySummary, todayStr, GreenlightStatusTypes.PENDING)}
            />
            <StatsSquare
              onClick={() => {
                setState({ ...state, view: GreenlightStatusTypes.RECOVERY })
              }}
              view="recovery"
              title="Recovery"
              number={fetchCount(state.weeklySummary, todayStr, GreenlightStatusTypes.RECOVERY)}
            />
            <StatsSquare
              onClick={() => {
                setState({ ...state, view: 'submitted' })
              }}
              view="submitted"
              title="Submitted"
              number={fetchSubmitted(state.weeklySummary, todayStr)}
            />
          </div>

          <UsersFilter />

          <div className="compliance-chart">
            <Line data={data} options={options} />
          </div>

          <List>
            <ListItem title="Roster" link={dynamicPaths.adminUsersPath(locationId)} />
            {
              state.location.category === 'school'
            && <ListItem title="Score Card" link={paths.schoolScoreCardPath} />
            }
          </List>
        </Block>
      </>
    )
  }

  return (
    <Page>
      {content}
    </Page>
  )
}