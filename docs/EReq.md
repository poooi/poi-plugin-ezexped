This document defines `EReq`, which is the interal representation for
all kinds of expedition requirements.

# Data Structures

## `EReq` structure

An `EReq` is an Object guaranteed to have `type` property.

- when type is `FSLevel`

    ```
    {
      type: 'FSLevel',
      level: <number>,
    }
    ```

    Flagship level requirement.

- when type is `FSType`

    ```
    {
      type: 'FSType',
      estype: <ESType>,
    }
    ```

    Flagship type requirement.

- when type is `ShipCount`

    ```
    {
      type: 'ShipCount',
      count: <number>,
    }
    ```

    Number of ships in the fleet.

- when type is `DrumCarrierCount`

    ```
    {
      type: 'DrumCarrierCount',
      count: <number>,
    }
    ```

    Number of ships carrying drums.

- when type is `DrumCount`

    ```
    {
      type: 'DrumCount',
      count: <number>,
    }
    ```

    Number of drums in fleet.

- when type is `LevelSum`

    ```
    {
      type: 'LevelSum',
      level: <number>,
    }
    ```

    Sum of levels of all ships in fleet.

- when type is `SparkledCount`

    ```
    {
      type: 'SparkledCount',
      count: <number>,
    }
    ```

    The number of sparkled ships in fleet should be at least `count`.

- when type is `SparkledCountCustom`

    ```
    {
      type: 'SparkledCountCustom',
    }
    ```

    Same as `sparkledCount`, but the number info is user-defined
    therefore is only available at runtime

- when type is `Morale`

    ```
    {
      type: 'Morale',
      morale: <number>,
    }
    ```

    Least morale requirement for fleet members

- when type is `Resupply`

    ```
    {
      type: 'Resupply',
    }
    ```

- when type is `AllSparkled`

    ```
    {
      type: 'AllSparkled',
    }
    ```

- when type is `FleetCompo`

    ```
    {
      type: 'FleetCompo',
      compo: <Compo>,
    }
    ```

    Fleet composition requirement.

- when type is `AnyFleetCompo`

    ```
    {
      type: 'AnyFleetCompo',
      compos: an Array of <Compo>,
    }
    ```

    Like fleet composition requirement but only requires one `Compo` to be satisfied.

## `FleetCompo` structure

an Object whose properties are all `ESType`s and values numbers.

For example, `{CL: 1, DD: 5}` means the fleet composition should be `1CL 5DD`.
