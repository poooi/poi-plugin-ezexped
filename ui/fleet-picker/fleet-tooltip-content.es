import React, { PureComponent } from 'react'
import { SlotitemIcon } from 'views/components/etc/icon'
import styled from 'styled-components'

import { PTyp } from '../../ptyp'
import { Morale } from './morale'

const equipIconIds = {
  // ドラム缶(輸送用)
  75: 25,
  // 大発動艇
  68: 20,
  // 大発動艇(八九式中戦車&陸戦隊)
  166: 20,
  // 特二式内火艇
  167: 36,
  // 特大発動艇
  193: 20,
  // 装甲艇(AB艇)
  408: 20,
  // 武装大発
  409: 20,
  // 大発動艇(II号戦車/北アフリカ仕様)
  436: 20,
  // 特大発動艇＋一式砲戦車
  449: 20,
}

const SIcon = styled(SlotitemIcon)`
  &.svg {
    height: 1.2em;
  }

  &.png {
    height: 1.6em;
  }
`

class FleetTooltipContent extends PureComponent {
  static propTypes = {
    fleet: PTyp.object.isRequired,
    stateContent: PTyp.node,
  }

  static defaultProps = {
    stateContent: null,
  }

  render() {
    const {fleet,stateContent} = this.props
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          stateContent && (
            <div key="fleet-describe">{stateContent}</div>
          )
        }
        {
          fleet.ships.map(ship => (
            <div key={ship.rstId} style={{display: 'flex', alignItems: 'center'}}>
              <span
                style={{
                  width: '4em',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  marginRight: '.2em'}}>
                {`${ship.name}`}
              </span>
              <span style={{
                width: '4em',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}>
                {`Lv.${ship.level}`}
              </span>
              <Morale
                style={{width: '1.6em'}}
                morale={ship.morale} />
              <span
                style={{
                  marginLeft: '.2em',
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                }}>
                {
                  ship.equips.map(({rstId,mstId}) => {
                    const iconId = equipIconIds[mstId]
                    return iconId && (
                      <SIcon
                        key={rstId}
                        className="slotitem-img"
                        slotitemId={iconId}
                      />
                    )
                  })
                }
              </span>
            </div>
          ))
        }
      </div>
    )
  }
}

export { FleetTooltipContent }
