/** @param {string} yyyy_mm_dd */
module.exports = (yyyy_mm_dd) => {
  const [, month, date] = yyyy_mm_dd.split('-')
  return `${+month}/${+date}`
}
