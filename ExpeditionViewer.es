import React, { Component } from 'react'

import { expedInfo } from './exped-info'
import { throwWith } from './utils'
import { daihatsu, fleetResupplyCost } from './income-calc'

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

import { MaterialIcon } from 'views/components/etc/icon'
import { resolveTime } from 'views/utils/tools'

const { FontAwesome } = window

const formatTime = mins => {
  const str = resolveTime(mins * 60)
  const matchResult = str.match(/^(.*):\d{2}$/)
  if (!matchResult)
    throw `failed while trying to truncate seconds from ${str}`
  return matchResult[1]
}

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
  : x === "FCoinSmall" ? 10
  : x === "FCoinMedium" ? 11
  : x === "FCoinLarge" ? 12
  : throwWith(`unknown item name: ${x}`)

// pretty-printing a floating number
const pprFloat = (v,digits=2) => v.toFixed(digits)

// pretty-printing a percentage
const pprAsPercent = (v,digits=2) => `${(v*100).toFixed(digits)}%`

const renderTexts = (rawIncome, greatSuccess, bonus, resupply) => {
  const basicIncome = greatSuccess ? Math.floor( rawIncome * 1.5 ) : rawIncome
  const basicIncomeText = basicIncome + 
    (greatSuccess ? ` (=${rawIncome}x150%)` : "")

  const aveImpText = basicIncome > 0 && bonus.dhtCount > 0 &&
    `${pprFloat(bonus.impLvlCount / bonus.dhtCount)} (= ${bonus.impLvlCount}/${bonus.dhtCount})`

  const dhtBonus = Math.floor(basicIncome * (bonus.normalBonus + bonus.normalBonusStar))
  const dhtBonusText = basicIncome > 0 && (bonus.normalBonus > 0 || bonus.normalBonusStar > 0) &&
    `${dhtBonus} (=${basicIncome}x` +
    `(${pprAsPercent(bonus.normalBonus)}+` +
    `${pprAsPercent(bonus.normalBonusStar)}))`

  const tokuBonus = Math.floor(basicIncome * bonus.tokuBonus)
  const tokuBonusText = basicIncome > 0 && bonus.tokuBonus > 0 &&
    `${tokuBonus} (=${basicIncome}x${pprAsPercent(bonus.tokuBonus)})`

  const totalIncome = basicIncome + dhtBonus + tokuBonus
  const totalIncomeInnerText = [basicIncome,dhtBonus,tokuBonus].filter(x => x > 0).join("+")
  const totalIncomeText = basicIncome > 0 && basicIncome !== totalIncome &&
    `${totalIncome} (=${totalIncomeInnerText})`

  const netIncome = totalIncome - resupply
  const netIncomeText = resupply > 0 &&
    `${netIncome} (=${totalIncome}-${resupply})`

  return {
    basicIncomeText,
    aveImpText,
    dhtBonusText,
    tokuBonusText,
    totalIncomeText,
    netIncomeText,
    finalIncome: netIncome,
  }
}

const mkMat = matId => <MaterialIcon materialId={matId} className="material-icon" />

const translateKey = {
  "basicIncomeText": "Basic Income",
  "aveImpText": "Ave. Improvement",
  "dhtBonusText": "Daihatsu-class Bonus",
  "tokuBonusText": "Toku Daihatsu Bonus",
  "totalIncomeText": "Total Income",
  "netIncomeText": "Net Income",
}

// props:
// - resourceName
// - icon
// - one of "renderedResources"'s value in "ExpeditionViewer"
class ResourceWithDetail extends Component {
  render() {
    const tooltipTexts = [
      "basicIncomeText",
      "aveImpText",
      "dhtBonusText",
      "tokuBonusText",
      "totalIncomeText",
      "netIncomeText",
    ].filter( k => this.props.renderedResource[k] )
     .map( k => `${translateKey[k]}: ${this.props.renderedResource[k]}`)
    const tooltip = (
      <Tooltip
          className="ezexped-pop"
          style={{display:"flex"}}
          id={`tooltip-${this.props.resourceName}`}>
          {tooltipTexts.map( (x,ind) => <div style={{flex: "1", textAlign: "left"}} key={ind}>{x}</div> )}
      </Tooltip>
    )

    return (
      <OverlayTrigger
        placement="bottom" overlay={tooltip}>
      <div>
        <IconAndLabel
          icon={this.props.icon}
          label={this.props.renderedResource.finalIncome} />
      </div>
      </OverlayTrigger>)}}

// props:
// - expedId: expedition id
// - greatSuccess: bool
// - onClickExped: when expedition button is clicked
// - onClickGS: when great success button is clicked
// - fleet: fleet representation
class ExpeditionViewer extends Component {
  render() {
    const info = expedInfo[ this.props.expedId ]
    const resupplyCost = 
      fleetResupplyCost(this.props.fleet)(
        info.cost.fuelPercent / 100, info.cost.ammoPercent / 100)
    const daihatsuBonus =
      daihatsu.computeBonus( this.props.fleet )

    // have to apply a semicolon otherwise parser won't recognize this properly
    const renderedResources = {};
    ["fuel","ammo","steel","bauxite"].map( resourceName => {
      const resupply = 
        resourceName === "fuel" ? resupplyCost.fuelCost
        : resourceName === "ammo" ? resupplyCost.ammoCost 
        : 0
      renderedResources[resourceName] = renderTexts(
        info.resource[resourceName],
        this.props.greatSuccess,
        daihatsuBonus,
        resupply)
    })

    const mkMatFromName = name => mkMat(itemNameToMaterialId( name ))
    const colFlexStyle = {
      display:"flex",
      justifyContent: "space-around",
      flexDirection: "column",
      marginLeft: "10px",
    }
    const hasNormalItem = info.itemNormal
    const hasGreatSuccessItem = this.props.greatSuccess && info.itemGreatSuccess
    const prettyRange = (x,y) => x === y ? `${x}` : `${x} ~ ${y}`
    return (
      <div style={{display: "flex", marginBottom: "5px"}}>
        <div style={{flex: "6", display: "flex", flexDirection: "column"}}>
          <Button onClick={this.props.onClickExped}>
            {this.props.expedId} {info.name}
          </Button>
          <div>Required Time (mins): {formatTime(info.timeInMin)}</div>
          <div style={{display: "flex"}}>
            <div style={{marginRight: "2px"}}>Cost:</div>
            <IconAndLabel
                icon={mkMat(1)} label={`${info.cost.fuelPercent}%`} />
            <IconAndLabel
                icon={mkMat(2)} label={`${info.cost.ammoPercent}%`} />
          </div>
        </div>
        <div style={{flex: "3", ...colFlexStyle}}>
          <ResourceWithDetail
              resourceName="fuel"
              icon={mkMat(1)} renderedResource={renderedResources.fuel} />
          <ResourceWithDetail 
              resourceName="ammo"
              icon={mkMat(2)} renderedResource={renderedResources.ammo} />
        </div>
        <div style={{flex:"3", ...colFlexStyle}}>
          <ResourceWithDetail 
              resourceName="steel"
              icon={mkMat(3)} renderedResource={renderedResources.steel} />
          <ResourceWithDetail 
              resourceName="bauxite"
              icon={mkMat(4)} renderedResource={renderedResources.bauxite} />
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
