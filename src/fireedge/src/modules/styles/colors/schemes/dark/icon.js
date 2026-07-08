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
  success,
  warning,
  miscellaneous,
  miscellaneous2,
  miscellaneous3,
  miscellaneous4,
  miscellaneous5,
} from '@modules/styles/colors/aliases'

export const icon = {
  primary: neutral[300],
  disabled: neutral[600],
  information: information[500],
  onDestructive: error[500],
  onDestructive2: error[300],
  destructiveHover: error[100],
  success: success.default,
  selected: primary[900],
  error: error[500],
  warning: warning.default,
  actionHover: primary[400],
  onAction: primary[900],
  onAction2: primary[400],
  onAction3: error[900],
  onDisabled: neutral[700],
  action: primary[500],
  focus: primary[400],
  miscellaneous: miscellaneous[200],
  miscellaneous2: miscellaneous2[200],
  miscellaneous3: miscellaneous3[200],
  miscellaneous4: miscellaneous4[200],
  miscellaneous5: miscellaneous5[200],
}
