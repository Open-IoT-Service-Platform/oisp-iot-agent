# IOT Agent Device OnBoarding Framework
This Framework Blueprint for Onboarding Gateway Devices for Industry Fusion.

## Installation Pre-Requisites:
In order to setup and onboard assets on your gateway you need to do the following:

Install and configure k3s:
=========================
Install the Lightweight Kubernetes k3s on gateway (root rights required).

Create namespace k3s:
==============================
```
kubectl create namespace oisp-devices
```

Install python3 and pip3 on your gateway:
========================================
```
sudo apt install python3
sudo apt install python3-pip
```
Install Packages with Pip using the Requirements Files:
======================================================
```
pip3 install -r requirements.txt
```
GitHub repos:
============

IndustryFusion-private-

machine-config repo

deployment-config-repo

Store git credentials in cache for 30 days:
==========================================
```
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=2592000'
```
Docker Hub:
==========

ibn40/repositories

oisp/repositories

Create secret for docker hub repository with your docker credentials:
====================================================================
```
kubectl -n oisp-devices create secret docker-registry regcred --docker-server=docker.io --docker-username=YOUR_DOCKER_USERNAME --docker-password=YOUR_DOCKER_PASSWORD --docker-email=YOUR@EMAIL.COM
```

OISP Platform:
=============
Get access to OISP Platform Dashboard.

## Getting started
1. Clone this repository under your gateway.
2. gatewaydeployment.yaml is the sample gateway device onboarding config repo description file.
3. Copy default config.json from IndustryFusion-private- git repository. This will set hosts for rest, ws and mqtt correctly 
   for OISP Platform DashBoard.
4. Create app_config.yaml which should consist of OISP Instance URL and APP Version.
Sample app_config.yaml description:
```
BASE_OISP_INSTANCE: <OISP_BASE_URL>
API_VERSION:   <vX/api>
```
5. Create gatewaydeployment.yaml which should consist of Application Name, Deployment Config, Machine Config details for this framework 
   to parse and deploy the devices you want to onboard connected to your gateway. 
Sample gatewaydeployment.yaml description:
```
version: <DEPLOYMENT_YAML_VERSION_NUMBER>
namespace: <NAMESPACE_FOR_ALL_DEPLOYMENTS>
CreateDeployments:
- ApplicationName: <DEPLOYMENT_NAME> 
    NodeName: <K3S_NODE_NAME>
    ToolVersion: <TOOL_VERSION>
    DeploymentConfig:
    	URL: <DEPLOYMENT_GIT_CONFIG_URL>
        Directory: <DEPLOYMENT_CONFIG_GIT_DIRECTORY_NAME>
        GitTag: <DEPLOYMENT_GIT_TAG_OR_COMMITID_OR_BRANCH>
    MachineConfig:
    	URL: <MACHINE_GIT_CONFIG_URL>,
       	Directory: <MACHINE_CONFIG_GIT_DIRECTORY_NAME>,
       	GitTag: <MACHINE_CONFIG_TAG_OR_COMMITID_OR_BRANCH>
```
6. Initiate the Deployment process based on three actions; create, update or delete.
```
python3 deviceonboarding.py --action create 
OR 
python3 deviceonboarding.py --action update
OR 
python3 deviceonboarding.py --action delete
```
7. Once the onboarding script it initiated it will ask you for OISP platform credentials.
```
Gateway:~/tools $python3 deviceonboarding.py --action delete
Deleting Pods....
Enter OISP User Credentials
Username: xxxx.xx@abc.com
Password:
If you multiple project account under single OISP Instance Below message will be generated.
==========================================================================================
Please choose one from below OISP account options
Account | name: None    id:3d14522e-3385-4c23-962a-3818d4983362 role:admin
Account | name: None    id:1d2c8140-0656-4f1b-ac18-875b17ed2e1e role:admin
Enter 0 for first account ID, 1 for second Account ID: 1
==================================================================================
Namespace oisp-devices already exists. Continue.
configmap "global-devices-config" deleted
configmap/global-devices-config created
secret "global-devices-secret" deleted
...........
```
8. After Onboarding is complete you can see the deployment pod status using following command.
```
kubectl -n oisp-devices get pods
```
9. Get detailed information on pods and containers 
   (exchange with correct name of pod and container e.g. oisp-iot-agent)

```
kubectl -n oisp-devices describe pods airtracker-deployment-testsensor-7b5bcfb77d-5knnf
kubectl -n oisp-devices logs airtracker-deployment-testsensor-7b5bcfb77d-w55dk oisp-iot-agent
```
