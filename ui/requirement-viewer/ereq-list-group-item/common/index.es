/* eslint-disable react/prop-types */
import _ from 'lodash'
import React from 'react'
import {
  Tooltip,
} from 'react-bootstrap'
import { __ } from '../../../../tr'

const formatReqExplain = ereqType => (...args) =>
  __(`RequirementExplain.${ereqType}`, ...args)

const getExtraType = props =>
  _.get(props,'result.extra.type')

const mayNoFlagship = props =>
  getExtraType(props) === 'NoFlagship' ? (
    <Tooltip
      className="ezexped-pop"
      id={`${props.prefix}detail`}>
      {__('RequirementExplain.TTNoFlagship')}
    </Tooltip>
  ) : null

const mayNeedMore = (describe,typ = 'GreaterOrEqual') => props =>
  getExtraType(props) === typ ? (
    <Tooltip
      className="ezexped-pop"
      id={`${props.prefix}detail`}>
      {describe(props.result.extra.left, props.result.extra.right)}
    </Tooltip>
  ) : null

const mayShipList = renderShipList => props =>
  getExtraType(props) === 'ShipList' ? (
    <Tooltip
      className="ezexped-pop"
      id={`${props.prefix}detail`}>
      {renderShipList(props.result.extra.shipList)}
    </Tooltip>
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

