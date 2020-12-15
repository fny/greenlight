import React, { useEffect, useRef } from 'reactn'
import { Page, Navbar, Block } from 'framework7-react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'

import { getCovidData } from 'src/api'
import { CovidData } from 'src/models'
import states from 'src/assets/data/states.json'

const state = 'North Carolina'
const county = 'Durham'

const MapPage = ({}) => {
  const mapRef = useRef<ReactEcharts>(null)

  useEffect(() => {
    getCovidData().then((res) => {
      const covidData: { [i: string]: CovidData } = res.reduce((acc, cur) => ({ ...acc, [cur.county]: cur }), {})
      const stateInfo = states.find((stateItem) => stateItem.label === state)
      const geoData: GeoDataType = require(`src/assets/data/geoData/${stateInfo!.value}.json`)
      const populationInfo: PopulationType[] = require('src/assets/data/us-population.json')
      const ncPopulation: { [i: string]: number } = populationInfo
        .filter((p) => p.state === state)
        .reduce((acc, cur) => ({ ...acc, [cur.county]: [cur.population] }), {})
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
              value: ((covidData[item.properties.NAME]?.cases || 0) / ncPopulation[item.properties.NAME]) * 1000000,
              cases: covidData[item.properties.NAME]?.cases,
              deaths: covidData[item.properties.NAME]?.deaths,
              population: ncPopulation[item.properties.NAME],
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

interface PopulationType {
  county: string
  state: string
  population: number
}

const chartOption = {
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    formatter(params: any) {
      const cases = `${params.data.cases}`.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      const deaths = `${params.data.deaths}`.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      const population = `${params.data.population}`.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      const value = `${params.value}`.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
      return `${params.name}<br/>Cases: ${cases}<br/>Deaths: ${deaths}<br/>Population: ${population}<br/>Cases / 1M pop: ${value}`
    },
  },
  visualMap: {
    min: 0,
    max: 100000,
    orient: 'horizontal',
    left: 'center',
    bottom: 0,
    inRange: {
      color: [
        '#ffffbf',
        '#ffff40',
        '#ffff00',
        '#ffdb00',
        '#ffb600',
        '#ff9200',
        '#ff6D00',
        '#ff4900',
        '#ff2400',
        '#ff0000',
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
