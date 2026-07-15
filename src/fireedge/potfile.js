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
const { writeFileSync } = require('fs')

const messages = require('./src/modules/constants/translates')

const outputFile = './src/client/assets/languages/messages.pot'
const sourceFile = './src/modules/constants/translates.js'

const messagesByText = Object.entries(messages).reduce(
  (catalog, [key, message]) => {
    if (typeof message !== 'string') {
      throw new TypeError(`Translation T.${key} must be a string`)
    }

    const keys = catalog.get(message) ?? []
    keys.push(key)
    catalog.set(message, keys)

    return catalog
  },
  new Map()
)

const header = [
  'msgid ""',
  'msgstr ""',
  '"Content-Type: text/plain; charset=UTF-8\\n"',
  '"Content-Transfer-Encoding: 8bit\\n"',
  '',
].join('\n')

const entries = [...messagesByText]
  .map(
    ([message, keys]) =>
      `#. ${keys.map((key) => `T.${key}`).join(', ')}\n` +
      `#: ${sourceFile}\n` +
      `msgid ${JSON.stringify(message)}\n` +
      'msgstr ""\n'
  )
  .join('\n')

writeFileSync(outputFile, `${header}${entries}`)
console.log(`created ${outputFile} (${messagesByText.size} messages)`)
