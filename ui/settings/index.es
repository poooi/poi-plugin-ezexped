import { join } from 'path-extra'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox, Radio, RadioGroup, Position, HTMLSelect,
} from '@blueprintjs/core'
import { modifyObject } from 'subtender'
import { Tooltip } from 'views/components/etc/overlay'

import {
  readySelector,
  gsRateCustomSelector,
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

const OptionCheckbox = styled(Checkbox)`
  margin-top: 10px;
  margin-bottom: 10px;
`

@connect(
  createStructuredSelector({
    ready: readySelector,
    gsRateCustom: gsRateCustomSelector,
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
    gsRateCustom: PTyp.number.isRequired,
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

  handleGSRateCustomChange = e => {
    const gsRateCustom = Number(e.target.value)
    this.props.modifyState(
      modifyObject('gsRateCustom', () => gsRateCustom)
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
      gsRateCustom,
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
        <Tooltip
          content={__('GSRateCustomDesc')}
          position={Position.BOTTOM}
        >
          {__('GSRateCustom')}
        </Tooltip>
        <HTMLSelect
          onChange={this.handleGSRateCustomChange}
          disabled={!ready}
          value={gsRateCustom}
          componentClass="select">
          {
            [100,95,90,85,80].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))
          }
        </HTMLSelect>
        <div>{__("HideMainFleet")}</div>
        <OptionCheckbox
          onChange={this.handleChange('hideMainFleet')}
          disabled={!ready}
          checked={hideMainFleet}
        />
        <div>{__("HideSatReqs")}</div>
        <OptionCheckbox
          onChange={this.handleChange('hideSatReqs')}
          disabled={!ready}
          checked={hideSatReqs}
        />
        <div>{__('SyncMainFleetId')}</div>
        <OptionCheckbox
          onChange={this.handleChange('syncMainFleetId')}
          disabled={!ready}
          checked={syncMainFleetId}
        />
        <Tooltip
          content={__('FleetAutoSwitchDesc')}
          position={Position.BOTTOM}
        >
          {__('FleetAutoSwitch')}
        </Tooltip>
        <OptionCheckbox
          onChange={this.handleChange('fleetAutoSwitch')}
          disabled={!ready}
          checked={fleetAutoSwitch}
        />
        <div>
          Kancepts
        </div>
        <RadioGroup
          onChange={this.handleKanceptsUrlChange}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 0,
          }}
          selectedValue={kanceptsUrl}
        >
          {
            [
              ['github', urlGitHub, 'GitHub'],
              ['kcwiki', urlKcWiki, 'kcwiki'],
            ].map(([which, url, text]) => (
              <Radio
                className="kancepts"
                value={which}
                key={which}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                name="kanceptsUrl"
              >
                <Tooltip
                  position={Position.LEFT}
                  content={url}
                >
                  {text}
                </Tooltip>
              </Radio>
            ))
          }
        </RadioGroup>
      </div>
    )
  }
}

export { Settings }
