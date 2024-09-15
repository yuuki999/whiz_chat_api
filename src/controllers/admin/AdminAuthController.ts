// import { Request, Response, NextFunction } from 'express';
// import { adminAuthService } from '../../services/admin/authService';

// class AdminAuthController {
//   async login(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { email, password } = req.body;
//       const result = await adminAuthService.login(email, password);
//       res.json(result);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async register(req: Request, res: Response, next: NextFunction) {
//     // 管理者登録のロジック
//   }

//   async logout(req: Request, res: Response, next: NextFunction) {
//     // ログアウトのロジック
//   }

//   // その他の認証関連メソッド
// }

// export const adminAuthController = new AdminAuthController();


// TOD0: 管理画面実装時に着手
