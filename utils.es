// enumFromTo(x,y) = [x,x+1,x+2...y]
// only guarantee to work on increasing sequences
const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

const warn = function () {
  return console.warn.apply(this, arguments)
}

const error = function () {
  return console.error.apply(this, arguments)
}

const valMap = obj => f => {
  const ret = {}
  Object.keys(obj).map( k => ret[k] = f(obj[k]) )
  return ret
}

export {
  enumFromTo,
  valMap,

  warn,
  error,
}
