import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  ItemTemplate,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'
import * as estype from '../../../estype'

import { MinFleetCompo } from './min-fleet-compo'

class FleetCompoItem extends Component {
  static propTypes = {
    result: PTyp.shape({
      extra: PTyp.shape({
        type: PTyp.oneOf(['FleetCompo']).isRequired,
        results: PTyp.array.isRequired,
      }).isRequired,
    }).isRequired,
    prefix: PTyp.string.isRequired,
  }

  renderContent = () => {
    const {results} = this.props.result.extra
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div key="header">
          {__("Fleet Composition")}
          :
        </div>
        <MinFleetCompo
          style={{marginLeft: '.5em'}}
          between=".2em"
          stypeInfoList={results}
        />
      </div>
    )
  }

  renderTooltip = () => {
    const {results} = this.props.result.extra
    // TODO: prefix is no longer used.
    // const {prefix} = this.props
    return (
      <div>
        <div style={{display: "flex", flexDirection: "column"}}>
          {
            results.map(({estype: estypeK, actual, need, sat}) => (
              <div
                key={estypeK}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <FontAwesome
                  className={sat ? 'text-success' : 'text-danger'}
                  style={{marginRight: "5px", marginTop: "2px"}}
                  name={sat ? "check-square-o" : "square-o"} />
                <div style={{flex: "1", whiteSpace: "nowrap"}}>
                  {`${estype.longDesc(__)(estypeK)}`}
                </div>
                <div
                  className={sat ? 'text-success' : 'text-danger'}
                  style={{marginLeft: '.4em'}}
                >
                  {`${actual}/${need}`}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <ItemTemplate
        content={this.renderContent()}
        tooltip={this.renderTooltip()}
        {...this.props}
      />
    )
  }
}

export { FleetCompoItem }
