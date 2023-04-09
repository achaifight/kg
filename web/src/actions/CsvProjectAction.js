import  request  from "@/utils/request";

export const getRuleList = () => {
    const requestURL = "/Csv/getRuleList";
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
};

export const uploadExistCsvPackageFile = (SchemaName,packageFile,ProjectName) => {
    const requestURL = "/Csv/uploadCsvZip";
    console.log(SchemaName,packageFile,ProjectName)
    var data = new FormData();
    data.append('csvFiles', packageFile);
    data.append('FileName', SchemaName);
    data.append('ProjectName', ProjectName)
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};

export const getExistCsvFileList = (fileName) => {
    const requestURL = "/Csv/getCsvList?FileName="+fileName;
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
};

export const getMappingSituation = (csvFileName, zipName, data) => {
    const requestURL = "/Csv/getClassMappingSituation?CsvFileName="+csvFileName+"&ZipName="+zipName;
    try {
        let res = request.get(requestURL, data)
        return res
    } catch (err) {
    }
};

export const updateClassMappingSituation = (csvFileName, zipName, tableData) => {
    const requestURL = "/Csv/updateClassMappingSituation?CsvFileName="+csvFileName+"&ZipName="+zipName;
    try {
        let res = request.post(requestURL, JSON.stringify(tableData))
        return res
    } catch (err) {
    }
};

export const getRelationMappingSituation = (csvFileName, zipName) => {
    const requestURL = "/Csv/getRelationMappingSituation";
    try {
        let res = request.get(requestURL, {
            params:{
                "CsvFileName": csvFileName,
                "ZipName": zipName
            }
        })
        return res
    } catch (err) {
    }
};

export const getCsvColumnName = (csvFileName, zipName) => {
    const requestURL = "/Csv/getCsvColumnName";
    try {
        let res = request.get(requestURL, {
            params:{
                "CsvFileName": csvFileName,
                "ZipName": zipName
            }
        })
        return res
    } catch (err) {
    }
};

export const updateRelationMappingSituation = (csvFileName, zipName, tableData) => {
    const requestURL = "/Csv/updateRelationMappingSituation?CsvFileName="+csvFileName + "&ZipName="+zipName;
    try {
        let res = request.post(requestURL,tableData)
        return res
    } catch (err) {
    }
};

export const submitCsvMappingResult = (schemaName, fileName) => {
    const requestURL = "/Csv/submitCsvMappingResult?SchemaName="+schemaName+"&RuleName="+fileName;
    try {
        let res = request.post(requestURL)
        return res
    } catch (err) {
    }
};

