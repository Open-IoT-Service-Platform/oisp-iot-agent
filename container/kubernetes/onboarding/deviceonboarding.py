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
"""Gateway IOT Device OnBoarding Framework."""

import sys
import os.path
import glob
import argparse
import subprocess
import shutil
import tempfile
from collections import defaultdict
from enum import Enum
from git import Repo
import yaml
NAME_SPACE = None


class CONFIG(Enum):
    """ Enum class for deployment
    and machine config separation.
    """
    DEPLOYMENT = 1
    GATEWAY = 2


class DEPLOYMENTTYPE(Enum):
    """ Enum class for deployment
    type differentiation.
    """
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"


def get_all_subdir_paths(dirpath):
    """Return list of subdirectory paths for a given directory."""
    dirlist = []
    for root, directories, _filename in os.walk(dirpath):
        for dirs in directories:
            dirlist.append(os.path.join(root, dirs))
    return dirlist


def check_deployment_status(deployment):
    """Return application deployment status in a given k8s node."""
    cmd = f"kubectl -n {NAME_SPACE} get deployment {deployment} | wc -l"
    process = subprocess.Popen(
        cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    check_deploy_status = process.communicate()[0].decode('utf-8').strip()

    # Cosmetic extraction of data from subprocess command
    if '\n' in check_deploy_status:
        check_deploy_status = check_deploy_status.splitlines()[1]

    deployment_status = False
    if int(check_deploy_status) > 0:
        deployment_status = True
    return deployment_status


def git_clone_tempdir(git_url, git_dir, git_tag,
                      appname_dir, config_type):
    """Method to checkout git repository based on git_tag
       and copy to application deployment directory.
    """
    # Create temporary dir
    tempdir = tempfile.mkdtemp()
    # Clone into temporary dir
    repo = Repo.clone_from(git_url, tempdir)
    if git_tag:
        repo.head.reset(git_tag, index=True, working_tree=True)
    if config_type == CONFIG.DEPLOYMENT:
        filelist = os.listdir(os.path.join(tempdir, git_dir))
        for filename in filelist:
            shutil.move(os.path.join(tempdir, git_dir, filename),
                        os.path.join(appname_dir, filename))
    elif config_type == CONFIG.GATEWAY:
        dirlist = get_all_subdir_paths(os.path.join(tempdir, git_dir))
        if "gateway" in dirlist[0]:
            dirlist.reverse()
        # We need to copy the dataservice application yaml
        # as generic one to distingush between gatewayapp
        shutil.move(os.path.join(tempdir, git_dir,
                                 dirlist[0], 'application.yaml'),
                    os.path.join(appname_dir,
                                 'fusiondataservice_application.yaml'))
        shutil.move(os.path.join(tempdir, git_dir, dirlist[1],
                                 'application.yaml'),
                    os.path.join(appname_dir, 'application.yaml'))
    # Remove temporary dir
    shutil.rmtree(tempdir)


def get_current_directory():
    """Return current working directory."""
    prog = __file__
    return os.path.dirname(os.path.abspath(prog))


def signal_activationcode():
    """Check activation code expiration status
        and re-generate it, if expired.
    """
    cmd = "find activation-code -mmin -60 | wc -l"
    process = subprocess.Popen(
        cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    check_status = process.communicate()[0].decode('utf-8').strip()
    # Cosmetic extraction of data from subprocess command
    # If "activation-code" file doesn't exists
    if '\n' in check_status:
        check_status = check_status.splitlines()[1]

    if int(check_status) == 0:
        # Check the Status of Activation code sub-process
        # and exit the process incase of failure.
        ret = subprocess.call(['sh', 'environment_setup.sh'])
        if ret != 0:
            sys.exit()


def parsing_device_configdata(deploydata):
    """ Returns multidict list from parsed onboarding
        devices's machine and depployment config's.
    """
    # Parsing gateway*.yaml and creating list of deployment's.
    # Input sample List of Deploymen and Each Deployment is List of
    # Deployment and Machine Config Elements:
    # [{
    # 'ApplicationName': '<DEPLOYMENT_NAME>', 'NodeName': '<K3S_NODE_NAME>',
    # 'ToolVersion': <TOOL_VERSION>,
    # 'DeploymentConfig':
    #  {  'URL': '<DEPLOYMENT_GIT_CONFIG_URL>',
    #    'Directory': '<DEPLOYMENT_CONFIG_GIT_DIRECTORY_NAME>',
    #      'GitTag': '<DEPLOYMENT_GIT_TAG_OR_COMMITID_OR_BRANCH>'
    #  },
    # 'MachineConfig':
    #  { 'URL': '<MACHINE_GIT_CONFIG_URL>',
    #     'Directory': '<MACHINE_CONFIG_GIT_DIRECTORY_NAME>',
    #     'GitTag': '<MACHINE_CONFIG_TAG_OR_COMMITID_OR_BRANCH>'
    #  }
    # },
    # Output of Method ,List of Deployment:
    # [{
    # 'ApplicationName': '<DEPLOYMENT_NAME>', 'NodeName': '<K3S_NODE_NAME>',
    #   'ToolVersion': '<TOOL_VERSION>',
    # 'DeploymentConfigURL':
    #   '<DEPLOYMENT_GIT_CONFIG_URL>',
    # 'DeploymentConfigDirectory': '<DEPLOYMENT_CONFIG_GIT_DIRECTORY_NAME>',
    # 'DeploymentConfigGitTag':
    #   '<DEPLOYMENT_GIT_TAG_OR_COMMITID_OR_BRANCH>',
    # 'MachineConfigURL':
    #   '<MACHINE_GIT_CONFIG_URL>',
    # 'MachineConfigDirectory': '<MACHINE_CONFIG_GIT_DIRECTORY_NAME>',
    # 'MachineConfigGitTag':
    #   '<MACHINE_CONFIG_TAG_OR_COMMITID_OR_BRANCH>'},.......

    dictd = {}
    deploylist = []
    for dirs in deploydata:
        for key in dirs:
            if isinstance(dirs[key], dict):
                for newkey, value in dirs[key].items():
                    dictd[key+newkey] = value
            else:
                dictd[key] = dirs[key]
        deploylist.append(dictd.copy())
    return deploylist


def create_new_deployment(deploy_instance, deploy_type):
    """ New Deployment creation based on meta-data of deployment
    and deployment type
    """
    # Storing Nodename and Deployment Config Data
    deployment, nodename, _toolversion, deployurl, deploydir,\
        deploygittag = deploy_instance[:6]

    # Cleanup old deployment directory
    if os.path.exists(deployment):
        shutil.rmtree(deployment)

    # TestSensor doesn't have Machine Config so check and store
    # relevant Machine Config data.
    machineconfig_exist = True
    if len(deploy_instance) > 6:
        # Storing Machine Config Data
        machineurl, machinedir, machinegittag = deploy_instance[6:9]
    else:
        machineconfig_exist = False

    print("Creating dir for application:", deployment)
    os.makedirs(deployment)
    # Function call for processing git repo and copyign relevant
    # deployment-config *.yaml files.
    git_clone_tempdir(deployurl, deploydir,
                      deploygittag, deployment, CONFIG.DEPLOYMENT)
    if machineconfig_exist:
        # Function call for processing git repo and copyign relevant
        # machine-config *.yaml files.
        git_clone_tempdir(machineurl, machinedir,
                          machinegittag, deployment, CONFIG.GATEWAY)
    # Deploying the Application pods
    subprocess.call(['sh', 'kubernetes_deployment_creation.sh',
                     nodename, deployment, NAME_SPACE, deploy_type.value])

    # Clean-up local directory after creation/update/deletion of deployment.
    if deploy_type != DEPLOYMENTTYPE.CREATE:
        shutil.rmtree(deployment)


def process_deploy_devices_gateway(deployment_list, deploy_type):
    """ Method for initiating device onboarding based
    on deployment action,deployment type and parsed
    machine and deployment config data.
    deploy_list is list of deployment's.Each Deployment
    consists of deploymentname+DeploymentConfig+MachineConfig.
    """
    signal_activationcode()
    # print(deployment_list,"\n")
    deploy_instance = []
    # Process deployment List,per device(deployment).
    for parse_item in deployment_list:
        for key in parse_item:
            deploy_instance.append(parse_item[key])

        # Storing DeploymentName
        deployment = deploy_instance[0]
        # Logic to check if Deployment Exist
        if check_deployment_status(deployment):
            if deploy_type == DEPLOYMENTTYPE.CREATE:
                print("Deployment:", deployment, "already exists",
                      "Run Update OR Delete Deployment!!\n")
                deploy_instance.clear()
                continue
        elif deploy_type in [DEPLOYMENTTYPE.UPDATE, DEPLOYMENTTYPE.DELETE]:
            print("Deployment:", deployment, "does not exists",
                  "Run Create Deployment First!!\n")
            deploy_instance.clear()
            continue

        create_new_deployment(deploy_instance, deploy_type)
        deploy_instance.clear()

# pylint: disable=too-few-public-methods
# Class will be expanded for adding more features.


class CreateDeployment:
    """Process Create Device Deployment instance data."""

    def __init__(self, cdeploy):
        print("Creating Pods...")
        self.create_deployment_list = defaultdict(list)  # list backed dict
        # List of deployment's with deployname+nodename+configs
        #   :[deploymentname,..]
        self.create_deployment_list = parsing_device_configdata(cdeploy)
        self.create_deployment()

    def create_deployment(self):
        """ Wrapper Method For Creating Deployments"""
        current_dir = get_current_directory()
        process_deploy_devices_gateway(
            self.create_deployment_list, DEPLOYMENTTYPE.CREATE)
        os.chdir(current_dir)
        ret = subprocess.call(['kubectl', '-n', NAME_SPACE, 'get', 'pods'])
        if ret != 0:
            sys.exit()

# pylint: disable=too-few-public-methods
# Class will be expanded for adding more features.


class UpdateDeployment:
    """Process Update Device Deployment instance data."""

    def __init__(self, udeploy):
        print("Updating Pods...")
        self.update_deployment_list = defaultdict(list)  # list backed dict
        # List of deployment's with deployname+nodename+configs
        #   :[deploymentname,..]
        self.update_deployment_list = parsing_device_configdata(udeploy)
        self.update_deployment()

    def update_deployment(self):
        """ Wrapper Method For Updating Deployments"""
        current_dir = get_current_directory()
        process_deploy_devices_gateway(
            self.update_deployment_list, DEPLOYMENTTYPE.UPDATE)
        os.chdir(current_dir)
        ret = subprocess.call(['kubectl', '-n', NAME_SPACE, 'get', 'pods'])
        if ret != 0:
            sys.exit()


# pylint: disable=too-few-public-methods
# Class will be expanded for adding more features.
class DeleteDeployment:
    """Process Delete Device Deployment instance data."""

    def __init__(self, ddeploy):
        print("Deleting Pods....")
        self.delete_deployment_list = defaultdict(list)
        # List of deployment's with deployname+nodename+configs
        #   :[deploymentname,..]
        self.delete_deployment_list = parsing_device_configdata(ddeploy)
        self.delete_deployment()

    def delete_deployment(self):
        """ Wrapper Method For Deleting Deployments"""
        current_dir = get_current_directory()
        process_deploy_devices_gateway(
            self.delete_deployment_list, DEPLOYMENTTYPE.DELETE)
        os.chdir(current_dir)
        ret = subprocess.call(['kubectl', '-n', NAME_SPACE, 'get', 'pods'])
        if ret != 0:
            sys.exit()


class DeviceDeployment:
    """Create Device Deployment instance for
    create,update or delete.
    """

    def __init__(self, file):

        with open(file, 'r') as deploymentfile:
            self.params = yaml.safe_load(deploymentfile)
        global NAME_SPACE
        NAME_SPACE = self.params['namespace']

    def create_deployment(self):
        """Create Deployment Class Instance."""
        cdict = self.params['CreateDeployments']
        CreateDeployment(cdict)

    def update_deployment(self):
        """Create Update Deployment Class Instance."""
        udict = self.params['UpdateDeployments']
        UpdateDeployment(udict)

    def delete_deployment(self):
        """Create Delete Deployment Class Instance."""
        ddict = self.params['DeleteDeployments']
        DeleteDeployment(ddict)


if __name__ == "__main__":
    directory = get_current_directory()
    # Find deployment("XYZ.yaml") file in a directory
    files = glob.glob(os.path.join(directory, '*.yaml'))
    deploymentstate = DeviceDeployment(files[0])
    # Input argument parser for performing creation,updation or deletion
    # of device deployment and machine config
    parser = argparse.ArgumentParser(
        description='Automating Gateway Device OnBoarding Script!')
    parser.add_argument(
        "--action", choices=["create", "update", "delete"],
        required=True, type=str, help="create")
    args = parser.parse_args()
    action = args.action

    # Deployment class object instance based on input argument to script.
    if action == "delete":
        deploymentstate.delete_deployment()
    elif action == "update":
        deploymentstate.update_deployment()
    elif action == "create":
        deploymentstate.create_deployment()
