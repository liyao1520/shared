const path = require("path");
const Koa = require("koa");
const static = require("koa-static");
const body = require("koa-body");
const fileRouter = require("./router/file");
const cors = require("koa-cors");
const app = new Koa();

app.use(cors());
app.use(static(path.resolve(__dirname, "../public")));
app.use(body());
app.use(fileRouter.allowedMethods());
app.use(fileRouter.routes());

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
