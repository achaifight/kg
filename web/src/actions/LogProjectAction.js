import  request  from "@/utils/request";

export const getLog = () => {
    const requestURL = "/Log/getLog";
    try {
        let res = request.get(requestURL)
        return res
    } catch (err) {
    }
}