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
      mk.FleetCompo({CL: 1, DD: 2}),
    ])

  defineExped(5)(
    [
      ...fslSc(3,4),
      mk.FleetCompo({CL: 1, DD: 2}),
    ])

  defineExped(6)(
    [
      ...fslSc(4,4),
      mk.Morale(1),
    ])

  defineExped(7)(fslSc(5,6))

  defineExped(8)(fslSc(6,6))
}

export { defineWorld1 }
