import shallowequal from 'shallowequal'
import {
  enumFromTo,
  not,
  ignore,
  modifyArray,
  modifyObject,
  singObj,
  mergeMapDispatchToProps,
  mergeMapStateToProps,
} from 'subtender'

const shallowEqual = shallowequal

function error(...args) {
  return console.error.apply(this, args)
}

const precompose = prj => f => (...args) =>
  f(...args.map(prj))

export {
  shallowEqual,

  enumFromTo,

  ignore,
  not,
  modifyArray,
  modifyObject,

  error,

  mergeMapDispatchToProps,
  mergeMapStateToProps,

  singObj,
  precompose,
}
