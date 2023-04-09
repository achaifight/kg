import  request  from "@/utils/request";


export const importDockerFile = (serviceName,dockerFile,yamlFile) => {
    const requestURL = "/DeployManage/importPackageFile";
    var data = new FormData();
    data.append('deployFile', dockerFile);
    data.append('serviceName', serviceName);
    if (yamlFile === null || yamlFile === undefined){
        data.append('ifYaml',false)
    }else{
        data.append('ifYaml',true)
    }
    data.append('yamlFile',yamlFile)
    try {
      let res = request.post(requestURL,data)
      return res
    } catch (err) {
    }
  };