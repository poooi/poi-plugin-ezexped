import _ from 'lodash'
import { modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { shell } from 'electron'
import { Button, Checkbox } from 'react-bootstrap'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { kanceptsExportShipListSelector } from '../../selectors'
import { __ } from '../../tr'

const makeLink = exportShipList => {
  if (exportShipList) {
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
  } else {
    return `https://javran.github.io/kancepts/`
  }
}

class KanceptsExporterImpl extends PureComponent {
  static propTypes = {
    style: PTyp.object.isRequired,

    exportShipList: PTyp.bool.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleOpen = () =>
    shell.openExternal(
      makeLink(this.props.exportShipList)
    )

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

const KanceptsExporter = connect(
  createStructuredSelector({
    exportShipList: kanceptsExportShipListSelector,
  }),
  mapDispatchToProps,
)(KanceptsExporterImpl)

export { KanceptsExporter }
