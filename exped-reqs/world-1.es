import { fslSc, mk } from './common'

const defineWorld1 = defineExped => {
  defineExped(1)(
    [
      ...fslSc(1,2),
      mk.Morale(28),
    ])

  defineExped(2)(
    [
      ...fslSc(2,4),
      mk.Morale(13),
    ])

  defineExped(3)(
    [
      ...fslSc(3,3),
      mk.Morale(22),
    ])

  defineExped(4)(
    [
      ...fslSc(3,3),
      mk.AnyFleetCompo([
        {CL: 1, DDorDE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DE: 2},
        {CVE: 1, DD: 2},
      ])
    ])

  defineExped(5)(
    [
      ...fslSc(3,4),
      mk.AnyFleetCompo([
        {CL: 1, DDorDE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DE: 2},
        {CVE: 1, DD: 2},
      ])
    ])

  defineExped(6)(
    [
      ...fslSc(4,4),
      mk.Morale(1),
    ])

  defineExped(7)(fslSc(5,6))

  defineExped(8)(fslSc(6,6))

  defineExped(/* A1 */ 100)(
    [
      ...fslSc(5,4),
      mk.LevelSum(10),
      mk.FleetCompo({DDorDE: 3}),
    ]
  )

  defineExped(/* A2 */ 101)(
    [
      ...fslSc(20,4),
      mk.FleetCompo({DDorDE: 4}),
      mk.TotalFirepower(50),
      mk.TotalAntiAir(70),
      mk.TotalAsw(180, true),
    ]
  )

  defineExped(/* A3 */ 102)(
    [
      ...fslSc(35,5),
      mk.LevelSum(185),
      mk.AnyFleetCompo([
        {CL: 1, DDorDE: 3},
        {CL: 1, DE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DD: 2},
        {CVE: 1, DE: 2},
      ]),
      mk.TotalAsw(280, true),
      mk.TotalLos(60),
    ]
  )
  defineExped(/* A4 */ 103)(
    [
      ...fslSc(40,5),
      mk.LevelSum(200),
      mk.AnyFleetCompo([
        {CL: 1, DD: 2},
        {CL: 1, DE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DD: 2},
        {CVE: 1, DE: 2},
      ]),
      mk.TotalFirepower(300),
      mk.TotalAntiAir(200),
      mk.TotalAsw(200, true),
      mk.TotalLos(120),
    ]
  )
  defineExped(/* A5 */ 104)(
    [
      ...fslSc(45,5),
      mk.LevelSum(230),
      mk.AnyFleetCompo([
        {CL: 1, DD: 3},
        {CL: 1, DE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DD: 2},
        {CVE: 1, DE: 2},
      ]),
      mk.TotalFirepower(280),
      mk.TotalAntiAir(220),
      mk.TotalAsw(240, true),
      mk.TotalLos(150),
    ]
  )
  defineExped(/* A6 */ 105)(
    [
      ...fslSc(55,6),
      mk.LevelSum(290),
      mk.AnyFleetCompo([
        {CL: 1, DD: 3},
        {CL: 1, DE: 2},
        {DD: 1, DE: 3},
        {CT: 1, DE: 2},
        {CVE: 1, DD: 2},
        {CVE: 1, DE: 2},
      ]),
      mk.TotalFirepower(330),
      mk.TotalAntiAir(300),
      mk.TotalAsw(270, true),
      mk.TotalLos(180),
    ]
  )
}

export { defineWorld1 }
