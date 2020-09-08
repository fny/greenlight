/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {Dropdown} from "react-bootstrap";
import {DropdownCustomToggler } from "../_metronic/_partials/dropdowns";

interface Props {
  className: string
}

export function TasksWidget({ className }: Props) {
  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">Task Overview</h3>
          <div className="card-toolbar">
            <Dropdown className="dropdown-inline" drop="down" alignRight>
                <Dropdown.Toggle
                  id="dropdown-toggle-top2"
                  // variant="transparent"
                  className="btn btn-light btn-sm font-size-sm font-weight-bolder dropdown-toggle text-dark-75">
                  Create
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                  <DropdownMenu1 />
                </Dropdown.Menu>
              </Dropdown>
          </div>
        </div>
        {/* Body */}
        <div className="card-body pt-2">
          <div className="d-flex align-items-center mb-10">
            <span className="bullet bullet-bar bg-success align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-success checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" name="" onChange={() => {}} value="1" />
              <span></span>
            </label>

            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1"
              >
                Approve Shelly Michael
              </a>
              <span className="text-muted font-weight-bold">Requested today</span>
            </div>
            <ItemDropdown item="" />
          </div>

          <div className="d-flex align-items-center mb-10">
            <span className="bullet bullet-bar bg-success align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-success checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" name="" onChange={() => {}} value="1" />
              <span></span>
            </label>

            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1"
              >
                Approve Sally Jenkins
              </a>
              <span className="text-muted font-weight-bold">Requested yesterday</span>
            </div>
            <ItemDropdown item="" />
          </div>

          <div className="d-flex align-items-center mb-10">
            <span className="bullet bullet-bar bg-danger align-self-stretch"></span>

            <label className="checkbox checkbox-lg checkbox-light-danger checkbox-single flex-shrink-0 m-0 mx-4">
              <input type="checkbox" name="" onChange={() => {}} value="1" />
              <span></span>
            </label>

            <div className="d-flex flex-column flex-grow-1">
              <a
                href="#"
                className="text-dark-75 text-hover-primary font-weight-bold font-size-lg mb-1"
              >
                Submit Weekly Report
              </a>
              <span className="text-muted font-weight-bold">Requested today</span>
            </div>
            <ItemDropdown item="" />
          </div>

        </div>
      </div>
    </>
  );
}

const ItemDropdown = ({item}: { item: any }) => {
  return (<>
  <Dropdown className="dropdown-inline" alignRight>
    <Dropdown.Toggle
      // variant="transparent"
      id="dropdown-toggle-top"
      // className="btn btn-hover-light-primary btn-sm btn-icon"
      as={DropdownCustomToggler}>
      <i className="ki ki-bold-more-hor" />
    </Dropdown.Toggle>
    <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
      <DropdownMenu1 />
    </Dropdown.Menu>
  </Dropdown>
  </>);
};


export function DropdownMenu1() {
  return (<>
      {/*begin::Navigation*/}
      <ul className="navi navi-hover">
          <li className="navi-header font-weight-bold py-5">
              <span className="font-size-lg">Choose Label:</span>
              <i className="flaticon2-information icon-md text-muted" data-toggle="tooltip" data-placement="right"
                 title="Click to learn more..."></i>
          </li>
          <li className="navi-separator mb-3 opacity-70"></li>
          <li className="navi-item">
              <a href="#" className="navi-link">
          <span className="navi-text">
              <span className="label label-xl label-inline label-light-success">One</span>
          </span>
              </a>
          </li>
          <li className="navi-item">
              <a href="#" className="navi-link">
          <span className="navi-text">
              <span className="label label-xl label-inline label-light-danger">Two</span>
          </span>
              </a>
          </li>
          <li className="navi-item">
              <a href="#" className="navi-link">
          <span className="navi-text">
              <span className="label label-xl label-inline label-light-warning">Three</span>
          </span>
              </a>
          </li>
          <li className="navi-item">
              <a href="#" className="navi-link">
          <span className="navi-text">
              <span className="label label-xl label-inline label-light-primary">Four</span>
          </span>
              </a>
          </li>
          <li className="navi-item">
              <a href="#" className="navi-link">
          <span className="navi-text">
              <span className="label label-xl label-inline label-light-dark">Five</span>
          </span>
              </a>
          </li>
          <li className="navi-separator mt-3 opacity-70"></li>
          <li className="navi-footer pt-5 pb-4">
              <a className="btn btn-clean font-weight-bold btn-sm" href="#">
                  <i className="ki ki-plus icon-sm"></i>
                  Add new
              </a>
          </li>
      </ul>
      {/*end::Navigation*/}
  </>);
}
