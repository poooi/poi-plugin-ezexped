// a special require to indicate that
// we are missing info for this requirement

class MissingInfo {
  static make = () => {}

  static prepare = () => () => () => ({
    sat: false,
    extra: {
      type: 'MissingInfo',
    },
  })
}

export { MissingInfo }
