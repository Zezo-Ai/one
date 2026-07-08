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

import {
  error,
  information,
  neutral,
  primary,
  warning,
  success,
  miscellaneous,
  miscellaneous2,
  miscellaneous3,
  miscellaneous4,
  miscellaneous5,
} from '@modules/styles/colors/aliases'

export const border = {
  primary: neutral[200],
  information: information.default,
  error: error[500],
  warning: warning.default,
  success: success.default,
  disabled: neutral[300],
  disabled2: neutral[100],
  destructive: error[950],
  destructiveHover: error[950],
  destructiveSecondary: error[100],
  action: primary.default,
  action2: neutral[300],
  focus: primary.default,
  focus2: primary[700],
  actionHover: primary[700],
  actionHover2: primary[100],
  actionHover3: primary[700],
  miscellaneous: miscellaneous[400],
  miscellaneous2: miscellaneous2[500],
  miscellaneous3: miscellaneous3[600],
  miscellaneous4: miscellaneous4[500],
  miscellaneous5: miscellaneous5[400],
}
