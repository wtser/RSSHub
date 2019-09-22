const Router = require('koa-router');
const router = new Router();

// 政府服务
router.get('/yuhanggov/:col', require('./custom_routes/yuhanggov/index'));
router.get('/koushuiloushi', require('./custom_routes/koushuiloushi/index'));

router.get('/saraba1st/forum/:id', require('./custom_routes/saraba1st/forum'));

// yande.re
router.get('/yande.re/post/popular_recent', require('./custom_routes/yande.re/post_popular_recent'));
router.get('/yande.re/post/popular_recent/:period', require('./custom_routes/yande.re/post_popular_recent'));

module.exports = router;
