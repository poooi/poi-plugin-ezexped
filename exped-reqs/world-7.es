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
      ...fslSc(45,6),
      mk.FleetCompo({CVLike: 2, AV: 1, CL: 1, DD: 2}),
      mk.DrumCarrierCount(3),
      mk.DrumCount(6),
    ]
  )
}

export { defineWorld7 }
