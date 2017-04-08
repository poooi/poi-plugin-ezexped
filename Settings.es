import React, { Component } from 'react'
import { 
  FormControl,
} from 'react-bootstrap'

import { connect } from 'react-redux'
import { get } from 'lodash'
const { config } = window
import { __ } from './tr'

const confPath = "plugin.poi-plugin-ezexped."
const keyRecommendSparkled = confPath + "recommendSparkledCount"

const settingsClass = connect (() => {
  return (state, props) => ({
    recommendSparkledCount: get(
      state.config, 
      keyRecommendSparkled, 4),
  })
})(class EZExpedSettings extends Component {
  changeRecommendSparkledCount = (e) => {
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
            style={{flex: "1"}} 
            value={this.props.recommendSparkledCount}
            onChange={this.changeRecommendSparkledCount}
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
  keyRecommendSparkled,
  settingsClass,
}
