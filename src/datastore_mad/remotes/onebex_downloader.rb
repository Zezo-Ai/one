#!/usr/bin/env ruby

# -------------------------------------------------------------------------- #
# Copyright 2002-2026, OpenNebula Project, OpenNebula Systems                #
#                                                                            #
# Licensed under the Apache License, Version 2.0 (the "License"); you may    #
# not use this file except in compliance with the License. You may obtain    #
# a copy of the License at                                                   #
#                                                                            #
# http://www.apache.org/licenses/LICENSE-2.0                                 #
#                                                                            #
# Unless required by applicable law or agreed to in writing, software        #
# distributed under the License is distributed on an "AS IS" BASIS,          #
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   #
# See the License for the specific language governing permissions and        #
# limitations under the License.                                             #
#--------------------------------------------------------------------------- #

ONE_LOCATION = ENV['ONE_LOCATION'] unless defined?(ONE_LOCATION)

if !ONE_LOCATION
    RUBY_LIB_LOCATION ||= '/usr/lib/one/ruby'
    GEMS_LOCATION     ||= '/usr/share/one/gems'
    VAR_LOCATION      ||= '/var/lib/one'
else
    RUBY_LIB_LOCATION ||= ONE_LOCATION + '/lib/ruby'
    GEMS_LOCATION     ||= ONE_LOCATION + '/share/gems'
    VAR_LOCATION      ||= ONE_LOCATION + '/var'
end

# %%RUBYGEMS_SETUP_BEGIN%%
require 'load_opennebula_paths'
# %%RUBYGEMS_SETUP_END%%

$LOAD_PATH << RUBY_LIB_LOCATION
$LOAD_PATH << File.dirname(__FILE__)

require 'shellwords'
require 'tempfile'
require 'tmpdir'

# onebex://DST_DS_ID:PORT
onebex_url = ARGV[0]
to         = ARGV[1]
tmp_to_file = nil
tmp_qcow2_file = nil

begin
    if to.nil? || to.empty?
        raise StandardError, 'Missing destination path for OneBEX writer'
    end

    proto, url = onebex_url.split(%r{://}, 2)

    unless proto == 'onebex' && url
        raise StandardError, "Invalid OneBEX URL: #{onebex_url}"
    end

    _ds, port_s = url.split(':', 2)

    port    = Integer(port_s, 10)
    baddr   = ENV.fetch('ONE_BEX_WRITER_ADDR', '0.0.0.0')
    writer  = File.expand_path('onebex_writer.rb', __dir__)

    tmp_dir = to == '-' ? Dir.tmpdir : File.dirname(File.expand_path(to))

    tmp_to_file = Tempfile.create(['onebex-', '.img'], tmp_dir)
    tmp_to      = tmp_to_file.path

    command = [
        writer,
        baddr,
        port.to_s,
        tmp_to
    ].shelljoin

    tmp_to_s = Shellwords.escape(tmp_to)

    if to == '-'
        tmp_qcow2_file = Tempfile.create(['onebex-qcow2-', '.img'], tmp_dir)
        tmp_qcow2      = tmp_qcow2_file.path
        tmp_qcow2_s    = Shellwords.escape(tmp_qcow2)

        raw_command = 'qemu-img convert -f raw -O qcow2 ' \
                      "#{tmp_to_s} #{tmp_qcow2_s} && " \
                      "dd if=#{tmp_qcow2_s} bs=64K status=none && " \
                      "rm -f #{tmp_to_s} #{tmp_qcow2_s}"

        qcow2_command = "dd if=#{tmp_to_s} bs=64K status=none && " \
                        "rm -f #{tmp_to_s} #{tmp_qcow2_s}"

        unsupported_command = "rm -f #{tmp_to_s} #{tmp_qcow2_s}; " \
                              'echo "Unsupported OneBEX image format: $fmt" >&2; ' \
                              'exit 1'
    else
        to_s = Shellwords.escape(to)

        raw_command = "rm -f #{to_s} && " \
                      'qemu-img convert -f raw -O qcow2 ' \
                      "#{tmp_to_s} #{to_s} && " \
                      "rm -f #{tmp_to_s}"

        qcow2_command = "mv #{tmp_to_s} #{to_s}"

        unsupported_command = 'echo "Unsupported OneBEX image format: $fmt" >&2; ' \
                              'exit 1'
    end

    clean_command = [
        'sh',
        '-c',
        "fmt=$(qemu-img info #{tmp_to_s} 2>/dev/null | " \
        "grep -Po '(?<=^file format: )\\w+' || :); " \
        'if [ "$fmt" = raw ]; then ' \
        "#{raw_command}; " \
        'elif [ "$fmt" = qcow2 ]; then ' \
        "#{qcow2_command}; " \
        'else ' \
        "#{unsupported_command}; " \
        'fi'
    ].shelljoin

    puts "command=#{Shellwords.escape(command)}"
    puts "clean_command=#{Shellwords.escape(clean_command)}"
rescue StandardError => e
    STDERR.puts e.message
    exit(-1)
ensure
    tmp_to_file.close if tmp_to_file
    tmp_qcow2_file.close if tmp_qcow2_file
end
