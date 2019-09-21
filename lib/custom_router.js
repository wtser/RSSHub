const Router = require('koa-router');
const router = new Router();

// 政府服务
router.get('/yuhanggov/:col', require('./custom_routes/yuhanggov/index'));

module.exports = router;
