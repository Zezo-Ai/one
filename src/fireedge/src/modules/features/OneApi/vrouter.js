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
import { Actions, Commands } from 'server/utils/constants/commands/vrouter'

import { oneApi } from '@modules/features/OneApi/oneApi'
import {
  withProfileLabelsTags,
  withResourceLabels,
} from '@modules/features/OneApi/labels'

import {
  ONE_RESOURCES,
  ONE_RESOURCES_POOL,
} from '@modules/features/OneApi/resources'

import {
  removeLockLevelOnResource,
  updateNameOnResource,
  updateLockLevelOnResource,
  updatePermissionOnResource,
  updateOwnershipOnResource,
  updateTemplateOnResource,
} from '@modules/features/OneApi/common'
import {
  FilterFlag,
  LockLevel,
  Permission,
  RESOURCE_NAMES,
} from '@ConstantsModule'

const { VROUTER } = ONE_RESOURCES
const { VROUTER_POOL } = ONE_RESOURCES_POOL

const normalizeOwnershipParams = ({
  userId,
  groupId,
  user,
  group,
  ...rest
}) => {
  const normalizedUser = userId ?? user
  const normalizedGroup = groupId ?? group

  return {
    ...rest,
    ...(normalizedUser !== undefined && {
      user: normalizedUser,
      userId: normalizedUser,
    }),
    ...(normalizedGroup !== undefined && {
      group: normalizedGroup,
      groupId: normalizedGroup,
    }),
  }
}

