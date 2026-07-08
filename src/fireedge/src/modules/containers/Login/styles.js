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
import { css } from '@emotion/css'

export const styles = (theme) => ({
  container: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    columnGap: theme.spacing(4),
    alignItems: 'start',
    paddingInline: theme.spacing(3),
    minHeight: '100vh',
  }),

  login: css({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    backgroundColor: 'transparent',
    overflow: 'visible',
    marginTop: theme.spacing(34),
    width: '100%',
  }),

  loginUser: css({
    gridColumn: '5 / span 4',
  }),

  loginQr: css({
    gridColumn: '3 / span 9',
  }),

  login2fa: css({
    gridColumn: '5 / span 4',
  }),

  loginTitle: css({
    width: '100%',
    color: theme.palette.text.headings,
    textAlign: 'center',
    lineHeight: {
      xs: theme.lineHeight.heading.h5.mobile,
      sm: theme.lineHeight.heading.h5.tablet,
      md: theme.lineHeight.heading.h5.desktop,
    },
  }),
})
