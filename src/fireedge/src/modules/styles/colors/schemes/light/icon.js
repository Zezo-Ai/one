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
  primary: neutral.default,
  disabled: neutral[400],
  information: information.default,
  onDestructive: error[500],
  onDestructive2: error[700],
  success: success[700],
  onAction: neutral.white,
  onAction2: neutral.white,
  onAction3: neutral.white,
  selected: primary.default,
  onDisabled: neutral[700],
  warning: warning.default,
  error: error[500],
  action: primary.default,
  actionHover: primary[700],
  focus: primary[700],
  miscellaneous: miscellaneous[500],
  miscellaneous2: miscellaneous2[500],
  miscellaneous3: miscellaneous3[700],
  miscellaneous4: miscellaneous4[500],
  miscellaneous5: miscellaneous5[400],
}
