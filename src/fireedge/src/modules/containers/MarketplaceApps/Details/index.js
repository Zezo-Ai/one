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

/* eslint-disable jsdoc/require-jsdoc */

import PropTypes from 'prop-types'
import { SingleView } from '@modules/containers/MarketplaceApps/Details/single'
import { AggregatedView } from '@modules/containers/MarketplaceApps/Details/aggregated'

export const DetailsDrawer = ({
  selectedMarketplaceApps = [],
  actions = [],
  ...handlers
}) => {
  const isMultiple = selectedMarketplaceApps?.length > 1
  const isOpen = selectedMarketplaceApps?.length > 0

  return (
    <>
      <SingleView
        {...handlers}
        isOpen={isOpen && !isMultiple}
        selectedMarketplaceApp={selectedMarketplaceApps[0]}
        actions={actions}
      />
      <AggregatedView
        {...handlers}
        isOpen={isOpen && isMultiple}
        selectedMarketplaceApps={selectedMarketplaceApps}
        actions={actions}
      />
    </>
  )
}

DetailsDrawer.displayName = 'DetailsDrawer'

DetailsDrawer.propTypes = {
  selectedMarketplaceApps: PropTypes.array,
  actions: PropTypes.array,
}
