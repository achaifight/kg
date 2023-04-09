import  request  from "@/utils/request";


export const uploadJsonFile = (FileName,File) => {
    const requestURL = "/Json/handlingSemiStructuredData";
    console.log(FileName,File)
    var data = new FormData();
    data.append('jsonFiles', File);
    data.append('FileName', FileName);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};

export const getExistJsonFileList = (fileName) => {
    const requestURL = "/Json/getJsonList?FileName="+fileName;
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
};

export const getJsonMappingSituation = (jsonFileName, zipName, data) => {
    const requestURL = "/Json/getJsonClassMappingSituation?JsonFileName="+jsonFileName+"&ZipName="+zipName;
    try {
        let res = request.get(requestURL, data)
        return res
    } catch (err) {
    }
};

export const getJsonRelationMappingSituation = (zipName, data) => {
    const requestURL = "/Json/getJsonRelationMappingSituation?ZipName="+zipName;
    try {
        let res = request.get(requestURL, data)
        return res
    } catch (err) {
    }
};

export const handlingOpenData = (zipName, schemaName, way, data) => {
    const requestURL = "/Json/handlingOpenData?fileName="+zipName+"&schema="+schemaName+"&way="+way;
    try {
        let res = request.post(requestURL, data)
        return res
    } catch (err) {
    }
};


export const updateJsonMappingSituation = (jsonFileName, zipName, tableData) => {
    const requestURL = "/Json/updateJsonMappingSituation?JsonFileName="+jsonFileName+"&ZipName="+zipName;
    try {
        let res = request.post(requestURL, JSON.stringify(tableData))
        return res
    } catch (err) {
    }
};

export const updateJsonRelationMappingSituation = (zipName, tableData) => {
    const requestURL = "/Json/updateJsonRelationMappingSituation?ZipName="+zipName;
    try {
        let res = request.post(requestURL, JSON.stringify(tableData))
        return res
    } catch (err) {
    }
};

export const getJsonRuleList = (type) => {
    const requestURL = "/Json/getRuleList?Type="+type;
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
};

export const createJsonTask = (File, FileName, Schema, RuleName, Executor, Type) => {
    const requestURL = "/Task/createJsonTask";
    var data = new FormData();
    data.append('file', File);
    data.append('file_name', FileName);
    data.append('schema', Schema);
    data.append('rule_name', RuleName);
    data.append('executor', Executor);
    data.append('type', Type);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};
