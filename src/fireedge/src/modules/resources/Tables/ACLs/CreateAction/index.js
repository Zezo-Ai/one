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
import { ReactElement, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Page, Code } from 'iconoir-react'
import { CreateTypeDialog } from '@ComponentsV2Module'
import { T, PATH } from '@ConstantsModule'
import { Tr } from '@modules/resources/HOC'

const ACL_CREATE_TYPES = {
  NORMAL: 'NORMAL',
  STRING: 'STRING',
}

const ACL_CREATE_OPTIONS = [
  {
    value: ACL_CREATE_TYPES.NORMAL,
    dataCy: 'acl-create-normal',
    icon: Page,
    title: T['acls.create.normal.title'],
    subtitle: T['acls.create.normal.subtitle'],
  },
  {
    value: ACL_CREATE_TYPES.STRING,
    dataCy: 'acl-create-string',
    icon: Code,
    title: T['acls.create.string.title'],
    subtitle: T['acls.create.string.subtitle'],
  },
]

/**
 * ACL create type selector.
 *
 * @returns {ReactElement} ACL create action selector
 */
const CreateAction = () => {
  const history = useHistory()
  const [selectedType, setSelectedType] = useState(ACL_CREATE_TYPES.NORMAL)

  const handleCancel = () => history.push(PATH.SYSTEM.ACLS.LIST)

  const handleContinue = () => {
    history.push(
      PATH.SYSTEM.ACLS.CREATE,
      selectedType === ACL_CREATE_TYPES.STRING
    )
  }

  return (
    <CreateTypeDialog
      title={Tr(T['acls.create.selection.title'])}
      subtitle={Tr(T['acls.create.selection.subtitle'])}
      options={ACL_CREATE_OPTIONS.map(({ title, subtitle, ...option }) => ({
        ...option,
        title: Tr(title),
        subtitle: Tr(subtitle),
      }))}
      selectedValue={selectedType}
      onChange={setSelectedType}
      onCancel={handleCancel}
      onConfirm={handleContinue}
      cancelLabel={Tr(T.Cancel)}
      confirmLabel={Tr(T.Continue)}
    />
  )
}

export { CreateAction }
