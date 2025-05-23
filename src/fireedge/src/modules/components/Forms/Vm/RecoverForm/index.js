/* ------------------------------------------------------------------------- *
 * Copyright 2002-2025, OpenNebula Project, OpenNebula Systems               *
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
import { Typography } from '@mui/material'

import { SCHEMA, FIELDS } from '@modules/components/Forms/Vm/RecoverForm/schema'
import { Translate } from '@modules/components/HOC'
import { createForm } from '@UtilsModule'
import { T } from '@ConstantsModule'

const RecoverForm = createForm(SCHEMA, FIELDS, {
  description: (
    <Typography variant="subtitle1" p="1rem">
      <Translate word={T.RecoverDescription} />
    </Typography>
  ),
})

export default RecoverForm
