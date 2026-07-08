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
 * @param {object} root0 - Params
 * @param {object} root0.theme - Current theme in use
 * @returns {object} - Menu Button SX style
 */
export const getStyles = ({ theme }) => ({
  '& .MuiPaper-root': {
    display: 'flex',
    minWidth: '220px',
    flexDirection: 'column',
    alignItems: 'flex-start',

    borderRadius: `${theme.borderRadius.xlg}px`,
    border: `${theme.borderWidth.md}px solid ${theme.palette.border.primary}`,
    bgcolor: 'surface.primary',
    boxShadow:
      '0 4px 6px -4px rgba(0, 0, 0, 0.10), 0 10px 15px -13px rgba(0, 0, 0, 0.10)',

    '& .MuiMenu-list': {
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'stretch',
      minWidth: 0,
      flex: '1 1 auto',
      maxHeight: `min(calc(100vh - ${theme.scale[1200]}px), ${
        theme.scale[1200] + theme.scale[1700]
      }px)`,
      overflowY: 'auto',
    },

    '& .menu-button-option': {
      display: 'flex',
      padding: `${theme.scale[150]}px ${theme.scale[200]}px ${theme.scale[150]}px ${theme.scale[300]}px `,
      alignItems: 'center',
      gap: `${theme.scale[200]}px`,
      alignSelf: 'stretch',
      flex: '0 0 auto',
      minWidth: 0,
      cursor: 'pointer',

      color: 'text.body',
      bgcolor: 'surface.primary',
      borderRadius: `${theme.borderRadius.xlg}px`,
      '&:hover': {
        color: 'text.actionHover2',
        bgcolor: 'surface.actionHover4',
      },
    },

    '& .menu-button-option.disabled': {
      pointerEvents: 'none',
      cursor: 'not-allowed',
      color: 'text.onDisabled',
      bgcolor: 'surface.disabled',
    },

    '& .menu-group-divider': {
      margin: `${theme.scale[100]}px 0 ${theme.scale[100]}px ${theme.scale[100]}px`,
    },
  },
})
