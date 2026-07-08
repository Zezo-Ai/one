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

import { Component } from 'react'
import { Typography, Link, Box, Divider, useTheme } from '@mui/material'
import MUIBreadcrumbs from '@mui/material/Breadcrumbs'
import { Home, NavArrowRight } from 'iconoir-react'
import PropTypes from 'prop-types'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useFunctionality } from '@FeaturesModule'
import { Button } from '@modules/componentsv2/primitives/Buttons/Default'

/**
 * @param {object} params - Params
 * @param {string} params.className - Classname override
 * @returns {Component} - Breadcrumb header
 */
export const Breadcrumbs = ({ className }) => {
  const { breadcrumbs } = useFunctionality()
  const history = useHistory()
  const theme = useTheme()

  if (!breadcrumbs?.length) return null

  return (
    <Box className={className}>
      <Button
        iconOnly={<Home />}
        type="transparent"
        size="small"
        data-cy="breadcrumb-home"
        onClick={() => history.push('/')}
        className={'header-home-button'}
      />

      <Divider orientation="vertical" flexItem className={'header-divider'} />

      <MUIBreadcrumbs
        aria-label="breadcrumb"
        separator={
          <NavArrowRight height={theme.scale[500]} width={theme.scale[500]} />
        }
        data-cy="breadcrumbs"
        className={'breadcrumb-links'}
      >
        {breadcrumbs.map(({ label, path }, i) =>
          path && i < breadcrumbs.length - 1 ? (
            <Link
              key={path}
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={path}
            >
              {label}
            </Link>
          ) : (
            <Typography
              className={`breadcrumb-item ${
                i === breadcrumbs?.length - 1 ? 'selected' : ''
              }`}
              key={label}
            >
              {label}
            </Typography>
          )
        )}
      </MUIBreadcrumbs>
    </Box>
  )
}

Breadcrumbs.propTypes = { className: PropTypes.string }
Breadcrumbs.displayName = 'Breadcrumbs'
