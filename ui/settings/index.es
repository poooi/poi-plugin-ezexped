import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox, FormControl,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'
import { modifyObject } from 'subtender'

import {
  readySelector,
  sparkledCountSelector,
  hideMainFleetSelector,
  hideSatReqsSelector,
  syncMainFleetIdSelector,
  fleetAutoSwitchSelector,
} from '../../selectors'
import { actionCreators } from '../../store'
import { PTyp } from '../../ptyp'
import { __ } from '../../tr'

class SettingsImpl extends PureComponent {
  static propTypes = {
    ready: PTyp.bool.isRequired,
    sparkledCount: PTyp.number.isRequired,
    hideMainFleet: PTyp.bool.isRequired,
    hideSatReqs: PTyp.bool.isRequired,
    syncMainFleetId: PTyp.bool.isRequired,
    fleetAutoSwitch: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleChange = propName => e => {
    const v = e.target.checked
    this.props.modifyState(
      modifyObject(propName, () => v)
    )
  }

  handleSparkledCountChange = e => {
    const sparkledCount = Number(e.target.value)
    this.props.modifyState(
      modifyObject('sparkledCount', () => sparkledCount)
    )
  }

  render() {
    const {
      ready,
      sparkledCount,
      hideMainFleet,
      hideSatReqs,
      syncMainFleetId,
      fleetAutoSwitch,
    } = this.props

    return (
      <div
        id="plugin-ezexped-settings"
        style={{
          display: 'grid',
          gridTemplate: 'auto / 2fr 1fr',
          marginBottom: '1.8em',
          alignItems: 'center',
        }}
      >
        <OverlayTrigger
          overlay={
            (
              <Tooltip id="ezexped-settings-sparked-count-tooltip">
                {__('SparkledCountCustomDesc')}
              </Tooltip>
            )
          }
          placement="bottom"
        >
          <div>
            {__('SparkledCountCustom')}
          </div>
        </OverlayTrigger>
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
        <div>{__("HideMainFleet")}</div>
        <Checkbox
          onChange={this.handleChange('hideMainFleet')}
          disabled={!ready}
          checked={hideMainFleet}
        />
        <div>{__("HideSatReqs")}</div>
        <Checkbox
          onChange={this.handleChange('hideSatReqs')}
          disabled={!ready}
          checked={hideSatReqs}
        />
        <div>{__('SyncMainFleetId')}</div>
        <Checkbox
          onChange={this.handleChange('syncMainFleetId')}
          disabled={!ready}
          checked={syncMainFleetId}
        />
        <OverlayTrigger
          overlay={
            (
              <Tooltip id="ezexped-auto-btn-tooltip">
                {__("AutoTooltip")}
              </Tooltip>
            )
          }
          placement="bottom"
        >
          <div>
            Auto-switch between Fleets
          </div>
        </OverlayTrigger>
        <Checkbox
          onChange={this.handleChange('fleetAutoSwitch')}
          disabled={!ready}
          checked={fleetAutoSwitch}
        />
      </div>
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
    fleetAutoSwitch: fleetAutoSwitchSelector,
  }),
  actionCreators,
)(SettingsImpl)

export { Settings }
