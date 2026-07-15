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

import PropTypes from 'prop-types'
import { Component, forwardRef, useState } from 'react'
import { Box } from '@mui/material'
import { getStyles } from '@modules/componentsv2/composed/DetailsDrawer/Default/slots/tabs/styles'
import { Tabs } from '@modules/componentsv2/primitives/Tabs/Default'
import { useViews } from '@FeaturesModule'

const getTabs = (tabs) =>
  Array.isArray(tabs) ? tabs : Object.values(tabs ?? {})

/**
 * TabSlot component.
 *
 * @param {object} root0 - Params
 * @returns {Component} - TabSlot component
 */
export const TabSlot = forwardRef(
  ({ tabs = [], tabProps = {}, resourceId }, ref) => {
    const { getResourceView } = useViews()
    const viewConfig = getResourceView(resourceId)?.['info-tabs']
    const enabledTabs = getTabs(tabs).filter(
      (Tab) => Tab?.id && viewConfig?.[Tab.id]?.enabled === true
    )

    const [selected, setSelected] = useState(0)

    const ActiveTab = enabledTabs?.[selected]

    return (
      <Box sx={(theme) => getStyles({ theme })} ref={ref}>
        <Tabs
          type="line"
          defaultSelect={0}
          options={enabledTabs.map(({ id, title }) => ({ id, title }))}
          onChange={(idx) => setSelected(idx)}
        />
        {ActiveTab && (
          <Box className="tab-content" data-cy={`tab-content-${ActiveTab.id}`}>
            <ActiveTab data={tabProps} config={viewConfig?.[ActiveTab?.id]} />
          </Box>
        )}
      </Box>
    )
  }
)

TabSlot.propTypes = {
  tabs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  tabProps: PropTypes.object,
  resourceId: PropTypes.string,
}

TabSlot.displayName = 'TabSlot'
