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
import { scale } from '@modules/styles/themes/responsive'

export const spacing = {
  '2xs': {
    desktop: scale[600],
    tablet: scale[600],
    mobile: scale[500],
  },
  'sm-xs': {
    desktop: scale[900],
    tablet: scale[900],
    mobile: scale[700],
  },
  'xl-sm': {
    desktop: scale[1500],
    tablet: scale[1300],
    mobile: scale[800],
  },
  'md-sm': {
    desktop: scale[1500],
    tablet: scale[1500],
    mobile: scale[900],
  },
  'xl-xl': {
    desktop: scale[1500],
    tablet: scale[1500],
    mobile: scale[1500],
  },
  '2xl-xl': {
    desktop: scale[1600],
    tablet: scale[1600],
    mobile: scale[1500],
  },
  '3xl-2xl': {
    desktop: scale[1700],
    tablet: scale[1600],
    mobile: scale[1600],
  },
  '3xl-xl': {
    desktop: scale[1700],
    tablet: scale[1600],
    mobile: scale[1500],
  },
}
