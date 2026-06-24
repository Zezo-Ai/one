/* -------------------------------------------------------------------------- */
/* Copyright 2002-2026, OpenNebula Project, OpenNebula Systems                */
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

#include "GroupVlans.h"
#include "Nebula.h"
#include "NebulaUtil.h"
#include "ObjectXML.h"

using namespace std;

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

GroupVlans::VlanRule::Scope GroupVlans::VlanRule::str_to_scope(string& str_scope)
{
    GroupVlans::VlanRule::Scope scope = UNDEFINED;

    one_util::toupper(str_scope);

    if (str_scope == "VLAN_ID")
    {
        scope = VLAN_ID;
    }
    else if (str_scope == "OUTER_VLAN_ID")
    {
        scope = OUTER_VLAN_ID;
    }
    else if (str_scope == "CVLAN")
    {
        scope = CVLAN;
    }
    else if (str_scope == "VLAN_TAGGED_ID")
    {
        scope = VLAN_TAGGED_ID;
    }
    else if (str_scope == "ANY")
    {
        scope = ANY;
    }

    return scope;
}

/* -------------------------------------------------------------------------- */

bool GroupVlans::VlanRule::parse_range(const string&           range_s,
                                       vector<pair<int, int>>& ranges,
                                       string&                 error_str)
{
    ranges.clear();

    if (range_s.empty())
    {
        error_str = "Empty range specification.";
        return false;
    }

    constexpr auto range_pattern =
            "^[[:digit:]]+(-[[:digit:]]+)?(,[[:digit:]]+(-[[:digit:]]+)?)*$";

    if (one_util::regex_match(range_pattern, range_s.c_str()) != 0)
    {
        error_str = "Invalid range specification.";
        return false;
    }

    const auto range_rules = one_util::split(range_s, ',');

    for (const auto& range_rule : range_rules)
    {
        int start, end;

        if (range_rule.find('-') != string::npos)
        {
            const auto range = one_util::split(range_rule, '-');

            if (!one_util::str_cast(range[0], start) ||
                !one_util::str_cast(range[1], end))
            {
                error_str = "Invalid range specification.";
                return false;
            }

            if (start > end)
            {
                ranges.emplace_back(end, start);
            }
            else
            {
                ranges.emplace_back(start, end);
            }
        }
        else
        {
            if (!one_util::str_cast(range_rule, start))
            {
                error_str = "Invalid range specification.";
                return false;
            }

            ranges.emplace_back(start, start);
        }
    }

    return true;
}

/* -------------------------------------------------------------------------- */

bool GroupVlans::VlanRule::parse_range(const VectorAttribute* rule,
                                       const string&           attr,
                                       vector<pair<int, int>>& ranges,
                                       string&                 error_str)
{
    const string& range_s = rule->vector_value(attr);

    if (range_s.empty())
    {
        error_str = "Missing " + attr + " in rule.";
        return false;
    }

    if (!parse_range(range_s, ranges, error_str))
    {
        error_str = "Invalid " + attr + " specification.";
        return false;
    }

    return true;
}

/* -------------------------------------------------------------------------- */

