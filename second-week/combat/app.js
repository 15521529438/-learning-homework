const Koa = require('koa');
const render = require('koa-swig');
const static = require('koa-static');
const app = module.exports = new Koa();
const co = require('co');
const router = require('koa-simple-router');
const mysql  = require('mysql');

// 配置静态web服务的中间件
app.use(static('./public'));//这个地址巨坑。。。。。我靠

app.context.render = co.wrap(render({
  writeBody: false
}));


app.use(router(_ => {
  _.get('/',  async (ctx, next) => {
  		ctx.body = await ctx.render('index');
  })
  _.get('/index/index',  (ctx, next) => {
  		ctx.redirect('http://www.baidu.com');
  })
  _.post('/transfers',  (ctx, next) => {
   		console.log(ctx);
 		ctx.status = 301;
 		// ctx.set('Referrer', 'balabala');
		ctx.redirect('http://192.168.1.101/liksphp/mysql.php?num=2');
		ctx.body = {
			status: 'success!'
		}
  })
  _.post('/path', (ctx, next) => {
 		ctx.body = {
 			aa:111
 		}
  })
}))

// app.use(async ctx => ctx.body = await ctx.render('index'));



if (!module.parent) app.listen(3000,()=>{
    console.log('Server start！')
});
