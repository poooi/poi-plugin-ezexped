import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  Tooltip,
} from 'react-bootstrap'

import {
  ItemTemplate,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'
import * as estype from '../../../estype'

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
        <div key="header">{__("Fleet Composition")}:</div>
        {
          results.map(({estype: estypeK, need, sat}) => (
            <div
              style={{
                marginLeft: "5px",
                color: sat ? 'green' : 'red',
              }}
              key={`ce-${estypeK}`}>
              {`${need}${estype.shortDesc(estypeK)}`}
            </div>
          ))
        }
      </div>
    )
  }

  renderTooltip = () => {
    const {results} = this.props.result.extra
    const {prefix} = this.props
    return (
      <Tooltip id={`${prefix}req-detail`} className="ezexped-pop">
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
                  style={{marginRight: "5px", marginTop: "2px"}}
                  name={sat ? "check-square-o" : "square-o"} />
                <div style={{flex: "1", whiteSpace: "nowrap"}}>
                  {`${estype.longDesc(__)(estypeK)} ${actual}/${need}`}
                </div>
              </div>
            ))
          }
        </div>
      </Tooltip>
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
