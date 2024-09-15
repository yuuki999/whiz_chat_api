import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  // ファイルにログを出力
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// 本番環境以外はコンソールにもログを出力
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;

// 使用例:
// import logger from './path/to/this/file';
//
// logger.error('エラーメッセージ', { errorDetails: 'エラーの詳細情報' });
// logger.warn('警告メッセージ');
// logger.info('情報メッセージ', { additionalInfo: '追加情報' });
// logger.debug('デバッグメッセージ'); // デフォルト設定では記録されない
//
// 異常終了時のログ例:
// logger.error('アプリケーションが異常終了しました', { 
//   error: error.message,
//   stack: error.stack
// });
//
// HTTPリクエストのログ例:
// logger.info('HTTPリクエストを受信しました', { 
//   method: req.method,
//   path: req.path,
//   ip: req.ip
// });
