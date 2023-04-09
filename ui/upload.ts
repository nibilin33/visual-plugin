import * as qiniu from 'qiniu-js'
const subObject = {
    next: (response: any) => {
        console.log(response);
    },
    error: (response: any) => {
        console.log(response, 'error');
    },
    complete: (response: any) => {
        console.log(response), 'complete';
    }
};
export function uploadFile(file: any, filename: string) {

    fetch('http://127.0.0.1:9000/api/uptoken')
        .then(async (res) => {
            const ctoken: any = await res.json();
            var config = {
                checkByServer: true,
                forceDirect: false,
                useCdnDomain: true,
                disableStatisticsReport: false,
                retryCount: 1
            };
            var putExtra = {
                customVars: {}
            };
            // 调用sdk上传接口获得相应的observable，控制上传和暂停
            let observable = qiniu.upload(file, filename, ctoken.uptoken, putExtra, config);
            observable.subscribe(subObject)
        });



}