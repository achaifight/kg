/**
 * 检查节点唯一性用
 * @param {*} Node 
 */

var classNodeDict = {}
var classNodeNumDict = {}
var relationNodeDict = {}
var relationNodeNumDict = {}
var dataNodeDict = {}
var dataNodeNumDict = {}

export function SchemaGraphNodeUniquenessManage(node){
    switch (node.shape){
        case "rect" :  return dataNodeUniquenessManage(node);
        case "ellipse" : return classNodeUniquenessManage(node);
        case "polygon" : return relationNodeUniquenessManage(node);
        default : null;
    }
    return ;
}

function classNodeUniquenessManage(classNode){
    var className = classNode.label
    try{
        var exitNode = classNodeDict[className]
        if(exitNode == undefined){
            classNodeDict[className] = classNode
            classNodeNumDict[className] = 1
            return null;
        }else{
            classNodeNumDict[className] += 1
            return exitNode
        }
    }catch {
        return null;
    }
}

function relationNodeUniquenessManage(relationNode){
    var relationName = relationNode.label
    try{
        var exitNode = relationNodeDict[relationName]
        if(exitNode == undefined){
            relationNodeDict[relationName] = relationNode
            relationNodeNumDict[relationName] = 1
            return null;
        }else{
            relationNodeNumDict[relationName] += 1
            return exitNode
        }
    }catch {
        return null;
    }
}

function dataNodeUniquenessManage(dataNode){
    var dataName = dataNode.label
    try{
        var exitNode = dataNodeDict[dataName]
        if(exitNode == undefined){
            dataNodeDict[dataName] = dataNode
            dataNodeNumDict[dataName] = 1
            return null;
        }else{
            dataNodeNumDict[dataName] += 1
            return exitNode
        }
    }catch {
        return null;
    }
}

export function SchemaGraphNodeDeleteHistory(node){
    switch (node.shape){
        case "rect" :  return dataNodeDelete(node);
        case "ellipse" : return classNodeDelete(node);
        case "polygon" : return relationNodeDelete(node);
        default : null;
    }
    return ;
}

function classNodeDelete(classNode){
    var nodeName = classNode.label
    if(classNodeNumDict[nodeName] < 2){
        delete(classNodeDict[nodeName])
        delete(classNodeNumDict[nodeName])
    }else{
        classNodeNumDict[nodeName] -= 1
    }
}

function relationNodeDelete(relationNode){
    var nodeName = relationNode.label
    if(relationNodeNumDict[nodeName] < 2){
        delete(relationNodeDict[nodeName])
        delete(relationNodeNumDict[nodeName])
    }else{
        relationNodeNumDict[nodeName] -= 1
    }
}

function dataNodeDelete(dataNode){
    var nodeName = dataNode.label
    if(dataNodeNumDict[nodeName] < 2){
        delete(dataNodeDict[nodeName])
        delete(dataNodeNumDict[nodeName])
    }else{
        dataNodeNumDict[nodeName] -= 1
    }
}

export function JsonGraphNodeManage(jsonData){
    console.log(jsonData)
    NodeHistoryClear()
    for (var InfoIndex =0; InfoIndex<jsonData.length; InfoIndex++){
        var tmpData = jsonData[InfoIndex]
        console.log(tmpData)
        tmpData["data"]["label"] = tmpData.label
        if (tmpData.shape === "edge"){
            continue
        }
        switch (tmpData.shape){
            case "rect" :  dataNodeUniquenessManage(tmpData);
            case "ellipse" : classNodeUniquenessManage(tmpData);
            case "polygon" : relationNodeUniquenessManage(tmpData);
            default : null;
        }
    }
}

function NodeHistoryClear(){
    classNodeDict = {}
    classNodeNumDict = {}
    relationNodeDict = {}
    relationNodeNumDict = {}
    dataNodeDict = {}
    dataNodeNumDict = {}
}

