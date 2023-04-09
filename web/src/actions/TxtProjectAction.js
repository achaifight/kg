import  request  from "@/utils/request";

export const uploadTextFile = (SchemaName,textFile) => {
    const requestURL = "/Txt/uploadTxtFile";
    console.log(SchemaName,textFile)
    var data = new FormData();
    data.append('TxtFile', textFile);
    data.append('SchemaFileName', SchemaName);
    try {
        let res = request.post(requestURL,data)
        return res
    } catch (err) {
    }
};