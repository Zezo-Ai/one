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
 * @returns {object} - Detailsdrawer styles
 */
export const getStyles = ({ theme }) => {
  const baseStyles = {
    display: 'flex',
    flex: '1 0 0',
    minWidth: 0,
    height: '100%',
    width: 'fit-content',

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

  const paperProps = {
    '& .detailsdrawer-paper': {
      display: 'inline-flex',
      flex: '1 0 0',
      minWidth: 0,
      width: 'calc(80vw - var(--sidebar-width, 0px))',
      height: 'calc(100vh - var(--sidebar-header-height, 0px))',
      marginTop: 'var(--sidebar-header-height, 0px)',
      padding: `${theme.scale[600]}px ${theme.scale[700]}px`,
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: `${theme.scale[550]}px`,
      borderRadius: `${theme.borderRadius?.['4xl']}px 0 0 ${theme.borderRadius?.['4xl']}px`,
      borderTop: `${theme.borderWidth.sm}px solid ${theme.palette.border.primary}`,
      borderRight: `${theme.borderWidth.none}px solid ${theme.palette.border.primary}`,
      borderBottom: `${theme.borderWidth.sm}px solid ${theme.palette.border.primary}`,
      borderLeft: `${theme.borderWidth.sm}px solid ${theme.palette.border.primary}`,
      bgcolor: 'surface.primary',
      boxShadow:
        '-119px 0 33px 0 rgba(0, 0, 0, 0.00), -76px 0 30px 0 rgba(0, 0, 0, 0.01), -43px 0 26px 0 rgba(0, 0, 0, 0.02), -19px 0 19px 0 rgba(0, 0, 0, 0.03), -5px 0 10px 0 rgba(0, 0, 0, 0.04)',
    },
  }

  const slots = {
    '& .detailsdrawer-slots': {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 0 0',
      minWidth: 0,
      alignItems: 'start',
      alignSelf: 'stretch',
      gap: `${theme.scale[550]}px`,
    },
  }

  const slot = {
    '& .detailsdrawer-slot': {
      display: 'flex',
      minWidth: 0,
      minHeight: 0,
      width: '100%',
      overflowY: 'auto',
    },
  }

  return {
    ...baseStyles,
    ...paperProps,
    ...slots,
    ...slot,
  }
}
