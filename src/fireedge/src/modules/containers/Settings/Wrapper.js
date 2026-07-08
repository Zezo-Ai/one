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

import { Translate, TranslateProvider } from '@ResourcesModule'
import { css } from '@emotion/css'
import { Box, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { ReactElement, createContext, useContext, useMemo } from 'react'
import clsx from 'clsx'

const SettingWrapperContext = createContext(null)

const styles = ({ typography, borderWidth, borderRadius, palette, scale }) => ({
  content: css({
    margin: `0 auto ${scale[800]}px`,
    width: '100%',
    maxWidth: '1024px',
  }),

  legend: css({
    textAlign: 'left',
    padding: 0,
    marginTop: scale[800],
    marginBottom: scale[700],
    border: 'none',
    fontSize: typography.h6.fontSize,
    fontWeight: typography.fontWeightBold,
    color: palette.text.headings,
  }),

  internalWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: scale[500],
    borderRadius: '12px',
    overflow: 'hidden',
    border: `${borderWidth.sm}px solid ${palette.border.primary}`,
    backgroundColor: palette.surface.primary,
  }),

  innerWrapperTitle: css({
    textAlign: 'left',
    fontSize: typography.body2.fontSize,
    fontWeight: typography.fontWeightMedium,
    marginTop: '0 !important',
    color: palette.text.headings,
    padding: `${scale[400]}px ${scale[600]}px`,
    borderBottom: `${borderWidth.sm}px solid ${palette.border.primary}`,
  }),

  innerWrapperBox: css({
    backgroundColor: palette.background.paper,
    color: palette.text.body,
    padding: `${scale[500]}px ${scale[600]}px`,
  }),
})

/**
 * Wrapper for settings.
 *
 * @param {object} props - props
 * @param {any} props.children - Children
 * @returns {ReactElement} React element
 */
const Wrapper = ({ children }) => {
  const theme = useTheme()
  const classes = useMemo(() => styles(theme), [theme])

  const Legend = ({ title = '' }) => (
    <Typography
      variant="underline"
      component="legend"
      className={classes.legend}
    >
      <Translate word={title} />
    </Typography>
  )
  Legend.propTypes = {
    title: PropTypes.string,
  }

  const InternalWrapper = ({ children, title = '', innerClassName }) => (
    <Box
      className={classes.internalWrapper}
      gridTemplateColumns={{ sm: '1fr' }}
    >
      {title && (
        <Typography
          className={clsx(classes.innerWrapperTitle, innerClassName)}
          component="legend"
        >
          <Translate word={title} />
        </Typography>
      )}
      <Box className={classes.innerWrapperBox}>{children}</Box>
    </Box>
  )
  InternalWrapper.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    innerClassName: PropTypes.string,
  }

  return (
    <TranslateProvider>
      <SettingWrapperContext.Provider value={{ Legend, InternalWrapper }}>
        <Box className={classes.content}>{children}</Box>
      </SettingWrapperContext.Provider>
    </TranslateProvider>
  )
}

Wrapper.propTypes = {
  children: PropTypes.any,
}
Wrapper.displayName = 'Wrapper'

/**
 * Legend hook.
 *
 * @returns {Function} Setting Context
 */
const useSettingWrapper = () => useContext(SettingWrapperContext)

export { Wrapper, useSettingWrapper }
