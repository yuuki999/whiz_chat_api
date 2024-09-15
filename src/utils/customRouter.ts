import { Router, Request, Response, NextFunction } from 'express';

/**
 * CustomRouterクラス
 * 
 * このクラスはExpressのRouterをラップし、全てのルートハンドラに自動的に
 * asyncHandlerを適用します。以下の問題を解決するために作成されました：
 * 
 * 1. ルート定義でasyncHandlerを繰り返し使用する必要性
 * 2. ルート間でのエラーハンドリングの不一致
 * 3. ルートハンドラ定義における型安全性の欠如
 *
 */

export class CustomRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  /**
   * asyncHandler関数
   * 
   * この関数は非同期のルートハンドラをラップし、以下の役割を果たします：
   * 
   * 1. 非同期関数内で発生した例外をキャッチする
   * 2. キャッチした例外を適切にExpressのエラーハンドリングミドルウェアに渡す
   * 
   * 動作の詳細：
   * - 渡された関数（fn）を Promise.resolve() でラップし、必ずPromiseとして扱えるようにする
   * - Promiseがrejectされた場合（エラーが発生した場合）、catchブロックで捕捉し、next関数にエラーを渡す
   * - これにより、エラーがExpressのエラーハンドリングミドルウェアに適切に渡される
   * 
   * この関数の利点：
   * - try-catchブロックを各ルートハンドラに書く必要がなくなる
   * - 非同期エラーを確実にキャッチし、アプリケーションのクラッシュを防ぐ
   * - エラーハンドリングのロジックを一箇所に集中させ、保守性を向上させる
   * 
   * @param fn ラップする非同期ルートハンドラ関数
   * @returns Expressミドルウェア関数
   */
  private asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // GETメソッド
  get(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.get(path, this.asyncHandler(handler));
  }

  // POSTメソッド
  post(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.post(path, this.asyncHandler(handler));
  }

  // PUTメソッド
  put(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.put(path, this.asyncHandler(handler));
  }

  // PATCHメソッド
  patch(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.patch(path, this.asyncHandler(handler));
  }

  // DELETEメソッド
  delete(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.delete(path, this.asyncHandler(handler));
  }

  // OPTIONSメソッド
  options(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.options(path, this.asyncHandler(handler));
  }

  // HEADメソッド
  head(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.head(path, this.asyncHandler(handler));
  }

  // ALLメソッド（全てのHTTPメソッドにマッチ）
  all(path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    this.router.all(path, this.asyncHandler(handler));
  }

  // ミドルウェアを追加するメソッド
  use(handler: (req: Request, res: Response, next: NextFunction) => void) {
    this.router.use(handler);
  }

  // 内部のExpressルーターを返すメソッド
  getRouter() {
    return this.router;
  }
}
