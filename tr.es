const { i18n } = window
const m = i18n["poi-plugin-ezexped"]
const __ = m.__.bind(m)

const fmtTime = timeInMins => {
  const hours = Math.floor(timeInMins / 60)
  const minutes = timeInMins % 60

  const hrText = __("RequiredTime.hour",hours)
  const minText = __("RequiredTime.minute",minutes)

  const buf = []
  if (hours>0)
    buf.push( hrText )
  if (minutes>0)
    buf.push( minText )

  return buf.length > 0 ? buf.join(" ") :
    // show text to the same effect of "0 minutes" if nothing is present, unlikely though.
    minText
}

export { __, fmtTime }
