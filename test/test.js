const assert = require('assert')
const spec = it

import * as estype from "../estype"
import * as req from "../requirement"
import * as utils from "../utils"
import * as autoSwitch from "../auto-switch"

describe('estype', () => {
  describe('nameToId & idToName', () => {
    spec('name -> id -> name', () => {
      estype.allSTypes.map( n => {
        assert.equal(n, estype.idToName(estype.nameToId(n)))
      })})})

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
    })})
})

describe('requirement', () => {
  describe('collapseResults', () => {
    spec('tests', () => {
      const aT = inp => assert( req.collapseResults( inp ) )
      const aF = inp => assert( !req.collapseResults( inp ) )

      aT( true )
      aF( false )

      aT( [true, true, {x: true, y: true} ] )
      aF( [true, true, {x: false, y: true} ] )

      aT( [[true,true],[],{}] )
      aF( [[true,true],[false],{}] )

      aT( {x: true, y: [{}, []], z: [true,true]} )
      aF( {x: true, y: [{u:false}, []], z: [true,true]} )

    })})
})

describe('utils', () => {
  describe('enumFromTo', () => {
    spec('tests', () => {
      assert.deepEqual(utils.enumFromTo(1,4),[1,2,3,4])
      assert.deepEqual(utils.enumFromTo(10,4),[])
      assert.deepEqual(utils.enumFromTo(3,3),[3])
      assert.deepEqual(utils.enumFromTo(10,100,x=>x+30),[10,40,70,100])
    })
  })

  describe('valMap', () => {
    spec('tests', () => {
      const testObj = {a: 1, b:10, c:30, d: null, e: false}

      assert.deepEqual(
        utils.valMap(testObj)(x => String(x)),
        {a:"1", b:"10", c:"30", d:"null", e:"false"})

      assert.deepEqual(
        utils.valMap(testObj)(x => typeof x === "number" ? x : undefined),
        {a:1, b:10, c:30, d: undefined, e: undefined})

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
      const fleets = utils.enumFromTo(0,3).map( fleetId => (
        {
          index: fleetId,
          ships: utils.enumFromTo(0,4).map(newShip),
        }))

      const modifyShips = f => ({index,ships}) =>
        ({index,ships: f(ships)})

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
          utils.modifyArray(2,modifyShips(x => x.slice(0,1)))(fleets)),
        2,
        "dismiss all except fs in 3rd fleet")
      assert.equal(
        autoSwitch.findChangingFleet(
          fleets,
          utils.modifyArray(1,modifyShips(
            arraySwap(0,1)))(fleets)),
          1,
          "swap first two ships in 2nd fleet")

      assert.equal(
        autoSwitch.findChangingFleet(
          fleets,
          utils.modifyArray(
            3,modifyShips( xs => {
              const ys = [...xs]
              ys.push(newShip())
              return ys
            }))(fleets)),
        3,
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
          3,
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
          3,
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
          3,
          "deprive equipment from 2nd fleet to 4th fleet (not adding)")

        assert.equal(
          autoSwitch.findChangingFleet(
            fleets.slice(1,4),
            newFleets.slice(1,4)),
          3,
          "deprive equipment from 2nd fleet to 4th fleet (not adding, ignore main fleet)")
      }
    })
  })

  describe("findNextAvailableFleet", () => {
    spec("skipping main fleet", () => {
      assert.equal(
        autoSwitch.findNextAvailableFleet([
          {available: true, index: 0},
          {available: true, index: 1},
          {available: true, index: 2},
        ],false),
        1,
        "show main, not combined")

      assert.equal(
        autoSwitch.findNextAvailableFleet([
          {available: true, index: 1},
          {available: true, index: 2},
        ],false),
        1,
        "hide main, not combined")

      assert.equal(
        autoSwitch.findNextAvailableFleet([
          {available: true, index: 0},
          {available: true, index: 1},
          {available: true, index: 2},
        ],true),
        2,
        "show main, combined")

      assert.equal(
        autoSwitch.findNextAvailableFleet([
          {available: true, index: 2},
        ],true),
        2,
        "hide main, combined")
    })

    spec("nothing to return", () => {
      assert.equal(
        autoSwitch.findNextAvailableFleet([
          {available: true, index: 0},
          {available: false, index: 1},
          {available: false, index: 2},
          {available: false, index: 3},
        ],false),
        null,
        "show main, not combined")

      assert.equal(
        autoSwitch.findNextAvailableFleet([
          {available: true, index: 0},
          {available: true, index: 1},
          {available: false, index: 2},
          {available: false, index: 3},
        ],true),
        null,
        "show main, combined")

    })
  })

  describe("isSendingFleetToExped", () => {
    spec("tests", () => {
      // all available
      const fleets1 = [0,1,2,3].map( x =>
        ({available: true, index: x}))

      // all available except second fleet
      const fleets2 = utils.modifyArray(
        1, (({index}) => ({available: false,index})))(fleets1)

      // all available except third fleet
      const fleets3 = utils.modifyArray(
        2, (({index}) => ({available: false,index})))(fleets1)

      assert.equal(
        autoSwitch.isSendingFleetToExped(
          fleets1, fleets2, false),
        true,
        "detected second fleet, not combined")

      assert.equal(
        autoSwitch.isSendingFleetToExped(
          fleets1, fleets2, true),
        false,
        "ignore second fleet, when it's combined")

      assert.equal(
        autoSwitch.isSendingFleetToExped(
          fleets1, fleets3, false),
        true,
        "always detect 3rd fleet (not combined)")

      assert.equal(
        autoSwitch.isSendingFleetToExped(
          fleets1, fleets3, true),
        true,
        "always detect 3rd fleet (combined)")
    })
  })
})
