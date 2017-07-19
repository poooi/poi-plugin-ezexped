import _ from 'lodash'
import React, { Component } from 'react'
import {
  Tooltip,
} from 'react-bootstrap'

import {
  ItemTemplate,
} from './common'
import { __ } from '../../../tr'
import { PTyp } from '../../../ptyp'

import { MinFleetCompo, computeKey } from './min-fleet-compo'

class AnyFleetCompoItem extends Component {
  static propTypes = {
    // prefix: PTyp.string.isRequired,
    result: PTyp.object.isRequired,
  }

  renderContent = () => {
    const {results} = this.props.result.extra
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div key="header">{__("Fleet Composition")}:</div>
        <div style={{flex: 1, display: 'flex', flexWrap: 'wrap'}}>
          {
            _.flatMap(
              results,
              (rs,ind) => {
                const keyPrefix = `${computeKey(rs.extra.results)}-`
                const content = (
                  <MinFleetCompo
                    key={`${keyPrefix}content`}
                    style={{marginLeft: '.2em'}}
                    stypeInfoList={rs.extra.results}
                  />
                )
                if (ind+1 !== results.length) {
                  return [
                    content,
                    <span
                      key={`${keyPrefix}sep`}
                      style={{marginLeft: '.2em'}}>
                      or
                    </span>,
                  ]
                } else {
                  return [content]
                }
              })
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <ItemTemplate
        content={this.renderContent()}
        {...this.props}
      />
    )
  }
}

export { AnyFleetCompoItem }
