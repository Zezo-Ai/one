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

import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { RESOURCE_NAMES } from '@ConstantsModule'
import { SystemAPI, useViews } from '@FeaturesModule'
import { ResourceSingleViewContextProvider } from '@ProvidersModule'
import { DetailsDrawerStackProvider } from '@ComponentsV2Module'
import { buildBreadcrumbMap, getActionsAvailable } from '@UtilsModule'

let entryId = 0

const actions = ({ resourceView }) => ({
  actions: getActionsAvailable(resourceView?.actions),
})
const rawActions = ({ resourceView }) => ({
  availableActions: resourceView?.actions ?? {},
})
const viewConfig = ({ resourceView }) => ({ viewConfig: resourceView ?? {} })
const templateActions = ({ resourceView }) => ({
  actions: getActionsAvailable(resourceView),
})
const serviceTemplateActions = ({ getResourceView }) => ({
  actions: getActionsAvailable(
    getResourceView?.(RESOURCE_NAMES.VM_TEMPLATE)?.actions
  ),
})
const serviceView = ({ resourceView }) => ({
  ...actions({ resourceView }),
  ...viewConfig({ resourceView }),
})

const lazyDrawer = (load) =>
  lazy(() => load().then(({ DetailsDrawer }) => ({ default: DetailsDrawer })))

const drawer = (load, selectedProp, getProps) => ({
  Component: lazyDrawer(load),
  selectedProp,
  getProps,
})

export const RESOURCE_SINGLE_VIEW = Object.freeze({
  [RESOURCE_NAMES.BACKUPJOBS]: drawer(
    () => import('@modules/containers/BackupJobs/Details'),
    'selectedData',
    rawActions
  ),
  [RESOURCE_NAMES.BACKUP]: drawer(
    () => import('@modules/containers/Backups/Details'),
    'selectedData',
    rawActions
  ),
  [RESOURCE_NAMES.CLUSTER]: drawer(
    () => import('@modules/containers/Clusters/Details'),
    'selectedClusters',
    actions
  ),
  [RESOURCE_NAMES.DATASTORE]: drawer(
    () => import('@modules/containers/Datastores/Details'),
    'selectedData',
    rawActions
  ),
  [RESOURCE_NAMES.FILE]: drawer(
    () => import('@modules/containers/Files/Details'),
    'selectedData',
    rawActions
  ),
  [RESOURCE_NAMES.GROUP]: drawer(
    () => import('@modules/containers/Groups/Details'),
    'selectedGroups'
  ),
  [RESOURCE_NAMES.HOST]: drawer(
    () => import('@modules/containers/Hosts/Details'),
    'selectedHosts'
  ),
  [RESOURCE_NAMES.IMAGE]: drawer(
    () => import('@modules/containers/Images/Details'),
    'selectedData',
    rawActions
  ),
  [RESOURCE_NAMES.APP]: drawer(
    () => import('@modules/containers/MarketplaceApps/Details'),
    'selectedMarketplaceApps',
    actions
  ),
  [RESOURCE_NAMES.MARKETPLACE]: drawer(
    () => import('@modules/containers/Marketplaces/Details'),
    'selectedMarketplaces',
    actions
  ),
  [RESOURCE_NAMES.ONEKS]: drawer(
    () => import('@modules/containers/OneKs/Details'),
    'selectedData',
    rawActions
  ),
  [RESOURCE_NAMES.PROVIDER]: drawer(
    () => import('@modules/containers/Providers/Details'),
    'selectedProviders',
    actions
  ),
  [RESOURCE_NAMES.SEC_GROUP]: drawer(
    () => import('@modules/containers/SecurityGroups/Details'),
    'selectedSecurityGroups',
    actions
  ),
  [RESOURCE_NAMES.SERVICE_TEMPLATE]: drawer(
    () => import('@modules/containers/ServiceTemplates/Details'),
    'selectedTemplates',
    serviceTemplateActions
  ),
  [RESOURCE_NAMES.SERVICE]: drawer(
    () => import('@modules/containers/Services/Details'),
    'selectedServices',
    serviceView
  ),
  [RESOURCE_NAMES.SUPPORT]: drawer(
    () => import('@modules/containers/Support/Details'),
    'selectedTickets',
    actions
  ),
  [RESOURCE_NAMES.USER]: drawer(
    () => import('@modules/containers/Users/Details'),
    'selectedUsers',
    actions
  ),
  [RESOURCE_NAMES.VDC]: drawer(
    () => import('@modules/containers/VDCs/Details'),
    'selectedVdcs'
  ),
  [RESOURCE_NAMES.VM]: drawer(
    () => import('@modules/containers/VirtualMachines/Details'),
    'selectedVms',
    viewConfig
  ),
  [RESOURCE_NAMES.VNET]: drawer(
    () => import('@modules/containers/VirtualNetworks/Details'),
    'selectedResources',
    actions
  ),
  [RESOURCE_NAMES.VROUTER]: drawer(
    () => import('@modules/containers/VirtualRouters/Details'),
    'selectedResources',
    actions
  ),
  [RESOURCE_NAMES.VM_GROUP]: drawer(
    () => import('@modules/containers/VmGroups/Details'),
    'selectedVmGroups',
    actions
  ),
  [RESOURCE_NAMES.VM_TEMPLATE]: drawer(
    () => import('@modules/containers/VmTemplates/Details'),
    'selectedTemplates',
    templateActions
  ),
  [RESOURCE_NAMES.VN_TEMPLATE]: drawer(
    () => import('@modules/containers/VnTemplates/Details'),
    'selectedVnTemplates',
    actions
  ),
  [RESOURCE_NAMES.VROUTER_TEMPLATE]: drawer(
    () => import('@modules/containers/VrTemplates/Details'),
    'selectedTemplates',
    templateActions
  ),
  [RESOURCE_NAMES.ZONE]: drawer(
    () => import('@modules/containers/Zones/Details'),
    'selectedZones'
  ),
})

