/* ------------------------------------------------------------------------- *
 * Copyright 2002-2022, OpenNebula Project, OpenNebula Systems               *
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

import { ReactElement, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'

import { yupResolver } from '@hookform/resolvers/yup'

import {
  FORM_FIELDS_PIN_POLICY,
  FORM_SCHEMA_PIN_POLICY,
} from 'client/components/Tabs/Host/Numa/UpdatePinPolicy/schema'

import FormWithSchema from 'client/components/Forms/FormWithSchema'

import { useGeneralApi } from 'client/features/General'

import { useUpdateHostMutation } from 'client/features/OneApi/host'

import { T, Host } from 'client/constants'
/**
 * @param {object} props - Props
 * @param {Host} props.host - Host resource
 * @returns {ReactElement} Form for updating pin policy
 */
const UpdatePinPolicyForm = ({ host }) => {
  const { TEMPLATE } = host

  const { enqueueError } = useGeneralApi()
  const [updateUserTemplate] = useUpdateHostMutation()

  const { watch, ...methods } = useForm({
    reValidateMode: 'onSubmit',
    defaultValues: {
      PIN_POLICY: TEMPLATE.PIN_POLICY,
    },
    resolver: yupResolver(FORM_SCHEMA_PIN_POLICY),
  })

  useEffect(() => {
    watch((data) => {
      try {
        updateUserTemplate({
          id: host.ID,
          template: `PIN_POLICY = ${data.PIN_POLICY}`,
          replace: 1,
        })
      } catch {
        enqueueError(T.SomethingWrong)
      }
    })
  }, [watch])

  return (
    <FormProvider {...methods}>
      <FormWithSchema
        cy="numa-pinned-policy"
        fields={FORM_FIELDS_PIN_POLICY}
        legend={T.PinPolicy}
      />
    </FormProvider>
  )
}

UpdatePinPolicyForm.propTypes = {
  host: PropTypes.object.isRequired,
}

UpdatePinPolicyForm.displayName = 'UpdateIsolatedCPUSForm'

export default UpdatePinPolicyForm