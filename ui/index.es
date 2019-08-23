import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  createStructuredSelector,
} from 'reselect'

import { join } from 'path-extra'

import { FleetPicker } from './fleet-picker'
import { ExpeditionViewer } from './expedition-viewer'
import { RequirementViewer } from './requirement-viewer'

import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

import {
  fleetInfoSelector,
} from '../selectors'

@connect(
  createStructuredSelector({
    fleet: fleetInfoSelector,
  }),
  mapDispatchToProps,
)
class EZExpedMain extends Component {
  static propTypes = {
    // connected
    fleet: PTyp.object,
    setWidth: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  target = React.createRef()

  handleResize = entries => {
    /* note: in our case entries should always have exactly one element. */
    if (entries.length !== 1)
      return
    const [e] = entries
    const width = _.get(e,['contentRect', 'width'])
    if (_.isFinite(width)) {
      this.props.setWidth(width)
    }
  }

  componentDidMount = () => {
    this.resizeObserver = new ResizeObserver(this.handleResize)
    this.resizeObserver.observe(this.target.current)
  }

  componentWillUnmount = () => {
    this.resizeObserver.unobserve(this.target.current)
  }

  render() {
    const {fleet} = this.props
    return (
      <div
        ref={this.target}
        style={{
          flex: 1,
          height: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="poi-plugin-ezexped"
      >
        <link
          rel="stylesheet"
          href={join(__dirname, '..', 'assets', 'ezexped.css')}
        />
        <div style={{
          paddingRight: 5,
          paddingLeft: 5,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <FleetPicker />
          {fleet && (<ExpeditionViewer />)}
          {fleet && (<RequirementViewer />)}
        </div>
      </div>
    )
  }
}

export {
  EZExpedMain,
}
