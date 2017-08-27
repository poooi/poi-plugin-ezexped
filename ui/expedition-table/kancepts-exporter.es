import _ from 'lodash'
import React, { PureComponent } from 'react'
import { shell } from 'electron'
import { Button, Checkbox } from 'react-bootstrap'
import { PTyp } from '../../ptyp'

// TODO i18n

const makeLink = () => {
  const {getStore} = window
  const slVal = encodeURIComponent(
    _.flatMap(
      Object.values(getStore().info.ships),
      rawInfo =>
        rawInfo.api_locked === 1 ? [
          `${rawInfo.api_lv>99?'r':''}${rawInfo.api_ship_id}`,
        ] : []
    ).join(',')
  )

  return `https://javran.github.io/kancepts/?sl=${slVal}`
}

class KanceptsExporter extends PureComponent {
  static propTypes = {
    style: PTyp.object.isRequired,
  }

  handleOpen = () =>
    shell.openExternal(makeLink())

  render() {
    const {style} = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          ...style,
        }}
      >
        <Button
          onClick={this.handleOpen}
          style={{marginRight: '.5em'}}
        >
          Launch Kancepts...
        </Button>
        <Checkbox
          style={{marginBottom: 0, marginTop: 0}}
          checked readOnly>
          Export ship list
        </Checkbox>
      </div>
    )
  }
}

export { KanceptsExporter }
