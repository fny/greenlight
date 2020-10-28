import React from 'react'
import * as jdenticon from 'jdenticon'
import { User } from '../models/User'
import { DateTime } from 'luxon'
import { GREENLIGHT_STATUSES } from  '../models/GreenlightStatus'
const configs: { [k in GREENLIGHT_STATUSES]: jdenticon.JdenticonConfig } = {
  recovery: {
    hues: [328],
    lightness: {
      color: [0.5, 1],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.5,
      grayscale: 1,
    },
    backColor: '#feecfe',
  },
  pending: {
    hues: [50],
    lightness: {
      color: [0.5, 1],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.5,
      grayscale: 1,
    },
    backColor: '#f9f1bb',
  },
  cleared: {
    hues: [146],
    lightness: {
      color: [0.5, 1],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.5,
      grayscale: 1,
    },
    backColor: '#abe8d6',
  },
  unknown: {
    hues: [146],
    lightness: {
      color: [0.6, 0.9],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.0,
      grayscale: 0.0,
    },
    backColor: '#eeeeee',
  },
  absent: {
    hues: [216],
    lightness: {
      color: [0.5, 1],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.5,
      grayscale: 0,
    },
    backColor: '#ecf2fe',
  },
}

type Props = {
  date: DateTime
  status: GREENLIGHT_STATUSES
  size: number
}

const StatusJDenticon = ({ date, status, size }: Props) => {
  jdenticon.configure(configs[status])
  return (
    <div
      // dangerouslySetInnerHTML={{ __html: jdenticon.toSvg(user.id, size) }}
      style={{
        // border: '1px solid #00000022',
        borderRadius: `${size}px`,
        background: `url(data:image/svg+xml;base64,${btoa(
          jdenticon.toSvg(date.toLocaleString(DateTime.DATE_SHORT), size)
        )})`,
        backgroundPosition: 'center',
        height: `${size}px`,
        width: `${size}px`,
        textAlign: 'center',
        lineHeight: `${size}px`,
        fontWeight: 'bold',
        fontSize: `${Math.floor(size / 6)}px`,
        color: 'var(--gl-color-dark)'
      }}
    >
      {date.toLocaleString(DateTime.DATE_SHORT)}
    </div>
  )
}

export default StatusJDenticon
