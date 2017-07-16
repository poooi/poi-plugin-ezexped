This document defines `EReq`, which is the interal representation for
all kinds of expedition requirements.

(TODO) impl

# Data Structures

## `EReq` structure

An `EReq` is an Object guaranteed to have `type` property.

- when type is `fsLevel`

    ```
    {
      type: 'fsLevel',
      level: <number>,
    }
    ```

    Flagship level requirement.

- when type is `fsType`

    ```
    {
      type: 'fsType',
      estype: <ESType>,
    }
    ```

    Flagship type requirement.

- when type is `shipCount`

    ```
    {
      type: 'shipCount',
      count: <number>,
    }
    ```

    Number of ships in the fleet.

- when type is `drumCarrierCount`

    ```
    {
      type: 'drumCarrierCount',
      count: <number>,
    }
    ```

    Number of ships carrying drums.

- when type is `drumCount`

    ```
    {
      type: 'drumCount',
      count: <number>,
    }
    ```

    Number of drums in fleet.

- when type is `levelSum`

    ```
    {
      type: 'levelSum',
      count: <number>,
    }
    ```

    Sum of levels of all ships in fleet.

- when type is `sparkledCount`

    ```
    {
      type: 'sparkledCount',
      count: <number>,
    }
    ```

    The number of sparkled ships in fleet should be at least `count`.

- when type is `sparkledCountCustom`

    ```
    {
      type: 'sparkledCountCustom',
    }
    ```

    Same as `sparkledCount`, but the number info is user-defined
    therefore is only available at runtime

- when type is `morale`

    ```
    {
      type: 'morale',
      morale: <number>,
    }
    ```

    Least morale requirement for fleet members

- when type is `resupply`

    ```
    {
      type: 'resupply',
    }
    ```

- when type is `allSparkled`

    ```
    {
      type: 'allSparkled',
    }
    ```

- when type is `fleetCompo`

    ```
    {
      type: 'fleetCompo',
      compo: <Compo>,
    }
    ```

    Fleet composition requirement.

- when type is `anyFleetCompo`

    ```
    {
      type: 'anyFleetCompo',
      compos: an Array of <Compo>,
    }
    ```

    Like fleet composition requirement but only requires one `Compo` to be satisfied.

## `FleetCompo` structure

an Object whose properties are all `ESType`s and values numbers.

For example, `{CL: 1, DD: 5}` means the fleet composition should be `1CL 5DD`.
