import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Panel,
} from 'react-bootstrap'

import {
  createStructuredSelector,
} from 'reselect'

import { join } from 'path-extra'

import { FleetPicker } from './fleet-picker'
import { ExpeditionViewer } from './expedition-viewer'
import { ExpeditionTable } from './expedition-table'
import { RequirementViewer } from './requirement-viewer'

import { PTyp } from '../ptyp'

import {
  expedTableExpandedSelector,
  fleetInfoSelector,
} from '../selectors'

class EZExpedMainImpl extends Component {
  static propTypes = {
    expedTableExpanded: PTyp.bool.isRequired,
    fleet: PTyp.object,
  }

  static defaultProps = {
    fleet: null,
  }

  render() {
    const {
      expedTableExpanded,
      fleet,
    } = this.props
    return (
      <div className="poi-plugin-ezexped">
        <link rel="stylesheet" href={join(__dirname, '..', 'assets', 'ezexped.css')} />
        <div style={{paddingRight: "5px", paddingLeft: "5px"}}>
          <FleetPicker />
          {
            fleet && (
              <ExpeditionViewer />
            )
          }
          {
            fleet && (
              <Panel
                collapsible
                expanded={expedTableExpanded}
                style={{marginBottom: "5px"}} >
                <ExpeditionTable />
              </Panel>
            )
          }
          {
            fleet && (
              <RequirementViewer />
            )
          }
        </div>
      </div>
    )
  }
}

const mainUISelector = createStructuredSelector({
  fleet: fleetInfoSelector,
  expedTableExpanded: expedTableExpandedSelector,
})

const EZExpedMain = connect(
  mainUISelector,
)(EZExpedMainImpl)

export {
  EZExpedMain,
}
