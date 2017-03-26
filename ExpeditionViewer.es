import React, { Component } from 'react'

import { expedInfo } from './exped-info'
import { throwWith } from './utils'

import {
  Button } from 'react-bootstrap'

import { MaterialIcon } from 'views/components/etc/icon'
const { FontAwesome } = window

class IconAndLabel extends Component {
  render() {
    return (
      <div style={{display: "flex"}}>
        <div>{this.props.icon}</div>
        <div style={{flex:"1", marginLeft:"2px", marginRight:"2px"}} >{this.props.label}</div>
      </div>
    )
  }
}

const itemNameToMaterialId = x =>
    x === "Bucket" ? 6
  : x === "Flamethrower" ? 5
  : x === "DevMat" ? 7
  : x === "FCoinSmall" ? 9
  : x === "FCoinMedium" ? 10
  : x === "FCoinLarge" ? 11
  : throwWith(`unknown item name: ${x}`)

// props:
// - expedId: expedition id
// - greatSuccess: bool
// - onClickExped: when expedition button is clicked
// - onClickGS: when great success button is clicked
class ExpeditionViewer extends Component {
  render() {
    const info = expedInfo[ this.props.expedId ]
    const mkMat = matId => <MaterialIcon materialId={matId} className="material-icon" />
    const mkMatFromName = name => mkMat(itemNameToMaterialId( name ))
    const colFlexStyle = {
      display:"flex",
      justifyContent: "space-around",
      flexDirection: "column",
      marginLeft: "10px",
    }
    console.log(info)
    const hasNormalItem = info.itemNormal
    const hasGreatSuccessItem = this.props.greatSuccess && info.itemGreatSuccess
    const prettyRange = (x,y) => x === y ? `${x}` : `${x} ~ ${y}`
    return (
      <div style={{display: "flex"}}>
        <div style={{flex: "6", display: "flex", flexDirection: "column"}}>
          <Button onClick={this.props.onClickExped}>
            {this.props.expedId} {info.name}
          </Button>
          <div>Required Time (mins): 19:26</div>
          <div style={{display: "flex"}}>
            <IconAndLabel
                icon={mkMat(1)} label={`${info.cost.fuelPercent}%`} />
            <IconAndLabel
                icon={mkMat(2)} label={`${info.cost.ammoPercent}%`} />
          </div>
      </div>
      <div style={{flex: "3", ...colFlexStyle}}>
        <IconAndLabel icon={mkMat(1)} label={info.resource.fuel} />
        <IconAndLabel icon={mkMat(2)} label={info.resource.ammo} />
      </div>
      <div style={{flex:"3", ...colFlexStyle}}>
        <IconAndLabel icon={mkMat(3)} label={info.resource.steel} />
        <IconAndLabel icon={mkMat(4)} label={info.resource.bauxite} />
      </div>
      <div style={{flex:"2", ...colFlexStyle}}>
        <IconAndLabel 
            icon={hasNormalItem ? mkMatFromName(info.itemNormal.itemId) : "-"} 
            label={hasNormalItem ? prettyRange(0,info.itemNormal.itemMaxCount) : "-"} />
        <IconAndLabel 
            icon={hasGreatSuccessItem ? mkMatFromName(info.itemGreatSuccess.itemId) : "-"} 
            label={hasGreatSuccessItem ? prettyRange(1,info.itemGreatSuccess.itemMaxCount) : "-"} />
      </div>
      <Button style={{flex: "1"}} onClick={this.props.onClickGS}>
        <FontAwesome name={this.props.greatSuccess ? "check-square-o" : "square-o"} />
        GS
      </Button>
      </div>
    )
  }
}

export { ExpeditionViewer }
