import Koa from 'koa';
import router from 'koa-simple-router'
import initController from "./controller/initController"
import serve from 'koa-static';
import render from 'koa-swig'
import convert from 'koa-convert'; //koa1 转换器
import co from 'co';
import babel_co from 'babel-core/register';
import babel_po from 'babel-polyfill'
import Config from './config/config'
const app = new Koa();
initController.init(app, router);


//views的路由封装
app.context.render = co.wrap(render({
	root: Config.get('viewDir'),
	autoescape: true,
	cache: 'memory', // disable, set to false 
	ext: 'html',
	writeBody: false
}));

//静态资源
app.use(convert(serve(Config.get('staticDir'))));

//CONFIG.get('port') =3000
app.listen(Config.get('port'));

export default app