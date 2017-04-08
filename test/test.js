const assert = require('assert')
const spec = it

import * as estype from "../estype"
import * as req from "../requirement"

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
