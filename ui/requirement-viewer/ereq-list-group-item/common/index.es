/* eslint-disable react/prop-types */
import _ from 'lodash'
import React from 'react'
import { __ } from '../../../../tr'

const formatReqExplain = ereqType => (...args) =>
  __(`RequirementExplain.${ereqType}`, ...args)

const getExtraType = props =>
  _.get(props,'result.extra.type')

const mayNoFlagship = props =>
  getExtraType(props) === 'NoFlagship' ? (
    <div>
      {__('RequirementExplain.TTNoFlagship')}
    </div>
  ) : null

const mayNeedMore = (describe,typ = 'GreaterOrEqual') => props =>
  getExtraType(props) === typ ? (
    <div>
      {describe(props.result.extra.left, props.result.extra.right)}
    </div>
  ) : null

const mayShipList = renderShipList => props =>
  getExtraType(props) === 'ShipList' ? (
    <div
      className="ezexped-pop"
      id={`${props.prefix}detail`}>
      {renderShipList(props.result.extra.shipList)}
    </div>
  ) : null

const renderShipList = (header=null) => shipList => (
  <div>
    {
      header && (
        <div key="header">
          {header}
        </div>
      )
    }
    {
      shipList.map(s => (
        <div key={s.rstId}>
          {`${s.name} Lv.${s.level}`}
        </div>
      ))
    }
  </div>
)

export * from './item-template'
export {
  getExtraType,
  formatReqExplain,
  mayNoFlagship,
  mayNeedMore,
  mayShipList,
  renderShipList,
}
