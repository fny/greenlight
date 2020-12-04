import React, { useEffect, useRef } from 'reactn'
import { Page, Navbar, Block } from 'framework7-react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'

import states from 'src/data/states.json'
import { getCovidData } from 'src/api'
import { CovidData } from 'src/models'

const state = 'North Carolina'
const county = 'Durham'

const MapPage = ({}) => {
  const mapRef = useRef<ReactEcharts>(null)

  useEffect(() => {
    getCovidData().then((res) => {
      const covidData: { [i: string]: CovidData } = res.reduce((acc, cur) => ({ ...acc, [cur.county]: cur }), {})
      const stateInfo = states.find((stateItem) => stateItem.label === state)
      const geoData: GeoDataType = require(`src/data/geo_data/${stateInfo!.value}.json`)
      echarts.registerMap('filteredState', geoData)

      const countyInfo = geoData.features.find((item) => item.properties.NAME === county)
      if (!countyInfo) return
      const centerCoordinate = countyInfo.geometry.coordinates[0].reduce(
        (res, cur, index) => {
          if (index === 0) {
            return [cur, cur]
          }
          let [[maxX, maxY], [minX, minY]] = res
          if (maxX < cur[0]) {
            maxX = cur[0]
          }
          if (maxY < cur[1]) {
            maxY = cur[1]
          }
          if (minX > cur[0]) {
            minX = cur[0]
          }
          if (minY > cur[1]) {
            minY = cur[1]
          }
          return [
            [maxX, maxY],
            [minX, minY],
          ]
        },
        [
          [0, 0],
          [0, 0],
        ],
      )

      mapRef.current?.getEchartsInstance().setOption({
        series: [
          {
            name: 'USA Estimates',
            mapType: 'filteredState',
            type: 'map',
            zoom: 8,
            center: [
              (centerCoordinate[0][0] + centerCoordinate[1][0]) / 2,
              (centerCoordinate[0][1] + centerCoordinate[1][1]) / 2,
            ],
            roam: true,
            nameProperty: 'NAME',
            label: {
              show: true,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data: geoData.features.map((item) => ({
              name: item.properties.NAME,
              value: covidData[item.properties.NAME].cases,
              deaths: covidData[item.properties.NAME].deaths,
            })),
          },
        ],
      } as echarts.EChartOption.SeriesMap)
    })
  }, [])

  return (
    <Page>
      <Navbar title="Map" backLink="Back" />
      <Block>
        <ReactEcharts ref={mapRef} option={chartOption as echarts.EChartOption.SeriesMap} style={{ flex: 1 }} />
      </Block>
    </Page>
  )
}

export default MapPage

interface GeoDataType {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry: {
      type: string
      coordinates: Array<Array<[number, number]>>
    }
    properties: {
      CENSUSAREA: number
      COUNTY: string
      GEO_ID: string
      LSAD: string
      NAME: string
      STATE: string
    }
  }>
}

const chartOption = {
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    formatter(params: any) {
      const value = `${params.value}`.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      const deaths = `${params.deaths}`.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      return `${params.name}<br/>Cases: ${value}<br/>Deaths: ${deaths}`
    },
  },
  visualMap: {
    min: 0,
    max: 50000,
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
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
      name: 'USA Cases',
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
