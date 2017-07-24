import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Grid, Row, Col,
  Checkbox, FormControl,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'

import {
  readySelector,
  sparkledCountSelector,
  hideMainFleetSelector,
  hideSatReqsSelector,
  syncMainFleetIdSelector,
} from '../../selectors'
import { actionCreator } from '../../store'
import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import { modifyObject } from '../../utils'

class SettingsImpl extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    sparkledCount: PTyp.number.isRequired,
    hideMainFleet: PTyp.bool.isRequired,
    hideSatReqs: PTyp.bool.isRequired,
    syncMainFleetId: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleChange = propName => e => {
    const v = e.target.checked
    this.props.modifyState(
      modifyObject(propName, () => v))
  }

  handleSparkledCountChange = e => {
    const sparkledCount = parseInt(e.target.value,10)
    this.props.modifyState(
      modifyObject('sparkledCount', () => sparkledCount))
  }

  render() {
    const {
      ready,
      sparkledCount,
      hideMainFleet,
      hideSatReqs,
      syncMainFleetId,
    } = this.props
    const rowStyle = {
      display: 'flex',
      alignItems: 'baseline',
    }
    return (
      <Grid
        style={{marginBottom: '1.8em'}}
      >
        <Row style={rowStyle}>
          <Col sm={8}>
            <OverlayTrigger
              overlay={
                <Tooltip id="ezexped-settings-sparked-count-tooltip">
                  {__('SparkledCountCustomDesc')}
                </Tooltip>
              }
              placement="bottom">
              <div>
                {__('SparkledCountCustom')}
              </div>
            </OverlayTrigger>
          </Col>
          <Col sm={4}>
            <FormControl
              onChange={this.handleSparkledCountChange}
              disabled={!ready}
              value={sparkledCount}
              componentClass="select">
              {
                [6,5,4,3].map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))
              }
            </FormControl>
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col sm={8}>
            {__("HideMainFleet")}
          </Col>
          <Col sm={4}>
            <Checkbox
              onChange={this.handleChange('hideMainFleet')}
              disabled={!ready}
              checked={hideMainFleet}
              />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col sm={8}>
            {__("HideSatReqs")}
          </Col>
          <Col sm={4}>
            <Checkbox
              onChange={this.handleChange('hideSatReqs')}
              disabled={!ready}
              checked={hideSatReqs}
              />
          </Col>
        </Row>
        <Row style={rowStyle}>
          <Col sm={8}>
            {__('SyncMainFleetId')}
          </Col>
          <Col sm={4}>
            <Checkbox
              onChange={this.handleChange('syncMainFleetId')}
              disabled={!ready}
              checked={syncMainFleetId}
              />
          </Col>
        </Row>
      </Grid>
    )
  }
}

const Settings = connect(
  createStructuredSelector({
    ready: readySelector,
    sparkledCount: sparkledCountSelector,
    hideMainFleet: hideMainFleetSelector,
    hideSatReqs: hideSatReqsSelector,
    syncMainFleetId: syncMainFleetIdSelector,
  }),
  actionCreator,
)(SettingsImpl)

export { Settings }
