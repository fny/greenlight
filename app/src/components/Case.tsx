import * as React from "react";
import { StatelessComponent } from "react";
import { chdir } from "process";

interface WhenProps {
    value: any;
    children: any;
}
export const When: StatelessComponent<WhenProps> = ({ children }) =>
  children === undefined ? null : children;

  interface Props {
    test: any;
    children: any;
    matchAll?: boolean
}

export const Case: StatelessComponent<Props> = ( { test, children, matchAll }) => {
    const matches = React.Children
                         .toArray(children)
                         .filter((child:any) => child.props.value == test);
    if (matches.length === 0) {
        return null;
    }

    if (!matchAll) {
      if (matches.length > 1) {
        console.error(`<Case /> statement matched multiple children: ${test}`);
      }
      return matches[0] as any;
    }

  return <div>{matches}</div>
}
