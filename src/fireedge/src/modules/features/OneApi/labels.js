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

import { LABEL_DELIMITER } from '@ConstantsModule'
import {
  isLabelResourceName,
  normalizeLabelResourceName,
  parseLabels,
} from '@UtilsModule'

export const PROFILE_LABELS = 'PROFILE_LABELS'

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const safeObject = (value) => (isPlainObject(value) ? value : {})

const getQueryData = (state, endpointName) =>
  Object.entries(state?.oneApi?.queries ?? {})
    .filter(
      ([key, query]) =>
        query?.endpointName === endpointName ||
        key.startsWith(`${endpointName}(`)
    )
    .map(([, query]) => query?.data)
    .find((data) => data !== undefined)

const mergeTrees = (...trees) =>
  trees.filter(isPlainObject).reduce((merged, tree) => {
    Object.entries(tree).forEach(([key, value]) => {
      if (UNSAFE_KEYS.has(key)) return

      merged[key] =
        isPlainObject(merged[key]) && isPlainObject(value)
          ? mergeTrees(merged[key], value)
          : value
    })

    return merged
  }, {})

const indexEntry = (index, resourceType, resourceId) => {
  const key = `${resourceType}:${String(resourceId)}`
  const entry = index.get(key) ?? { user: new Set(), group: new Map() }

  index.set(key, entry)

  return entry
}

const addToIndex = (
  index,
  { owner, groupName, resourceType, resourceIds, labelPath }
) => {
  if (!labelPath) return

  resourceIds.forEach((resourceId) => {
    if (resourceId === undefined || resourceId === null) return

    const entry = indexEntry(index, resourceType, resourceId)

    if (owner !== 'group') {
      entry.user.add(labelPath)

      return
    }

    const labels = entry.group.get(groupName) ?? new Set()
    labels.add(labelPath)
    entry.group.set(groupName, labels)
  })
}

const walkLabels = (
  node,
  index,
  {
    path = [],
    resourceType,
    owner = 'user',
    groupName,
    delimiter = LABEL_DELIMITER,
  } = {}
) => {
  if (!isPlainObject(node)) return

  Object.entries(node).forEach(([key, value]) => {
    if (UNSAFE_KEYS.has(key)) return
    const labelResourceType = normalizeLabelResourceName(key)

    if (
      Array.isArray(value) &&
      (labelResourceType === resourceType ||
        (!resourceType && isLabelResourceName(key)))
    ) {
      addToIndex(index, {
        owner,
        groupName,
        resourceType: labelResourceType,
        resourceIds: value,
        labelPath: path.join(delimiter),
      })

      return
    }

    if (isPlainObject(value)) {
      walkLabels(value, index, {
        path: [...path, key],
        resourceType,
        owner,
        groupName,
        delimiter,
      })
    }
  })
}

export const parseProfileLabels = (labels) => safeObject(parseLabels(labels))

export const getUserProfileLabels = (user) =>
  parseProfileLabels(
    user?.TEMPLATE?.FIREEDGE?.LABELS ?? user?.TEMPLATE?.LABELS ?? {}
  )

export const getGroupProfileLabels = (group) =>
  parseProfileLabels(group?.TEMPLATE?.FIREEDGE?.LABELS ?? {})

export const getProfileGroups = (state) =>
  [getQueryData(state, 'getGroups') ?? []].flat().filter(isPlainObject)

export const getDefaultLabels = (state) => {
  const labels = getQueryData(state, 'getDefaultLabels')

  return safeObject(safeObject(labels)?.data ?? labels)
}

export const getProfileLabelTrees = (state) => {
  const defaults = getDefaultLabels(state)
  const defaultGroups = defaults?.group

  return {
    user: mergeTrees(defaults?.user, getUserProfileLabels(state?.auth?.user)),
    group: getProfileGroups(state).reduce((labelsByGroup, group) => {
      if (!group?.NAME) return labelsByGroup

      labelsByGroup[group.NAME] = mergeTrees(
        defaultGroups?.[group.NAME],
        defaultGroups?.[`$${group.NAME}`],
        getGroupProfileLabels(group)
      )

      return labelsByGroup
    }, {}),
  }
}

export const buildResourceLabelIndex = (
  labels = {},
  resourceType,
  delimiter = LABEL_DELIMITER
) => {
  const index = new Map()
  const labelResourceType =
    resourceType && normalizeLabelResourceName(resourceType)

  walkLabels(labels?.user, index, {
    resourceType: labelResourceType,
    delimiter,
  })

  Object.entries(labels?.group ?? {}).forEach(([groupName, groupLabels]) => {
    walkLabels(groupLabels, index, {
      resourceType: labelResourceType,
      owner: 'group',
      groupName,
      delimiter,
    })
  })

  return index
}

export const getLabelsFromIndex = (index, resourceType, resourceId) => {
  const entry = index.get(
    `${normalizeLabelResourceName(resourceType)}:${String(resourceId)}`
  )
  const user = [...(entry?.user ?? [])]
  const group = Object.fromEntries(
    [...(entry?.group ?? new Map())].map(([groupName, labels]) => [
      groupName,
      [...labels],
    ])
  )

  return {
    user,
    group,
  }
}

export const withResourceLabels = (resourceOrArray, resourceType, meta) => {
  const labels = getProfileLabelTrees(meta?.state)
  const index = buildResourceLabelIndex(labels, resourceType)
  const addLabels = (resource) =>
    isPlainObject(resource)
      ? {
          ...resource,
          LABELS: getLabelsFromIndex(index, resourceType, resource?.ID),
        }
      : resource

  return Array.isArray(resourceOrArray)
    ? resourceOrArray.map(addLabels)
    : addLabels(resourceOrArray)
}

export const withProfileLabelsTags = (tags = []) => [
  ...[].concat(tags).filter(Boolean),
  PROFILE_LABELS,
]
