import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import {
  ListGroupItem,
  OverlayTrigger,
} from 'react-bootstrap'

import { PTyp } from '../../../../ptyp'
import { darkOrLightSelector } from '../../../../selectors'

class ItemTemplateImpl extends Component {
  static propTypes = {
    result: PTyp.shape({
      sat: PTyp.bool.isRequired,
    }).isRequired,
    which: PTyp.EReqWhich.isRequired,
    content: PTyp.node.isRequired,
    tooltip: PTyp.node,
    darkOrLight: PTyp.DarkOrLight.isRequired,
  }

  static defaultProps = {
    tooltip: null,
  }

  render() {
    const {
      result, which,
      tooltip, content,
      darkOrLight,
    } = this.props
    const {sat} = result
    const checkboxClass = sat ?
      (which === 'gs' ? `poi-ship-cond-53 ${darkOrLight}` : 'text-success') :
      (which === 'gs' ? 'text-muted' : 'text-danger')
    const itemContent = (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <FontAwesome
          className={checkboxClass}
          style={{
            fontWeight: 'normal',
            marginRight: '.4em',
            width: '1em',
          }}
          name={sat ? 'check-square-o' : 'square-o'}
        />
        <div style={{flex: 1}}>
          {content}
        </div>
      </div>
    )

    return (
      <ListGroupItem
        style={{padding: 10}}>
        {
          tooltip ? (
            <OverlayTrigger
              placement="top"
              overlay={tooltip}>
              {itemContent}
            </OverlayTrigger>
          ) : (
            itemContent
          )
        }
      </ListGroupItem>
    )
  }
}

const ItemTemplate = connect(
  createStructuredSelector({
    darkOrLight: darkOrLightSelector,
  }))(ItemTemplateImpl)

export { ItemTemplate }
