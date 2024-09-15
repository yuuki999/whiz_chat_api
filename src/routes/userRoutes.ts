import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Get all users' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: `Get user with id ${req.params.id}` });
});

export default router;
