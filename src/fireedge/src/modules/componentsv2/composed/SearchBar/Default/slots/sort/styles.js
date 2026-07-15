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
 * @returns {object} - Slot styles
 */
export const getStyles = ({ theme }) => {
  const baseStyles = {
    display: 'flex',
    flex: '0 0 auto',
    width: 'auto',

    fontSize: {
      xs: theme.fontSize.body.sm.mobile,
      sm: theme.fontSize.body.sm.tablet,
      md: theme.fontSize.body.sm.desktop,
    },
    fontWeight: {
      xs: theme.fontWeight.body.sm.mobile,
      sm: theme.fontWeight.body.sm.tablet,
      md: theme.fontWeight.body.sm.desktop,
    },
    lineHeight: {
      xs: theme.lineHeight.body.sm.mobile,
      sm: theme.lineHeight.body.sm.tablet,
      md: theme.lineHeight.body.sm.desktop,
    },
  }

  const dropdown = {
    '& .dropdown': {
      flex: '0 0 auto',
      width: 'auto',
      minWidth: 0,
    },

    '& .dropdown-input-wrapper .MuiInput-input': {
      flex: '0 0 auto',
      width: 'auto',
      minWidth: 0,
      fieldSizing: 'content',
    },
  }

  return {
    ...baseStyles,
    ...dropdown,
  }
}

/**
 * @param {object} root0 - Params
 * @param {object} root0.theme - Current theme in use
 * @param {string} root0.label - Longest sort option label
 * @returns {object} - Sort dropdown popper styles
 */
export const getPopperStyles = ({ theme, label = '' }) => {
  const width = `calc(${label.length}ch + ${
    theme.scale[1500] + theme.scale[500]
  }px)`

  return {
    width: 'max-content',
    minWidth: width,

    '& .dropdown-menu-paper, & .MuiAutocomplete-listbox': {
      width: '100%',
      minWidth: width,
    },

    '& .dropdown-menu-option': {
      minWidth: 'max-content',
    },

    '& .dropdown-option-starticon': {
      width: `${theme.scale[500]}px`,
      height: `${theme.scale[500]}px`,
      alignItems: 'center',
      justifyContent: 'center',
    },

    '& .dropdown-option-starticon svg': {
      width: `${theme.scale[500]}px`,
      height: `${theme.scale[500]}px`,
    },

    '& .dropdown-option-text': {
      flex: '0 0 auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }
}
