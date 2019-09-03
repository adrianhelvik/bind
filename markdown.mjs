export default (parts, ...values) => {
  const result = []
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i])
    if (i < values.length) {
      result.push('```javascript')
      let start = 1
      let lines = values[i].toString()
        .split('\n')
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (/\/\/\s*@start\s*/.test(line.trim())) {
          start = i + 1
        }
      }
      const fnString = lines
        .slice(start, -1)
        .join('\n')
      result.push(fnString)
      result.push('```')
      result.push('')
      const log = []
      const consoleLog = console.log
      console.log = value => {
        log.push('> ' + String(value))
      }
      values[i]()
      console.log = consoleLog
      if (log.length) {
        result.push('```', ...log, '```')
      }
    }
  }
  console.log(result.join('\n'))
  const root = document.querySelector('#root')
  root.innerHTML += new showdown.Converter().makeHtml(result.join('\n'))
}