const getResourceName = (resource) => String(resource ?? '').toLowerCase()

const getResourceData = (data) =>
  data && typeof data === 'object' ? data : { ID: data, id: data }

const getStackEntry = (resource, data, props, key) => ({
  key: key ?? `${resource}-${entryId++}`,
  resource,
  data: getResourceData(data),
  props,
})

const clampIndex = (index, length) =>
  length ? Math.min(Math.max(index, 0), length - 1) : -1

const clampStackIndex = (index, entries) => clampIndex(index, entries.length)

const getRenderedStackLength = (entries, hasBase) =>
  entries.length + (hasBase && entries.length ? 1 : 0)

const hasValue = (value) =>
  value !== undefined && value !== null && value !== ''

const getResourceId = (data = {}) => (hasValue(data?.ID) ? data.ID : data?.id)

const getEntryIdentity = ({ resource, data } = {}) =>
  `${getResourceName(resource)}:${getResourceId(data)}`

const isSameEntry = (first, second) =>
  first &&
  second &&
  hasValue(getResourceId(first?.data)) &&
  getEntryIdentity(first) === getEntryIdentity(second)

const getBaseStackEntry = (resource, data, props) => {
  const resourceName = getResourceName(resource)
  const resourceData = getResourceData(data)

  return getStackEntry(
    resourceName,
    resourceData,
    props,
    `base-${resourceName}-${getResourceId(resourceData)}`
  )
}

const getResourceTitle = (data = {}, resource) =>
  data?.TEMPLATE?.NAME ??
  data?.NAME ??
  data?.name ??
  (hasValue(getResourceId(data)) ? getResourceId(data) : resource)

const getResourceBreadcrumbs = (getBreadcrumbs, entry = {}) => {
  const { data = {}, resource } = entry
  const id = getResourceId(data)
  const resourcePath = `/${resource}`
  const detailPath = hasValue(id) ? `${resourcePath}/${id}` : undefined
  const title = getResourceTitle(data, resource)
  const detailCrumbs = detailPath ? getBreadcrumbs?.(detailPath) : null
  const listCrumbs = getBreadcrumbs?.(resourcePath)
  const crumbs = detailCrumbs ?? listCrumbs ?? []

  if (!crumbs.length) {
    return [
      { label: resource, path: resourcePath },
      ...(detailPath ? [{ label: title, path: detailPath }] : []),
    ]
  }

  const nextCrumbs = crumbs.map((crumb) => ({ ...crumb }))

  if (detailCrumbs) {
    nextCrumbs[nextCrumbs.length - 1] = {
      ...nextCrumbs[nextCrumbs.length - 1],
      label: title,
      path: detailPath,
    }

    return nextCrumbs
  }

  return detailPath
    ? [...nextCrumbs, { label: title, path: detailPath }]
    : nextCrumbs
}

