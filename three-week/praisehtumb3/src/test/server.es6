import requester  from 'supertest';
import app  from '../app.js';
function request(){
    return requester(app.listen())
}
describe('测试接口路由', function() {
    it('点赞+1', function(done) {
      request(app)
        .get('/index/update')
        .expect(200)
        .end(function(err,res){
            if(res.data==1) return done(err);
        })
        done();
    });
  });