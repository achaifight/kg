import  request  from "@/utils/request";


export const getSchemaList = () => {
  const requestURL = "/Schema/getSchemaInfoList/";
  try {
    let res = request.get(requestURL)
    return res
  } catch (err) {
  }
};

export const createSchema = (schemaName) => {
    const requestURL = "/Schema/createSchema/";
    var data = new FormData();
    data.append('schemaName', schemaName);
    try {
      let res = request.post(requestURL,data)
      return res
    } catch (err) {
    }
};

//导入Schema文件
export const importSchemaFile = (schemaName,file) => {
  const requestURL = "/Schema/importSchemaFile/";
  console.log(schemaName,file)
  var data = new FormData();
  data.append('SchemaFile', file);
  data.append('SchemaFileName', schemaName);
  try {
    let res = request.post(requestURL,data)
    return res
  } catch (err) {
  }
};

export const deleteSchema = (schemaName) => {
  const requestURL = "/Schema/deleteSchemaFile/?schemaName="+schemaName;
  try {
    let res = request.get(requestURL)
    return res
  } catch (err) {
  }
};


export const getSchemaGraph = (schemaName) => {
  const requestURL = "/SchemaEdit/LoadFile";
  let data = new FormData();
  data.append('SchemaName', schemaName);
  try {
    let res = request.post(requestURL, data)
    return res
  } catch (err) {
  }
};

export const getSchemaEditHelper = () =>{
    
    request
    .get('/SchemaEdit/getSchemaHelper',{
      responseType:'blob',
    })
    .then((response)=>{
      //headers请求头的乱码数据转换为中文
      console.log(response)
      let blob = new Blob([response], {type:"application/pdf"})
      let objectUrl = URL.createObjectURL(blob) // 创建URL
      const link = document.createElement('a')
      link.href = objectUrl
      //这里是获取后台传过来的文件名
      link.setAttribute("download","helper.pdf")
      link.click() // 下载文件
      URL.revokeObjectURL(objectUrl) // 释放内存
    })
    .catch((error)=>{
      console.log(error);
      alert('下载失败')
    })
}

export const saveSchemaGraph = (schemaName,schemaJson) => {
  const requestURL = "/SchemaEdit/SaveEditFile?SchemaName="+schemaName;
  try {
    let res = request.post(requestURL, {
      "nodes":schemaJson.nodes,
      "edges":schemaJson.edges
    })
    return res
  } catch (err) {
    console.log(err);
    alert('保存失败请重试')
  }
}

export const downloadSchema = (SchemaName) => {
  const requestURL = "/SchemaEdit/downloadSchemaFile?SchemaName="+SchemaName;
  try {
    let response = request.get(requestURL, 
      {
        responseType:'blob',
      }
    )
    .then((response)=>{
      //headers请求头的乱码数据转换为中文
      let blob = new Blob([response], {type:'.xml'})
      let objectUrl = URL.createObjectURL(blob) // 创建URL
      const link = document.createElement('a')
      link.href = objectUrl
      //这里是获取后台传过来的文件名
      link.setAttribute("download",SchemaName+".owl")
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

export const getProjectNameList = () => {
  const requestURL = "/ModelRefinement/getProjectNameList";
  try {
    let response = request.get(requestURL)
    return response
  } catch (err) {
  }
}

export const deleteProject = (schemaName) => {
  const requestURL = "/ModelRefinement/deleteProject";
  try {
    let response = request.get(requestURL, {
      params:{
        "SchemaName": schemaName
      }
    })
    return response
  } catch (err) {
  }
}

export const getProjectGraph = (schemaName) => {
  const requestURL = "/ModelRefinement/getProjectGraph";
  try {
    let response = request.get(requestURL, {
      params:{
        "SchemaName": schemaName
      }
    })
    return response
  } catch (err) {
  }
}

export const getNewSchemaName = (version,name) => {
  const requestURL = "/ModelRefinement/getNewSchemaName";
  console.log(version)
  console.log(name)
  try {
    let response = request.get(requestURL, {
      params:{
        "version": version,
        "name":name
      }
    })
    return response
  } catch (err) {
  }
}

export const mergeSchema = () => {
  const requestURL = "/ModelRefinement/mergeSchema";
  try {
    let response = request.post(requestURL)
    return response
  } catch (err) {
  }
}


