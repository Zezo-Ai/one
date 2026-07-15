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
const { readFileSync, readdirSync, unlinkSync, writeFileSync } = require('fs')
const path = require('path')

const messages = require('./src/modules/constants/translates')

const sourceMessages = new Set(Object.values(messages))
const placeholderPattern = /%(?:\d+\$)?[bcdeEufFgGosxX]/g
const placeholders = (message) =>
  (String(message).match(placeholderPattern) ?? []).sort().join(',')

/**
 * @param {string} value - Quoted PO value
 * @param {string} filename - Catalog filename
 * @returns {string} Parsed value
 */
const parseQuotedString = (value, filename) => {
  try {
    return JSON.parse(value)
  } catch {
    throw new SyntaxError(`${filename}: invalid PO string ${value}`)
  }
}

/**
 * @param {string} content - PO catalog content
 * @param {string} filename - Catalog filename
 * @returns {object} Translated messages
 */
const parseCatalog = (content, filename) => {
  const catalog = {}
  let source = null
  let translation = null
  let state = null
  let fuzzy = false

  const commit = () => {
    if (source && translation && !fuzzy) {
      if (!sourceMessages.has(source)) {
        source = null
        translation = null
        state = null
        fuzzy = false

        return
      }

      if (placeholders(source) !== placeholders(translation)) {
        throw new TypeError(
          `${filename}: placeholders differ for ${JSON.stringify(source)}`
        )
      }

      catalog[source] = translation
    }

    source = null
    translation = null
    state = null
    fuzzy = false
  }

  for (const line of content.split(/\r?\n/)) {
    if (!line.trim()) {
      commit()
    } else if (line.startsWith('#,')) {
      fuzzy = line.includes('fuzzy')
    } else if (line.startsWith('msgid ')) {
      source = parseQuotedString(line.slice(6), filename)
      state = 'source'
    } else if (line.startsWith('msgstr ')) {
      translation = parseQuotedString(line.slice(7), filename)
      state = 'translation'
    } else if (line.startsWith('msgstr[0] ')) {
      translation = parseQuotedString(line.slice(10), filename)
      state = 'translation'
    } else if (line.startsWith('"')) {
      if (state === 'source') {
        source += parseQuotedString(line, filename)
      } else if (state === 'translation') {
        translation += parseQuotedString(line, filename)
      }
    }
  }

  commit()

  return catalog
}

/**
 * @param {object} options - Generation options
 * @param {string} options.languagesDirectory - PO and JS catalog directory
 * @param {boolean} options.removeSource - Remove PO files after conversion
 * @returns {void}
 */
const generateCatalogs = ({
  languagesDirectory = path.resolve(__dirname, 'src/client/assets/languages'),
  removeSource = false,
} = {}) => {
  let generatedCatalogs = 0

  for (const filename of readdirSync(languagesDirectory).sort()) {
    if (!filename.endsWith('.po')) continue

    const locale = path.basename(filename, '.po')
    const sourcePath = path.join(languagesDirectory, filename)
    const outputPath = path.join(languagesDirectory, `${locale}.js`)
    const catalog = parseCatalog(readFileSync(sourcePath, 'utf8'), filename)

    writeFileSync(
      outputPath,
      `lang=${JSON.stringify(locale)}\nlocale=${JSON.stringify(
        catalog,
        null,
        2
      )}\n`
    )
    removeSource && unlinkSync(sourcePath)
    generatedCatalogs += 1
    console.log(
      `created ${outputPath} (${Object.keys(catalog).length} messages)`
    )
  }

  if (!generatedCatalogs) {
    console.log(`no PO catalogs found in ${languagesDirectory}`)
  }
}

if (require.main === module) {
  generateCatalogs({ removeSource: process.argv.includes('--remove-source') })
}

module.exports = { generateCatalogs, parseCatalog }
