import  request  from "@/utils/request";



export const getSchemaElementList = (fileName) => {
    const requestURL = "/UserInteraction/getSchemaElementList";
    try {
        let res = request.get(requestURL, {
            params:{
                "FileName": fileName
            }
        })
        console.log(res)
        return res
    } catch (err) {
    }
};

export const downloadJsonSample = (sample) => {
    const requestURL = "/UserInteraction/downloadJsonSampleFiles?sample="+sample;
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
                link.setAttribute("download","sample.zip")
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
