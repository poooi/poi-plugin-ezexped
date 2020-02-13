import React, { PureComponent } from 'react'
import { MaterialIcon } from 'views/components/etc/icon'

import { fmtTime } from '../../../../tr'
import { PTyp } from '../../../../ptyp'

class ExpedTooltipContent extends PureComponent {
  static propTypes = {
    expedId: PTyp.number.isRequired,
    getExpedInfo: PTyp.func.isRequired,
  }

  render() {
    const {expedId, getExpedInfo} = this.props
    const info = getExpedInfo(expedId)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}>
        <div
          style={{width: '100%', textAlign: 'center'}}
        >
          {info.name}
        </div>
        <div
          style={{width: '100%', textAlign: 'center'}}
        >
          {fmtTime(info.timeInMin)}
        </div>
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplate: 'auto / 1fr 1fr',
            alignItems: 'center',
          }}
        >
          {
            [
              ['fuel', 1], ['steel', 3],
              ['ammo', 2], ['bauxite', 4],
            ].map(([resourceName, matId]) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                key={resourceName}
              >
                <MaterialIcon
                  materialId={matId}
                  className="material-icon"
                />
                <span
                  style={{
                    flex: 1,
                    marginLeft: '.4em',
                    minWidth: '2.5em',
                  }}>
                  {
                    (info && info.resources) ? info.resources[resourceName] : '???'
                  }
                </span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export { ExpedTooltipContent }
