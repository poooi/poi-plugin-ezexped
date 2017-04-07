import React, { Component } from 'react'
import { 
  FormControl,
} from 'react-bootstrap'

import { connect } from 'react-redux'
import { get } from 'lodash'
const { config } = window

// TODO
// - i18n

const confPath = "plugin.poi-plugin-ezexped."
const keyRecommendedSparkled = confPath + "recommendedSparkledCount"

const settingsClass = connect (() => {
  return (state, props) => ({
    recommendedSparkledCount: get(
      state.config, 
      keyRecommendedSparkled, 4),
  })
})(class EZExpedSettings extends Component {
  changeRecommendedSparkledCount = (e) => {
    // seems like e.target.value somehow gets coerced to a string,
    // so we need to convert it back.
    const v = parseInt(e.target.value, 10)
    config.set(keyRecommendedSparkled, v)
  }
  render() {
    return (
      <div style={{
        display: "flex", 
        justifyContent: "space-between"}}>
        <div style={{flex: "4", alignSelf: "center"}}>Recommended number of sparkled ships:</div>
        <FormControl
            style={{flex: "1"}} 
            value={this.props.recommendedSparkledCount}
            onChange={this.changeRecommendedSparkledCount}
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
  }})

export {
  keyRecommendedSparkled,
  settingsClass,
}
