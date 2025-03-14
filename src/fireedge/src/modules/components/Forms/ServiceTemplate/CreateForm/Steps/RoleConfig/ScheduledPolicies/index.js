/* ------------------------------------------------------------------------- *
 * Copyright 2002-2024, OpenNebula Project, OpenNebula Systems               *
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
import PropTypes from 'prop-types'
import { Component, useMemo } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  useFormContext,
  useForm,
  useFieldArray,
  FormProvider,
} from 'react-hook-form'
import {
  createScheduledPolicyFields,
  createScheduledPoliciesSchema,
  SCHED_TYPES,
} from '@modules/components/Forms/ServiceTemplate/CreateForm/Steps/RoleConfig/ScheduledPolicies/schema'
import { FormWithSchema } from '@modules/components/Forms'
import { Translate, Tr } from '@modules/components/HOC'
import { DeleteCircledOutline, AddCircledOutline } from 'iconoir-react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import SubmitButton from '@modules/components/FormControl/SubmitButton'
import { T } from '@ConstantsModule'

export const SECTION_ID = 'SCHEDULEDPOLICIES'

/**
 * @param {object} root0 - props
 * @param {string} root0.stepId - Main step ID
 * @param {number} root0.selectedRoleIndex - Active role index
 * @returns {Component} - component
 */
const ScheduledPoliciesSection = ({ stepId, selectedRoleIndex }) => {
  const { palette } = useTheme()
  const fields = createScheduledPolicyFields()
  const schema = createScheduledPoliciesSchema()
  const { getValues } = useFormContext()

  const { append, remove } = useFieldArray({
    name: useMemo(
      () => `${stepId}.${SECTION_ID}.${selectedRoleIndex}`,
      [stepId, selectedRoleIndex]
    ),
  })

  const methods = useForm({
    defaultValues: schema.default(),
    resolver: yupResolver(schema),
  })

  const onSubmit = async (newPolicy) => {
    const isValid = await methods.trigger(`${stepId}.${SECTION_ID}`)
    if (isValid) {
      append(newPolicy)
      methods.reset()
    }
  }

  const currentPolicies =
    getValues(`${stepId}.${SECTION_ID}.${selectedRoleIndex}`) ?? []

  if (fields.length === 0) {
    return null
  }

  return (
    <FormControl
      component="fieldset"
      sx={{ width: '100%', gridColumn: '1 / -1' }}
    >
      <Accordion>
        <AccordionSummary
          aria-controls="panel-content"
          id="panel-header"
          data-cy="roleconfig-scheduledpolicies-accordion"
          sx={{
            backgroundColor: palette?.background?.paper,
            filter: 'brightness(90%)',
          }}
        >
          <Typography variant="body1">{Tr(T.ScheduledPolicies)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormProvider {...methods}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Box
                component="form"
                onSubmit={methods.handleSubmit(onSubmit)}
                sx={{ width: '100%' }}
              >
                <FormWithSchema fields={fields} rootProps={{ sx: { m: 0 } }} />

                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  color="secondary"
                  startIcon={<AddCircledOutline />}
                  data-cy={'roleconfig-scheduledpolicies'}
                  sx={{ width: '100%', mt: 2 }}
                >
                  <Translate word={T.Add} />
                </Button>
              </Box>
            </Box>
            <List>
              {currentPolicies.map(
                (
                  { TIMEFORMAT, SCHEDTYPE, ADJUST, MIN, TIMEEXPRESSION },
                  index
                ) => {
                  const timeFormatTrans = Tr(TIMEFORMAT)

                  const secondaryFields = [
                    TIMEEXPRESSION &&
                      `${Tr(T.TimeExpression)}: ${TIMEEXPRESSION}`,
                    ADJUST && `${Tr(T.Adjust)}: ${ADJUST}`,
                    timeFormatTrans &&
                      `${Tr(T.TimeFormat)}: ${timeFormatTrans}`,
                  ].filter(Boolean)

                  if (MIN !== undefined) {
                    secondaryFields?.push(`${Tr(T.Min)}: ${MIN}`)
                  }

                  return (
                    <Box
                      key={index}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginBottom: '6px',
                      }}
                    >
                      <ListItem
                        secondaryAction={
                          <SubmitButton
                            onClick={() => remove(index)}
                            icon={<DeleteCircledOutline />}
                          />
                        }
                        sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <ListItemText
                          primary={Tr(SCHED_TYPES?.[SCHEDTYPE])}
                          primaryTypographyProps={{ variant: 'body1' }}
                          secondary={secondaryFields.join(' | ')}
                        />
                      </ListItem>
                    </Box>
                  )
                }
              )}
            </List>
          </FormProvider>
        </AccordionDetails>
      </Accordion>
    </FormControl>
  )
}

ScheduledPoliciesSection.propTypes = {
  stepId: PropTypes.string,
  selectedRoleIndex: PropTypes.number,
}

export default ScheduledPoliciesSection
