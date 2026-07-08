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
 * @returns {object} - EmptyContent styles
 */
export const getStyles = ({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.scale[600]}px`,
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: '476px',
  textAlign: 'center',
  width: '100%',

  '& .empty-content-illustration': {
    height: 'auto',
    maxWidth: '100%',
    width: '476px',
  },

  '& .empty-content-card': {
    fill: theme.palette.surface.primary,
    stroke: theme.palette.border.primary,
  },

  '& .empty-content-card-active': {
    fill: theme.palette.surface.primary,
    stroke: theme.palette.border.action,
  },

  '& .empty-content-card-muted': {
    fill: theme.palette.surface.primary,
    opacity: 0.64,
    stroke: theme.palette.border.primary,
  },

  '& .empty-content-icon-active': {
    fill: theme.palette.icon.action,
  },

  '& .empty-content-icon-muted': {
    fill: theme.palette.icon.disabled,
  },

  '& .empty-content-line': {
    stroke: theme.palette.border.primary,
    strokeLinecap: 'round',
    strokeWidth: theme.borderWidth.lg,
  },

  '& .empty-content-pointer': {
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: theme.borderWidth.sm,
  },

  '& .empty-content-pointer-active': {
    stroke: theme.palette.icon.action,
  },

  '& .empty-content-pointer-muted': {
    stroke: theme.palette.icon.disabled,
  },

  '& .empty-content-text': {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.scale[100]}px`,
    maxWidth: '384px',
  },

  '& .empty-content-title': {
    color: 'text.headings',
  },

  '& .empty-content-subtitle': {
    color: 'text.body',
  },
})
