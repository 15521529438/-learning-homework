import index from'./indexController'
const controllerInit = {
    init(app, router) {
        app.use(router(_ => {
            _.get('/index/index', index.index())
            //index/updata 方法调用了sql的封装，直接这个路径就能访问数据库
            _.get('/index/updata', index.update())
        }))
    }
}

export default controllerInit;