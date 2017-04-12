import React, { Component } from 'react'
import {
  FormControl,
  Checkbox,
} from 'react-bootstrap'

import { connect } from 'react-redux'
import { get } from 'lodash'
const { config } = window
import { __ } from './tr'

const confPath = "plugin.poi-plugin-ezexped."
const keyRecommendSparkled = confPath + "recommendSparkledCount"
const keyAllowSwitch = confPath + "allowPluginAutoSwitch"
const keyHideMainFleet = confPath + "hideMainFleet"
const keyHideSatReqs = confPath + "hideSatReqs"

// props:
// - value: current value of this setting
class RecommendSparkledCountSetting extends Component {
  handleChange = (e) => {
    // seems like e.target.value somehow gets coerced to a string,
    // so we need to convert it back.
    const v = parseInt(e.target.value, 10)
    config.set(keyRecommendSparkled, v)
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
            value={this.props.value}
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
// - path
// - (optional) defVal
class CheckboxSetting extends Component {
  constructor(props) {
    super(props)
    const { path, defVal } = this.props
    this.state = {value: config.get(path,defVal)}
  }
  handleChange = () => {
    const newVal = !this.state.value
    config.set(this.props.path, newVal)
    this.setState({value: newVal})
  }
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
            checked={this.state.value}
            onChange={this.handleChange}>
        </Checkbox>
      </div>)
  }
}

const settingsClass = connect (() => {
  return (state, props) => ({
    recommendSparkledCount: get(
      state.config,
      keyRecommendSparkled, 4),
  })
})(class EZExpedSettings extends Component {
  handleConfigChange = (path, defVal=false) => () => {
    const old = config.get(path,defVal)
    config.set(path, !old)
  }
  render() {
    return (
      <div style={{
        display:"flex",
        flexDirection:"column",
        marginBottom: "20px"}}>
        <RecommendSparkledCountSetting
            value={this.props.recommendSparkledCount} />
        <CheckboxSetting
            label={__("AllowPluginAutoSwitch")}
            defVal={false}
            path={keyAllowSwitch}
        />
        <CheckboxSetting
            label={__("HideMainFleet")}
            defVal={false}
            path={keyHideMainFleet}
        />
        <CheckboxSetting
            label={__("HideSatReqs")}
            defVal={false}
            path={keyHideSatReqs}
        />
      </div>)
  }})

export {
  keyRecommendSparkled,
  keyAllowSwitch,
  keyHideMainFleet,
  keyHideSatReqs,
  settingsClass,
}
