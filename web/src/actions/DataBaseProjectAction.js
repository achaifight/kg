import  request  from "@/utils/request";

export const uploadDatabase = (ProjectName,SchemaName,TableName,DatabaseURL,Day,Time) => {
    const requestURL = "/Database/uploadDatabase";
    var data = new FormData();
    data.append('tableName', TableName);
    data.append('databaseURL', DatabaseURL);
    data.append('schemaName', SchemaName);
    data.append('projectName', ProjectName);
    data.append('day', Day);
    data.append('time', Time);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};

export const testConnectURL = (DatabaseURL) => {
    const requestURL = "/Database/testConnect";
    var data = new FormData();
    data.append('databaseURL', DatabaseURL);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};

export const getDatabaseClassMappingSituation = (ruleName, collectionName, data) => {
    const requestURL = "/Database/getDatabaseClassMappingSituation?RuleName="+ruleName+"&CollectionName="+collectionName;
    try {
        let res = request.get(requestURL, data)
        return res
    } catch (err) {
    }
};

export const updateDatabaseClassMappingSituation = (collectionName, ruleName, tableData) => {
    const requestURL = "/Database/updateDatabaseClassMappingSituation?CollectionName="+collectionName+"&RuleName="+ruleName;
    try {
        let res = request.post(requestURL, JSON.stringify(tableData))
        return res
    } catch (err) {
    }
};

export const getKeyList = (collectionName, ruleName, data) => {
    const requestURL = "/Database/getKeyList?CollectionName="+collectionName+"&RuleName="+ruleName;
    try {
        let res = request.get(requestURL, data)
        return res
    } catch (err) {
    }
};

export const updateDatabaseRelationMappingSituation = (ruleName, data) => {
    const requestURL = "/Database/updateDatabaseRelationMappingSituation?RuleName="+ruleName;
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};

export const getDatabaseRelationMappingSituation = (ruleName, data) => {
    const requestURL = "/Database/getDatabaseRelationMappingSituation?RuleName="+ruleName;
    try {
        let res = request.get(requestURL, data)
        return res
    } catch (err) {
    }
};

export const saveDatabaseDataRule = (ruleName) => {
    const requestURL = "/Database/saveDatabaseDataRule?RuleName="+ruleName;
    try {
        let res = request.post(requestURL)
        return res
    } catch (err) {
    }
};

export const getDatabaseRuleList = () => {
    const requestURL = "/Database/getDatabaseRuleList";
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
};
