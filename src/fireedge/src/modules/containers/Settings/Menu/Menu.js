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

import { css } from '@emotion/css'
import { useSystemData } from '@FeaturesModule'
import LogOut from '@modules/containers/Settings/Menu/LogOut'
import ProfileImage from '@modules/containers/Settings/Menu/ProfileImage'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  useTheme,
} from '@mui/material'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Fragment, ReactElement, useMemo } from 'react'

const MENU_SECTIONS = [
  { title: 'Account', options: ['security'] },
  { title: 'Display', options: ['preferences'] },
  { title: 'Tools', options: ['showback', 'labels'] },
]

const styles = ({
  borderWidth,
  palette,
  scale,
  typography,
  lineHeight,
  fontSize,
}) => ({
  root: css({
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: scale[600],
    height: '100%',
    padding: `${scale[800]}px 0 ${scale[500]}px ${scale[400]}px`,
    margin: 0,
    minWidth: '216px',
    borderRight: `${borderWidth.sm}px solid ${palette.border.primary}`,
  }),
  menu: css({
    flexGrow: 1,
    overflow: 'auto',
    padding: 0,
  }),
  sectionTitle: css({
    marginTop: scale[500],
    marginBottom: scale[200],
    color: palette.text.body,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.fontWeightMedium,
    padding: 0,
    textTransform: 'uppercase',

    '&:first-of-type': {
      marginTop: 0,
    },
  }),
  listItem: css({
    margin: 0,
    padding: 0,
    cursor: 'pointer',
  }),
  listItemContainer: css({
    display: 'flex',
    gap: scale[400],
    width: '100%',
    padding: `${scale[100]}px ${scale[200]}px ${scale[100]}px ${scale[200]}px`,
    alignItems: 'center',
    borderLeft: `${borderWidth.sm}px solid ${palette.border.primary}`,

    '&:hover': {
      borderLeft: `${borderWidth.md}px solid ${palette.text.action}`,
      paddingLeft: scale[200] - borderWidth.sm,

      '& .settings-menu-icon': {
        color: palette.text.action,
      },

      '& .settings-menu-title': {
        color: palette.text.action,
        fontWeight: 600,
      },
    },
  }),
  listItemSelected: css({
    borderLeft: `${borderWidth.md}px solid ${palette.text.action}`,
    paddingLeft: scale[200] - borderWidth.sm,
    backgroundColor: palette.surface.focus2,
    borderRadius: `0 ${scale[100]}px ${scale[150]}px 0`,

    '& .settings-menu-icon': {
      color: palette.text.action,
    },

    '& .settings-menu-title': {
      fontWeight: 600,
      color: palette.text.action,
    },
  }),
  title: css({
    margin: 0,
  }),
  titleText: css({
    color: palette.text.body,
    fontSize: typography.body2.fontSize,
    fontWeight: typography.fontWeightMedium,
  }),
  icon: css({
    width: scale[500],
    height: scale[500],
    minWidth: 0,
    color: palette.icon.primary,

    '& svg': {
      width: scale[500],
      height: scale[500],
      strokeWidth: 1.6,
    },
  }),
})

/**
 * Setting Menu.
 *
 * @param {object} props - Props
 * @param {object} props.options - Options
 * @param {string} props.selectedOption - Selected option
 * @param {Function} props.setSelectedOption - Set selected option
 * @param {any[]} props.optionsRestrincted - Options restricted
 * @returns {ReactElement} Settings menu
 */
const Menu = ({
  options = {},
  selectedOption = '',
  setSelectedOption = () => undefined,
  optionsRestrincted = [],
}) => {
  const theme = useTheme()
  const classes = useMemo(() => styles(theme), [theme])

  const { adminGroup } = useSystemData()
  const menuSections = useMemo(() => {
    const availableEntries = Object.entries(options).filter(
      ([key]) => adminGroup || !optionsRestrincted.includes(key)
    )
    const entriesByKey = Object.fromEntries(availableEntries)
    const sectionKeys = new Set()

    const sections = MENU_SECTIONS.map(({ title, options: sectionOptions }) => {
      const entries = sectionOptions
        .filter((key) => {
          const hasEntry = key in entriesByKey
          if (hasEntry) sectionKeys.add(key)

          return hasEntry
        })
        .map((key) => [key, entriesByKey[key]])

      return { title, entries }
    }).filter(({ entries }) => entries.length)

    const ungroupedEntries = availableEntries.filter(
      ([key]) => !sectionKeys.has(key)
    )

    return ungroupedEntries.length
      ? [...sections, { title: '', entries: ungroupedEntries }]
      : sections
  }, [adminGroup, options, optionsRestrincted])

  return (
    <Paper className={classes.root}>
      <ProfileImage />
      <List className={classes.menu} data-cy="setting-menu">
        {menuSections.map(({ title, entries }) => (
          <Fragment key={title || 'settings-menu-ungrouped'}>
            {title && (
              <ListSubheader
                className={classes.sectionTitle}
                data-cy={`setting-section-${title.toLocaleLowerCase()}`}
                disableSticky
              >
                {title}
              </ListSubheader>
            )}
            {entries.map(([key, value]) => {
              const isSelected = selectedOption === key

              return (
                <ListItem
                  className={classes.listItem}
                  key={key}
                  onClick={() => setSelectedOption(key)}
                  data-cy={`setting-${value?.title?.toLocaleLowerCase()}`}
                >
                  <Box
                    className={clsx(classes.listItemContainer, {
                      [classes.listItemSelected]: isSelected,
                    })}
                  >
                    {value.icon && (
                      <ListItemIcon
                        className={clsx(classes.icon, 'settings-menu-icon')}
                      >
                        <value.icon />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      className={classes.title}
                      primary={value?.title}
                      primaryTypographyProps={{
                        className: clsx(
                          classes.titleText,
                          'settings-menu-title'
                        ),
                      }}
                    />
                  </Box>
                </ListItem>
              )
            })}
          </Fragment>
        ))}
      </List>
      <LogOut />
    </Paper>
  )
}

Menu.propTypes = {
  options: PropTypes.object,
  selectedOption: PropTypes.string,
  setSelectedOption: PropTypes.func,
  optionsRestrincted: PropTypes.array,
}

Menu.displayName = 'SettingsMenu'

export { Menu }
