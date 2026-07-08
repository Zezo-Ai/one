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
/* eslint-disable jsdoc/require-jsdoc */
import { Settings } from 'luxon'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import root from 'window-or-global'
import { sprintf } from 'sprintf-js'
import { LANGUAGES, LANGUAGES_URL } from '@ConstantsModule'
import { useAuth } from '@FeaturesModule'
import { isDevelopment } from '@UtilsModule'

const translation = { hash: {} }

export const setTranslationHash = (hash) => {
  translation.hash = hash
}

export const Tr = (key, values) => {
  const word = translation.hash?.[key] ?? key

  return values ? sprintf(word, ...[].concat(values)) : word
}

export const TranslateProvider = ({ children = [] }) => {
  const { settings: { FIREEDGE: fireedge = {} } = {} } = useAuth()
  const { LANG: lang } = fireedge

  useEffect(() => {
    if (!lang || !LANGUAGES[lang]) return
    try {
      Settings.defaultLocale = lang.replace('_', '-')
      const script = root.document.createElement('script', {})
      script.src = `${LANGUAGES_URL}/${lang}.js`
      script.async = true
      /**
       *
       */
      script.onload = () => {
        setTranslationHash(window.locale)
        delete window.lang
        delete window.locale
        window.document.body.removeChild(script)
      }
      window.document.body.appendChild(script)

      return () => {
        if (window.document.body.contains(script)) {
          window.document.body.removeChild(script)
        }
      }
    } catch (error) {
      isDevelopment() &&
        console.error('Error while generating script language', error)
    }
  }, [lang])

  return children
}

TranslateProvider.propTypes = { children: PropTypes.any }
