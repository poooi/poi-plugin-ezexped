import _ from 'lodash'
import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

import { PTyp } from '../../../ptyp'
import { __ } from '../../../tr'
import { computeKey, MinFleetCompo } from './min-fleet-compo'
import { longDesc as esLongDesc } from '../../../estype'

class AnyFleetCompoTooltipContent extends Component {
  static propTypes = {
    fleetCompos: PTyp.array.isRequired,
    currentKey: PTyp.string,
    noDanger: PTyp.bool,
  }

  static defaultProps = {
    currentKey: null,
    noDanger: false,
  }

  render() {
    const {fleetCompos, currentKey, noDanger} = this.props
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        {
          _.flatMap(
            fleetCompos,
            (fcInfo,ind) => {
              const key = computeKey(fcInfo.extra.results)
              const mainContent = (
                <div
                  key={`${key}-main`}
                  style={{display: 'flex', alignItems: 'center'}}>
                  <FontAwesome
                    className={
                      fcInfo.sat ? 'text-success' :
                      (noDanger ? '' : 'text-danger')
                    }
                    name={fcInfo.sat ? 'check-square-o' : 'square-o'}
                    style={{width: '1em', height: '1em'}}
                  />
                  <MinFleetCompo
                    noDanger={noDanger}
                    style={{flex: 1, marginLeft: '.4em'}}
                    stypeInfoList={fcInfo.extra.results}
                    between=".5em"
                  />
                </div>
              )

              /*
                 thanks to the fact that detail lists always contain two
                 items, by always having a focus, we don't have to worry about
                 tooltip's height being changed when it's visible.
               */
              const isFocused =
                (currentKey === null && ind === 0) ||
                currentKey === key
              const detailContents =
                isFocused ?
                  fcInfo.extra.results.map(({estype,need,actual,sat}) => (
                    <div
                      style={{marginLeft: '.8em', display: 'flex', alignItems: 'center'}}
                      key={`${key}-detail-${estype}`}>
                      <FontAwesome
                        className={
                          sat ? 'text-success' : (noDanger ? '' : 'text-danger')
                        }
                        name={sat ? 'check-square-o' : 'square-o'}
                        style={{width: '1em', height: '1em'}}
                      />
                      <div style={{flex: 1, marginLeft: '.4em', whiteSpace: "nowrap"}}>
                        {`${esLongDesc(__)(estype)}`}
                      </div>
                      <div
                        className={
                          sat ? 'text-success' : (noDanger ? '' : 'text-danger')
                        }
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
