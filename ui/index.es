import { debounce } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ResizeSensor } from '@blueprintjs/core'
import { modifyObject } from 'subtender'

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
    modifyState: PTyp.func.isRequired,
  }

  static defaultProps = {
    fleet: null,
  }

  resizeObserver = new ResizeObserver(debounce(this.handleResize, 200))

  webview = React.createRef()

  handleResize = entries => {
    /* note: in our case entries should always have exactly one element. */
    if (entries.length !== 1)
      return
    const [e] = entries
    this.props.modifyState(
      modifyObject('uiWidth', () => e.contentRect.width)
    )
  }

  componentDidMount = () => {
    this.resizeObserver.observe(this.webview.current.view)
  }

  componentWillUnmount = () => {
    this.resizeObserver.unobserve(this.webview.current.view)
  }

  render() {
    const {fleet} = this.props
    return (
      <div
        ref={this.webview}
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
