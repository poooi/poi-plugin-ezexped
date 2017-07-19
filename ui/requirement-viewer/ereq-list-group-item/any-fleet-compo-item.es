import _ from 'lodash'
import React, { Component } from 'react'
import {
  Well,
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
        <div style={{
          marginLeft: '.5em',
          flex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {
            _.flatMap(
              results,
              (rs,ind) => {
                const keyPrefix = `${computeKey(rs.extra.results)}-`
                const content = (
                  <Well
                    key={`${keyPrefix}content`}
                    style={{
                      fontSize: '100%',
                      marginTop: '.1em',
                      marginBottom: '.1em',
                      padding: '.2em .2em',
                    }}>
                    <MinFleetCompo
                      style={{
                        marginLeft: 0,
                        marginRight: 0,
                      }}
                      between=".2em"
                      stypeInfoList={rs.extra.results}
                    />
                  </Well>
                )
                if (ind+1 !== results.length) {
                  return [
                    content,
                    <span
                      key={`${keyPrefix}sep`}
                      style={{
                        marginLeft: '.4em',
                        marginRight: '.4em',
                      }}>
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
