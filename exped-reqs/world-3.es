import { fslSc, mk } from './common'

const defineWorld3 = defineExped => {
  defineExped(17)(
    [
      ...fslSc(20,6),
      mk.FleetCompo({CL: 1, DD: 3}),
    ])

  defineExped(18)(
    [
      ...fslSc(15,6),
      mk.FleetCompo({CVLike: 3, DD: 2}),
    ])

  defineExped(19)(
    [
      ...fslSc(20,6),
      mk.FleetCompo({BBV: 2, DD: 2}),
    ])

  defineExped(20)(
    [
      ...fslSc(1,2),
      mk.FleetCompo({SSLike: 1, CL: 1}),
    ])

  defineExped(21)(
    [
      ...fslSc(15,5),
      mk.LevelSum(30),
      mk.FleetCompo({CL: 1, DD: 4}),
      mk.DrumCarrierCount(3),
    ])

  defineExped(22)(
    [
      ...fslSc(30,6),
      mk.LevelSum(45),
      mk.FleetCompo({CA: 1, CL: 1, DD: 2}),
    ])

  defineExped(23)(
    [
      ...fslSc(50,6),
      mk.LevelSum(200),
      mk.FleetCompo({BBV: 2, DD: 2}),
    ])

  defineExped(24)(
    [
      ...fslSc(50,6),
      mk.LevelSum(200),
      mk.FleetCompo({CL: 1, DDorDE: 4}),
      mk.FSType('CL'),
    ])
}

export { defineWorld3 }
