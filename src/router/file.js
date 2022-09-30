const path = require("path");
const fs = require("fs");
const Router = require("koa-router");
const multer = require("koa-multer");
const dayjs = require("dayjs");

const uploadPath = path.resolve(__dirname, "../../upload");

const TEST_FILE = "a测试文件.txt";

if (!fs.existsSync(path.resolve(uploadPath, TEST_FILE))) {
  fs.writeFileSync(path.resolve(uploadPath, TEST_FILE), "这是一个测试文件", {
    encoding: "utf-8",
  });
}

let storage = multer.diskStorage({
  destination: uploadPath,
  filename: (ctx, file, cb) => {
    console.log(file);
    const [infoList, ext] = file.originalname.split(".");
    const filename = [
      infoList,
      dayjs(new Date()).format("MM-DD_HH_mm_ss"),
      ext,
    ].join(".");
    cb(null, filename);
  },
});

let upload = multer({
  storage: storage,
});

const fileRouter = new Router({ prefix: "/api/file" });

fileRouter.post("/upload", upload.single("file"), async (ctx) => {
  const file = ctx.req.file;
  if (file) {
    ctx.body = {
      code: 1,
    };
  } else {
    ctx.body = {
      code: 0,
    };
  }
});
fileRouter.get("/list", upload.single("file"), async (ctx) => {
  ctx.body = {
    fileList: fs.readdirSync(uploadPath),
  };
});
fileRouter.get("/:filename", async (ctx) => {
  const filename = ctx.params.filename;
  if (filename) {
    const filePath = path.resolve(uploadPath, filename);
    if (fs.existsSync(filePath)) {
      ctx.body = fs.createReadStream(filePath);
    }
  }
});

// 轮询删除过期文件

const MAX_TIME = 1000 * 60 * 10;

function checkFileList() {
  const handler = () => {
    const now = Date.now();
    for (const filename of fs.readdirSync(uploadPath)) {
      if (filename === TEST_FILE) continue;
      const filePath = path.resolve(uploadPath, filename);
      const info = fs.statSync(filePath);
      const time = info.mtime.getTime();
      const t = now - time; //过去多久了
      if (t > MAX_TIME) {
        //应该删除的
        fs.unlinkSync(filePath);
      }
    }
  };
  handler();
  setInterval(() => {
    handler();
  }, MAX_TIME);
}
checkFileList();
module.exports = fileRouter;
