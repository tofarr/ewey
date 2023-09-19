

export function toCamelCase(value: string){
  const parts = []
  for (const part of value.split('_')){
    parts.push(part[0].toUpperCase(), part.substring(1))
  }
  const result = parts.join("")
  return result
}