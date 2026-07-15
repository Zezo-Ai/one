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
import { ObjectSchema } from 'yup'

import { getObjectSchemaFromFields } from '@UtilsModule'
import { createFieldsFromUserInputs } from '@modules/resources/Forms/UserInputs'
import { Field, UserInputObject } from '@ConstantsModule'

const USER_INPUT_GRID = { md: 12 }

/**
 * @param {UserInputObject[]} userInputs - User inputs
 * @param {object} userInputsLayout - User input layout
 * @returns {Field[]} User inputs in Field format
 */
const FIELDS = (userInputs = [], userInputsLayout) =>
  createFieldsFromUserInputs(userInputs, userInputsLayout).map((field) => ({
    ...field,
    grid: {
      ...field.grid,
      ...USER_INPUT_GRID,
    },
  }))

/**
 * @param {UserInputObject[]} userInputs - User inputs
 * @param {object} userInputsLayout - User input layout
 * @returns {ObjectSchema} User inputs schema
 */
const SCHEMA = (userInputs = [], userInputsLayout) =>
  getObjectSchemaFromFields(FIELDS(userInputs, userInputsLayout))

export { FIELDS, SCHEMA }
