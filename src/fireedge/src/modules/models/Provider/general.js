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

import { LOGO_DRIVERS_IMAGES_URL } from '@ConstantsModule'

/**
 * Gets the provider logo URL.
 *
 * @param {object} fireedge - FireEdge provider metadata
 * @returns {string} Provider logo URL
 */
export const getLogoSource = (fireedge = {}) => {
  if (!fireedge?.logo) return `${LOGO_DRIVERS_IMAGES_URL}/default.png`
  if (fireedge?.logo.includes(LOGO_DRIVERS_IMAGES_URL)) return fireedge.logo

  return `${LOGO_DRIVERS_IMAGES_URL}/${fireedge?.logo}`
}
