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

import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Component, useMemo } from 'react'
import { T } from '@ConstantsModule'
import { decodeBase64 } from '@UtilsModule'
import { TemplateTab } from '@ComponentsV2Module'

const getStyles = ({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  gap: `${theme.scale[600]}px`,
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',

  '& .marketplaceapp-template-section': {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    gap: `${theme.scale[300]}px`,
    width: '100%',
    minWidth: 0,
    minHeight: '240px',
  },

  '& .marketplaceapp-template-body': {
    display: 'flex',
    flex: '1 1 0',
    width: '100%',
    minWidth: 0,
    minHeight: 0,
  },

  '& .marketplaceapp-template-body > *': {
    flex: '1 1 0',
    minWidth: 0,
    minHeight: 0,
  },
})

const titleStyles = ({ theme }) => ({
  color: 'text.headings',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: {
    xs: theme.fontSize.heading.h6.mobile,
    sm: theme.fontSize.heading.h6.tablet,
    md: theme.fontSize.heading.h6.desktop,
  },
  lineHeight: {
    xs: theme.lineHeight.heading.h5.mobile,
    sm: theme.lineHeight.heading.h5.tablet,
    md: theme.lineHeight.heading.h5.desktop,
  },
})

/**
 * @param {object} root0 - Params
 * @param {object} root0.data - Tab specific data
 * @returns {Component} - Marketplace App template tab
 */
export const Template = ({ data }) => {
  const { marketplaceApp = {} } = data || {}
  const { APPTEMPLATE64, VMTEMPLATE64 } = marketplaceApp?.TEMPLATE ?? {}

  const appTemplate = useMemo(
    () => (APPTEMPLATE64 ? decodeBase64(APPTEMPLATE64, T.Empty) : T.Empty),
    [APPTEMPLATE64]
  )

  const vmTemplate = useMemo(
    () => (VMTEMPLATE64 ? decodeBase64(VMTEMPLATE64, T.Empty) : T.Empty),
    [VMTEMPLATE64]
  )

  return (
    <Box sx={(theme) => getStyles({ theme })}>
      <Box className="marketplaceapp-template-section">
        <Box sx={(theme) => titleStyles({ theme })}>{T.AppTemplate}</Box>
        <Box className="marketplaceapp-template-body">
          <TemplateTab code={appTemplate} />
        </Box>
      </Box>
      <Box className="marketplaceapp-template-section">
        <Box sx={(theme) => titleStyles({ theme })}>{T.VMTemplate}</Box>
        <Box className="marketplaceapp-template-body">
          <TemplateTab code={vmTemplate} />
        </Box>
      </Box>
    </Box>
  )
}

Template.propTypes = {
  data: PropTypes.object,
}

Template.id = 'template'
Template.title = T.Template
