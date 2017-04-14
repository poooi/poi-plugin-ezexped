const assert = require('assert')
const spec = it

import * as estype from "../estype"
import * as req from "../requirement"
import * as utils from "../utils"

describe('estype', () => {
  describe('nameToId & idToName', () => {
    spec('name -> id -> name', () => {
      estype.allSTypes.map( n => {
        assert.equal(n, estype.idToName(estype.nameToId(n)))
      })})})

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
    })})
})

describe('requirement', () => {
  describe('collapseResults', () => {
    spec('tests', () => {
      const aT = inp => assert( req.collapseResults( inp ) )
      const aF = inp => assert( !req.collapseResults( inp ) )

      aT( true )
      aF( false )

      aT( [true, true, {x: true, y: true} ] )
      aF( [true, true, {x: false, y: true} ] )

      aT( [[true,true],[],{}] )
      aF( [[true,true],[false],{}] )

      aT( {x: true, y: [{}, []], z: [true,true]} )
      aF( {x: true, y: [{u:false}, []], z: [true,true]} )

    })})
})

describe('utils', () => {
  describe('enumFromTo', () => {
    spec('tests', () => {
      assert.deepEqual(utils.enumFromTo(1,4),[1,2,3,4])
      assert.deepEqual(utils.enumFromTo(10,4),[])
      assert.deepEqual(utils.enumFromTo(3,3),[3])
      assert.deepEqual(utils.enumFromTo(10,100,x=>x+30),[10,40,70,100])
    })
  })

  describe('valMap', () => {
    spec('tests', () => {
      const testObj = {a: 1, b:10, c:30, d: null, e: false}

      assert.deepEqual(
        utils.valMap(testObj)(x => String(x)),
        {a:"1", b:"10", c:"30", d:"null", e:"false"})

      assert.deepEqual(
        utils.valMap(testObj)(x => typeof x === "number" ? x : undefined),
        {a:1, b:10, c:30, d: undefined, e: undefined})

    })
  })

  describe('konst', () => {
    spec('tests', () => {
      assert.equal(utils.konst(10)(false), 10)
      assert.equal(utils.konst(10)(), 10)
      assert.equal(utils.konst(10)(undefined,undefined,undefined), 10)
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
        utils.modifyArray(4,utils.konst(false))(arr),
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
