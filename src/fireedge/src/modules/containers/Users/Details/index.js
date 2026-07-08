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
import { SingleView } from '@modules/containers/Users/Details/single'
import { AggregatedView } from '@modules/containers/Users/Details/aggregated'

export const DetailsDrawer = ({
  selectedUsers = [],
  actions = [],
  ...handlers
}) => {
  const isMultiple = selectedUsers?.length > 1
  const isOpen = selectedUsers?.length > 0

  return (
    <>
      <SingleView
        {...handlers}
        isOpen={isOpen && !isMultiple}
        selectedUser={selectedUsers[0]}
        actions={actions}
      />
      <AggregatedView
        {...handlers}
        isOpen={isOpen && isMultiple}
        selectedUsers={selectedUsers}
        actions={actions}
      />
    </>
  )
}

DetailsDrawer.displayName = 'DetailsDrawer'

DetailsDrawer.propTypes = {
  selectedUsers: PropTypes.array,
  actions: PropTypes.array,
}
