import { join } from 'path-extra'
import { createStructuredSelector } from 'reselect'

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox, FormControl,
  FormGroup, Radio,
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
  kanceptsUrlSelector,
} from '../../selectors'
import { actionCreators } from '../../store'
import { PTyp } from '../../ptyp'
import { __ } from '../../tr'
import { urlGitHub, urlKcWiki } from '../../kancepts'

@connect(
  createStructuredSelector({
    ready: readySelector,
    sparkledCount: sparkledCountSelector,
    hideMainFleet: hideMainFleetSelector,
    hideSatReqs: hideSatReqsSelector,
    syncMainFleetId: syncMainFleetIdSelector,
    fleetAutoSwitch: fleetAutoSwitchSelector,
    kanceptsUrl: kanceptsUrlSelector,
  }),
  actionCreators,
)
class Settings extends PureComponent {
  static propTypes = {
    // connected
    ready: PTyp.bool.isRequired,
    sparkledCount: PTyp.number.isRequired,
    hideMainFleet: PTyp.bool.isRequired,
    hideSatReqs: PTyp.bool.isRequired,
    syncMainFleetId: PTyp.bool.isRequired,
    fleetAutoSwitch: PTyp.bool.isRequired,
    kanceptsUrl: PTyp.string.isRequired,
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

  handleKanceptsUrlChange = e => {
    const kanceptsUrl = e.target.value
    this.props.modifyState(
      modifyObject('kanceptsUrl', () => kanceptsUrl)
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
      kanceptsUrl,
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
        <link
          rel="stylesheet"
          href={join(__dirname, '..', '..', 'assets', 'ezexped.css')}
        />
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
                {__('FleetAutoSwitchDesc')}
              </Tooltip>
            )
          }
          placement="bottom"
        >
          <div>
            {__('FleetAutoSwitch')}
          </div>
        </OverlayTrigger>
        <Checkbox
          onChange={this.handleChange('fleetAutoSwitch')}
          disabled={!ready}
          checked={fleetAutoSwitch}
        />
        <div>
          Kancepts
        </div>
        <FormGroup
          onChange={this.handleKanceptsUrlChange}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 0,
          }}
        >
          {
            [
              ['github', urlGitHub, 'GitHub'],
              ['kcwiki', urlKcWiki, 'kcwiki'],
            ].map(([which, url, text]) => (
              <Radio
                checked={which === kanceptsUrl}
                className="kancepts"
                value={which}
                key={which}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                name="kanceptsUrl"
              >
                <OverlayTrigger
                  placement="left"
                  overlay={
                    (
                      <Tooltip id={`ezexped-settings-kancepts-url-${which}`}>
                        {url}
                      </Tooltip>
                    )
                  }
                >
                  <div>{text}</div>
                </OverlayTrigger>
              </Radio>
            ))
          }
        </FormGroup>
      </div>
    )
  }
}

export { Settings }
