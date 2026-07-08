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
import { memo } from 'react'
import PropTypes from 'prop-types'

import { Trash, UndoAction } from 'iconoir-react'

import { ImageAPI, useModalsApi } from '@FeaturesModule'

import { Tr, Translate } from '@modules/resources/HOC'
import { T, IMAGE_ACTIONS } from '@ConstantsModule'

import { SubmitButton } from '@ComponentsV2Module'

const SnapshotFlattenAction = memo(({ id, snapshot }) => {
  const { showModal } = useModalsApi()

  const [flattenImageSnapshot] = ImageAPI.useFlattenImageSnapshotMutation()
  const { ID, NAME = T.Snapshot } = snapshot

  const handleDelete = async () => {
    await flattenImageSnapshot({ id, snapshot: ID })
  }

  const handleOpenForm = () =>
    showModal({
      isConfirmDialog: true,

      dialogProps: {
        title: (
          <Translate word={T.FlattenSnapshot} values={`#${ID} - ${NAME}`} />
        ),
        children: (
          <>
            <p>{Tr(T.DeleteOtherSnapshots)}</p>
            <p>{Tr(T.DoYouWantProceed)}</p>
          </>
        ),
      },

      onSubmit: handleDelete,
    })

  return (
    <SubmitButton
      data-cy={IMAGE_ACTIONS.SNAPSHOT_FLATTEN}
      tooltip={Tr(T.Flatten)}
      label={Tr(T.Flatten)}
      onClick={handleOpenForm}
    />
  )
})

const SnapshotRevertAction = memo(({ id, snapshot }) => {
  const { showModal } = useModalsApi()

  const [revertImageSnapshot] = ImageAPI.useRevertImageSnapshotMutation()
  const { ID, NAME = T.Snapshot } = snapshot
  const handleRevert = async () => {
    await revertImageSnapshot({ id, snapshot: ID })
  }

  const handleOpenForm = () =>
    showModal({
      isConfirmDialog: true,

      dialogProps: {
        title: (
          <Translate word={T.RevertSomething} values={`#${ID} - ${NAME}`} />
        ),
        children: <p>{Tr(T.DoYouWantProceed)}</p>,
      },

      onSubmit: handleRevert,
    })

  return (
    <SubmitButton
      data-cy={IMAGE_ACTIONS.SNAPSHOT_REVERT}
      iconOnly={<UndoAction />}
      tooltip={Tr(T.Revert)}
      onClick={handleOpenForm}
    />
  )
})

const SnapshotDeleteAction = memo(({ id, snapshot }) => {
  const { showModal } = useModalsApi()

  const [deleteImageSnapshot] = ImageAPI.useDeleteImageSnapshotMutation()
  const { ID, NAME = T.Snapshot } = snapshot

  const handleDelete = async () => {
    await deleteImageSnapshot({ id, snapshot: ID })
  }

  const handleOpenForm = () =>
    showModal({
      isConfirmDialog: true,

      dialogProps: {
        title: (
          <Translate word={T.DeleteSomething} values={`#${ID} - ${NAME}`} />
        ),
        children: <p>{Tr(T.DoYouWantProceed)}</p>,
      },

      onSubmit: handleDelete,
    })

  return (
    <SubmitButton
      data-cy={IMAGE_ACTIONS.SNAPSHOT_DELETE}
      iconOnly={<Trash />}
      tooltip={Tr(T.Delete)}
      onClick={handleOpenForm}
    />
  )
})

const ActionPropTypes = {
  id: PropTypes.string,
  snapshot: PropTypes.object,
}

SnapshotFlattenAction.propTypes = ActionPropTypes
SnapshotFlattenAction.displayName = 'SnapshotFlattenAction'

SnapshotRevertAction.propTypes = ActionPropTypes
SnapshotRevertAction.displayName = 'SnapshotRevertAction'

SnapshotDeleteAction.propTypes = ActionPropTypes
SnapshotDeleteAction.displayName = 'SnapshotDeleteAction'

export { SnapshotFlattenAction, SnapshotDeleteAction, SnapshotRevertAction }