bool GroupVlans::VlanRule::build_rule(const VectorAttribute * rule, string& estr)
{
    _scope = UNDEFINED;

    _ranges.clear();
    _vntemplates.clear();

    if (!parse_range(rule, "ID", _ranges, estr))
    {
        return false;
    }

    string scope_str = rule->vector_value("SCOPE");

    _scope = str_to_scope(scope_str);

    if ( _scope == UNDEFINED )
    {
        estr = "Wrong SCOPE in rule.";
        return false;
    }

    string vntemplate = rule->vector_value("VNTEMPLATE");

    if (vntemplate.empty() || vntemplate == "-1")
    {
        return true;
    }

    if (!parse_range(rule, "VNTEMPLATE", _vntemplates, estr))
    {
        return false;
    }

    return true;
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

string& GroupVlans::to_xml(string& xml) const
{
    return vlan_template.to_xml(xml);
}

/* -------------------------------------------------------------------------- */

int GroupVlans::from_xml(const string& xml)
{
    int rc = vlan_template.from_xml(xml);

    if (rc != 0)
    {
        _rules.clear();
        return rc;
    }

    vlan_template.replace("ID", oid);

    string error_str;

    if (!build_rules(error_str))
    {
        return -1;
    }

    return 0;
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

int GroupVlans::select(SqlDB * db)
{
    ostringstream   oss;
    int             rc;

    set_callback(static_cast<Callbackable::Callback>(&GroupVlans::select_cb));

    oss << "SELECT body FROM " << one_db::group_vlans_db_table
        << " WHERE " << one_db::group_vlans_db_oid_column << " = " << oid;

    rc = db->exec_rd(oss, this);

    unset_callback();

    return rc;
}

/* -------------------------------------------------------------------------- */

int GroupVlans::select_cb(void *nil, int num, char **values, char **names)
{
    if ( (!values[0]) || (num != 1) )
    {
        return -1;
    }

    return from_xml(values[0]);
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

int GroupVlans::insert_replace(SqlDB *db, bool replace, string& error_str)
{
    ostringstream   oss;

    int    rc;
    string xml_vlans;
    char * sql_vlans_xml;

    vlan_template.replace("ID", oid);

    sql_vlans_xml = db->escape_str(to_xml(xml_vlans));

    if ( sql_vlans_xml == 0 )
    {
        error_str = "Error transforming the VLAN rules to XML.";
        return -1;
    }

    if ( ObjectXML::validate_xml(sql_vlans_xml) != 0 )
    {
        db->free_str(sql_vlans_xml);
        error_str = "Error transforming the VLAN rules to XML (invalid XML).";
        return -1;
    }

    if(replace)
    {
        oss << "REPLACE";
    }
    else
    {
        oss << "INSERT";
    }

    oss << " INTO " << one_db::group_vlans_db_table
        << " (" << one_db::group_vlans_db_names <<") VALUES ("
        << oid  << ","
        << "'"  <<   sql_vlans_xml   << "')";

    rc = db->exec_wr(oss);

    db->free_str(sql_vlans_xml);

    return rc;
}

/* -------------------------------------------------------------------------- */

int GroupVlans::drop(SqlDB *db)
{
    ostringstream oss;

    oss << "DELETE FROM " << one_db::group_vlans_db_table
        << " WHERE " << one_db::group_vlans_db_oid_column << " = " << oid;

    return db->exec_wr(oss);
}

/* -------------------------------------------------------------------------- */

int GroupVlans::set(Template *tmpl, string& error)
{
    GroupVlans group_vlans;

    group_vlans.vlan_template.merge(tmpl);

    if (!group_vlans.build_rules(error))
    {
        return -1;
    }

    vlan_template = std::move(group_vlans.vlan_template);
    _rules        = std::move(group_vlans._rules);

    vlan_template.replace("ID", oid);

    return 0;
}

/* -------------------------------------------------------------------------- */

bool GroupVlans::build_rules(string& error_str)
{
    vector<VectorAttribute*> vrules;

    _rules.clear();

    vlan_template.get("RULE", vrules);

    for (auto r : vrules)
    {
        VlanRule vlan_rule;

        if (!vlan_rule.build_rule(r, error_str))
        {
            _rules.clear();
            return false;
        }

        r->replace("SCOPE", VlanRule::scope_to_str(vlan_rule.scope()));

        if (vlan_rule.vntemplates().empty())
        {
            r->replace("VNTEMPLATE", "-1");
        }

        r->remove("TYPE");
        r->remove("TARGET_ID");

        _rules.push_back(std::move(vlan_rule));
    }

    return true;
}

/* -------------------------------------------------------------------------- */

bool GroupVlans::check(VlanRule::Scope vlan_scope,
                       const string& value,
                       int vntemplate_id,
                       string& error_str) const
{
    vector<pair<int, int>> test_ranges;

    error_str.clear();

    switch (vlan_scope)
    {
        case VlanRule::VLAN_ID:
        case VlanRule::OUTER_VLAN_ID:
        {
            int vlan;

            if (value.empty() ||
                one_util::regex_match("^[[:digit:]]+$", value.c_str()) != 0 ||
                !one_util::str_cast(value, vlan))
            {
                error_str = "Invalid " + VlanRule::scope_to_str(vlan_scope) +
                            " specification.";
                return false;
            }

            test_ranges.emplace_back(vlan, vlan);

            break;
        }
        case VlanRule::CVLAN:
        case VlanRule::VLAN_TAGGED_ID:
        {
            if (!VlanRule::parse_range(value, test_ranges, error_str))
            {
                error_str = "Invalid " + VlanRule::scope_to_str(vlan_scope) +
                            " specification.";
                return false;
            }

            break;
        }
        default:
            return false;
    }

    for (const auto& rule : _rules)
    {
        if (test_ranges.empty())
        {
            break;
        }

        if (rule.scope() != vlan_scope && rule.scope() != VlanRule::ANY)
        {
            continue;
        }

        bool vntemplate_match = rule.vntemplates().empty();

        for (const auto& vntemplate : rule.vntemplates())
        {
            if (vntemplate_id >= vntemplate.first &&
                vntemplate_id <= vntemplate.second)
            {
                vntemplate_match = true;
                break;
            }
        }

        if (!vntemplate_match)
        {
            continue;
        }

        auto test_range = test_ranges.begin();

        while (test_range != test_ranges.end())
        {
            bool range_match = false;

            for (const auto& rule_range : rule.ranges())
            {
                if (test_range->first >= rule_range.first &&
                    test_range->second <= rule_range.second)
                {
                    range_match = true;
                    break;
                }
            }

            if (range_match)
            {
                test_range = test_ranges.erase(test_range);
            }
            else
            {
                ++test_range;
            }
        }
    }

    return test_ranges.empty();
}

/* -------------------------------------------------------------------------- */

bool GroupVlans::has_vntemplate_rules(int vntemplate_id) const
{
    for (const auto& rule : _rules)
    {
        if (rule.vntemplates().empty())
        {
            return true;
        }

        for (const auto& vntemplate : rule.vntemplates())
        {
            if (vntemplate_id >= vntemplate.first &&
                vntemplate_id <= vntemplate.second)
            {
                return true;
            }
        }
    }

    return false;
}
