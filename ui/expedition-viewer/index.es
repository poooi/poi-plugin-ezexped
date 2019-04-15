import { createStructuredSelector } from 'reselect'
import React, { Component } from 'react'
import {
  Button,
  ButtonGroup,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { modifyObject } from 'subtender'

import { MaterialIcon, SlotitemIcon } from 'views/components/etc/icon'
import { daihatsu, fleetResupplyCost } from '../../income-calc'

import { __, fmtTime } from '../../tr'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'

import { IconAndLabel } from './icon-and-label'
import { ResourceWithDetail } from './resource-with-detail'
import { ExpeditionPicker } from './expedition-picker'
import {
  expedIdSelector,
  fleetInfoSelector,
  gsFlagSelector,
  dlcFlagSelector,
  getExpedInfoFuncSelector,
} from '../../selectors'
import { debug } from '../../debug'

const itemNameToMaterialId = x =>
  x === "Bucket" ? 6 :
  x === "Flamethrower" ? 5 :
  x === "DevMat" ? 7 :
  x === "FCoinSmall" ? 10 :
  x === "FCoinMedium" ? 11 :
  x === "FCoinLarge" ? 12 :
  debug.error(`unknown item name: ${x}`)

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

class ExpeditionViewerImpl extends Component {
  static propTypes = {
    expedId: PTyp.number.isRequired,
    greatSuccess: PTyp.bool.isRequired,
    dlcFlag: PTyp.bool.isRequired,
    getExpedInfo: PTyp.func.isRequired,
    mountPoint: PTyp.any.isRequired,

    fleet: PTyp.object.isRequired,
    modifyState: PTyp.func.isRequired,
  }

  handleClickExped = () =>
    this.props.modifyState(
      modifyObject(
        'expedTableExpanded',
        x => !x))

  handleToggleGS = () => {
    const {expedId, modifyState} = this.props
    modifyState(
      modifyObject(
        'gsFlags',
        modifyObject(
          expedId,
          x => !x
        )
      )
    )
  }

  handleToggleDlc = () => {
    const {expedId, modifyState} = this.props
    modifyState(
      modifyObject(
        'dlcFlags',
        modifyObject(
          expedId,
          x => !x
        )
      )
    )
  }

  render() {
    const {expedId, getExpedInfo, mountPoint} = this.props
    const info = getExpedInfo(expedId)
    const resupplyCost =
      fleetResupplyCost(this.props.fleet.ships)(
        info.cost.fuelPercent / 100, info.cost.ammoPercent / 100)
    const daihatsuBonus =
      daihatsu.computeBonus(this.props.fleet.ships)

    // have to apply a semicolon otherwise parser won't recognize this properly
    const renderedResources = {};
    ["fuel","ammo","steel","bauxite"].map( resourceName => {
      const resupply =
        resourceName === 'fuel' ? resupplyCost.fuelCost :
        resourceName === 'ammo' ? resupplyCost.ammoCost :
        0

      if (info.resources) {
        renderedResources[resourceName] = renderTexts(
          info.resources[resourceName],
          this.props.greatSuccess,
          daihatsuBonus,
          resupply)
      } else {
        renderedResources[resourceName] =
          resupply > 0 ? `???-${resupply}` : '???'
      }
    })

    const mkMatFromName = name => mkMat(itemNameToMaterialId(name))
    const hasNormalItem = info.itemNormal
    const canObtainGreatSuccessItem =
      this.props.greatSuccess && info.itemGreatSuccess
    const prettyRange = (x,y) => x === y ? `${x}` : `${x}~${y}`
    const gsRangeText =
      info.itemGreatSuccess && prettyRange(1,info.itemGreatSuccess.itemMaxCount)

    return (
      <div
        className="exped-viewer"
        style={{
          display: 'flex',
          marginBottom: 5,
        }}
      >
        <div
          style={{
            flex: 1,
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <ExpeditionPicker
            mountPoint={mountPoint}
          />
          <div style={{textAlign: 'center'}}>
            {fmtTime(info.timeInMin)}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplate: 'auto / 1fr 1fr',
              alignItems: 'center',
            }}
          >
            <IconAndLabel
              icon={mkMat(1)} label={`${info.cost.fuelPercent}%`}
            />
            <IconAndLabel
              icon={mkMat(2)} label={`${info.cost.ammoPercent}%`}
            />
            <IconAndLabel
              icon={hasNormalItem ? mkMatFromName(info.itemNormal.itemId) : '-'}
              label={hasNormalItem ? prettyRange(0,info.itemNormal.itemMaxCount) : '-'}
            />
            <IconAndLabel
              icon={info.itemGreatSuccess ? mkMatFromName(info.itemGreatSuccess.itemId) : '-'}
              label={
                (
                  info.itemGreatSuccess ? (
                    canObtainGreatSuccessItem ?
                      gsRangeText : (
                        <OverlayTrigger
                          overlay={
                            (
                              <Tooltip id="ezexped-great-sucess-only-item">
                                {__('TTGreatSucessOnlyItem')}
                              </Tooltip>
                            )
                          }
                          placement="bottom"
                        >
                          <div className="text-danger">
                            {gsRangeText}
                          </div>
                        </OverlayTrigger>
                      )
                  ) : '-'
                )
              }
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            width: '50%',
            flex: 1,
            flexDirection: 'column',
          }}>
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplate: 'auto / 1fr 1fr',
              alignItems: 'center',
              marginLeft: 5,
            }}
          >
            <ResourceWithDetail
              resourceName="fuel"
              icon={mkMat(1)}
              renderedResource={renderedResources.fuel}
            />
            <ResourceWithDetail
              resourceName="steel"
              icon={mkMat(3)}
              renderedResource={renderedResources.steel}
            />
            <ResourceWithDetail
              resourceName="ammo"
              icon={mkMat(2)}
              renderedResource={renderedResources.ammo}
            />
            <ResourceWithDetail
              resourceName="bauxite"
              icon={mkMat(4)}
              renderedResource={renderedResources.bauxite}
            />
          </div>
          <ButtonGroup style={{display: 'flex'}}>
            <Button
              style={{
                flex: 1, display: 'flex', alignItems: 'baseline',
                width: 0,
              }}
              onClick={this.handleToggleGS}>
              <FontAwesome
                className={
                  this.props.greatSuccess ?
                    `poi-ship-cond-53 dark` :
                    ''
                }
                style={{marginRight: 5}}
                name={this.props.greatSuccess ? "check-square-o" : "square-o"} />
              <span
                className={
                  this.props.greatSuccess ? `poi-ship-cond-53 dark` : ''}
                style={{
                  flex: 1,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {__("Great Success")}
              </span>
            </Button>
            <OverlayTrigger
              placement="left"
              overlay={
                (
                  <Tooltip id="ezexped-dlc-button">
                    {__('TTFillDlcExplain')}
                  </Tooltip>
                )
              }
            >
              <Button
                bsStyle={this.props.dlcFlag ? 'primary' : 'default'}
                onClick={this.handleToggleDlc}
                style={{
                  width: '3em',
                  padding: 0,
                }}
              >
                <SlotitemIcon
                  className="slotitem-img"
                  slotitemId={20}
                />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </div>
      </div>
    )
  }
}

const uiSelector = createStructuredSelector({
  expedId: expedIdSelector,
  fleet: fleetInfoSelector,
  greatSuccess: gsFlagSelector,
  dlcFlag: dlcFlagSelector,
  getExpedInfo: getExpedInfoFuncSelector,
})

const ExpeditionViewer = connect(
  uiSelector,
  mapDispatchToProps,
)(ExpeditionViewerImpl)

export { ExpeditionViewer }
