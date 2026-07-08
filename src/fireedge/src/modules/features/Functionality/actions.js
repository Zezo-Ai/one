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
import { createAction } from '@reduxjs/toolkit'

export const setSearchExpression = createAction('Set search expression')
export const setSortExpression = createAction('Set sort expression')
export const setFilterExpression = createAction('Set filter expression')
export const setContainerView = createAction('Set container view expression')
export const setSelectedItems = createAction('Set selected items')
export const setBreadcrumbs = createAction('Set header breadcrumb path')
export const setResourceCreatePath = createAction(
  'Set dynamic resource create button path'
)