const ResourceSingleViewDrawer = ({
  view,
  getResourceView,
  handleClose,
  ...props
}) => {
  const resource = getResourceName(view?.resource)
  const config = RESOURCE_SINGLE_VIEW[resource]

  if (!config || !view) return null

  const { Component, selectedProp, getProps } = config
  const resourceView = getResourceView?.(resource)
  const baseProps =
    getProps?.({ getResourceView, resource, resourceView }) ?? {}

  const content = (
    <Component
      {...baseProps}
      {...view.props}
      {...props}
      {...{ [selectedProp]: [view.data] }}
      handleClose={handleClose}
    />
  )

  return <Suspense fallback={null}>{content}</Suspense>
}

ResourceSingleViewDrawer.propTypes = {
  view: PropTypes.shape({
    resource: PropTypes.string,
    data: PropTypes.object,
    props: PropTypes.object,
  }),
  getResourceView: PropTypes.func,
  handleClose: PropTypes.func,
}

/**
 * Checks whether a resource has a registered single view drawer.
 *
 * @param {string} resource - Resource name
 * @returns {boolean} True when a single view exists
 */
export const hasResourceSingleView = (resource) =>
  RESOURCE_SINGLE_VIEW[getResourceName(resource)] !== undefined

/**
 * Opens any registered resource single view from the current component.
 *
 * @returns {object} Resource single view API
 */
export const useResourceSingleView = () => {
  const { getResourceView } = useViews()
  const { data: tabManifest = [] } = SystemAPI.useGetTabManifestQuery()
  const getBreadcrumbs = useMemo(
    () => buildBreadcrumbMap(tabManifest ?? []),
    [tabManifest]
  )
  const [stack, setStack] = useState({ entries: [], activeIndex: -1 })
  const [baseEntry, setBaseEntry] = useState()
  const baseEntryRef = useRef()
  const entries = useMemo(() => {
    const rawEntries =
      baseEntry && stack.entries.length
        ? [baseEntry, ...stack.entries]
        : stack.entries

    return rawEntries.map((entry) => ({
      ...entry,
      title: getResourceTitle(entry?.data, entry?.resource),
      breadcrumbs: getResourceBreadcrumbs(getBreadcrumbs, entry),
    }))
  }, [baseEntry, getBreadcrumbs, stack.entries])
  const activeIndex = clampStackIndex(stack.activeIndex, entries)
  const currentStack = useMemo(
    () => ({ ...stack, activeIndex, entries }),
    [activeIndex, entries, stack]
  )

  const closeResourceSingleView = useCallback(
    () => setStack({ entries: [], activeIndex: -1 }),
    []
  )

  const goBackResourceSingleView = useCallback(() => {
    setStack(({ entries: stackEntries, activeIndex: stackActiveIndex }) => ({
      entries: stackEntries,
      activeIndex: clampIndex(
        stackActiveIndex - 1,
        getRenderedStackLength(stackEntries, baseEntryRef.current)
      ),
    }))
  }, [])

  const goForwardResourceSingleView = useCallback(() => {
    setStack(({ entries: stackEntries, activeIndex: stackActiveIndex }) => ({
      entries: stackEntries,
      activeIndex: clampIndex(
        stackActiveIndex + 1,
        getRenderedStackLength(stackEntries, baseEntryRef.current)
      ),
    }))
  }, [])

  const goToResourceSingleView = useCallback((index) => {
    setStack(({ entries: stackEntries }) => ({
      entries: stackEntries,
      activeIndex: clampIndex(
        index,
        getRenderedStackLength(stackEntries, baseEntryRef.current)
      ),
    }))
  }, [])

  const registerResourceSingleViewBase = useCallback(
    (resource, data, props = {}) => {
      const resourceName = getResourceName(resource)

      if (!hasValue(getResourceId(getResourceData(data)))) return false
      if (!hasResourceSingleView(resourceName)) return false

      const nextBaseEntry = getBaseStackEntry(resourceName, data, props)

      if (isSameEntry(baseEntryRef.current, nextBaseEntry)) {
        baseEntryRef.current = nextBaseEntry
        setBaseEntry((currentEntry) =>
          isSameEntry(currentEntry, nextBaseEntry)
            ? nextBaseEntry
            : currentEntry
        )

        return true
      }

      baseEntryRef.current = nextBaseEntry
      setBaseEntry(nextBaseEntry)
      setStack({ entries: [], activeIndex: -1 })

      return true
    },
    []
  )

  const clearResourceSingleViewBase = useCallback((resource, data) => {
    const nextBaseEntry = getBaseStackEntry(resource, data)

    if (!isSameEntry(baseEntryRef.current, nextBaseEntry)) return

    baseEntryRef.current = undefined
    setBaseEntry(undefined)
    setStack({ entries: [], activeIndex: -1 })
  }, [])

  const openResourceSingleView = useCallback(
    (resource, data, props = {}) => {
      const resourceName = getResourceName(resource)

      if (!hasResourceSingleView(resourceName)) return false

      setStack(({ entries: stackEntries, activeIndex: stackActiveIndex }) => {
        const childActiveIndex = baseEntry
          ? stackActiveIndex - 1
          : stackActiveIndex
        const nextEntries = [
          ...stackEntries.slice(0, Math.max(childActiveIndex + 1, 0)),
          getStackEntry(resourceName, data, props),
        ]

        return {
          entries: nextEntries,
          activeIndex: (baseEntry ? 1 : 0) + nextEntries.length - 1,
        }
      })

      return true
    },
    [baseEntry]
  )

  const ResourceSingleView = useCallback(
    (props) =>
      entries
        .slice(baseEntry ? 1 : 0, activeIndex + 1)
        .map((entry, childIndex) => {
          const index = baseEntry ? childIndex + 1 : childIndex

          return (
            <DetailsDrawerStackProvider
              key={entry.key}
              value={{
                entries,
                activeIndex,
                index,
                isActive: index === activeIndex,
                breadcrumbs: entry.breadcrumbs,
                goBack: goBackResourceSingleView,
                goForward: goForwardResourceSingleView,
                goTo: goToResourceSingleView,
              }}
            >
              <ResourceSingleViewDrawer
                {...props}
                view={entry}
                getResourceView={getResourceView}
                handleClose={closeResourceSingleView}
              />
            </DetailsDrawerStackProvider>
          )
        }),
    [
      activeIndex,
      baseEntry,
      closeResourceSingleView,
      entries,
      getResourceView,
      goBackResourceSingleView,
      goForwardResourceSingleView,
      goToResourceSingleView,
    ]
  )

  return {
    view: entries[activeIndex],
    stack: currentStack,
    ResourceSingleView,
    clearResourceSingleViewBase,
    openResourceSingleView,
    closeResourceSingleView,
    goBackResourceSingleView,
    goForwardResourceSingleView,
    goToResourceSingleView,
    registerResourceSingleViewBase,
  }
}

