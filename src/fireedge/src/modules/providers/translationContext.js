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
import { createContext } from 'react'
import root from 'window-or-global'

const TRANSLATION_CONTEXT_KEY = Symbol.for(
  'opennebula.sunstone.translation-context'
)

/**
 * Returns the context shared by every Module Federation runtime.
 *
 * @param {object} defaultValue - Context fallback value
 * @param {object} globalObject - Runtime global
 * @returns {object} Shared React context
 */
export const getSharedTranslationContext = (
  defaultValue,
  globalObject = root
) => {
  if (globalObject[TRANSLATION_CONTEXT_KEY]) {
    return globalObject[TRANSLATION_CONTEXT_KEY]
  }

  Object.defineProperty(globalObject, TRANSLATION_CONTEXT_KEY, {
    value: createContext(defaultValue),
  })

  return globalObject[TRANSLATION_CONTEXT_KEY]
}
