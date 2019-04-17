import { modifyObject } from 'subtender'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { shell } from 'electron'
import { Button, Checkbox } from 'react-bootstrap'

import { PTyp } from '../../../../ptyp'
import { mapDispatchToProps } from '../../../../store'
import {
  kanceptsExportShipListSelector,
  kanceptsUrlSelector,
} from '../../../../selectors'
import { __ } from '../../../../tr'
import { makeLink } from '../../../../kancepts'

@connect(
  state => {
    const exportShipList = kanceptsExportShipListSelector(state)
    const kanceptsUrl = kanceptsUrlSelector(state)
    const mkLink = () => makeLink(kanceptsUrl)(exportShipList)
    return {exportShipList, mkLink}
  },
  mapDispatchToProps,
)
class KanceptsExporter extends PureComponent {
  static propTypes = {
    style: PTyp.object.isRequired,

    exportShipList: PTyp.bool.isRequired,
    mkLink: PTyp.func.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleOpen = () =>
    shell.openExternal(this.props.mkLink())

  handleToggleExport = e => {
    const kanceptsExportShipList = e.target.checked
    this.props.modifyState(
      modifyObject(
        'kanceptsExportShipList', () => kanceptsExportShipList
      )
    )
  }

  render() {
    const {style, exportShipList} = this.props
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
          bsSize="small"
          style={{marginRight: '.5em'}}
        >
          {__('Kancepts.Launch')}
        </Button>
        <Checkbox
          style={{marginBottom: 0, marginTop: 0}}
          checked={exportShipList}
          onChange={this.handleToggleExport}
        >
          {__('Kancepts.ExportShipList')}
        </Checkbox>
      </div>
    )
  }
}

export { KanceptsExporter }
