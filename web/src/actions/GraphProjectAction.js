import  request  from "@/utils/request";

export const getProjectList = () => {
    const requestURL = "/GraphManage/getFolderList";
    try {
      let res = request.get(requestURL)
      return res
    } catch (err) {
    }
};

export const downloadCsvPackage = (SchemaName,ProjectName) => {
    const requestURL = "/GraphManage/downloadProjectPackageFile?SchemaName="+SchemaName+"&ProjectName="+ProjectName;
    try {
      let response = request.get(requestURL, 
        {
          responseType:'blob',
        }
      )
      .then((response)=>{
        //headers请求头的乱码数据转换为中文
        let blob = new Blob([response])
        let objectUrl = URL.createObjectURL(blob) // 创建URL
        const link = document.createElement('a')
        link.href = objectUrl
        //这里是获取后台传过来的文件名
        link.setAttribute("download",SchemaName+".zip")
        link.click() // 下载文件
        URL.revokeObjectURL(objectUrl) // 释放内存
      })
      .catch((error)=>{
        console.log(error);
        alert('下载失败')
      })
      return response
    } catch (err) {
      console.log(err);
      alert('下载失败请重试')
    }
}

//导入csvPackage文件
export const importpackageFile = (SchemaName,packageFile,ProjectName) => {
    const requestURL = "/GraphManage/uploadGraphPackageFile";
    console.log(SchemaName,packageFile,ProjectName)
    var data = new FormData();
    data.append('packageFile', packageFile);
    data.append('SchemaName', SchemaName);
    data.append('ProjectName', ProjectName)
    try {
      let res = request.post(requestURL,data)
      return res
    } catch (err) {
    }
  };
export const getGraphNode=(nodeName)=>{
    const requestURL = "/GraphManage/getGraphNode?nodeName="+nodeName;
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
}

export const getGraphRelation=(relationName)=>{
    const requestURL = "/GraphManage/getGraphNode?FileName="+fileName;
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
}

export const getGraphCount=()=>{
    const requestURL = "/GraphManage/getGraphCount";
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
}

export const getGraphUrl=()=>{
    const requestURL = "/GraphManage/getGraphUrl";
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
}