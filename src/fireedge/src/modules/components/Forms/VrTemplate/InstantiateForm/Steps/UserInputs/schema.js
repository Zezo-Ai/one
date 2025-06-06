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
import { ObjectSchema } from 'yup'

import { getObjectSchemaFromFields } from '@UtilsModule'
import { createFieldsFromUserInputs } from '@modules/components/Forms/UserInputs'
import { Field, UserInputObject } from '@ConstantsModule'

/**
 * @param {UserInputObject[]} userInputs - User inputs
 * @returns {Field[]} User inputs in Field format
 */
const FIELDS = (userInputs = []) => createFieldsFromUserInputs(userInputs)

/**
 * @param {UserInputObject[]} userInputs - User inputs
 * @returns {ObjectSchema} User inputs schema
 */
const SCHEMA = (userInputs = []) =>
  getObjectSchemaFromFields(FIELDS(userInputs))

export { FIELDS, SCHEMA }
