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

import { variables } from '@modules/styles/colors'

const switchView = ({ palette }) => ({
  normal: {
    backgroundColor: 'transparent',
    borderColor: variables.grey[600],
    color: variables.grey[700],
  },
  hover: {
    backgroundColor: variables.grey[200],
  },
  selected: {
    backgroundColor: variables.grey[700],
  },
  icon: {
    color: variables.grey[700],
  },
})

const searchBar = ({ palette }) => ({
  normal: {
    backgroundColor: variables.grey[300],
    color: variables.grey[500],
    borderColor: variables.grey[300],
  },
  hover: {
    backgroundColor: variables.grey[300],
    color: variables.grey[500],
    borderColor: palette.surface.actionHover,
  },
  focus: {
    backgroundColor: palette.surface.focus,
    color: palette.text.focus,
    borderColor: palette.border.primary,
  },
  icon: {
    color: variables.grey[700],
  },
})

const refreshIcon = ({ palette }) => ({
  refreshIcon: {
    backgroundColor: 'transparent',
    color: palette.icon.action,
    borderColor: palette.border.primary,
  },
})

/**
 * @param {object} params - Theme params
 * @returns {object} Table layout
 */
export const Table = (params) => ({
  buttons: {
    switchView: switchView(params),
  },
  searchBar: searchBar(params),
  cards: {
    normal: {
      backgroundColor: variables.white,
      hover: {
        backgroundColor: variables.grey[200],
      },
    },
    pressed: {
      backgroundColor: variables.white,
      borderColor: variables.blue[500],
      hover: {
        backgroundColor: variables.grey[200],
        borderColor: variables.blue[500],
      },
    },
  },
  refreshIcon: refreshIcon(params),
})
