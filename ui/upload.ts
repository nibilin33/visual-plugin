import * as qiniu from "qiniu-js";
export function uploadFile(file: any, filename: string) {
  return new Promise((resolve) => {
    fetch("http://127.0.0.1:9000/api/uptoken").then(async (res) => {
      const ctoken: any = await res.json();
      var config = {
        useCdnDomain: true, // 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        region: qiniu.region.z2, // 上传域名区域（z1为华北）,当为 null 或 undefined 时，自动分析上传域名区域
      };
      var putExtra = {
        customVars: {},
      };
      // 调用sdk上传接口获得相应的observable，控制上传和暂停
      let observable = qiniu.upload(
        file,
        filename,
        ctoken.uptoken,
        putExtra,
        config
      );
      observable.subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (response: any) => {
          console.log(response, "error");
          resolve(false);
        },
        complete: (response: any) => {
          console.log(response, "complete");
          resolve({
            ...response,
            ...ctoken,
          });
        },
      });
    });
  });
}
