import shallowequal from 'shallowequal'

const shallowEqual = shallowequal

// enumFromTo(x,y) = [x,x+1,x+2...y]
// only guarantee to work on increasing sequences
const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

function warn(...args) {
  return console.warn.apply(this, args)
}

function error(...args) {
  return console.error.apply(this, args)
}

const valMap = obj => f => {
  const ret = {}
  Object.keys(obj).map( k => {
    ret[k] = f(obj[k])
  })
  return ret
}

// usage: "ignore(a,b,c)" to fool eslint to believe that "a", "b" and "c"
// are somehow being used, it serves as an explicit annotation to say that they actually don't
const ignore = () => {}

// "modifyArray(index,f)(xs)" keeps "xs" intact and returns a new array
// whose element on "index" is modified by feeding original value to "f".
// if "index" is out of range, "xs" itself is returned.
const modifyArray = (index, f) => {
  if (typeof index !== "number")
    error("index is not a number")
  if (typeof f !== "function")
    error("modifier is not a function")
  return xs => {
    if (index < 0 || index >= xs.length)
      return xs
    const ys = [...xs]
    const v = ys[index]
    const newV = f(v)
    if (v !== newV) {
      ys[index] = newV
      return ys
    } else {
      return xs
    }
  }
}

const modifyObject = (propName, f, removeUndefined = false) => {
  if (typeof f !== 'function')
    console.error('modifier is not a function')

  return obj => {
    const val = obj[propName]
    const newVal = f(val)
    if (val === newVal)
      return obj

    if (typeof newVal === 'undefined' && removeUndefined) {
      const newObj = {...obj}
      delete newObj[propName]
      return newObj
    } else {
      return ({
        ...obj,
        [propName]: newVal,
      })
    }
  }
}

const not = x => !x

const testSelector = selector => () => {
  try {
    const { getStore } = window
    // eslint-disable-next-line no-console
    console.log(selector(getStore()))
  } catch (e) {
    console.error(`error while testing selector ${e}`)
  }
}

const mergeMapDispatchToProps = (...mdtps) => dispatch =>
  mdtps.reduce(
    (props, curMdtp) => ({...props, ...curMdtp(dispatch)}),
    {})

const mergeMapStateToProps = mergeMapDispatchToProps

// create singleton object
const singObj = propName => v => ({[propName]: v})

export {
  shallowEqual,

  enumFromTo,
  valMap,
  ignore,
  not,
  modifyArray,
  modifyObject,

  warn,
  error,

  testSelector,

  mergeMapDispatchToProps,
  mergeMapStateToProps,

  singObj,
}
