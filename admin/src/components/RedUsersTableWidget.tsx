/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useState} from "react";
import { Nav, Tab } from "react-bootstrap";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../_metronic/_helpers";

interface Props {
  className: string
}


export function RedUsersTableWidget({ className }: Props) {
  return (
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">Teachers and Staff of Concern</span>
            <span className="text-muted mt-3 font-weight-bold font-size-sm">10 of your teachers and staff are staying home</span>
          </h3>
          {/* <div className="card-toolbar">
            <a href="#" className="btn btn-info font-weight-bolder font-size-sm mr-3">New Report</a>
            <a href="#" className="btn btn-danger font-weight-bolder font-size-sm">Create</a>
          </div> */}
        </div>
        {/* Body */}
        <div className="card-body pt-0 pb-3">
          <div className="tab-content">
            <div className="table-responsive">
              <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                <thead>
                <tr className="text-left text-uppercase">
                  <th className="pl-7"><span className="text-dark-75">Teacher</span></th>
                  <th style={{minWidth: "100px"}}>Current Status</th>
                  <th style={{minWidth: "100px"}}>Returning</th>
                  <th style={{minWidth: "80px"}}/>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td className="pl-0 py-8">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50 symbol-light mr-4">
                          <span className="symbol-label">
                            <span className="svg-icon h-75 align-self-end">
                              <SVG src={toAbsoluteUrl("/images/svg/avatars/boy-0.svg")}/>
                            </span>
                          </span>
                      </div>
                      <div>
                        <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                          Brad
                          Simmons</a>
                        <span className="text-muted font-weight-bold d-block">3rd Grade Teacher</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="label label-lg label-light-warning label-inline font-weight-bolder font-size-lg">
                      Stay Home
                    </span>
                  </td>
                  <td>
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                      5 days from now
                    </span>
                  </td>
                  <td className="pr-0 text-right">
                    <a href="#" className="btn btn-light font-weight-bolder font-size-sm">View</a>
                  </td>
                </tr>
                <tr>
                  <td className="pl-0 py-8">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50 symbol-light mr-4">
                          <span className="symbol-label">
                            <span className="svg-icon h-75 align-self-end">
                              <SVG src={toAbsoluteUrl("/images/svg/avatars/girl-5.svg")}/>
                            </span>
                          </span>
                      </div>
                      <div>
                        <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                          Marsha
                          Walker</a>
                        <span className="text-muted font-weight-bold d-block">4th Grade Teacher</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="label label-lg label-light-danger label-inline font-weight-bolder font-size-lg">
                      Recovering
                    </span>
                  </td>
                  <td>
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                      5 days from now
                    </span>
                  </td>
                  <td className="pr-0 text-right">
                    <a href="#" className="btn btn-light font-weight-bolder font-size-sm">View</a>
                  </td>
                </tr>
                <tr>
                  <td className="pl-0 py-8">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50 symbol-light mr-4">
                          <span className="symbol-label">
                            <span className="svg-icon h-75 align-self-end">
                              <SVG src={toAbsoluteUrl("/images/svg/avatars/girl-3.svg")}/>
                            </span>
                          </span>
                      </div>
                      <div>
                        <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                          Mary
                          Goldwasser</a>
                        <span className="text-muted font-weight-bold d-block">5th Grade Teacher</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="label label-lg label-light-warning label-inline font-weight-bolder font-size-lg">
                      Stay Home
                    </span>
                  </td>
                  <td>
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                      5 days from now
                    </span>
                  </td>
                  <td className="pr-0 text-right">
                    <a href="#" className="btn btn-light font-weight-bolder font-size-sm">View</a>
                  </td>
                </tr>
                <tr>
                  <td className="pl-0 py-8">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50 symbol-light mr-4">
                          <span className="symbol-label">
                            <span className="svg-icon h-75 align-self-end">
                              <SVG src={toAbsoluteUrl("/images/svg/avatars/girl-2.svg")}/>
                            </span>
                          </span>
                      </div>
                      <div>
                        <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                          Jon
                          Calhoun</a>
                        <span className="text-muted font-weight-bold d-block">2nd Grade Teacher</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="label label-lg label-light label-inline font-weight-bolder font-size-lg">
                      Unknown
                    </span>
                  </td>
                  <td>
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                      7 days from now
                    </span>
                  </td>
                  <td className="pr-0 text-right">
                    <a href="#" className="btn btn-light font-weight-bolder font-size-sm">View</a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}
