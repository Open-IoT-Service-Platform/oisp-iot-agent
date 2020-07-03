# Copyright (c) 2020, Intel Corporation
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
#    * Redistributions of source code must retain the above copyright notice,
#      this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above copyright
#      notice, this list of conditions and the following disclaimer in the
#      documentation and/or other materials provided with the distribution.
#    * Neither the name of Intel Corporation nor the names of its contributors
#      may be used to endorse or promote products derived from this software
#      without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""Methods for OISP Activation Code Generation for Onboarding IOT Devices."""

import os
import sys
import getpass
# pylint: disable=W0611
# We need readline for editing input values in commandline.
import readline
import oisp
import yaml


def oisp_activation_code_generator(oisp_url):
    """Generates Activation Code"""
    try:
        client = oisp.Client(oisp_url)
        client.auth(username, password)
        accounts = client.get_accounts()
        index = 0
        account = None
        if len(accounts) > 1:
            print("Please choose one from below"
                  + " OISP account options")
            for acc in accounts:
                print(acc)

            index = int(input("Enter 0 for first account ID,"
                              + " 1 for second Account ID: "))
            account = accounts[index]
        else:
            account = accounts[index]

        activation_code = account.get_activation_code()
        open("./activation-code", "w").write(activation_code)
    # Authentication Failure
    except Exception:
        print("Please generate activation-code again either"
              + " UserName or Password seems to be incorrect!")
        # This forces to generate token, in case of failure.
        if os.path.isfile("activation-code"):
            os.remove("./activation-code")
        sys.exit(1)


if __name__ == "__main__":
    try:
        DEPLOYMENT_FILE = "app_config.yaml"
        APP_CONFIG_PARAMS = ""
        with open(DEPLOYMENT_FILE, 'r') as file_instance:
            APP_CONFIG_PARAMS = yaml.safe_load(file_instance)
        oisp_instance = APP_CONFIG_PARAMS['BASE_OISP_INSTANCE'] + \
            '/' + APP_CONFIG_PARAMS['API_VERSION']
        if sys.stdin.isatty():
            print("Enter OISP User Credentials")
            username = input("Username: ")
            password = getpass.getpass("Password: ")
        else:
            username = sys.stdin.readline().rstrip()
            password = sys.stdin.readline().rstrip()

        # Activation Code Generator
        oisp_activation_code_generator(oisp_instance)
    except FileNotFoundError:
        print("File does not exist")
        # This forces to generate token, in case of failure.
        if os.path.isfile("activation-code"):
            os.remove("./activation-code")
        sys.exit(1)
    except IOError:
        print("File not accessible")
        # This forces to generate token, in case of failure.
        if os.path.isfile("activation-code"):
            os.remove("./activation-code")
        sys.exit(1)
