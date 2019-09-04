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
      console.log = (...values) => {
        log.push('> ' + values.map(stringify).join(' '))
      }
      try {
        values[i]()
      } catch (e) {
        log.push(`${e.stack.split('\n')[0]}`)
      }
      console.log = consoleLog
      if (log.length) {
        result.push('```', ...log, '```')
      }
    }
  }
  console.log(result.join('\n'))
  const root = document.querySelector('#root')
  const converter = new showdown.Converter()
  converter.setOption('backslashEscapesHTMLTags', true)
  root.innerHTML += converter.makeHtml(result.join('\n'))
}

function stringify(value) {
  if (typeof value === 'string') {
    return value
  }
  return JSON.stringify(value, null, 2)
}
