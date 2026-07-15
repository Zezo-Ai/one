/* ------------------------------------------------------------------------- *
 * Copyright 2002-2026, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { sprintf } from 'sprintf-js'

const normalizeTranslation = (input = '', values = []) => {
  if (Array.isArray(input)) {
    return normalizeTranslation(input[0], input[1] ?? values)
  }

  if (input && typeof input === 'object') {
    return normalizeTranslation(input.word ?? input.message, input.values)
  }

  return {
    message: input ?? '',
    values: (Array.isArray(values) ? values : [values]).filter(
      (value) => value !== undefined && value !== null
    ),
  }
}

/**
 * Formats a translation without depending on React.
 *
 * @param {object} messages - Messages indexed by their source text
 * @param {string|string[]|object} input - Translation input
 * @param {any|any[]} values - Interpolation values
 * @returns {string} Translated and formatted message
 */
export const formatTranslation = (messages = {}, input = '', values = []) => {
  const { message, values: normalizedValues } = normalizeTranslation(
    input,
    values
  )
  const translatedMessage = messages[message] || message

  if (!translatedMessage || !normalizedValues.length) return translatedMessage

  try {
    return sprintf(translatedMessage, ...normalizedValues)
  } catch {
    return message
  }
}

/**
 * Translates catalog-backed segments inside composed UI text.
 * Unknown segments, such as resource names and counts, are preserved.
 *
 * @param {object} messages - Messages indexed by their source text
 * @param {string|string[]|object} input - Translation input
 * @param {any|any[]} values - Interpolation values
 * @returns {string} Translated text
 */
export const formatTranslationText = (
  messages = {},
  input = '',
  values = []
) => {
  const { message, values: normalizedValues } = normalizeTranslation(
    input,
    values
  )
  const exactTranslation = formatTranslation(messages, input, values)

  if (
    typeof message !== 'string' ||
    normalizedValues.length ||
    Object.prototype.hasOwnProperty.call(messages, message)
  ) {
    return exactTranslation
  }

  const segments = message.match(/\s+|\S+/g) ?? []
  const result = []

  for (let start = 0; start < segments.length; ) {
    if (/^\s+$/.test(segments[start])) {
      result.push(segments[start++])
      continue
    }

    let translated
    let next = start + 1

    for (let end = segments.length; end > start; end -= 1) {
      if (/^\s+$/.test(segments[end - 1])) continue

      const candidate = segments.slice(start, end).join('')
      if (!Object.prototype.hasOwnProperty.call(messages, candidate)) continue

      translated = messages[candidate] || candidate
      next = end
      break
    }

    result.push(translated ?? segments[start])
    start = translated === undefined ? start + 1 : next
  }

  return result.join('')
}
