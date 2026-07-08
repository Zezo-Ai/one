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

import { Component, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Drawer, useTheme } from '@mui/material'
import { getStyles } from '@modules/componentsv2/composed/DetailsDrawer/Default/styles'

/**
 * DetailsDrawer component.
 *
 * @param {object} root0 - Params
 * @param {Array} root0.slots - Component slots
 * @returns {Component} - DetailsDrawer component
 */
export const DetailsDrawer = forwardRef(
  ({ isOpen = false, slots = [] }, ref) => {
    const theme = useTheme()

    return (
      <Drawer
        hideBackdrop={true}
        anchor={'right'}
        sx={{ ...getStyles({ theme }) }}
        open={isOpen}
        PaperProps={{
          className: 'detailsdrawer-paper',
        }}
        ref={ref}
      >
        <Box className="detailsdrawer-slots">
          {slots?.map(([Slot, slotProps = {}, containerSx = {}], idx) => (
            <Box
              key={idx}
              className={`detailsdrawer-slot detailsdrawer-slot--${idx}`}
              sx={[
                ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
              ]}
            >
              <Slot {...slotProps} />
            </Box>
          ))}
        </Box>
      </Drawer>
    )
  }
)

DetailsDrawer.propTypes = {
  isOpen: PropTypes.bool,
  slots: PropTypes.array,
}

DetailsDrawer.displayName = 'DetailsDrawer'
