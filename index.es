import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'

import * as estype from './estype'
import { mkFleetInfoSelector } from './selectors'

const { _, $, $$, FontAwesome } = window

import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'

class EZExpedMain extends Component {
  render() {
    return (
      <Button>
      </Button>
    )
  }
}

// TODO: fixing on first fleet for now for debuging.
const dbgFleetId = 3

export const reactClass = connect(
  state => ({
    fleetInfo: mkFleetInfoSelector(dbgFleetId)(state),
  }))(EZExpedMain)
