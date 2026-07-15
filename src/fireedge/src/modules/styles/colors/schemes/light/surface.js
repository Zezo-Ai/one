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
  page: neutral.white,
  primary: neutral.white,
  mute: neutral[100],
  skeleton: neutral[100],
  skeletonHighlight: neutral.white,
  imageBg: neutral[100],
  error: error[100],
  warning: warning[100],
  information: information[100],
  success: success[100],
  disabled: neutral[100],
  disabled2: neutral[200],
  destructive: error[950],
  destructiveHover: error[400],
  destructiveDisabled: error[100],
  destructiveSecondary: error[100],
  disabledSelected: neutral[300],
  action: primary.default,
  focus: primary[200],
  focus2: primary[100],
  actionHover: primary[700],
  actionHover2: primary[100],
  actionHover3: primary[200],
  actionHover4: neutral[100],
  miscellaneous: miscellaneous[100],
  miscellaneous2: miscellaneous2[100],
  miscellaneous3: miscellaneous3[100],
  miscellaneous4: miscellaneous4[100],
  miscellaneous5: miscellaneous5[100],
}