/**
 * Hosts the resource single view drawer API and renderer.
 *
 * @param {object} props - Host props
 * @param {Component} props.children - Nested content
 * @returns {Component} Resource single view host
 */
export const ResourceSingleViewHost = ({ children }) => {
  const {
    ResourceSingleView,
    clearResourceSingleViewBase,
    goBackResourceSingleView,
    goForwardResourceSingleView,
    goToResourceSingleView,
    openResourceSingleView,
    registerResourceSingleViewBase,
    stack,
  } = useResourceSingleView()
  const value = useMemo(
    () => ({
      clearResourceSingleViewBase,
      goBackResourceSingleView,
      goForwardResourceSingleView,
      goToResourceSingleView,
      openResourceSingleView,
      registerResourceSingleViewBase,
      stack,
    }),
    [
      clearResourceSingleViewBase,
      goBackResourceSingleView,
      goForwardResourceSingleView,
      goToResourceSingleView,
      openResourceSingleView,
      registerResourceSingleViewBase,
      stack,
    ]
  )

  return (
    <ResourceSingleViewContextProvider value={value}>
      {children}
      <ResourceSingleView />
    </ResourceSingleViewContextProvider>
  )
}

ResourceSingleViewHost.propTypes = {
  children: PropTypes.node,
}

/**
 * Adds the resource single view API and renderer to a component.
 *
 * @param {Component} Component - Component to wrap
 * @returns {Component} Wrapped component
 */
export const withResourceSingleView = (Component) => {
  /**
   * Wrapped component with resource single view support.
   *
   * @param {object} props - Component props
   * @returns {Component} Component with resource single view drawer
   */
  const WithResourceSingleView = (props) => {
    const resourceSingleView = useResourceSingleView()
    const { ResourceSingleView } = resourceSingleView

    return (
      <>
        <Component {...props} {...resourceSingleView} />
        <ResourceSingleView />
      </>
    )
  }

  WithResourceSingleView.displayName = `withResourceSingleView(${
    Component.displayName || Component.name || 'Component'
  })`

  return WithResourceSingleView
}
