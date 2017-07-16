/*

   (TODO)
   EReq should destruct <EReq> structure and dispatch it
   to the actual impl accordingly, every EReq is implemented
   as a class with static methods, these methods should respect the following
   specification:

   - prepare(<EReq>)(<config>)(Fleet) = Object

       curried in this way to allow pre-processing ahead of
       getting info about the fleet.

       returns an Object of the following shape:

       {
         sat: <boolean>, // whether this requirement is satisfied
         tooltip: <Object> or null, // no spec atm, just stuff necessary to render a tooltip
       }

   - Fleet structure:

       {
         ships: array of <Ship>s,
       }

 */

/*
export {
  FSLevel,
  FSType,
  ShipCount,
  DrumCarrierCount,
  DrumCount,
  LevelSum,
  SparkledCount,
  SparkledCountCustom,
  Morale,
  Resupply,
  AllSparkled,
  FleetCompo,
  AnyFleetCompo,
}
*/
