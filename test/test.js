import assert from 'assert'

import * as estype from "../estype"
import * as utils from "../utils"
import * as autoSwitch from "../auto-switch"

const spec = it

describe('estype', () => {
  describe('nameToId & idToName', () => {
    spec('name -> id -> name', () => {
      estype.allSTypes.map( n => {
        assert.equal(n, estype.idToName(estype.nameToId(n)))
      })
    })
  })

  const ty = estype.stype
  describe('isESType', () => {
    spec('tests', () => {
      assert( estype.isESType.DD( ty.DD ) )
      assert( ! estype.isESType.BBV( ty.DD ) )
      assert( estype.isESType.CVLike( ty.CVL ) )
      assert( estype.isESType.CVLike( ty.AV ) )
      assert( estype.isESType.SSLike( ty.SS ) )
      assert( estype.isESType.SSLike( ty.SSV ) )
      assert( ! estype.isESType.SSLike( ty.AV ) )
      assert( estype.isESType.CVE(ty.CVL, 529) )
      assert( ! estype.isESType.CVE(ty.CVL, 318))
      assert( estype.isESType.DE( ty.DE ) )
      assert( ! estype.isESType.DE( ty.DD ) )
    })
  })

  describe('esFleetCompoToPairs', () => {
    spec('tests', () => {
      assert.deepEqual(
        estype.esFleetCompoToPairs({}),
        [])

      assert.deepEqual(
        estype.esFleetCompoToPairs({CL: 1, DD: 2, BBV: 3}),
        estype.esFleetCompoToPairs({BBV: 3, CL: 1, DD: 2}))

      assert.deepEqual(
        estype.esFleetCompoToPairs({CL: 1, DD: 2, BBV: 3}),
        [
          ['BBV', 3],
          ['CL', 1],
          ['DD', 2],
        ])
      assert.deepEqual(
        estype.esFleetCompoToPairs({CL: undefined, BBV: null, DD: 2}),
        [
          ['BBV', null],
          ['CL', undefined],
          ['DD', 2],
        ])
    })
  })
})

describe('utils', () => {
  describe('enumFromTo', () => {
    spec('tests', () => {
      assert.deepEqual(utils.enumFromTo(1,4),[1,2,3,4])
      assert.deepEqual(utils.enumFromTo(10,4),[])
      assert.deepEqual(utils.enumFromTo(3,3),[3])
      assert.deepEqual(utils.enumFromTo(10,100,x => x+30),[10,40,70,100])
    })
  })

  describe('valMap', () => {
    spec('tests', () => {
      const testObj = {a: 1, b: 10, c: 30, d: null, e: false}

      assert.deepEqual(
        utils.valMap(testObj)(x => String(x)),
        {a: "1", b: "10", c: "30", d: "null", e: "false"})

      assert.deepEqual(
        utils.valMap(testObj)(x => typeof x === "number" ? x : undefined),
        {a: 1, b: 10, c: 30, d: undefined, e: undefined})
    })
  })

  describe('modifyArray', () => {
    // for turning console.error calls into errors
    let consoleError
    before( () => {
      consoleError = console.error
      console.error = (...args) => {
        throw Error( JSON.stringify(args) )
      }
    })
    after( () => {
      console.error = consoleError
    })

    spec('tests', () => {
      const arr = [1,2,3,4,5]

      assert.deepEqual(
        utils.modifyArray(0,x => x+1)(arr),
        [2,2,3,4,5])

      assert.deepEqual(
        utils.modifyArray(4,() => false)(arr),
        [1,2,3,4,false])

      assert.throws( () => {
        utils.modifyArray(undefined,undefined)
      })

      assert.throws( () => {
        utils.modifyArray(x => !x,10)
      })
    })
  })
})

