import { fslSc, mk } from './common'

const defineWorld2 = defineExped => {
  defineExped(9)(
    [
      ...fslSc(3,4),
      mk.FleetCompo({CL: 1, DD: 2}),
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
}

export { defineWorld2 }
