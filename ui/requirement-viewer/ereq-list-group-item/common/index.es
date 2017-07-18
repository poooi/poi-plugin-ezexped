/* eslint-disable react/prop-types   */
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
      Flagship not found
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

export * from './item-template'
export {
  formatReqExplain,
  mayNoFlagship,
  mayNeedMore,
}

