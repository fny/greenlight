import React, { useEffect, useRef } from 'reactn'
import { Page, Navbar, Block } from 'framework7-react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'

import states from 'src/assets/data/states.json'

const state = 'North Carolina'
// const county = 'Durham'

const MapPage = ({}) => {
  const mapRef = useRef(null)
  useEffect(() => {
    const stateInfo = states.find((stateItem) => stateItem.label === state)
    const geoData = require(`src/assets/data/geoData/${stateInfo!.value}.json`)
    echarts.registerMap('filteredState', geoData)
  }, [])

  return (
    <Page>
      <Navbar title="Map" backLink="Back" />
      <Block>
        <ReactEcharts ref={mapRef} option={{}} style={{ flex: 1 }} />
      </Block>
    </Page>
  )
}

export default MapPage

const chartOption = {
  title: {
    text: 'USA Estimates',
    subtext: 'GeoJSON Data from Eric Celeste',
    sublink: 'https://eric.clst.org/tech/usgeojson/',
  },
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    formatter(params: any) {
      const value = (`${params.value}`).split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      return `${params.seriesName}<br/>${params.name}: ${value}`
    },
  },
  visualMap: {
    min: 0,
    max: 10000,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
      ],
    },
    text: ['High', 'Low'],
    calculable: true,
  },
  toolbox: {
    show: true,
    left: 'right',
    top: 'top',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {},
    },
  },
  series: [
    {
      name: 'USA Estimates',
      map: 'filteredState',
      type: 'map',
      zoom: 4,
      roam: true,
      label: {
        show: true,
      },
      emphasis: {
        label: {
          show: true,
        },
      },
    },
  ],
}
