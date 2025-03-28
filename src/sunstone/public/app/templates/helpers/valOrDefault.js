/* -------------------------------------------------------------------------- */
/* Copyright 2002-2025, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define(function(require) {
  var Handlebars = require('hbs/handlebars');
  var Locale = require('utils/locale');
  var templateUtils = require("utils/template-utils");

  var valOrDefault = function(value, defaultValue, options) {
    var out;

    if (value == undefined || ($.isPlainObject(value) && $.isEmptyObject(value))){
        out = defaultValue;
    } else {
        out = templateUtils.removeHTMLTags(value);
    }

    return new Handlebars.SafeString(out);
  };

  Handlebars.registerHelper('valOrDefault', valOrDefault);
  return valOrDefault;
})
