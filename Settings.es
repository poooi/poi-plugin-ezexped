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
            [4,5,6].map((num, ind) =>
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
// - value
class AllowPluginAutoSwitchSetting extends Component {
  handleChange = () => {
    config.set(keyAllowSwitch, !this.props.value)
  }

  render() {
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between"}}>
        <div style={{flex: "4", alignSelf: "center"}}>
          {`${__("AllowPluginAutoSwitch")}:`}
        </div>
        <Checkbox
            style={{flex: "1", marginLeft: "5px"}}
            checked={this.props.value}
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
    allowPluginAutoSwitch: get(
      state.config,
      keyAllowSwitch, false),
  })
})(class EZExpedSettings extends Component {
  render() {
    return (
      <div style={{display:"flex", flexDirection:"column"}}>
        <RecommendSparkledCountSetting
            value={this.props.recommendSparkledCount} />
        <AllowPluginAutoSwitchSetting
            value={this.props.allowPluginAutoSwitch} />
      </div>)
  }})

export {
  keyRecommendSparkled,
  keyAllowSwitch,
  settingsClass,
}
