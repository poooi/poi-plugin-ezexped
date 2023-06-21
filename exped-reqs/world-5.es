import { fslSc, mk } from './common'

const defineWorld5 = defineExped => {
  defineExped(33)(
    [
      ...fslSc(1,2),
      mk.FleetCompo({DD: 2}),
    ])

  defineExped(34)(
    [
      ...fslSc(1,2),
      mk.FleetCompo({DD: 2}),
    ])

  defineExped(35)(
    [
      ...fslSc(40,6),
      mk.FleetCompo({CVLike: 2, CA: 1, DD: 1}),
    ])

  defineExped(36)(
    [
      ...fslSc(30,6),
      mk.FleetCompo({AV: 2, CL: 1, DD: 1}),
    ])

  /*
     requirement for exped 37 updated, it now just requires 3 drum carriers
     and still require 4 drums for a successful run.

     references as of Apr 5th, 2017:
     - http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC
     - http://kancolle.wikia.com/wiki/Expedition
   */
  defineExped(37)(
    [
      ...fslSc(50,6),
      mk.LevelSum(200),
      mk.FleetCompo({CL: 1, DD: 5}),
      mk.DrumCarrierCount(3),
      mk.DrumCount(4),
    ])


  defineExped(38)(
    [
      ...fslSc(65,6),
      mk.LevelSum(240),
      mk.FleetCompo({DD: 5}),
      mk.DrumCarrierCount(4),
      mk.DrumCount(8),
    ])

  defineExped(39)(
    [
      ...fslSc(3,5),
      mk.LevelSum(180),
      mk.FleetCompo({AS: 1, SSLike: 4}),
    ])

  defineExped(40)(
    [
      ...fslSc(25,6),
      mk.LevelSum(150),
      mk.FleetCompo({CL: 1, AV: 2, DD: 2}),
      mk.FSType('CL'),
    ])
  defineExped(/* E1 */ 141)(
    [
      ...fslSc(55,6),
      mk.LevelSum(290),
      mk.FleetCompo({CA: 1, CL: 1, DD: 3}),
      mk.FSType('CA'),
      mk.TotalFirepower(450),
      mk.TotalAsw(330),
      mk.TotalAntiAir(350),
      mk.TotalLos(250),
    ])
  defineExped(/* E2 */ 142)(
    [
      ...fslSc(70,5),
      mk.LevelSum(320),
      mk.FleetCompo({DD: 5}),
      mk.TotalFirepower(280),
      mk.TotalAntiAir(240),
      mk.TotalAsw(200),
      mk.TotalLos(160),
      mk.DrumCarrierCount(3),
      mk.DrumCount(4),
    ])
}

export { defineWorld5 }
