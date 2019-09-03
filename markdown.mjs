export default (parts, ...values) => {
  const result = []
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i])
    if (i < values.length) {
      result.push('##### Input')
      result.push('```javascript')
      const fnString = values[i].toString()
        .split('\n')
        .slice(1, -1)
        .join('\n')
      result.push(fnString)
      result.push('```')
      result.push('')
      result.push('##### Output')
      result.push('```')
      const log = []
      console.log = value => {
        log.push(JSON.stringify(value))
      }
      values[i]()
      for (const part of log) {
        result.push('> ' + String(part))
      }
      result.push('```')
    }
  }
  const root = document.querySelector('#root')
  root.innerHTML += new showdown.Converter().makeHtml(result.join('\n'))
}
