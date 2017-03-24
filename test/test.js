const assert = require('assert')
const spec = it

import * as estype from "../estype"

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

  describe('checkFleetSTypes', () => {
    spec('tests', () => {
      assert.deepStrictEqual(
        estype.checkFleetSTypes(1,"DD")([ty.DD,ty.DD]),
        true)
      assert.deepStrictEqual(
        estype.checkFleetSTypes(2,"DD")([ty.DD,ty.DD]),
        true)
      assert.deepStrictEqual(
        estype.checkFleetSTypes(3,"DD")([ty.DD,ty.DD]),
        { type: "ShipType", estype: "DD", count: 3 })

      assert.deepStrictEqual(
        estype.checkFleetSTypes(2,"CVLike")([ty.DD,ty.DD]),
        { type: "ShipType", estype: "CVLike", count: 2 })

      assert.deepStrictEqual(
        estype.checkFleetSTypes(2,"CVLike")([ty.CV,ty.AV]),
        true)
    })})
})
