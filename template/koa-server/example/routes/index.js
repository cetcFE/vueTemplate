import Router from 'koa-router';

import ApiRouter from './api';

const router = new Router();

router.use('/api/v1', ApiRouter.routes());
export default router;
