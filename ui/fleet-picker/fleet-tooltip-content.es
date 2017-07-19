import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SlotitemIcon } from 'views/components/etc/icon'

import { equipIconIdsSelector } from './selectors'
import { PTyp } from '../../ptyp'
import { Morale } from './morale'

class FleetTooltipContentImpl extends PureComponent {
  static propTypes = {
    fleet: PTyp.object.isRequired,
    equipIconIds: PTyp.object.isRequired,
  }

  render() {
    const {fleet,equipIconIds} = this.props
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          fleet.ships.map(ship => (
            <div key={ship.rstId} style={{display: 'flex', alignItems: 'center'}}>
              <span
                style={{
                  width: '8em',
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
              <Morale morale={ship.morale} />
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
                      <SlotitemIcon
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

const FleetTooltipContent = connect(
  createStructuredSelector({
    equipIconIds: equipIconIdsSelector,
  }))(FleetTooltipContentImpl)

export { FleetTooltipContent }
