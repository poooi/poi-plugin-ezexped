import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { Dropdown } from 'react-bootstrap'
import { connect } from 'react-redux'
import { modifyObject } from 'subtender'
import _ from 'lodash'
import { PTyp } from '../../../ptyp'
import { mapDispatchToProps } from '../../../store'
import {
  expedIdSelector,
  getExpedInfoFuncSelector,
  expedTableExpandedSelector,
} from '../../../selectors'
import { ExpeditionTable } from './expedition-table'

class ExpeditionPickerImpl extends PureComponent {
  static propTypes = {
    expedId: PTyp.number.isRequired,
    getExpedInfo: PTyp.func.isRequired,
    expedTableExpanded: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,

    mountPoint: PTyp.any.isRequired,
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
      expedId, getExpedInfo, expedTableExpanded,
      mountPoint,
    } = this.props
    const info = getExpedInfo(expedId)
    const {displayNum} = info
    const menuStyle = {minWidth: 300}

    const curPluginRef =
      mountPoint && mountPoint.querySelector('.poi-plugin-ezexped')

    if (_.isFinite(_.get(curPluginRef, 'clientWidth'))) {
      menuStyle.width = `calc(${curPluginRef.clientWidth}px - 20px)`
    }

    return (
      <Dropdown
        open={expedTableExpanded}
        onToggle={this.handleToggleExpedTable}
      >
        <Dropdown.Toggle
          noCaret
          style={{width: '100%'}}
        >
          <div
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {`${displayNum} ${info.name}`}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={menuStyle}
        >
          <ExpeditionTable />
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

const ExpeditionPicker = connect(
  createStructuredSelector({
    expedId: expedIdSelector,
    getExpedInfo: getExpedInfoFuncSelector,
    expedTableExpanded: expedTableExpandedSelector,
  }),
  mapDispatchToProps,
)(ExpeditionPickerImpl)

export { ExpeditionPicker }
