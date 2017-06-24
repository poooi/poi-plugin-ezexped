import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  FormControl,
  Checkbox,
} from 'react-bootstrap'

import {
  ezconfigSelector,
} from './selectors'

import { ezconfigs, ConfigDef } from './ezconfig'
import { __ } from './tr'
import { not } from './utils'

class RecommendSparkledCountSetting extends Component {
  constructor(props) {
    super(props)
    this.configDef = ezconfigs.recommendSparkledCount
  }

  handleChange = e => {
    // seems like e.target.value somehow gets coerced to a string,
    // so we need to convert it back.
    const v = parseInt(e.target.value, 10)
    this.configDef.setValue(v)
  }

  render() {
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between"}}>
        <div style={{flex: "4", alignSelf: "center"}}>
          {`${__("CustomRecommendSparkledCount")}:`}
        </div>
        <FormControl
            style={{flex: "1", marginLeft: "5px"}}
            value={this.configDef.getValue()}
            onChange={this.handleChange}
            componentClass="select">
          {
            [3,4,5,6].map((num, ind) =>
              <option key={ind} value={num}>
                {num}
              </option>
            )
          }
        </FormControl>
      </div>)
  }
}

// props:
// - label
// - configDef
class CheckboxSetting extends Component {
  static propTypes = {
    label: PropTypes.node,
    configDef: PropTypes.instanceOf(ConfigDef),
  }

  handleChange = () =>
    this.props.configDef.modifyValue(not)

  render() {
    const { label } = this.props
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between"}}>
        <div style={{flex: "4", alignSelf: "center"}}>
          {`${label}:`}
        </div>
        <Checkbox
            style={{flex: "1", marginLeft: "5px"}}
            checked={this.props.configDef.getValue()}
            onChange={this.handleChange}>
        </Checkbox>
      </div>)
  }
}

class EZExpedSettings extends Component {
  static propTypes = {
    recommendSparkled: PropTypes.number.isRequired,
    hideMainFleet: PropTypes.bool.isRequired,
    hideSatReqs: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px"}}>
        <RecommendSparkledCountSetting />
        <CheckboxSetting
            label={__("HideMainFleet")}
            configDef={ezconfigs.hideMainFleet}
        />
        <CheckboxSetting
            label={__("HideSatReqs")}
            configDef={ezconfigs.hideSatReqs}
        />
      </div>)
  }
}

const settingsClass = connect(ezconfigSelector)(EZExpedSettings)

export {
  settingsClass,
}
