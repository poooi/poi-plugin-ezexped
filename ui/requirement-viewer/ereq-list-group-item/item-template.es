import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  ListGroupItem,
  OverlayTrigger,
} from 'react-bootstrap'

import { PTyp } from '../../../ptyp'

class ItemTemplate extends Component {
  static propTypes = {
    result: PTyp.shape({
      sat: PTyp.bool.isRequired,
    }).isRequired,
    which: PTyp.EReqWhich.isRequired,
    content: PTyp.node.isRequired,
    tooltip: PTyp.node,
  }

  static defaultProps = {
    tooltip: null,
  }

  render() {
    const {
      result, which,
      tooltip, content,
    } = this.props
    const {sat} = result
    const checkboxColor = sat ?
      (which === 'gs' ? 'gold' : 'green') :
      (which === 'gs' ? 'grey' : 'red')
    const itemContent = (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <FontAwesome
          style={{
            color: checkboxColor,
            marginRight: '.4em',
          }}
          name={sat ? 'check-square-o' : 'square-o'}
        />
        <div style={{flex: 1}}>
          {content}
        </div>
      </div>
    )

    // TODO: remove color after done
    return (
      <ListGroupItem
        style={{padding: 10, color: 'cyan'}}>
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

export { ItemTemplate }
