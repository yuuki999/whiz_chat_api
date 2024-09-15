import express from 'express';
import v1Routes from './v1';

const apiRouter = express.Router();
apiRouter.use('/v1', v1Routes);

export default apiRouter;


// 将来的に v2 を追加する場合:
// import v2Routes from './v2';
// router.use('/v2', v2Routes);
