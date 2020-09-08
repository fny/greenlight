import React from 'react'
import * as jdenticon from 'jdenticon'
import { User } from '../models/user'
import { GREENLIGHT_STATUSES } from  '../models/greenlightStatus'
const configs: { [k in GREENLIGHT_STATUSES]: jdenticon.JdenticonConfig } = {
  red: {
    hues: [328],
    lightness: {
      color: [0.0, 1],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.5,
      grayscale: 1,
    },
    backColor: '#feecfe',
  },
  yellow: {
    hues: [50],
    lightness: {
      color: [0.0, 1],
      grayscale: [1, 1],
    },
    saturation: {
      color: 0.5,
      grayscale: 1,
    },
    backColor: '#f9f1bb',
  },
  green: {
    hues: [146],
    lightness: {
      color: [0.0, 1],
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
      color: [0.0, 1],
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
}

const JDenticon = ({ user, size }: Props) => {
  jdenticon.configure(configs[user.greenlightStatus().status])
  return (
    <div
      // dangerouslySetInnerHTML={{ __html: jdenticon.toSvg(user.id, size) }}
      style={{
        // border: '1px solid #00000022',
        borderRadius: `${size}px`,
        background: `url(data:image/svg+xml;base64,${btoa(
          jdenticon.toSvg(user.id, size)
        )})`,
        backgroundPosition: 'center',
        height: `${size}px`,
        width: `${size}px`,
        textAlign: 'center',
        lineHeight: `${size}px`,
        fontWeight: 'bold',
        color: 'var(--gl-color-dark)'
      }}
    >
      {user.firstName[0]}
    </div>
  )
}

export default JDenticon
