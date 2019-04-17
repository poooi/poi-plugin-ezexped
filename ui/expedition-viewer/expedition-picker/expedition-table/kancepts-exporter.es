import { modifyObject } from 'subtender'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { shell } from 'electron'
import { Button, Checkbox } from '@blueprintjs/core'
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
    // connected
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
          small
          style={{marginRight: '.5em'}}
          onClick={this.handleOpen}
          text={__('Kancepts.Launch')}
        />
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
