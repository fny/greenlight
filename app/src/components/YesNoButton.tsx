import React from 'react'

import {
  Row,
  Col,
  Segmented,
  Button,
} from 'framework7-react'

interface YesNoButtonProps {
  setYesNo: (yesNo: boolean) => void
  yesNo: boolean | null
}

export default function YesNoButton({ yesNo, setYesNo }: YesNoButtonProps) {
  return (
    <Row>
      <Col width="50">
        <Segmented tag="p">
          <Button outline fill={yesNo === true} onClick={() => setYesNo(true)}>
            Yes
          </Button>
          <Button
            outline
            fill={yesNo === false}
            onClick={() => setYesNo(false)}
          >
            No
          </Button>
        </Segmented>
      </Col>
    </Row>
  )
}
