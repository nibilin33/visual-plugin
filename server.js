var qiniu = require("qiniu");
var express = require("express");
var path = require("path")
var app = express();
app.use(express.static(__dirname + "/"));
//设置CORS
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin','*'); //当允许携带cookies此处的白名单不能写’*’
    next();
});
var fs=require('fs');
var config=JSON.parse(fs.readFileSync(path.resolve(__dirname,"config.json")));

var mac = new qiniu.auth.digest.Mac(config.AccessKey, config.SecretKey);
var config2 = new qiniu.conf.Config();
// 这里主要是为了用 node sdk 的 form 直传，结合 demo 中 form 方式来实现无刷新上传
config2.zone = qiniu.zone.Zone_z0;// 华东区域
config2.useCdnDomain = true;
var options = {
  scope: config.Bucket,
// 上传策略设置文件过期时间，正式环境中要谨慎使用，文件在存储空间保存一天后删除
  deleteAfterDays: 1, 
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
};

var putPolicy = new qiniu.rs.PutPolicy(options);
var bucketManager = new qiniu.rs.BucketManager(mac, null);
app.get("/api/uptoken", function(req, res, next) {
  var token = putPolicy.uploadToken(mac);
  console.log(token);
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      uptoken: token,
      domain: config.Domain
    });
  }
});

app.listen(config.Port, function() {
  console.log("Listening on port %d\n", config.Port);
  console.log(
    "▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽  Demos  ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽"
  );
});