describe("autoSwitch", () => {
  describe("findChangingFleet", () => {
    spec("tests", () => {
      // simulate manager
      let shipMaxId = 1
      let equipMaxId = 1

      const newEquip = () => {
        const ret = { rstId: equipMaxId }
        ++ equipMaxId
        return ret
      }

      const newShip = () => {
        const ret = {
          rstId: shipMaxId,
          equips: utils.enumFromTo(1,3).map(newEquip),
        }
        ++ shipMaxId
        return ret
      }

      // 5 ships for each fleet, 3 equips for each ship
      // so that we can test adding
      const fleets = utils.enumFromTo(1,4).map( fleetId => (
        {
          id: fleetId,
          ships: utils.enumFromTo(0,4).map(newShip),
        }))

      const modifyFleetById = fleetId => f => fleetArr => {
        const ind = fleetArr.findIndex(x => x.id === fleetId)
        if (ind === -1)
          return fleetArr
        return utils.modifyArray(ind,f)(fleetArr)
      }

      const modifyShips = f => ({id,ships}) =>
        ({id,ships: f(ships)})

      const arraySwap = (ind1,ind2) => xs => {
        const ys = [...xs]
        const tmp = ys[ind1]
        ys[ind1] = ys[ind2]
        ys[ind2] = tmp
        return ys
      }

      // cases where there is only one changing fleet
      assert.equal(
        autoSwitch.findChangingFleet(
          fleets,
          fleets),
        null,
        "no change at all")

      assert.equal(
        autoSwitch.findChangingFleet(
          fleets,
          modifyFleetById(3)(modifyShips(x => x.slice(0,1)))(fleets)),
        3,
        "dismiss all except fs in 3rd fleet")
      assert.equal(
        autoSwitch.findChangingFleet(
          fleets,
          modifyFleetById(2)(modifyShips(
            arraySwap(0,1)))(fleets)),
          2,
          "swap first two ships in 2nd fleet")

      assert.equal(
        autoSwitch.findChangingFleet(
          fleets,
          modifyFleetById(4)(
            modifyShips( xs => {
              const ys = [...xs]
              ys.push(newShip())
              return ys
            }))(fleets)),
        4,
        "adding one ship to 4th fleet")

      // multiple changing fleets
      {
        // 3rd ship of 1st fleet
        const ship = fleets[0].ships[2]
        const newFleets = [...fleets]
        newFleets[0] = modifyShips(xs => xs.filter( s => s !== ship))(newFleets[0])
        newFleets[3] = modifyShips(xs => [...xs])(newFleets[3])
        newFleets[3].ships.push(ship)

        assert.equal(
          autoSwitch.findChangingFleet(
            fleets,
            newFleets),
          4,
          "moving 3rd ship of 1st fleet to 4th fleet")
      }
      {
        const equip = fleets[0].ships[2].equips[1]
        const newFleets = [...fleets]
        // removing the 2nd equipment from 3rd ship of 1st fleet
        newFleets[0] = modifyShips(
          utils.modifyArray(2, s => ({
            rstId: s.rstId,
            equips: s.equips.filter(e => e !== equip),
          })))(newFleets[0])
        // adding equipment to 4th fleet, 1st ship
        newFleets[3] = modifyShips(
          utils.modifyArray(0, s => ({
            rstId: s.rstId,
            equips: [...s.equips, equip],
          }))
        )(newFleets[3])

        assert.equal(
          autoSwitch.findChangingFleet(
            fleets,
            newFleets),
          4,
          "deprive equipment from 1st fleet to 4th fleet")
      }
      {
        const equip = fleets[1].ships[2].equips[1]
        const newFleets = [...fleets]
        // removing the 2nd equipment from 3rd ship of 2nd fleet
        newFleets[1] = modifyShips(
          utils.modifyArray(2, s => ({
            rstId: s.rstId,
            equips: s.equips.filter(e => e !== equip),
          })))(newFleets[1])
        // adding equipment to 4th fleet, 1st ship
        newFleets[3] = modifyShips(
          utils.modifyArray(0, s => ({
            rstId: s.rstId,
            equips: utils.modifyArray(0,() => equip)(s.equips),
          }))
        )(newFleets[3])
        assert.equal(
          autoSwitch.findChangingFleet(
            fleets,
            newFleets),
          4,
          "deprive equipment from 2nd fleet to 4th fleet (not adding)")

        assert.equal(
          autoSwitch.findChangingFleet(
            fleets.slice(1,4),
            newFleets.slice(1,4)),
          4,
          "deprive equipment from 2nd fleet to 4th fleet (not adding, ignore main fleet)")
      }
    })
  })
})
