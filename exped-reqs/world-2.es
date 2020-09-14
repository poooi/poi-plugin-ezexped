import { fslSc, mk, escortSpecialFleetCompos } from './common'

const defineWorld2 = defineExped => {
  defineExped(9)(
    [
      ...fslSc(3,4),
      escortSpecialFleetCompos,
    ])

  defineExped(10)(
    [
      ...fslSc(3,3),
      mk.FleetCompo({CL: 2}),
    ])

  defineExped(11)(
    [
      ...fslSc(6,4),
      mk.FleetCompo({DD: 2}),
    ])

  defineExped(12)(
    [
      ...fslSc(4,4),
      mk.FleetCompo({DD: 2}),
    ])

  defineExped(13)(
    [
      ...fslSc(5,6),
      mk.FleetCompo({CL: 1, DD: 4}),
    ])

  defineExped(14)(
    [
      ...fslSc(6,6),
      mk.FleetCompo({CL: 1, DD: 3}),
    ])

  defineExped(15)(
    [
      ...fslSc(9,6),
      mk.FleetCompo({CVLike: 2, DD: 2}),
    ])

  defineExped(16)(
    [
      ...fslSc(11,6),
      mk.FleetCompo({CL: 1, DD: 2}),
    ])

  // reference: http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC
  defineExped(/* B1 */ 110)(
    [
      ...fslSc(40,6),
      mk.LevelSum(150),
      mk.FleetCompo({AV: 1, CL: 1, DDorDE: 2}),
      mk.TotalAsw(200, true),
      mk.TotalAntiAir(200),
      mk.TotalLos(140),
    ])

  defineExped(/* B2 */ 111)(
    [
      ...fslSc(45,6),
      mk.LevelSum(290),
      mk.FleetCompo({CA: 1, CL: 1, DD: 3}),
      mk.TotalFirepower(360),
    ]
  )
  defineExped(/* B3 */ 112)(
    [
      ...fslSc(50,6),
      mk.LevelSum(350),
      mk.FleetCompo({AV: 1, CL: 1, DD: 4}),
      mk.TotalFirepower(400),
      mk.TotalAsw(220, true),
    ]
  )

  defineExped(/* B4 */ 113)(
    [
      ...fslSc(55,6),
      mk.FleetCompo({CA: 2, CL: 1, DD: 2, SSLike: 1}),
      mk.TotalAsw(280, true),
      mk.TotalFirepower(500),
    ]
  )
  defineExped(/* B5 */ 114)(
    [
      ...fslSc(60,6),
      mk.LevelSum(346),
      mk.FleetCompo({AV: 1, CL: 1, DD: 2}),
      mk.TotalFirepower(510),
      mk.TotalAsw(285, true),
      mk.TotalAntiAir(400),
      mk.TotalLos(385),
    ]
  )
}

export { defineWorld2 }
