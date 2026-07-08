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
import { SingleView } from '@modules/containers/Services/Details/single'
import { AggregatedView } from '@modules/containers/Services/Details/aggregated'

export const DetailsDrawer = ({
  selectedServices = [],
  actions = [],
  viewConfig = {},
  ...handlers
}) => {
  const isMultiple = selectedServices?.length > 1
  const isOpen = selectedServices?.length > 0

  return (
    <>
      <SingleView
        {...handlers}
        isOpen={isOpen && !isMultiple}
        selectedService={selectedServices[0]}
        viewConfig={viewConfig}
      />
      <AggregatedView
        {...handlers}
        isOpen={isOpen && isMultiple}
        selectedServices={selectedServices}
        actions={actions}
      />
    </>
  )
}

DetailsDrawer.displayName = 'DetailsDrawer'

DetailsDrawer.propTypes = {
  selectedServices: PropTypes.array,
  actions: PropTypes.array,
  viewConfig: PropTypes.object,
}
