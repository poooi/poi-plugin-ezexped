import { fslSc, mk } from './common'

const defineWorld2 = defineExped => {
  defineExped(9)(
    [
      ...fslSc(3,4),
      mk.AnyFleetCompo([
        {CL: 1, DDorDE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DE: 2},
        {CVE: 1, DD: 2},
      ]),

    ])

  defineExped(10)(
    [
      ...fslSc(3,3),
      mk.FleetCompo({CL: 2}),
    ])

  defineExped(11)(
    [
      ...fslSc(6,4),
      mk.FleetCompo({DDorDE: 2}),
    ])

  defineExped(12)(
    [
      ...fslSc(4,4),
      mk.FleetCompo({DDorDE: 2}),
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
      mk.TotalAntiAir(200),
      mk.TotalAsw(200, true),
      mk.TotalLos(140),
    ])

  defineExped(/* B2 */ 111)(
    [
      ...fslSc(45,6),
      mk.LevelSum(220),
      mk.FleetCompo({CA: 1, CL: 1, DD: 3}),
      mk.TotalFirepower(360),
      mk.TotalAntiAir(160),
      mk.TotalAsw(160, true),
      mk.TotalLos(140),
    ]
  )
  defineExped(/* B3 */ 112)(
    [
      ...fslSc(50,6),
      mk.LevelSum(250),
      mk.FleetCompo({AV: 1, CL: 1, DD: 4}),
      mk.TotalFirepower(400),
      mk.TotalAntiAir(220),
      mk.TotalAsw(220, true),
      mk.TotalLos(190),
    ]
  )

  defineExped(/* B4 */ 113)(
    [
      ...fslSc(55,6),
      mk.LevelSum(300),
      mk.FleetCompo({CA: 2, CL: 1, DD: 2, SSLike: 1}),
      mk.TotalFirepower(500),
      mk.TotalAntiAir(280),
      mk.TotalAsw(280, true),
      mk.TotalLos(170),
    ]
  )
  defineExped(/* B5 */ 114)(
    [
      ...fslSc(60,6),
      mk.LevelSum(330),
      mk.FleetCompo({AV: 1, CL: 1, DD: 2}),
      mk.TotalFirepower(510),
      mk.TotalAntiAir(400),
      mk.TotalAsw(285, true),
      mk.TotalLos(385),
    ]
  )

  defineExped(/* B6 */ 115)(
    [
      ...fslSc(75,6),
      mk.LevelSum(400),
      mk.FleetCompo({CL: 1, DD: 5}),
      mk.TotalFirepower(410),
      mk.TotalAntiAir(390),
      mk.TotalAsw(410, true),
      mk.TotalLos(340),
      mk.FSType('CL'),
    ]
  )
}

export { defineWorld2 }
