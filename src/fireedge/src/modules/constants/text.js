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
export const TEXT_VARIANTS = {
  H1: 'H1',
  H2: 'H2',
  H3: 'H3',
  H4: 'H4',
  H5: 'H5',
  H6: 'H6',
  BODY_LARGE: 'BODY_LARGE',
  BODY_MEDIUM: 'BODY_MEDIUM',
  BODY_SMALL: 'BODY_SMALL',
  CAPTION: 'CAPTION',
}

export const TEXT_COMPONENTS = {
  [TEXT_VARIANTS.H1]: 'h1',
  [TEXT_VARIANTS.H2]: 'h2',
  [TEXT_VARIANTS.H3]: 'h3',
  [TEXT_VARIANTS.H4]: 'h4',
  [TEXT_VARIANTS.H5]: 'h5',
  [TEXT_VARIANTS.H6]: 'h6',
  [TEXT_VARIANTS.BODY_LARGE]: 'p',
  [TEXT_VARIANTS.BODY_MEDIUM]: 'p',
  [TEXT_VARIANTS.BODY_SMALL]: 'p',
  [TEXT_VARIANTS.CAPTION]: 'span',
}

export const TEXT_WEIGHTS = {
  BOLD: 'BOLD',
  SEMIBOLD: 'SEMIBOLD',
  REGULAR: 'REGULAR',
  MEDIUM: 'MEDIUM',
}
