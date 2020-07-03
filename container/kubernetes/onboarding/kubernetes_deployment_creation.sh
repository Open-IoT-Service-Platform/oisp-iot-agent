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

## Gateway IOT Device Deployments Pods Creation,Update and Delete.

NODENAME=${1}
APPNAME=${2}
NAMESPACE=${NAMESPACE:-${3}}
DEPLOYTYPE=${4}
CONFIG_MAP_NAME=app-config
GATEWAYAPPCONFIGTARGET=application.yaml
DATASERVICECONFIGTARGET=fusiondataservice_application.yaml
if [ "$#" -gt 4 -o "$#" -lt 4 -o "$#" -eq 3 ]; then
    echo usage: ${0##*/} \<node-name\> \<application-name\> \<namespace\> \<deploytype\>
    echo e.g. ${0##*/} kubemaster testsensor
    exit 1
fi


cd $APPNAME
TEST_SENSOR_CONFIG_EXIST=0
TEST_SENSOR_CONFIG_EXIST=`grep "name: testsensor-config" deployment.yaml | wc -l`
###### Find out correct DATASERVICECONFIG FROM Deployment yaml file
if [ "$TEST_SENSOR_CONFIG_EXIST" -eq 0 ] 
then
    DATACONFIGTARGET=`grep "fusion*.*yaml" deployment.yaml | awk '{print $3}'`
    mv $DATASERVICECONFIGTARGET $DATACONFIGTARGET
    DATASERVICECONFIGTARGET=$DATACONFIGTARGET
fi
echo Creating temporary subdir for processing...
WORKDIR=`mktemp -d -p "."`

if [ "$DEPLOYTYPE" = "update" ]
then
    # Deleting old configmap and all.yaml files 
    rm -rf configmap.yaml all.yaml
    echo Deleting old configmap.yaml and allmap.yaml files....
fi

echo Copy and adapt the templates
for file in $(ls *.yaml); do
    echo Processing $file
    sed 's|<NODENAME>|'$NODENAME'|g' $file | sed 's|<APPLICATIONNAME>|'$APPNAME'|g' | sed 's|<NAMESPACE>|'$NAMESPACE'|g' > $WORKDIR/$file
done

if [ "$TEST_SENSOR_CONFIG_EXIST" -gt 0 ]
then
    CONFIG_MAP_NAME=testsensor-config
    kubectl -n ${NAMESPACE} create configmap $APPNAME-${CONFIG_MAP_NAME} --from-file=./sensorSpecs.json -o yaml --dry-run > $WORKDIR/configmap.yaml
else
    kubectl -n ${NAMESPACE} create configmap $APPNAME-${CONFIG_MAP_NAME}  --from-file=${GATEWAYAPPCONFIGTARGET} --from-file=${DATASERVICECONFIGTARGET} -o yaml --dry-run > $WORKDIR/configmap.yaml
fi

cat $WORKDIR/configmap.yaml > $WORKDIR/all.yaml
echo --- >> $WORKDIR/all.yaml
cat $WORKDIR/pvc.yaml >> $WORKDIR/all.yaml
echo --- >> $WORKDIR/all.yaml
cat $WORKDIR/deployment.yaml >> $WORKDIR/all.yaml
cp -a $WORKDIR/. .
rm -rf $WORKDIR

# Deleting any existing application kubernetes pods
if [ "$DEPLOYTYPE" = "create" ] || [ "$DEPLOYTYPE" = "delete" ]
then
    kubectl delete -f all.yaml > /dev/null 2>&1
fi

# Create new deployment
if [ "$DEPLOYTYPE" = "create" ] || [ "$DEPLOYTYPE" = "update" ]
then
    # Creating kubernetes Device pods
    kubectl apply -f all.yaml
fi

# Restart the deployment
if [ "$DEPLOYTYPE" = "update" ]
then
    kubectl -n ${NAMESPACE} rollout restart deployment ${APPNAME}
fi
