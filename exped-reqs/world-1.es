import { fslSc, mk, escortSpecialFleetCompos } from './common'

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
      escortSpecialFleetCompos,
    ])

  defineExped(5)(
    [
      ...fslSc(3,4),
      escortSpecialFleetCompos,
    ])

  defineExped(6)(
    [
      ...fslSc(4,4),
      mk.Morale(1),
    ])

  defineExped(7)(fslSc(5,6))

  defineExped(8)(fslSc(6,6))

  // TODO: waiting for requirements to be confirmed
  defineExped(100)(
    [
      mk.ShipCount(4),
      mk.AnyFleetCompo([
        {CL: 1, DD: 3},
        {DD: 4},
      ]),
      mk.TotalAsw(Infinity),
      mk.MissingInfo(),
    ]
  )
  defineExped(101)(
    [
      mk.ShipCount(4),
      mk.FSLevel(20),
      mk.FleetCompo({DDorDE: 4}),
      mk.TotalAsw(180),
      mk.MissingInfo(),
    ]
  )
  defineExped(102)(
    [
      mk.ShipCount(5),
      mk.AnyFleetCompo([
        {CL: 1, DD: 4},
        {CL: 1, DD: 2, DE: 2},
      ]),
      mk.TotalAsw(Infinity),
      mk.MissingInfo(),
    ]
  )
}

export { defineWorld1 }
