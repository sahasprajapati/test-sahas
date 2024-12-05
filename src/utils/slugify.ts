const format = (val: string): string =>
  val
    ?.replace(/ /g, '-')
    ?.replace(/[^\w-]+/g, '')
    ?.toLowerCase()

export default format
