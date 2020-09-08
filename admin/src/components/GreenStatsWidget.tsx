/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo, useEffect} from "react";
import objectPath from "object-path";
import ApexCharts, { ApexOptions } from "apexcharts";
import config from "../config"


interface Props {
  title: string
  subtitle: string
  data: number[]
  className?: string
}



export function GreenStatsWidget({ title, subtitle, className, data }: Props) {
  const options: ApexOptions = {
    series: [
      {
        name: title,
        data: data
      }
    ],
    chart: {
      type: "area",
      height: 150,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "solid",
      opacity: 1
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [config.colors.base.success]
    },
    xaxis: {
      categories: ["Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7"],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: config.colors.gray500,
          fontSize: "12px",
          fontFamily: config.fontFamily
        }
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: config.colors.gray300,
          width: 1,
          dashArray: 3
        }
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: config.fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        style: {
          colors: config.colors.gray500,
          fontSize: "12px",
          fontFamily: config.fontFamily
        }
      },
      max: 105,
      min: 80
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: config.fontFamily
      },
      y: {
        formatter: function(val: any) {
          return val + "%";
        }
      }
    },
    colors: [config.colors.light.success],
    markers: {
      colors: [config.colors.light.success],
      strokeColors: [config.colors.base.success],
      strokeWidth: 3
    }
  };



  const widgetId =  `widget-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`



  useEffect(() => {
    const element = document.getElementById(widgetId);

    if (!element) {
      return;
    }

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, []);


  const change = data[data.length - 1] - data[data.length - 2]

  
  return (
    <div className={`card card-custom ${className}`}>
      <div className="card-body d-flex flex-column p-0">
        <div className="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
          <div className="d-flex flex-column mr-2">
            <a
              href="#"
              className="text-dark-75 text-hover-primary font-weight-bolder font-size-h5"
            >
              {title}
            </a>
            <span className="text-muted font-weight-bold mt-2">
              {subtitle}
            </span>
          </div>
          <span className="symbol symbol-light-success symbol-45">
            <span className="symbol-label font-weight-bolder font-size-h6">
            {change >= 0 ? '+' : '-'}{Math.abs(change)}%
            </span>
          </span>
        </div>
        <div
          id={widgetId}
          className="card-rounded-bottom"
          style={{ height: "150px" }}
        ></div>
      </div>
    </div>
  );
}
