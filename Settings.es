import React, { Component } from 'react'
import {
  FormControl,
  Checkbox,
} from 'react-bootstrap'

import { ezconfigs } from './ezconfig'
import { __ } from './tr'

// props:
// - value: current value of this setting
class RecommendSparkledCountSetting extends Component {
  constructor(props) {
    super(props)
    this.configDef = ezconfigs.recommendSparkledCount
    this.state = { value: this.configDef.value }
  }
  handleChange = (e) => {
    // seems like e.target.value somehow gets coerced to a string,
    // so we need to convert it back.
    const v = parseInt(e.target.value, 10)
    const newVal = this.configDef.setValue(v)
    this.setState( { value: newVal } )
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
            value={this.state.value}
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
  constructor(props) {
    super(props)
    this.state = {value: this.props.configDef.getValue()}
  }
  handleChange = () => {
    const newVal = this.props.configDef.modifyValue(x => !x)
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

const settingsClass = class EZExpedSettings extends Component {
  render() {
    return (
      <div style={{
        display:"flex",
        flexDirection:"column",
        marginBottom: "20px"}}>
        <RecommendSparkledCountSetting />
        <CheckboxSetting
            label={__("AllowPluginAutoSwitch")}
            configDef={ezconfigs.allowPluginAutoSwitch}
        />
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

export {
  settingsClass,
}
