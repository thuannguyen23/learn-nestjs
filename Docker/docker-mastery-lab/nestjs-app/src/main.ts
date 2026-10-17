import express, { Request, Response } from 'express';
import os from 'os';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const memoryHog: Buffer[] = [];

// 1. Endpoint chính: Hiển thị Container ID (hostname) và môi trường
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Xin chào từ NestJS/TypeScript Subject App! 🐳',
    containerHostname: os.hostname(),
    environment: process.env.NODE_ENV || 'development',
    databaseHost: process.env.DATABASE_HOST || 'chưa cấu hình',
    redisHost: process.env.REDIS_HOST || 'chưa cấu hình',
    pid: process.pid,
    uptimeSeconds: Math.round(process.uptime())
  });
});

// 2. Endpoint Healthcheck (Dùng cho Module 07 & 10)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 3. Endpoint ép tràn bộ nhớ RAM (Dùng để test OOM Kill ở Module 04)
app.get('/stress-ram', (_req: Request, res: Response) => {
  // Cấp phát liên tiếp 100MB vào bộ nhớ RAM
  for (let i = 0; i < 10; i++) {
    memoryHog.push(Buffer.alloc(10 * 1024 * 1024, 'x'));
  }
  const usedMb = Math.round(process.memoryUsage().rss / 1024 / 1024);
  res.json({ warning: 'Đã bơm thêm 100MB vào RAM!', currentMemoryRssMB: usedMb });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [App PID: ${process.pid}] Server đang lắng nghe tại http://0.0.0.0:${PORT}`);
});

// 4. Xử lý Graceful Shutdown khi nhận tín hiệu SIGTERM từ lệnh 'docker stop'
process.on('SIGTERM', () => {
  console.log('⚠️ Nhận tín hiệu SIGTERM từ Docker! Đang đóng kết nối an toàn (Graceful Shutdown)...');
  server.close(() => {
    console.log('✅ Đã đóng toàn bộ kết nối HTTP an toàn. Tạm biệt!');
    process.exit(0);
  });
});
// Cap nhat luc Thứ bảy, 17 Tháng 10 năm 2026 22:46:28 +07
