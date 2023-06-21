import { fslSc, mk } from './common'

const defineWorld7 = defineExped => {
  defineExped(41)(
    [
      ...fslSc(30,3),
      mk.LevelSum(100),
      mk.FleetCompo({DDorDE: 3}),
      mk.TotalFirepower(60),
      mk.TotalAntiAir(80),
      mk.TotalAsw(210),
    ]
  )
  defineExped(42)(
    [
      ...fslSc(45,4),
      mk.LevelSum(200),
      mk.AnyFleetCompo([
        {CL: 1, DD: 2},
        {CL: 1, DE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DD: 2},
        {CVE: 1, DE: 2},
      ]),
    ]
  )
  defineExped(43)(
    [
      ...fslSc(55,6),
      mk.LevelSum(300),
      mk.FSType('CVL'),
      mk.AnyFleetCompo([
        {CVE: 1, DD: 2},
        {CVE: 1, DE: 2},
        {CVL: 1, CL: 1, DD: 4},
        {CVL: 1, CL: 1, DE: 2},
        {CVL: 1, DD: 1, DE: 3},
        {CVL: 1, CT: 1, DE: 2},
        {CVL: 1, CVE: 1, DD: 2},
        {CVL: 1, CVE: 1, DE: 2},
      ]),
      mk.TotalFirepower(500),
      mk.TotalAntiAir(280),
      mk.TotalAsw(280),
      mk.TotalLos(170),
    ]
  )
  defineExped(44)(
    [
      ...fslSc(35,6),
      mk.LevelSum(210),
      mk.FleetCompo({
        CVLike: 2,
        AV: 1,
        CL: 1,
        DDorDE: 2,
      }),
      mk.DrumCarrierCount(3),
      mk.DrumCount(6),
      mk.TotalAntiAir(200),
      mk.TotalAsw(200),
      mk.TotalLos(150),
    ]
  )
  defineExped(45)([
    ...fslSc(50,5),
    mk.LevelSum(240),
    mk.FSType('CVL'),
    mk.FleetCompo({
      CVL: 1,
      DDorDE: 4,
    }),
    mk.TotalAntiAir(240),
    mk.TotalAsw(300),
    mk.TotalLos(180),
  ])
  defineExped(46)([
    ...fslSc(60,5),
    mk.LevelSum(300),
    mk.FleetCompo({
      CA: 2,
      CL: 1,
      DD: 2,
    }),
    mk.TotalFirepower(350),
    mk.TotalAntiAir(250),
    mk.TotalAsw(220),
    mk.TotalLos(190),
  ])
}

export { defineWorld7 }
