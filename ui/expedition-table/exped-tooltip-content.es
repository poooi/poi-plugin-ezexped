import React, { PureComponent } from 'react'
import {
  Grid, Row, Col,
} from 'react-bootstrap'
import { MaterialIcon } from 'views/components/etc/icon'

import { expedInfo } from '../../exped-info'
import { fmtTime } from '../../tr'
import { PTyp } from '../../ptyp'

class ExpedTooltipContent extends PureComponent {
  static propTypes = {
    expedId: PTyp.number.isRequired,
  }

  render() {
    const {expedId} = this.props
    const info = expedInfo[expedId]
    return (
      <Grid style={{width: '100%', padding: '.2em .4em'}}>
        <Row>
          <Col>{info.name}</Col>
        </Row>
        <Row><Col>{fmtTime(info.timeInMin)}</Col></Row>
        {
          [
            [
              [['fuel',1], ['steel',3]], 'fuel-steel',
            ],
            [
              [['ammo',2], ['bauxite',4]], 'ammo-bauxite',
            ],
          ].map(([cols,key]) => (
            <Row key={key}>
              {
                cols.map(([resourceProp,matId]) => (
                  <Col key={resourceProp} sm={6} style={{display: 'flex', alignItems: 'center'}}>
                    <MaterialIcon
                      materialId={matId}
                      className="material-icon"
                    />
                    <span style={{flex: 1, marginLeft: '.4em'}}>
                      {info.resource[resourceProp]}
                    </span>
                  </Col>
                ))
              }
            </Row>
          ))
        }
      </Grid>
    )
  }
}

export { ExpedTooltipContent }
