import React, { PureComponent } from 'react'

import { PTyp } from '../../ptyp'

class Morale extends PureComponent {
  static propTypes = {
    morale: PTyp.number.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const { morale, style } = this.props
    /* eslint-disable indent */
    const moraleStyle =
      morale <= 48 ? {} :
      morale === 49 ? {textShadow: 'white 0 0 7px'} :
      {textShadow: '#ffee00 0 0 7px'}
    /* eslint-enable indent */
    /* eslint-disable indent */
    const moraleClasses =
      morale === null ? '' :
      morale <= 19 ? 'poi-ship-cond-0' :
      morale <= 29 ? 'poi-ship-cond-20' :
      morale <= 39 ? 'poi-ship-cond-30' :
      morale <= 48 ? 'poi-ship-cond-40' :
      morale === 49 ? 'poi-ship-cond-49' :
      morale <= 52 ? 'poi-ship-cond-50' :
      'poi-ship-cond-53'
    /* eslint-enable indent */
    return (
      <span
        className={`${moraleClasses} dark`}
        style={{
          ...moraleStyle,
          textAlign: 'center',
          fontWeight: 'bold',
          ...style,
        }}
      >
        {morale}
      </span>
    )
  }
}

export { Morale }
