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
import { createSlice } from '@reduxjs/toolkit'
import * as actions from '@modules/features/Functionality/actions'

const initial = {
  // Expressions
  searchExpression: '',
  sortExpression: '',
  filterExpression: '',

  containerView: '',
  containerViews: {},
  selectedItems: [],
  breadcrumbs: [],
  createPath: {},
}

const slice = createSlice({
  name: 'functionality',
  initialState: initial,
  extraReducers: (builder) => {
    builder
      .addCase(actions.setSearchExpression, (state, { payload }) => ({
        ...state,
        searchExpression: payload,
      }))
      .addCase(actions.setSortExpression, (state, { payload }) => ({
        ...state,
        sortExpression: payload,
      }))
      .addCase(actions.setFilterExpression, (state, { payload }) => ({
        ...state,
        filterExpression: payload,
      }))
      .addCase(actions.setContainerView, (state, { payload }) => {
        const isObjectPayload =
          payload && typeof payload === 'object' && !Array.isArray(payload)
        const { defaultView, key, view } = isObjectPayload
          ? payload
          : { view: payload }

        state.containerView = view

        if (key) {
          state.containerViews[key] = { defaultView, view }
        }
      })
      .addCase(actions.setSelectedItems, (state, { payload }) => ({
        ...state,
        selectedItems: [].concat(payload),
      }))

      .addCase(actions.setBreadcrumbs, (state, { payload }) => ({
        ...state,
        breadcrumbs: payload ?? [],
      }))

      .addCase(actions.setResourceCreatePath, (state, { payload }) => ({
        ...state,
        createPath: payload ?? {},
      }))
  },
})

export { slice as FunctionalitySlice }
