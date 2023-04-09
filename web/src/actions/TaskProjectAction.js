import  request  from "@/utils/request";

export const getTaskList = (schemaName) => {
    const requestURL = "/Task/getTaskList";
    try {
        let response = request.get(requestURL)
        return response
    } catch (err) {
    }
}

export const startTask = (task) => {
    const requestURL = "/Task/startTask"
    var data = new FormData();
    data.append('task', task);
    try {
        let response = request.post(requestURL, task)
        return response
    }catch (err){

    }
}

export const stopTask = (task) => {
    const requestURL = "/Task/stopTask"
    var data = new FormData();
    data.append('task', task);
    try {
        let response = request.post(requestURL, task)
        return response
    }catch (err){

    }
}

export const createDatabaseTask = (DatabaseURL, Table, Schema, RuleName, Day, Time, Executor) => {
    const requestURL = "/Task/createDatabaseTask";
    var data = new FormData();
    data.append('databaseURL', DatabaseURL);
    // , , , , , , , ,
    data.append('table', Table);
    data.append('schema', Schema);
    data.append('rule_name', RuleName);
    data.append('day', Day);
    data.append('time', Time);
    data.append('executor', Executor);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};

export const createCsvTask = (File, FileName, Schema, RuleName, Executor) => {
    const requestURL = "/Task/createCsvTask";
    var data = new FormData();
    data.append('file', File);
    data.append('file_name', FileName);
    data.append('schema', Schema);
    data.append('rule_name', RuleName);
    data.append('executor', Executor);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};