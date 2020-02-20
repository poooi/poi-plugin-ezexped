import { join } from 'path-extra'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Checkbox, Radio, RadioGroup, Position, HTMLSelect,
} from '@blueprintjs/core'
import { modifyObject } from 'subtender'
import {
  Tooltip as BPTooltip,
} from 'views/components/etc/overlay'

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

const OptionCheckbox = styled(Checkbox)`
  margin-top: 10px;
  margin-bottom: 10px;
`

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
        <BPTooltip
          content={
            (
              <div id="ezexped-settings-sparked-count-tooltip">
                {__('SparkledCountCustomDesc')}
              </div>
            )
          }
          position={Position.BOTTOM}
        >
          <div>
            {__('SparkledCountCustom')}
          </div>
        </BPTooltip>
        <HTMLSelect
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
        <BPTooltip
          content={
            (
              <div id="ezexped-auto-btn-tooltip">
                {__('FleetAutoSwitchDesc')}
              </div>
            )
          }
          position={Position.BOTTOM}
        >
          <div>
            {__('FleetAutoSwitch')}
          </div>
        </BPTooltip>
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
                <BPTooltip
                  position={Position.LEFT}
                  content={url}
                >
                  {text}
                </BPTooltip>
              </Radio>
            ))
          }
        </RadioGroup>
      </div>
    )
  }
}

export { Settings }
