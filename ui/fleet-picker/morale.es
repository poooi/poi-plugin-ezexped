import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  darkOrLightSelector,
} from '../../selectors'

import { PTyp } from '../../ptyp'

class MoraleImpl extends PureComponent {
  static propTypes = {
    morale: PTyp.number.isRequired,
    darkOrLight: PTyp.DarkOrLight.isRequired,
    style: PTyp.object,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const { morale, darkOrLight, style } = this.props
    const moraleStyle =
      morale <= 48 ? {} :
      morale === 49 ? {textShadow: 'white 0 0 7px'} :
      {textShadow: '#ffee00 0 0 7px'}

    const moraleClasses =
      morale === null ? '' :
      morale <= 19 ? 'poi-ship-cond-0' :
      morale <= 29 ? 'poi-ship-cond-20' :
      morale <= 39 ? 'poi-ship-cond-30' :
      morale <= 48 ? 'poi-ship-cond-40' :
      morale === 49 ? 'poi-ship-cond-49' :
      morale <= 52 ? 'poi-ship-cond-50' :
      'poi-ship-cond-53'

    return (
      <span
        className={`${moraleClasses} ${darkOrLight}`}
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

const Morale = connect(createStructuredSelector({
  darkOrLight: darkOrLightSelector,
}))(MoraleImpl)

export { Morale }
