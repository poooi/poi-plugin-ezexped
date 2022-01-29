import { fslSc, mk } from './common'

const defineWorld7 = defineExped => {
  defineExped(41)(
    [
      ...fslSc(30,3),
      mk.LevelSum(115),
      mk.FleetCompo({DDorDE: 3}),
      mk.TotalAsw(210, true),
      mk.TotalAntiAir(80),
    ]
  )
  defineExped(42)(
    [
      ...fslSc(45,4),
      mk.LevelSum(200),
      mk.AnyFleetCompo([
        {CVE: 1, DDorDE: 3},
        {CL: 1, DDorDE: 3},
        {CT: 1, DDorDE: 3},
      ]),
    ]
  )
  defineExped(43)(
    [
      ...fslSc(55,6),
      mk.LevelSum(300),
      mk.FSType('CVE'),
      mk.FleetCompo({CVE: 1, DDorDE: 2}),
      mk.TotalFirepower(500),
      mk.TotalAsw(280, true),
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
      mk.TotalAsw(200, true),
      mk.TotalLos(150),
    ]
  )
  defineExped(45)([
    ...fslSc(50,5),
    mk.LevelSum(240),
    mk.FleetCompo({
      CVL: 1,
      DDorDE: 4,
    }),
    mk.FSType('CVL'),
    mk.TotalAntiAir(240),
    // TODO: to be confirmed.
    mk.TotalAsw(300, true),
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
    mk.TotalAntiAir(300),
    mk.TotalAsw(220, true),
    mk.TotalLos(200),
  ])
}

export { defineWorld7 }
