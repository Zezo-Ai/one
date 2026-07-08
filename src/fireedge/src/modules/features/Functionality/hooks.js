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
/* eslint-disable jsdoc/require-jsdoc */
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { SERVER_CONFIG, TABLE_VIEW_MODE } from '@ConstantsModule'
import { AuthSlice } from '@modules/features/Auth/slice'
import * as actions from '@modules/features/Functionality/actions'
import { FunctionalitySlice } from '@modules/features/Functionality/slice'
import { GeneralSlice } from '@modules/features/General/slice'

const { name: functionalitySlice } = FunctionalitySlice
const { name: authSlice } = AuthSlice
const { name: generalSlice } = GeneralSlice

const getValidViewMode = (view, fallback = TABLE_VIEW_MODE.CARD) => {
  const value = typeof view === 'string' ? view.toLowerCase() : view

  return Object.values(TABLE_VIEW_MODE).includes(value) ? value : fallback
}

const getUserRowStyle = (user) => {
  const template = user?.TEMPLATE ?? {}

  return template?.FIREEDGE?.ROW_STYLE || template?.ROW_STYLE
}

const getSavedContainerView = (savedView, defaultView) =>
  savedView?.defaultView === defaultView
    ? getValidViewMode(savedView.view, undefined)
    : undefined

export const useFunctionality = () => {
  const { pathname } = useLocation()

  return useSelector((state) => {
    const functionality = state[functionalitySlice] ?? {}
    const auth = state[authSlice] ?? {}
    const general = state[generalSlice] ?? {}
    const containerViewKey = pathname || ''
    const defaultContainerView = getValidViewMode(
      getUserRowStyle(auth.user) ||
        SERVER_CONFIG?.rowStyle ||
        general.tableViewMode
    )
    const savedContainerView = getSavedContainerView(
      functionality.containerViews?.[containerViewKey],
      defaultContainerView
    )

    return {
      ...functionality,
      containerView: savedContainerView ?? defaultContainerView,
      containerViewKey,
      defaultContainerView,
    }
  }, shallowEqual)
}

export const useFunctionalityApi = () => {
  const dispatch = useDispatch()

  return {
    setSearchExpression: (expression) =>
      dispatch(actions.setSearchExpression(expression)),

    setSortExpression: (expression) =>
      dispatch(actions.setSortExpression(expression)),

    setFilterExpression: (expression) =>
      dispatch(actions.setFilterExpression(expression)),

    setContainerView: (view, options) =>
      dispatch(actions.setContainerView(options ? { ...options, view } : view)),
    setSelectedItems: (selected) =>
      dispatch(actions.setSelectedItems(selected)),

    setBreadcrumbs: (crumbs) => dispatch(actions.setBreadcrumbs(crumbs)),
    setResourceCreatePath: (path) =>
      dispatch(actions.setResourceCreatePath(path)),
  }
}
