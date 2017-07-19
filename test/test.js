import assert from 'assert'

import * as estype from "../estype"
import * as utils from "../utils"

const spec = it

describe('estype', () => {
  describe('nameToId & idToName', () => {
    spec('name -> id -> name', () => {
      estype.allSTypes.map( n => {
        assert.equal(n, estype.idToName(estype.nameToId(n)))
      })
    })
  })

  const ty = estype.stype
  describe('isESType', () => {
    spec('tests', () => {
      assert( estype.isESType.DD( ty.DD ) )
      assert( ! estype.isESType.BBV( ty.DD ) )
      assert( estype.isESType.CVLike( ty.CVL ) )
      assert( estype.isESType.CVLike( ty.AV ) )
      assert( estype.isESType.SSLike( ty.SS ) )
      assert( estype.isESType.SSLike( ty.SSV ) )
      assert( ! estype.isESType.SSLike( ty.AV ) )
      assert( estype.isESType.CVE(ty.CVL, 529) )
      assert( ! estype.isESType.CVE(ty.CVL, 318))
      assert( estype.isESType.DE( ty.DE ) )
      assert( ! estype.isESType.DE( ty.DD ) )
    })
  })

  describe('esFleetCompoToPairs', () => {
    spec('tests', () => {
      assert.deepEqual(
        estype.esFleetCompoToPairs({}),
        [])

      assert.deepEqual(
        estype.esFleetCompoToPairs({CL: 1, DD: 2, BBV: 3}),
        estype.esFleetCompoToPairs({BBV: 3, CL: 1, DD: 2}))

      assert.deepEqual(
        estype.esFleetCompoToPairs({CL: 1, DD: 2, BBV: 3}),
        [
          ['BBV', 3],
          ['CL', 1],
          ['DD', 2],
        ])
      assert.deepEqual(
        estype.esFleetCompoToPairs({CL: undefined, BBV: null, DD: 2}),
        [
          ['BBV', null],
          ['CL', undefined],
          ['DD', 2],
        ])
    })
  })
})

describe('utils', () => {
  describe('enumFromTo', () => {
    spec('tests', () => {
      assert.deepEqual(utils.enumFromTo(1,4),[1,2,3,4])
      assert.deepEqual(utils.enumFromTo(10,4),[])
      assert.deepEqual(utils.enumFromTo(3,3),[3])
      assert.deepEqual(utils.enumFromTo(10,100,x => x+30),[10,40,70,100])
    })
  })

  describe('valMap', () => {
    spec('tests', () => {
      const testObj = {a: 1, b: 10, c: 30, d: null, e: false}

      assert.deepEqual(
        utils.valMap(testObj)(x => String(x)),
        {a: "1", b: "10", c: "30", d: "null", e: "false"})

      assert.deepEqual(
        utils.valMap(testObj)(x => typeof x === "number" ? x : undefined),
        {a: 1, b: 10, c: 30, d: undefined, e: undefined})
    })
  })

  describe('modifyArray', () => {
    // for turning console.error calls into errors
    let consoleError
    before( () => {
      consoleError = console.error
      console.error = (...args) => {
        throw Error( JSON.stringify(args) )
      }
    })
    after( () => {
      console.error = consoleError
    })

    spec('tests', () => {
      const arr = [1,2,3,4,5]

      assert.deepEqual(
        utils.modifyArray(0,x => x+1)(arr),
        [2,2,3,4,5])

      assert.deepEqual(
        utils.modifyArray(4,() => false)(arr),
        [1,2,3,4,false])

      assert.throws( () => {
        utils.modifyArray(undefined,undefined)
      })

      assert.throws( () => {
        utils.modifyArray(x => !x,10)
      })
    })
  })
})
