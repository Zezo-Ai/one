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

export const surface = {
  page: neutral[950],
  primary: neutral[925],
  mute: neutral[900],
  imageBg: neutral[900],
  error: error[900],
  warning: warning[950],
  information: information[900],
  success: success[900],
  disabled: neutral[900],
  disabled2: neutral[915],
  disabledSelected: neutral[900],
  destructive: error[950],
  destructiveHover: error[400],
  destructiveDisabled: error[900],
  destructiveSecondary: error[900],
  action: primary[500],
  focus: primary[400],
  focus2: neutral[900],
  actionHover: neutral[900],
  actionHover2: neutral[925],
  actionHover3: primary[400],
  actionHover4: neutral[915],
  miscellaneous: miscellaneous[900],
  miscellaneous2: miscellaneous2[900],
  miscellaneous3: miscellaneous3[900],
  miscellaneous4: miscellaneous4[900],
  miscellaneous5: miscellaneous5[900],
}
