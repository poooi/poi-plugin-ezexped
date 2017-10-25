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

  // reference: http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC
  defineExped(100)(
    [
      ...fslSc(5,4),
      mk.FleetCompo({DDorDE: 3}),
    ]
  )

  // reference: https://docs.google.com/spreadsheets/d/1BM2SCpxuZRMY0R9ipptY6jQ1-v51tOijBJ8Fofpx33c
  defineExped(101)(
    [
      ...fslSc(20,4),
      mk.FleetCompo({DDorDE: 4}),
      mk.TotalAsw(180),
      // TODO: AA?
      mk.MissingInfo(),
    ]
  )

  defineExped(102)(
    [
      ...fslSc(35,5),
      mk.LevelSum(185),
      mk.AnyFleetCompo([
        {CL: 1, DDorDE: 3},
        {DD: 1, DE: 3},
        {CT: 1, DD: 2, DE: 2},
      ]),
      mk.TotalAsw(280),
    ]
  )
}

export { defineWorld1 }
