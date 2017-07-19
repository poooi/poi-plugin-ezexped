import React, { PureComponent } from 'react'
import { PTyp } from '../../ptyp'

class FleetTooltipContent extends PureComponent {
  static propTypes = {
    fleet: PTyp.object,
  }

  static defaultProps = {
    fleet: null,
  }

  render() {
    const {fleet} = this.props
    return (
      <div style={{display: "flex", flexDirection: "column"}}>
        {
          fleet.ships.map(ship => (
            <div key={ship.rstId}>
              {`${ship.name} (Lv. ${ship.level})`}
            </div>
          ))
        }
      </div>
    )
  }
}

export { FleetTooltipContent }
