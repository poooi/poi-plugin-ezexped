import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { Dropdown } from 'react-bootstrap'
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
} from '../../../selectors'
import { ExpeditionTable } from './expedition-table'

const PPopover = styled(Popover)`
  & > span.bp3-popover-target {
    width: 100%;
  }

  & > span.bp3-popover-target > button {
    width: 100%;
  }
`

@connect(
  createStructuredSelector({
    expedId: expedIdSelector,
    getExpedInfo: getExpedInfoFuncSelector,
    expedTableExpanded: expedTableExpandedSelector,
  }),
  mapDispatchToProps,
)
class ExpeditionPicker extends PureComponent {
  static propTypes = {
    mountPoint: PTyp.any.isRequired,
    // connected
    expedId: PTyp.number.isRequired,
    getExpedInfo: PTyp.func.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleToggleExpedTable = (newVal, e, srcInfo) => {
    const {source} = srcInfo
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
      /*
         TODO: we'll still need to make this controlled so that
         when Popover opens we'll have a chance to update current width
         of the plugin itself.
       */
      expedTableExpanded: _ignored,
      mountPoint,
    } = this.props
    const info = getExpedInfo(expedId)
    const {displayNum} = info
    const menuStyle = {minWidth: 300}

    /*
       TODO: this does not work when the plugin is opened in a new window
       mountPoint is true-y but the querySelector returns null.
     */
    const curPluginRef =
      mountPoint && mountPoint.querySelector('.poi-plugin-ezexped')

    if (_.isFinite(_.get(curPluginRef, 'clientWidth'))) {
      menuStyle.width = `calc(${curPluginRef.clientWidth}px - 20px)`
    }

    return (
      <PPopover
        content={(<ExpeditionTable style={menuStyle} />)}
        position={Position.BOTTOM_LEFT}
      >
        <Button
          text={`${displayNum} ${info.name}`}
        />
      </PPopover>
    )
  }
}

export { ExpeditionPicker }
