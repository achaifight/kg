
/**
 * 处理画布的json以对齐api接口
 * @param {*} jsonData 
 */

export const ClassAttrTable = ["subClassOf","comment","disjointWith"]
export const RelationAttrTable=["subPropertyOf","inverseOf","comment","propertyDisjointWith","FunctionalProperty","TransitiveProperty","SymmetricProperty","ReflexiveProperty"]
export const DataAttrTable = ["dataRange","comment"]


export function handleSchemaJson(jsonData){
    
    var saveJson = {"nodes":[],"edges":[]}

    var nodes = jsonData['cells']
    for(var i = 0;i<nodes.length;i++){
        var node = nodes[i]
        if(node["shape"] == "edge"){
            var edge = {...node}
            if(node["source"]["cell"]!==undefined){
                edge["sources"] = node["source"]
                edge["source"] = node["source"]["cell"]
            }else{
                edge["source"] = node["source"]
            }

            if(node["target"]["cell"]!==undefined){
                edge["targets"] = node["target"]
                edge["target"] = node["target"]["cell"]
            }else{
                edge["target"] = node["target"]
            }
            saveJson["edges"].push(edge)
        }else {
            var point = {...node}
            point["data"] = {}
            point["label"] = node["attrs"]["text"]["text"]
            var attrTable = point["shape"] == "rect" ? DataAttrTable : point["shape"] == "ellipse" ? ClassAttrTable : RelationAttrTable
            for(var attrIndex in attrTable){
                var attr = attrTable[attrIndex]
                if (node["data"]!==undefined && node["data"][attr] !== undefined){
                    point["data"][attr] = node["data"][attr]
                }else{
                    point["data"][attr] = null
                }
            }
            saveJson["nodes"].push(point)
        }
    }

    return saveJson
}