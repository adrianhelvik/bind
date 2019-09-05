import inspect from './inspect.mjs'

export default async (parts, ...values) => {
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
        if (/\/\/\s*@start\s*$/.test(line.trim())) {
          start = i + 1
        }
      }
      const fnString = lines
        .slice(start, -1)
        .filter(line => ! /\/\/\s*@skip\s*$/.test(line))
        .map(line => {
          if (line.trim().startsWith('/// ')) {
            return line.replace('/// ', '')
          }
          return line
        })
        .join('\n')
      result.push(fnString)
      result.push('```')
      result.push('')
      const log = []
      const consoleLog = console.log
      console.log = (...values) => {
        consoleLog.call(console, ...values)
        consoleLog.call(console, values.map(x => stringify(x)).join(' '))
        log.push('  ' + values.map(x => stringify(x)).join(' '))
      }
      try {
        await values[i]()
      } catch (e) {
        log.push(`${e.stack.split('\n')[0]}`)
      }
      console.log = consoleLog
      if (log.length) {
        result.push('```', ...log, '```')
      }
    }
  }
  const root = document.querySelector('#root')
  const converter = new showdown.Converter()
  converter.setOption('backslashEscapesHTMLTags', true)
  root.innerHTML += converter.makeHtml(result.join('\n'))
}

function stringify(x) {
  if (typeof x === 'string') return x
  if (x && (x instanceof Set)) {
    return setToStr(x)
  }
  if (x && (x instanceof Map)) {
    return mapToStr(x)
  }

  return inspect(x)
}

function mapToStr(map) {
  var obj = {}
  map.forEach((v, k) => {
    console.log(k, v)
    obj[k] = v
  })
  return 'Map(' + stringify(obj) + ')'
}

function setToStr(set) {
  return 'Set(' + stringify(Array.from(set)) + ')'
}
