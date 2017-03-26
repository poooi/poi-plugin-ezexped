// enumFromTo(x,y) = [x,x+1,x+2...y]
// only guarantee to work on increasing sequences
const enumFromTo = (frm,to,succ=(x => x+1)) => {
  const arr = []
  for (let i=frm; i<=to; i=succ(i))
    arr.push( i )
  return arr
}

// to same effect of "throw" statement.
// useful in situations where an expression is expected.
const throwWith = data => {
  throw data
}

export { enumFromTo, throwWith }
