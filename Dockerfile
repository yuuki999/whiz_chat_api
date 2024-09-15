FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm ts-node nodemon

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV DATABASE_URL="postgresql://user:password@db:5432/mydb"
RUN npx prisma generate

# 非root ユーザーを作成して切り替え
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 開発モードでアプリケーションを起動
CMD ["pnpm", "run", "dev"]
