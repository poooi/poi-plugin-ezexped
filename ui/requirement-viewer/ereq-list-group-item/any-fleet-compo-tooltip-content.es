import _ from 'lodash'
import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import {
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'
import { __ } from '../../../tr'
import { computeKey, MinFleetCompo } from './min-fleet-compo'
import { longDesc as esLongDesc } from '../../../estype'

class AnyFleetCompoTooltipContent extends Component {
  static propTypes = {
    fleetCompos: PTyp.array.isRequired,
    currentKey: PTyp.string,
  }

  static defaultProps = {
    currentKey: null,
  }

  render() {
    const {fleetCompos, currentKey} = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        {
          _.flatMap(
            fleetCompos,
            fcInfo => {
              const key = computeKey(fcInfo.extra.results)
              const mainContent = (
                <div
                  key={`${key}-main`}
                  style={{display: 'flex', alignItems: 'center'}}>
                  <FontAwesome
                    className={fcInfo.sat ? 'text-success' : 'text-danger'}
                    name={fcInfo.sat ? 'check-square-o' : 'square-o'}
                    style={{width: '1em', height: '1em'}}
                  />
                  <MinFleetCompo
                    style={{flex: 1, marginLeft: '.4em'}}
                    stypeInfoList={fcInfo.extra.results}
                    between=".5em"
                  />
                </div>
              )

              const detailContents =
                currentKey === key ?
                  fcInfo.extra.results.map(({estype,need,actual,sat}) => (
                    <div
                      style={{marginLeft: '.8em', display: 'flex', alignItems: 'center'}}
                      key={`${key}-detail-${estype}`}>
                      <FontAwesome
                        className={sat ? 'text-success' : 'text-danger'}
                        name={sat ? 'check-square-o' : 'square-o'}
                        style={{width: '1em', height: '1em'}}
                      />
                      <div style={{flex: 1, marginLeft: '.4em', whiteSpace: "nowrap"}}>
                        {`${esLongDesc(__)(estype)}`}
                      </div>
                      <div
                        className={sat ? 'text-success' : 'text-danger'}
                        style={{marginLeft: '.4em'}}>
                        {`${actual}/${need}`}
                      </div>
                    </div>
                  )) : []

              return [mainContent, ...detailContents]
            })
        }
      </div>
    )
  }
}

export { AnyFleetCompoTooltipContent }
