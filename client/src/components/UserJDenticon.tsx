import React from 'react'
import * as jdenticon from 'jdenticon'
import { User } from '../models/User'
import { GreenlightStatusTypes } from '../models/GreenlightStatus'

const configs: { [k in GreenlightStatusTypes]: jdenticon.JdenticonConfig } = {
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
      grayscale: 1,
    },
    backColor: '#ecf2fe',
  },
}

type Props = {
  user: User
  size: number
  alert?: boolean
}

const UserJDenticon = ({ user, size, alert }: Props) => {
  jdenticon.configure(configs[user.lastUnexpiredGreenlightStatus().status])
  return (
    <div
      // dangerouslySetInnerHTML={{ __html: jdenticon.toSvg(user.id, size) }}
      style={{
        // border: '1px solid #00000022',
        borderRadius: `${size}px`,
        background: alert ? '' : `url(data:image/svg+xml;base64,${btoa(
          jdenticon.toSvg(user.id, size),
        )})`,
        backgroundPosition: 'center',
        height: `${size}px`,
        width: `${size}px`,
        textAlign: 'center',
        lineHeight: `${size}px`,
        fontWeight: 'bold',
        color: 'var(--gl-color-dark)',
      }}
    >
      {user.firstName[0]}
    </div>
  )
}

export default UserJDenticon
