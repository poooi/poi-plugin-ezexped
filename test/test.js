import assert from 'assert'

import * as estype from "../estype"

const spec = it

describe('estype', () => {
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
      assert( !estype.isESType.CVE(ty.CVL, 521) )
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