const virtualRouterApi = oneApi.injectEndpoints({
  endpoints: (builder) => ({
    getVrs: builder.query({
      /**
       * Retrieves information for all or part of the virtual routers in the pool.
       *
       * @param {object} params - Request params
       * @param {FilterFlag} [params.filter] - Filter flag
       * @param {number} [params.start] - Range start ID
       * @param {number} [params.end] - Range end ID
       * @returns {Array} List of virtual routers
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_POOL_INFO
        const command = { name, ...Commands[name] }

        return { params, command, needStateInMeta: true }
      },
      transformResponse: (data, meta) =>
        withResourceLabels(
          [data?.VROUTER_POOL?.VROUTER ?? []].flat(),
          RESOURCE_NAMES.VROUTER,
          meta
        ),
      providesTags: (vRouters) =>
        withProfileLabelsTags(
          vRouters
            ? [
                ...vRouters.map(({ ID }) => ({ type: VROUTER_POOL, ID })),
                VROUTER_POOL,
              ]
            : [VROUTER_POOL]
        ),
    }),

    getVr: builder.query({
      /**
       * Retrieves information for the virtual router.
       *
       * @param {object} params - Request params
       * @param {string|number} params.id - Virtual router id
       * @param {boolean} [params.decrypt] - Optional flag to decrypt contained secrets, valid only for admin
       * @returns {object} Get virtual router identified by id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_INFO
        const command = { name, ...Commands[name] }

        return { params, command, needStateInMeta: true }
      },
      transformResponse: (data, meta) =>
        withResourceLabels(data?.VROUTER ?? {}, RESOURCE_NAMES.VROUTER, meta),
      providesTags: (_, __, { id }) =>
        withProfileLabelsTags([{ type: VROUTER, id }]),
    }),

    changeVrOwnership: builder.mutation({
      /**
       * Changes the ownership bits of a virtual router.
       * If set to `-1`, the user or group aren't changed.
       *
       * @param {object} params - Request parameters
       * @param {string} params.id - Virtual router id
       * @param {number} params.user - The user id
       * @param {number} params.group - The group id
       * @returns {number} Virtual router id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_CHOWN
        const command = { name, ...Commands[name] }

        return { params: normalizeOwnershipParams(params), command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
      async onQueryStarted(params, { getState, dispatch, queryFulfilled }) {
        try {
          const normalizedParams = normalizeOwnershipParams(params)
          const patchVr = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVr',
              { id: params.id },
              updateOwnershipOnResource(getState(), normalizedParams)
            )
          )

          const patchVrs = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVrs',
              undefined,
              updateOwnershipOnResource(getState(), normalizedParams)
            )
          )

          queryFulfilled.catch(() => {
            patchVr.undo()
            patchVrs.undo()
          })
        } catch {}
      },
    }),

    changeVrPermissions: builder.mutation({
      /**
       * Changes the permission bits of a virtual router.
       * If set any permission to -1, it's not changed.
       *
       * @param {object} params - Request parameters
       * @param {string} params.id - Virtual router id
       * @param {Permission|'-1'} params.ownerUse - User use
       * @param {Permission|'-1'} params.ownerManage - User manage
       * @param {Permission|'-1'} params.ownerAdmin - User administrator
       * @param {Permission|'-1'} params.groupUse - Group use
       * @param {Permission|'-1'} params.groupManage - Group manage
       * @param {Permission|'-1'} params.groupAdmin - Group administrator
       * @param {Permission|'-1'} params.otherUse - Other use
       * @param {Permission|'-1'} params.otherManage - Other manage
       * @param {Permission|'-1'} params.otherAdmin - Other administrator
       * @returns {number} Virtual router id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_CHMOD
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const patchVr = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVr',
              { id: params.id },
              updatePermissionOnResource(params)
            )
          )

          const patchVrs = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVrs',
              undefined,
              updatePermissionOnResource(params)
            )
          )

          queryFulfilled.catch(() => {
            patchVr.undo()
            patchVrs.undo()
          })
        } catch {}
      },
    }),

    renameVr: builder.mutation({
      /**
       * Renames a VM template.
       *
       * @param {object} params - Request parameters
       * @param {string|number} params.id - VR id
       * @param {string} params.name - The new name
       * @returns {number} VR id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_RENAME
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const patchVR = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVr',
              { id: params.id },
              updateNameOnResource(params)
            )
          )

          const patchVRs = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVrs',
              undefined,
              updateNameOnResource(params)
            )
          )

          queryFulfilled.catch(() => {
            patchVR.undo()
            patchVRs.undo()
          })
        } catch {}
      },
    }),

    updateVr: builder.mutation({
      /**
       * Replaces the template contents in a vrouter.
       *
       * @param {object} params - Request params
       * @param {number|string} params.id - Vr id
       * @param {string} params.template - The new template contents
       * @param {0|1} params.replace
       * - Update type:
       * ``0``: Replace the whole template.
       * ``1``: Merge new template with the existing one.
       * @returns {number} Template id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_UPDATE
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const patchVr = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVr',
              { id: params.id },
              updateTemplateOnResource(params)
            )
          )

          const patchVrs = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVrs',
              undefined,
              updateTemplateOnResource(params)
            )
          )

          queryFulfilled.catch(() => {
            patchVr.undo()
            patchVrs.undo()
          })
        } catch {}
      },
    }),

    lockVr: builder.mutation({
      /**
       * Locks a virtual router.
       *
       * @param {object} params - Request parameters
       * @param {string|number} params.id - Virtual router id
       * @param {LockLevel} params.lock - Lock level
       * @returns {number} Virtual router id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_LOCK
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const patchVr = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVr',
              { id: params.id },
              updateLockLevelOnResource(params)
            )
          )

          const patchVrs = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVrs',
              undefined,
              updateLockLevelOnResource(params)
            )
          )

          queryFulfilled.catch(() => {
            patchVr.undo()
            patchVrs.undo()
          })
        } catch {}
      },
    }),

    unlockVr: builder.mutation({
      /**
       * Unlocks a virtual router.
       *
       * @param {object} params - Request parameters
       * @param {string|number} params.id - Virtual router id
       * @returns {number} Virtual router id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_UNLOCK
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const patchVr = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVr',
              { id: params.id },
              removeLockLevelOnResource(params)
            )
          )

          const patchVrs = dispatch(
            virtualRouterApi.util.updateQueryData(
              'getVrs',
              undefined,
              removeLockLevelOnResource(params)
            )
          )

          queryFulfilled.catch(() => {
            patchVr.undo()
            patchVrs.undo()
          })
        } catch {}
      },
    }),

    attachNicVr: builder.mutation({
      /**
       * Attaches a NIC to a virtual router and its VMs.
       *
       * @param {object} params - Request params
       * @param {number|string} params.id - Virtual router id
       * @param {string} params.template - NIC template in XML format
       * @returns {number} Virtual router id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_NIC_ATTACH
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
    }),

    detachNicVr: builder.mutation({
      /**
       * Detaches a NIC from a virtual router and its VMs.
       *
       * @param {object} params - Request params
       * @param {number|string} params.id - Virtual router id
       * @param {number|string} params.nic - NIC id
       * @returns {number} Virtual router id
       * @throws Fails when response isn't code 200
       */
      query: (params) => {
        const name = Actions.VROUTER_NIC_DETACH
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: (_, __, { id }) => [{ type: VROUTER, id }, VROUTER_POOL],
    }),

    deleteVr: builder.mutation({
      query: (params) => {
        const name = Actions.VROUTER_DELETE
        const command = { name, ...Commands[name] }

        return { params, command }
      },
      invalidatesTags: [VROUTER_POOL],
    }),
  }),
})

const vrouterQueries = (({
  // Queries
  useGetVrQuery,
  useLazyGetVrQuery,
  useGetVrsQuery,
  useLazyGetVrsQuery,
  useDeleteVrMutation,
  useChangeVrOwnershipMutation,
  useChangeVrPermissionsMutation,
  useRenameVrMutation,
  useUpdateVrMutation,
  useLockVrMutation,
  useUnlockVrMutation,
  useAttachNicVrMutation,
  useDetachNicVrMutation,
}) => ({
  // Queries
  useGetVrQuery,
  useLazyGetVrQuery,
  useGetVrsQuery,
  useLazyGetVrsQuery,
  useDeleteVrMutation,
  useChangeVrOwnershipMutation,
  useChangeVrPermissionsMutation,
  useRenameVrMutation,
  useUpdateVrMutation,
  useLockVrMutation,
  useUnlockVrMutation,
  useAttachNicVrMutation,
  useDetachNicVrMutation,
}))(virtualRouterApi)

export default vrouterQueries
