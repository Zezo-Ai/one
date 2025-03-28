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

import { OpenNebulaLogin } from '@modules/containers/Login/Opennebula'
import { RemoteLogin } from '@modules/containers/Login/Remote'
import { ReactElement } from 'react'
import { TranslateProvider } from '@ComponentsModule'

/**
 * Displays the login form and handles the login process.
 *
 * @returns {ReactElement} The login form.
 */
export const Login = () => (
  <TranslateProvider>
    {window?.__REMOTE_AUTH__?.remote ? (
      <RemoteLogin data={window?.__REMOTE_AUTH__} />
    ) : (
      <OpenNebulaLogin />
    )}
  </TranslateProvider>
)
