# مرحله 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# نصب وابستگی‌ها
COPY package*.json ./
RUN npm install

# کپی کد پروژه
COPY . .

# بیلد پروژه
RUN npm run build

# مرحله 2: اجرای برنامه
FROM node:18-alpine AS runner
WORKDIR /app

# فقط فایل‌های لازم
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
