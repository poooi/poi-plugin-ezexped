import { fslSc, mk } from './common'

const defineWorld4 = defineExped => {
  defineExped(25)(
    [
      ...fslSc(25,4),
      mk.FleetCompo({CA: 2, DD: 2}),
    ])

  defineExped(26)(
    [
      ...fslSc(30,4),
      mk.FleetCompo({CVLike: 1, CL: 1, DD: 2}),
    ])

  defineExped(27)(
    [
      ...fslSc(1,2),
      mk.FleetCompo({SSLike: 2}),
    ])

  defineExped(28)(
    [
      ...fslSc(30,3),
      mk.FleetCompo({SSLike: 3}),
    ])

  defineExped(29)(
    [
      ...fslSc(50,3),
      mk.FleetCompo({SSLike: 3}),
    ])

  defineExped(30)(
    [
      ...fslSc(55,4),
      mk.FleetCompo({SSLike: 4}),
    ])

  defineExped(31)(
    [
      ...fslSc(60,4),
      mk.LevelSum(200),
      mk.FleetCompo({SSLike: 4}),
    ])

  defineExped(32)(
    [
      ...fslSc(5,3),
      mk.FleetCompo({CT: 1, DD: 2}),
      mk.FSType('CT'),
    ])

  defineExped(/* D1 */ 131)(
    [
      ...fslSc(50, 5),
      mk.LevelSum(200),
      mk.FSType('AV'),
      mk.LevelSum(200),
      mk.FleetCompo({AV: 1, DD: 3}),
      mk.TotalAntiAir(240),
      mk.TotalAsw(240, true),
      mk.TotalLos(300),
    ]
  )

  defineExped(/* D2 */ 132)(
    [
      ...fslSc(55,5),
      mk.LevelSum(270),
      mk.FSType('AS'),
      mk.FleetCompo({AS: 1, SSLike: 3}),
      mk.TotalFirepower(60),
      mk.TotalAntiAir(80),
      mk.TotalAsw(50, true),
    ]
  )

  defineExped(/* D3 */ 133)(
    [
      ...fslSc(65,5),
      mk.LevelSum(350),
      mk.FSType('AS'),
      mk.FleetCompo({AS: 1, SSLike: 3}),
      mk.TotalFirepower(115),
      mk.TotalAntiAir(90),
      mk.TotalAsw(70, true),
      mk.TotalLos(95),
    ]
  )
}

export { defineWorld4 }
