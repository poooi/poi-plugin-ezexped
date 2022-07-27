import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { Button, Position } from '@blueprintjs/core'
import { connect } from 'react-redux'
import { modifyObject } from 'subtender'
import _ from 'lodash'
import styled from 'styled-components'
import { Popover } from 'views/components/etc/overlay'

import { PTyp } from '../../../ptyp'
import { mapDispatchToProps } from '../../../store'
import {
  expedIdSelector,
  getExpedInfoFuncSelector,
  expedTableExpandedSelector,
  uiWidthSelector,
} from '../../../selectors'
import { ExpeditionTable } from './expedition-table'

const PPopover = styled(Popover)`
  & > span.bp4-popover-target {
    width: 100%;
  }

  & > span.bp4-popover-target > button {
    width: 100%;
  }
`

@connect(
  createStructuredSelector({
    expedId: expedIdSelector,
    getExpedInfo: getExpedInfoFuncSelector,
    expedTableExpanded: expedTableExpandedSelector,
    uiWidth: uiWidthSelector,
  }),
  mapDispatchToProps,
)
class ExpeditionPicker extends PureComponent {
  static propTypes = {
    // connected
    expedId: PTyp.number.isRequired,
    getExpedInfo: PTyp.func.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
    uiWidth: PTyp.number.isRequired,
  }

  handleToggleExpedTable = (newVal, e, srcInfo) => {
    const { source } = srcInfo
    if (source === 'rootClose') {
      /*
         Dropdown won't be closed if our user is
         switching between fleets by clicking fleet buttons
       */
      const elements = _.get(e, 'path', [])
      if (elements.some(element =>
        typeof element.className === 'string' &&
        element.className.indexOf('fleet-picker-button') !== -1
      ))
        return
    }

    this.props.modifyState(
      modifyObject(
        'expedTableExpanded',
        () => newVal
      )
    )
  }

  render() {
    const {
      expedId, getExpedInfo,
      expedTableExpanded: _ignored,
      uiWidth,
    } = this.props
    const info = getExpedInfo(expedId)
    const { displayNum } = info
    const menuStyle = { minWidth: 300 }

    if (_.isFinite(uiWidth)) {
      menuStyle.width = `calc(${uiWidth}px - 20px)`
    }

    return (
      <PPopover
        content={(<ExpeditionTable style={menuStyle} />)}
        position={Position.BOTTOM_LEFT}
        autoFocus={false}
      >
        <Button
          text={`${displayNum} ${info.name}`}
        />
      </PPopover>
    )
  }
}

export { ExpeditionPicker }
