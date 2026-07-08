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

/**
 * Add filters defined in view yaml to bulk actions.
 *
 * @param {object} params - Config parameters
 * @param {object} params.filters - Which buttons are visible to operate over the resources
 * @param {Array} params.actions - Actions
 * @returns {object} Action with filters
 */
export const createActions = ({ filters = {}, actions = [] }) => {
  if (Object.keys(filters).length === 0) return actions

  return actions
    .filter(
      ({ accessor }) =>
        !accessor || filters[String(accessor.toLowerCase())] === true
    )
    .map((action) => {
      const { accessor, options } = action

      if (accessor) return action

      const groupActions = options?.filter(
        (option) => filters[`${option.accessor?.toLowerCase()}`] === true
      )

      return groupActions?.length > 0
        ? { ...action, options: groupActions }
        : undefined
    })
    .filter(Boolean)
}
