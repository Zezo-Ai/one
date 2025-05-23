/* ------------------------------------------------------------------------- *
 * Copyright 2002-2025, OpenNebula Project, OpenNebula Systems               *
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

const { createReadStream, generateFile } = require('opennebula-generatepotfile')
const clientConstants = require('./src/modules/constants/translates')

const modulesCode = './src/modules'
const clientCode = './src/client'
const exportFile = `${clientCode}/assets/languages/messages.pot`

/**
 * if the constants have an object indicator. where are the definitions you must place it
 *
 * example:
 * - indicator: T.Cluster
 * - definition: {T: {Cluster: "Cluster"}} (e)
 */

const definitions = { T: { ...clientConstants } }

// function Tr()
const optsFunc = {
  regex: /Tr(\("|\('|\()[a-zA-Z0-9_. ]*("\)|'\)|\))/g,
  removeStart: /Tr(\()/g,
  removeEnd: /(\))/g,
  regexTextCaptureIndex: 0,
  definitions,
  split: '.',
}

// React component <Translate word="word"/>
const optsComponent = {
  regex: /<Translate word=('|"|{|{'|{")[a-zA-Z0-9_. ]*('|"|}|'}|"}) \/>/g,
  removeStart: /<Translate word=('|"|{|{'|{")/g,
  removeEnd: /('|"|}|'}|"}) \/>/g,
  regexTextCaptureIndex: 0,
  definitions,
  split: '.',
}

createReadStream(modulesCode, optsFunc)
createReadStream(modulesCode, optsComponent)

generateFile(exportFile)
