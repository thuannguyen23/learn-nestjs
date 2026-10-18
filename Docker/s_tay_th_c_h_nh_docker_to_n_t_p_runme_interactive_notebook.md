# 🐳 DOCKER MASTERY: TỪ BEGINNER ĐẾN MASTER (INTERACTIVE RUNME NOTEBOOK)

> **Chào mừng bạn đến với lộ trình học Docker thực chiến!**
> Tài liệu này được thiết kế như một **Phòng Lab Tương tác (Interactive Notebook)** dành riêng cho VS Code với extension **Runme**. Bạn vừa đọc lý thuyết chuyên sâu, vừa bấm nút **`▶ Run`** ngay bên cạnh từng khối lệnh để thấy kết quả trực tiếp mà không cần gõ lại hay chuyển cửa sổ.

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT RUNME & CAM KẾT "AN TOÀN 100% CHO MÁY CHÍNH"

### 1. Cách biến file `.md` này thành Notebook giống Google Colab trên VS Code

1. Mở **VS Code** trên máy của bạn.
2. Vào mục **Extensions** (`Ctrl+Shift+X` hoặc `Cmd+Shift+X`), tìm từ khóa **`Runme`** (ID: `stateful.runme`) và bấm **Install**.
3. Lưu file này với tên `DOCKER_MASTERY_RUNME.md` vào một thư mục trống trên máy.
4. Nhấp chuột phải vào file `DOCKER_MASTERY_RUNME.md` → chọn **Open With...** → chọn **Runme Notebook** (hoặc đặt làm mặc định).
5. Ngay lập tức, mọi khối lệnh `bash` bên dưới sẽ xuất hiện nút **`▶ Run`**. Khi bạn bấm chạy, Terminal tích hợp sẽ thực thi và in kết quả ngay bên dưới khối lệnh đó!

### 2. Tại sao chạy trên máy cá nhân по lộ trình này lại KHÔNG BAO GIỜ làm hỏng máy?

Nhiều người mới học sợ chạy lệnh tạo file, cài cắm thư viện làm rác hệ điều hành. Trong tài liệu này:

- **Cô lập hoàn toàn trong thư mục `./docker-mastery-lab`:** Mọi câu lệnh tạo code, tạo `Dockerfile`, `docker-compose.yml` đều tự động gom vào thư mục con `./docker-mastery-lab`. Bạn không cần cài PostgreSQL, Redis, MySQL hay thậm chí không cần cài Node.js lên máy thật!
- **Mỗi Module đều có nút "🧹 Dọn dẹp an toàn":** Cuối mỗi bài học đều có một ô lệnh giúp bạn xóa sạch các container/network nháp của bài đó.
- **Module 01 → 11 chạy trên máy cá nhân, Module 12 chạy trên VPS thật:** Bạn học và hiểu rõ bản chất ở máy mình trước, sau đó đến bài cuối sẽ đẩy toàn bộ hệ thống lên VPS thật qua GitHub Actions CI/CD.

---

## 🗺️ BẢN ĐỒ LỘ TRÌNH 12 MODULES (BEGINNER → MASTER)

| Module        | Tên Module                    | Trọng tâm cốt lõi & Case Study thực tế                                                                               | Môi trường   |
| :------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------- | :----------- |
| **Module 00** | **Lab Setup & Subject App**   | Tự động khởi tạo dự án NestJS mẫu có sẵn các API test lỗi, RAM, DB, Redis                                            | Máy cá nhân  |
| **Module 01** | **Hello Docker & Kiến trúc**  | Bài toán "Chạy được trên máy tôi", Container vs VM, kiến trúc Client-Host-Registry                                   | Máy cá nhân  |
| **Module 02** | **Giải phẫu Docker Images**   | UnionFS Layers, Writable Layer, `docker diff`, `commit`, đóng gói `.tar` (`save`/`load`)                             | Máy cá nhân  |
| **Module 03** | **Dockerfile Mastery**        | Layer Caching, bẫy Build Context (`demo/test` vs `demo`), `.dockerignore`, tiến hóa `v1` → `v3`          | Máy cá nhân  |
| **Module 04** | **Containers Deep Dive**      | Vòng đời, `SIGTERM` vs `SIGKILL`, `exec`/`inspect`, ép tràn RAM xem **OOM Kill (Exit 137)**                          | Máy cá nhân  |
| **Module 05** | **Volumes & Bind Mounts**     | Persistent Data, bẫy `:ro` vs `:rw`, Anonymous Volume của MySQL, Utility Containers                                  | Máy cá nhân  |
| **Module 06** | **Docker Networking**         | IPTables/NAT, Default Bridge (`--link`) vs Custom Bridge (DNS), Multi-Network, Network Alias                         | Máy cá nhân  |
| **Module 07** | **Docker Compose Cơ bản**     | Tiến hóa `v1` → `v3` (NestJS + Postgres + Redis + Adminer), bẫy `depends_on` & `healthcheck`             | Máy cá nhân  |
| **Module 08** | **Docker Compose Nâng cao**   | Cơ chế Auto-merge `override.yml`, tách `prod.yml`, `profiles` và `Makefile` chuẩn công ty                            | Máy cá nhân  |
| **Module 09** | **Multi-Stage Builds**        | Tận dụng output stage trước làm input stage sau: Ép cân Image từ **~1.1GB xuống ~90MB**                              | Máy cá nhân  |
| **Module 10** | **Development vs Production** | Hot-reload + Debug (`9229`) cho Dev vs Non-root + Healthcheck + Graceful Shutdown cho Prod                           | Máy cá nhân  |
| **Module 11** | **Security & Debugging**      | Chống leo thang đặc quyền (`--read-only`, `cap-drop`), quét lỗ hổng, bắt bệnh Crash-Loop                             | Máy cá nhân  |
| **Module 12** | **CI/CD trên VPS & Beyond**   | GitHub Actions tự động Build → Push Registry → SSH Deploy lên **VPS thật**, Monitoring & K8s | **VPS Thật** |

---

# 🚀 MODULE 00: KHỞI TẠO PHÒNG LAB & ỨNG DỤNG MẪU (SUBJECT APP)

> 🎯 **Mục tiêu:** Chỉ với 1 cú click chuột, tự động tạo ra thư mục phòng lab `./docker-mastery-lab` và một dự án **NestJS/Node.js (TypeScript)** thu nhỏ dùng xuyên suốt từ bài 1 đến bài 12.

### Tại sao chúng ta cần bước này?

Thay vì bắt bạn phải tự gõ code ứng dụng, ô lệnh bên dưới sẽ tự động sinh ra thư mục `docker-mastery-lab/nestjs-app` chứa một ứng dụng TypeScript có đầy đủ các endpoint đặc biệt phục vụ cho việc học Docker:

- `GET /`: Trả về thông tin Container ID (chính là `hostname` bên trong container) và phiên bản.
- `GET /health`: Dùng để kiểm tra sức khỏe container ở Module 07, 10.
- `GET /stress-ram`: Cố tình cấp phát mảng lớn trong RAM để bạn tận mắt chứng kiến Docker cắt cổ tiến trình (**OOM Kill - Exit Code 137**) ở Module 04!
- `SIGTERM` Listener: Lắng nghe tín hiệu tắt máy để thực hành **Graceful Shutdown** ở Module 10.

👉 **Bấm nút `▶ Run` ở ô bên dưới để khởi tạo Phòng Lab:**

```bash
set -e
mkdir -p docker-mastery-lab/nestjs-app/src

cat << 'EOF' > docker-mastery-lab/nestjs-app/package.json
{
  "name": "nestjs-docker-mastery",
  "version": "1.0.0",
  "description": "Subject App cho lo trinh Docker Beginner to Master",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "start:dev": "tsc --watch & node --watch dist/main.js",
    "test": "echo '✅ All unit tests passed!' && exit 0"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3"
  }
}
EOF

cat << 'EOF' > docker-mastery-lab/nestjs-app/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
EOF

cat << 'EOF' > docker-mastery-lab/nestjs-app/src/main.ts
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
EOF

echo "✅ Đã khởi tạo thành công thư mục './docker-mastery-lab/nestjs-app'!"
ls -la docker-mastery-lab/nestjs-app
```

---

# 📘 MODULE 01: HELLO DOCKER — DOCKER LÀ GÌ & KIẾN TRÚC CỐT LÕI

> 🎯 **Mục tiêu:** Hiểu tận gốc bài toán Docker giải quyết, sự khác biệt giữa Container và Máy ảo (VM), kiến trúc Client-Host-Registry, và chạy những container đầu tiên.

### 1. Lý thuyết Chuyên sâu (Dành cho người mới bắt đầu)

### 1.1. Cơn ác mộng "Trên máy em chạy ngon, lên máy sếp lại lỗi!" (It works on my machine)

Hãy tưởng tượng một quy trình làm phần mềm kinh điển mà ai đi làm cũng từng nếm trải:

1. **Trên máy bạn (Dev):** Bạn dùng MacBook cài Node.js v20, có sẵn bộ thư viện xử lý ảnh mới nhất. Code chạy mượt mà 100%!
2. **Gửi sang máy Tester:** Máy Tester là Windows đang cài Node.js v16 từ một dự án cũ và thiếu thư viện C++ hệ thống → **Báo lỗi đỏ lòm, Tester bắt bạn sửa!**
3. **Đem lên máy chủ Production:** Server chạy Linux Ubuntu nhưng khác bản phân phối → **Nửa đêm server sập vì thiếu file ngầm của hệ điều hành!**

💡 **Cách Docker giải quyết triệt để:**
Thay vì chỉ gửi mỗi "mã nguồn code", Docker đóng gói **Toàn bộ Mã nguồn + Node.js v20 + Đúng các thư viện hệ điều hành + Biến môi trường** vào một **"Chiếc Hộp Tiêu Chuẩn"** duy nhất gọi là **Container**.
Chiếc hộp này mang sang máy Windows, macOS hay Linux Server đều chạy **giống hệt nhau 100%** không sai lệch một dấu phẩy!

---

### 1.2. So sánh Trực quan: Container vs Máy ảo (Virtual Machine - VMWare/VirtualBox)

Rất nhiều người mới lầm tưởng Container là một loại Máy ảo thu nhỏ. Hãy xem sự khác biệt sống còn này:

```ini
+--------------------------------------------------+--------------------------------------------------+
|          MÁY ẢO (VIRTUAL MACHINE - VM)           |               DOCKER CONTAINER                   |
|       (Ẩn dụ: Thuê Nguyên Căn Biệt Thự)          |          (Ẩn dụ: Thuê Căn Hộ Chung Cư)           |
+--------------------------------------------------+--------------------------------------------------+
| [App A]  [App B]                                 | [App A]  [App B]  [App C]                        |
| [Libs]   [Libs]                                  | [Libs]   [Libs]   [Libs]                         |
| [HỆ ĐIỀU HÀNH KHÁCH (GUEST OS - Nặng 10-20GB)]   | (Không cần OS riêng! Dùng chung Kernel máy chủ)  |
| [Phần mềm Giả lập phần cứng (Hypervisor)]        | [Docker Engine (Bộ điều phối siêu nhẹ)]          |
| [Hệ điều hành máy thật (Host OS)]                | [Hệ điều hành máy thật (Host OS)]                |
| [Phần cứng máy tính (CPU / RAM / Ổ cứng)]        | [Phần cứng máy tính (CPU / RAM / Ổ cứng)]        |
+--------------------------------------------------+--------------------------------------------------+
| ❌ Nặng nề: Mỗi VM vác theo một OS riêng (Windows| ⚡ Siêu nhẹ: Các container dùng chung Nhân Linux |
|    hoặc Ubuntu) ngốn hàng chục GB ổ cứng.        |    (Kernel), chỉ đóng gói phần mềm của bạn (~50MB)|
| ❌ Khởi động chậm: Mất từ 1 đến 3 phút để boot OS| ⚡ Bật tắt tức thì: Khởi động chỉ mất 0.2 GIÂY!  |
| ❌ Ngốn tài nguyên: Bật 3 máy ảo là đơ cả máy tính| ⚡ Tiết kiệm: 1 máy tính có thể bật cả 50 container|
+--------------------------------------------------+--------------------------------------------------+
```

---

### 1.3. Khái niệm Cốt lõi: Image vs Container là gì?

- **Docker Image (Khuôn đúc bánh quy / Bản thiết kế nhà):**
  - Là một file tĩnh, đóng băng bất biến (Read-Only).
  - Nó chứa toàn bộ hệ điều hành rút gọn, thư viện và mã nguồn code của bạn.
  - Bản thân Image **không thể chạy được**, nó chỉ nằm im trên ổ cứng như một chiếc khuôn đúc.

- **Docker Container (Chiếc bánh quy thật / Ngôi nhà được xây xong):**
  - Là một thực thể sống đang chạy trên RAM được sinh ra từ Image.
  - Từ **1 Image duy nhất**, bạn có thể tạo ra **hàng chục Container giống hệt nhau** chỉ trong vài giây!

- 📌 **Quy tắc bất di bất dịch:** _1 Docker Image có thể tạo ra vô số Container, nhưng mỗi Container chỉ thuộc về đúng 1 Image gốc duy nhất._

---

### 1.4. Kiến trúc 3 Chân kiềng: Docker Client — Docker Host — Docker Registry

```ini
+-----------------------+              (Socket nội bộ HOẶC Mạng Internet)             +-----------------------+
|     DOCKER CLIENT     | ----------------------------------------------------------> |      DOCKER HOST      |
|  (Chiếc Remote)       |                                                             |   (Cục Máy Lạnh)      |
|  - Nơi bạn gõ lệnh:   |                                                             |  - Chạy ngầm dockerd  |
|    docker run         |                                                             |  - Quản lý Container  |
|    docker build       |                                                             |  - Tải & lưu trữ Image|
+-----------------------+                                                             +-----------┬-----------+
                                                                                                  │
                                                                       Tải Image về (docker pull) │
                                                                       Đẩy Image lên (docker push)│
                                                                                                  v
                                                                                      +-----------------------+
                                                                                      |    DOCKER REGISTRY    |
                                                                                      |   (Kho Ứng Dụng Chợ)  |
                                                                                      |  - Docker Hub         |
                                                                                      |  - GitHub Packages    |
                                                                                      |  - AWS ECR            |
                                                                                      +-----------------------+
```

- **Docker Client (`docker`):** Là công cụ dòng lệnh (CLI) bạn gõ phím. Nó giống chiếc **Remote điều khiển**: chỉ nhận lệnh của bạn rồi gửi yêu cầu đi, bản thân nó không tốn RAM chạy container.
- **Docker Host (`dockerd` - Daemon):** Là cỗ máy chạy ngầm trên máy tính (hoặc trên VPS). Nó mới là anh thợ làm việc thực sự: tải image, cấp phát RAM, CPU và bảo vệ container.
- **Docker Registry (Kho chứa):** Nơi cả thế giới chia sẻ các image mẫu (giống như App Store / Google Play). Nổi tiếng nhất là **Docker Hub**.

> 🔍 **4 Tình huống thực tế bạn cần nhớ:**
>
> 1. **Khi máy chưa có Image:** Bạn gõ `docker run nginx` → Docker Daemon thấy trong máy chưa có khuôn `nginx` → Tự động lên Docker Hub tải (`pull`) về → Tạo và bật Container.
> 2. **Khi máy đã có sẵn Image:** Lần thứ 2 bạn gõ `docker run nginx` → Docker Daemon lấy ngay khuôn có sẵn trong máy để đẻ ra Container mới trong 0.2 giây mà không cần tải lại!
> 3. **Client và Host không nằm cùng 1 máy:** Bạn có thể ngồi ở laptop cá nhân (Docker Client) gõ lệnh điều khiển Docker Daemon đang chạy trên một con VPS ở tận Singapore!
> 4. **Private Registry:** Các công ty lớn không đẩy code mật lên Docker Hub công khai mà tự dựng Registry riêng (Harbor, GitHub Container Registry, AWS ECR).

---

### 1.5. Cấu trúc chuẩn của mọi câu lệnh Docker hiện đại

Thay vì học vẹt hàng trăm lệnh rời rạc, bạn chỉ cần nhớ đúng 1 công thức nhất quán:

```text
docker <object> <command> <options>
```

- `<object>` (Đối tượng bạn muốn điều khiển): `container`, `image`, `volume`, `network`, `system`...
- `<command>` (Hành động muốn làm): `run`, `ls`, `stop`, `rm`, `inspect`, `logs`, `prune`...
- `<options>` (Tham số bổ sung): `-d` (chạy ngầm), `-p` (mở cổng), `-v` (gắn ổ đĩa)...
- _Ví dụ chuẩn:_
  - Quản lý container: `docker container ls`, `docker container stop my-app`, `docker container rm my-app`
  - Quản lý image: `docker image ls`, `docker image rm my-image`
  - Quản lý ổ đĩa: `docker volume ls`, `docker volume create my-vol`
  - _(Lưu ý: `docker ps` là cách viết tắt cũ của `docker container ls`)._

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Kiểm tra kết nối giữa Docker Client và Docker Daemon

Bấm `▶ Run` để xem phiên bản của cả Client lẫn Server (Daemon):

```bash {"terminalRows":"20"}
docker version
```

**Giải thích:** Nếu bạn thấy cả 2 phần `Client:` và `Server: Docker Engine` hiện ra, nghĩa là Docker Daemon trên máy bạn đang sống khỏe mạnh!

### Bước 2: Chạy Container đầu tiên (`hello-world`)

```bash
docker container run hello-world
```

**Chuyện gì vừa xảy ra trong 2 giây đó?**

1. Docker Client gửi lệnh `run hello-world` cho Docker Daemon.
2. Daemon tìm trong máy chưa thấy image `hello-world:latest` → Tự kéo từ Docker Hub về.
3. Daemon tạo một container mới từ image đó, chạy chương trình in ra dòng chữ chào mừng rồi **tự động dừng lại** (vì nhiệm vụ của nó chỉ là in chữ rồi kết thúc).

### Bước 3: Khởi chạy Web Server `Nginx` chạy ngầm và ánh xạ cổng (Port Mapping)

```bash
# Xóa container cũ nếu đã tồn tại để lệnh luôn chạy mượt
docker container rm -f my-nginx 2>/dev/null || true

# Chạy container nginx ở chế độ chạy ngầm (-d) và nối cổng 8080 của máy bạn vào cổng 80 của container
docker container run --name my-nginx -p 8080:80 -d nginx:alpine

# Kiểm tra danh sách container đang chạy
docker container ls

# Dùng curl gọi thử vào cổng 8080 trên máy của bạn
curl -I http://localhost:8080
```

**Giải thích từng tham số cực kỳ quan trọng:**

- `--name my-nginx`: Đặt tên dễ nhớ cho container (nếu bỏ qua, Docker sẽ tự đặt tên ngẫu nhiên kiểu `epic_jennings`).
- `-d` (_Detached mode_): Cho container chạy ngầm dưới nền để trả lại cửa sổ Terminal cho bạn làm việc tiếp.
- `-p 8080:80` (_Port Mapping_ theo cú pháp `Cổng_Máy_Host : Cổng_Container`): Bên trong container, Nginx mặc định lắng nghe ở cổng `80`. Nhờ `-p 8080:80`, mọi truy cập vào `http://localhost:8080` trên máy bạn sẽ được chuyển thẳng vào cổng `80` của container `my-nginx`.

### Bước 4: Chứng minh "Container chỉ là 1 tiến trình bị cô lập"

Hãy dùng lệnh `docker container exec` để chạy lệnh xem tiến trình (`ps aux`) và thông tin hệ điều hành (`cat /etc/os-release`) **bên trong** container `my-nginx`:

```bash
echo "=== 1. Hệ điều hành bên trong container my-nginx ==="
docker container exec my-nginx cat /etc/os-release

echo ""
echo "=== 2. Toàn bộ các tiến trình mà container my-nginx nhìn thấy ==="
docker container exec my-nginx ps aux
```

**Tại sao kết quả lại thú vị đến vậy?**

- Máy chính của bạn đang mở hàng trăm phần mềm (VS Code, trình duyệt...), nhưng khi đứng bên trong container `my-nginx` và gõ `ps aux`, nó chỉ nhìn thấy **đúng 2–3 tiến trình của riêng Nginx** với `PID 1` là `nginx: master process`! Đó chính là sức mạnh cô lập của Linux Namespaces.

### Bước 5: Dọn dẹp sạch sẽ sau Module 01

```bash
docker container stop my-nginx
docker container rm my-nginx
echo "🧹 Đã dừng và xóa sạch container my-nginx!"
```

---

## 3. Bài tập Thực hành Module 01 (Kèm lời giải bấm chạy được)

**Đề bài:**

1. Chạy một container từ image `alpine` (hệ điều hành Linux siêu nhẹ chỉ ~7MB), yêu cầu nó in ra câu `"Xin chào Docker từ Alpine!"` rồi tự xóa container ngay sau khi chạy xong (Gợi ý: dùng cờ `--rm`).
2. Chạy một container Apache (`httpd:alpine`) đặt tên là `test-apache` ở cổng `3001` của máy bạn (cổng mặc định của Apache trong container là `80`), kiểm tra bằng `curl`, sau đó xóa sạch nó.

👉 **Sau khi tự suy nghĩ, bạn có thể bấm `▶ Run` bên dưới để kiểm tra lời giải thực tế:**

```bash {"terminalRows":"30"}
echo "--- Giải Bài 1 ---"
docker container run --rm alpine echo "Xin chào Docker từ Alpine!"

echo "--- Giải Bài 2 ---"
docker container rm -f test-apache 2>/dev/null || true
docker container run -d --name test-apache -p 3001:80 httpd:alpine
sleep 2
curl -s http://localhost:3001 | head -n 5
docker container rm -f test-apache
echo "✅ Đã hoàn thành bài tập Module 01 và dọn dẹp sạch sẽ!"
```

---

# 📘 MODULE 02: DOCKER IMAGES — HỆ THỐNG PHÂN LỚP (LAYERS), WRITABLE LAYER & PHÂN PHỐI

> 🎯 **Mục tiêu:** Hiểu sâu cấu tạo các lớp (Layers) của Image, phân biệt Read-only Layers và Writable Layer, thực hành `docker diff`, `docker commit`, và đóng gói Image ra file `.tar` (`save`/`load`).

## 1. Lý thuyết Chuyên sâu (Dành cho người mới bắt đầu)

### 1.1. Cấu tạo của Docker Image: Ẩn dụ "Những tấm kính xếp chồng" (Layered System)

Một Docker Image không phải là một cục file nhị phân to đùng nguyên khối. Thay vào đó, nó được cấu tạo từ **nhiều lớp kính mỏng trong suốt xếp chồng lên nhau**:

```ini
[ Tấm kính số 4: CMD ["node", "dist/main.js"] ] ---> (0B - Đổi metadata cấu hình)
----------------------------------------------------------------------------------
[ Tấm kính số 3: COPY . /app                  ] ---> (Chứa 2MB mã nguồn code của bạn)
----------------------------------------------------------------------------------
[ Tấm kính số 2: RUN npm install              ] ---> (Chứa 150MB thư viện node_modules)
----------------------------------------------------------------------------------
[ Tấm kính số 1: FROM node:20-alpine          ] ---> (Chứa 50MB hệ điều hành Linux rút gọn)
```

- Mỗi dòng lệnh trong Dockerfile (`FROM`, `RUN`, `COPY`) sẽ tạo ra **một tấm kính mới (Layer)** đặt đè lên trên.
- **Tính chất Bất Biến (Immutable - Read-Only):** Tất cả các tấm kính này một khi đã tạo ra thì **bị đóng băng vĩnh viễn 100%**, không ai có thể sửa đổi nội dung bên trong nó!
- **Tại sao có Layer nặng 0 Byte?** Những câu lệnh như `ENV`, `EXPOSE`, `WORKDIR`, `CMD` không tạo thêm file nào vào ổ cứng mà chỉ bổ sung thông tin ghi chú cấu hình (metadata) nên dung lượng của nó là 0 Byte.

---

### 1.2. Writable Layer: Bí mật giúp Container vừa an toàn vừa cực nhanh!

Nếu tất cả các Layer của Image đều bị đóng băng chỉ đọc, vậy khi ứng dụng NestJS chạy lên, tạo file log, tải ảnh người dùng lên thì file đó lưu vào đâu?

👉 **Đáp án:** Khi bạn bật Container, Docker lập tức phủ lên trên cùng một lớp nhựa trong suốt siêu mỏng gọi là **Writable Layer (Lớp ghi đè)**:

```ini
+==================================================================================+
|  WRITABLE LAYER (Container Layer - Có quyền Đọc & Ghi)                           |
|  - Mọi thao tác tạo file log, sửa file, xóa file khi app chạy ĐỀU NẰM Ở ĐÂY!     |
+==================================================================================+
|  Layer 4: CMD ["node", "dist/main.js"]           (Chỉ đọc - Đóng băng)           |
|  Layer 3: COPY . /app                            (Chỉ đọc - Đóng băng)           |
|  Layer 2: RUN npm install                        (Chỉ đọc - Đóng băng)           |
|  Layer 1: FROM node:20-alpine                    (Chỉ đọc - Đóng băng)           |
```

#### Cơ chế Thần thánh: Copy-on-Write (CoW)

- Nếu Container muốn **đọc** file của Image: Nó nhìn xuyên qua lớp Writable xuống tấm kính bên dưới để đọc.
- Nếu Container muốn **sửa** 1 file có sẵn của Image: Docker không sửa trên tấm kính gốc, mà **nhân bản file đó copy ngược lên Writable Layer** rồi mới sửa trên lớp này. Các tấm kính gốc bên dưới vẫn nguyên vẹn 100%!
- 👉 **Hệ quả sống còn:** Khi bạn xóa Container (`docker rm`), **chỉ có duy nhất Writable Layer bị vứt vào sọt rác**. Image gốc của bạn không hề sứt mẻ một ly nào! Bạn có thể bật 10 container cùng chạy 1 lúc từ 1 Image mà không sợ chúng làm hỏng file của nhau.

---

### 1.3. Ba công cụ Soi và Đóng băng Layer: `diff`, `commit` và `save/load`

1. **`docker container diff <tên_container>` (Kính hiển vi soi Writable Layer):**
   - Lệnh này liệt kê chính xác những gì container đã làm trên Writable Layer:
     - `A` (Add): File mới được tạo thêm.
     - `C` (Change): File/thư mục có sẵn bị chỉnh sửa.
     - `D` (Delete): File bị đánh dấu xóa.

2. **`docker container commit <tên_container> <tên_image_mới>`:**
   - Lấy toàn bộ Writable Layer tạm bợ đó, **đóng băng nó thành một tấm kính mới** để tạo ra một Docker Image vĩnh cửu.

3. **`docker image save` vs `docker image load` (Chuyển giao không cần Internet):**
   - Bình thường bạn chia sẻ Image qua Docker Hub (`push`/`pull`).
   - Nhưng ở các môi trường quân sự, ngân hàng hoặc mạng nội bộ cấm Internet: Bạn dùng lệnh `docker save` để nén toàn bộ các Layer thành 1 file **`.tar`**, chép vào USB mang sang máy khác gõ `docker load` để giải nén ra dùng!

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Mổ xẻ các Layer của một Image bằng `docker image history`

Hãy kéo image `node:20-alpine` về và soi từng lớp bên trong nó:

```bash {"terminalRows":"30"}
docker image pull node:20-alpine
echo ""
echo "=== CÁC LAYER CỦA IMAGE node:20-alpine ==="
docker image history node:20-alpine
```

**Quan sát kết quả:** Bạn sẽ thấy các dòng có kích thước `0B` (như `ENV NODE_VERSION`, `CMD ["node"]`) xen kẽ với các dòng có dung lượng vài chục MB (chứa nhân Alpine Linux và bộ cài Node.js).

### Bước 2: Thí nghiệm "Writable Layer", `docker container diff` và `docker container commit`

Chúng ta sẽ chạy một container `alpine`, tạo sẵn 2 file `file1.txt` và `file2.txt`. Sau đó xóa `file1.txt`, tạo mới `hihi.txt`, dùng `docker container diff` để bắt tận tay sự thay đổi trên Writable Layer, rồi đóng băng nó thành một Image mới!

```bash
# Dọn dẹp nếu có từ lần chạy trước
docker container rm -f demo-writable new-container 2>/dev/null || true
docker image rm -f image-from-commit:v1 2>/dev/null || true

# 1. Tạo một container từ alpine
docker container run -d --name demo-writable alpine sleep 3600

# 2. Thực hiện thay đổi bên trong Writable Layer của container
docker container exec demo-writable sh -c "echo 'Hello' > /hihi.txt && rm -f /etc/motd"

# 3. Soi sự thay đổi trên Writable Layer bằng docker container diff
echo "=== KẾT QUẢ SOI WRITABLE LAYER (docker container diff) ==="
docker container diff demo-writable

# 4. Đóng băng container này thành một Docker Image mới (docker container commit)
echo ""
echo "=== BIẾN CONTAINER THÀNH IMAGE MỚI ==="
docker container commit demo-writable image-from-commit:v1

# 5. Chạy một container MỚI từ image vừa commit để xem file /hihi.txt có nằm sẵn trong đó không
echo "=== KIỂM TRA NỘI DUNG TRONG CONTAINER SINH RA TỪ IMAGE MỚI ==="
docker container run --rm image-from-commit:v1 cat /hihi.txt

# Dọn dẹp container nháp
docker container rm -f demo-writable
```

**Giải thích kết quả:**

- Lệnh `docker container diff` in ra:
  - `A /hihi.txt`: File `/hihi.txt` vừa được **Thêm mới (Added)** trên Writable Layer.
  - `C /etc` và `D /etc/motd`: Thư mục `/etc` bị **Thay đổi (Changed)** vì file `/etc/motd` bên trong nó đã bị **Xóa (Deleted)**.

- Khi chạy `docker container commit`, lớp Writable này đã hóa đá thành một lớp Read-only mới trong `image-from-commit:v1`!

### Bước 3: Đóng gói Image ra file `.tar` (`save`) và Khôi phục lại (`load`)

Kỹ thuật này cực kỳ hữu ích khi bạn cần chép Image sang một máy chủ nội bộ (ngân hàng, doanh nghiệp) bị khóa Internet:

```bash {"terminalRows":"30"}
mkdir -p docker-mastery-lab/tar-demo

# 1. Xuất image 'image-from-commit:v1' ra thành file output.tar
echo "📦 Đang đóng gói image thành file .tar..."
docker image save image-from-commit:v1 -o docker-mastery-lab/tar-demo/output.tar
ls -lh docker-mastery-lab/tar-demo/output.tar

# 2. Xóa sạch image 'image-from-commit:v1' khỏi Docker trên máy để giả lập sang máy mới
echo "🗑️ Xóa image khỏi Docker Engine..."
docker image rm image-from-commit:v1

# 3. Nạp lại image từ file output.tar
echo "📥 Đang nạp lại image từ file output.tar..."
docker image load -i docker-mastery-lab/tar-demo/output.tar

# 4. Kiểm tra xem image đã sống lại chưa và dọn dẹp
docker image ls image-from-commit:v1
docker image rm image-from-commit:v1
rm -rf docker-mastery-lab/tar-demo
```

---

# 📘 MODULE 03: DOCKERFILE MASTERY — BUILD CONTEXT, LAYER CACHING & TIẾN HÓA V1 → V3

> 🎯 **Mục tiêu:** Nắm vững toàn bộ các chỉ thị trong `Dockerfile`, hiểu rõ bẫy **Build Context** (`demo/test` vs `demo`), cơ chế **Layer Caching** và cách tối ưu thời gian build từ 60 giây xuống còn 1 giây.

## 1. Lý thuyết Chuyên sâu

### 1.1. Cẩm nang Chỉ thị Dockerfile: 4 Nhóm Cốt Lõi & Bẫy Lỗi Production

Trong môi trường Production, việc dùng sai một chỉ thị Dockerfile có thể dẫn đến **lộ Secret, không thể Graceful Shutdown, app bị treo mà Docker không biết, hoặc bị lỗi quyền truy cập file**. Dưới đây là phân loại 4 nhóm chỉ thị quan trọng nhất:

---

#### 🟢 NHÓM 1: NHÓM VẬN HÀNH (EXECUTION) — `RUN` vs `CMD` vs `ENTRYPOINT`

| Chỉ thị          | Thời điểm chạy                  | Mục đích                                                               | Bị ghi đè bởi `docker run`?                            |
| :--------------- | :------------------------------ | :--------------------------------------------------------------------- | :----------------------------------------------------- |
| **`RUN`**        | **Build time** (`docker build`) | Cài package, compile TypeScript → Tạo Layer mới vĩnh viễn. | ❌ Không thể                                           |
| **`CMD`**        | **Runtime** (`docker run`)      | Khởi chạy chương trình chính mặc định của container.                   | ✅ **Bị ghi đè hoàn toàn** nếu truyền lệnh mới         |
| **`ENTRYPOINT`** | **Runtime** (`docker run`)      | Khóa chặt chương trình chạy chính của container.                       | 🔒 Không bị ghi đè, tham số truyền vào biến thành đuôi |

##### 🎯 Ma trận phối hợp Vàng: `ENTRYPOINT` + `CMD` (Best Practice Production)

Khi xây dựng Image chuẩn quốc tế, người ta không dùng đơn lẻ mà **kết hợp cả hai**:

- `ENTRYPOINT ["chương_trình_chính"]` → Đóng vai trò cố định chương trình thực thi.
- `CMD ["tham_số_mặc_định"]` → Đóng vai trò tham số gợi ý, người dùng có thể đổi khi chạy.

```dockerfile
# Ví dụ: Chạy NestJS với file migration tự động
ENTRYPOINT ["node"]
CMD ["dist/main.js"]
# -> docker run my-app                     => Chạy: node dist/main.js
# -> docker run my-app dist/migration.js   => Chạy: node dist/migration.js (CMD bị thay thế!)
```

##### ⚠️ Bẫy lỗi Production #1: Shell Form vs Exec Form (Bẫy nuốt tín hiệu `SIGTERM`)

- ❌ **Shell Form:** `CMD npm run start` hoặc `CMD node dist/main.js`
  → Docker sẽ bọc lệnh vào `/bin/sh -c "..."`. Lúc này tiến trình shell `/bin/sh` chiếm giữ `PID 1` và **nuốt chửng tín hiệu `SIGTERM`** khi bạn gõ `docker stop`. App NestJS không thể đóng kết nối DB, bị treo cứng 10 giây trước khi Docker buộc phải dùng `SIGKILL` (giết cưỡng bức)!
- ✅ **Exec Form (Bắt buộc):** `CMD ["node", "dist/main.js"]`
  → Tiến trình `node` trực tiếp làm `PID 1`, nhận tín hiệu tắt máy ngay lập tức để ngắt kết nối an toàn (Graceful Shutdown).

---

#### 🟡 NHÓM 2: DỮ LIỆU & THƯ MỤC — `WORKDIR` vs `RUN cd`, `COPY` vs `ADD`, `VOLUME`

| Chỉ thị                       | Bản chất & Quy tắc thực chiến                                                                                                                                                                                    | Bẫy lỗi Production thường gặp                                                                                                                                                            |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`WORKDIR`** vs **`RUN cd`** | - `WORKDIR /app`: Đổi thư mục làm việc **cho toàn bộ các lệnh tiếp theo**, tự động tạo thư mục (`mkdir -p`) nếu chưa có.<br>- `RUN cd /app`: Chỉ có tác dụng trong **tiến trình con tạm thời** của dòng lệnh đó! | ❌ _Bẫy kinh điển:_ Viết `RUN cd /app` rồi dòng sau viết `COPY . .` → Toàn bộ code bị văng vào thư mục gốc `/` thay vì `/app`! Luôn dùng `WORKDIR`.                          |
| **`COPY`** vs **`ADD`**       | - `COPY`: Sao chép file/thư mục minh bạch từ host vào image.<br>- `ADD`: Ngoài copy còn tự động giải nén file `.tar.gz` và tải file từ URL trên mạng.                                                            | ❌ _Bẫy bảo mật:_ Dùng `ADD` tải link từ internet dễ bị tấn công MITM hoặc kéo malware. **Quy tắc: 99% trường hợp chỉ dùng `COPY`, chỉ dùng `ADD` khi muốn giải nén file `.tar` local.** |
| **`VOLUME`**                  | Khai báo điểm gắn ổ đĩa ẩn danh (`Anonymous Volume`) bên trong Dockerfile: `VOLUME ["/app/data"]`.                                                                                                               | ⚠️ Khi khai báo `VOLUME` trong Dockerfile, mọi thay đổi trên thư mục đó ở các lệnh `RUN` tiếp theo sẽ **bị hủy bỏ**! Nên đặt `VOLUME` ở cuối Dockerfile.                                 |

---

#### 🔵 NHÓM 3: CẤU HÌNH & MẠNG — `ARG` vs `ENV`, `EXPOSE` vs `-p`

| Chỉ thị                  | Vòng đời & Bản chất                                                                                                                                                                                                       | Bẫy lỗi Production thường gặp                                                                                                                                                                                                           |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`ARG`** vs **`ENV`**   | - `ARG`: Biến chỉ tồn tại lúc **Build Image** (biến mất khi container chạy).<br>- `ENV`: Biến môi trường sống **vĩnh viễn trong Container** (code đọc được qua `process.env`).                                            | 🚨 _Bẫy bảo mật nguy hiểm nhất:_ Dùng `ARG` hay `ENV` để truyền mật khẩu/API Key lúc build → Lệnh `docker history` sẽ **soi ra toàn bộ mật khẩu trần**! Secrets phải được mount qua Docker Secrets hoặc truyền lúc runtime. |
| **`EXPOSE`** vs **`-p`** | - `EXPOSE <port>`: **KHÔNG HỀ tự mở cổng ra máy host!** Nó chỉ là metadata tài liệu, và làm mồi cho cờ `-P` (Publish All Ports).<br>- `-p <host>:<container>`: Mới là lệnh **thực sự bắc cầu nối mạng** từ ngoài vào app. | ❌ Nếu ghi `EXPOSE 8000` mà gõ `-p 3000:3000` → App vẫn chạy ở cổng 3000 bình thường (nếu app code nghe ở 3000), dòng `EXPOSE` bị phớt lờ.                                                                                  |

---

#### 🔴 NHÓM 4: BẢO MẬT & GIÁM SÁT — `USER` & `HEALTHCHECK`

| Chỉ thị           | Bản chất kỹ thuật                                                                                                                  | Ứng dụng sống còn trong Production                                                                                                                                                                                                                     |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`USER`**        | Mặc định mọi container đều chạy dưới quyền **`root` (UID 0)**. Chỉ thị `USER <tên_user>` chuyển quyền thực thi sang user giới hạn. | 🛡️ _Ngăn chặn Container Breakout:_ Nếu app bị dính lỗi bảo mật (như RCE), hacker chỉ chiếm được quyền của user bình thường (`node`), không thể chiếm quyền điều khiển nhân Linux để phá máy chủ thật!                                                  |
| **`HEALTHCHECK`** | Định kỳ thực thi một lệnh kiểm tra xem ứng dụng bên trong có thực sự phục vụ được không (ví dụ gọi vào endpoint `/health`).        | 🩺 _Chống Zombie Container:_ App có thể bị deadlock kết nối database hoặc tràn event loop, tiến trình Node vẫn sống nhưng không nhận thêm request. `HEALTHCHECK` giúp Docker/Kubernetes phát hiện trạng thái `unhealthy` để tự động restart container! |

### 1.2. Build Context là gì? (Case Study kinh điển: `demo/test` vs `demo`)

Khi bạn gõ lệnh:

```bash
docker image build -f <đường_dẫn_Dockerfile> -t <tên_image> <BUILD_CONTEXT>
```

Nhiều người mới học tưởng dấu chấm `.` ở cuối câu lệnh là "chỗ chứa Dockerfile". **HOÀN TOÀN SAI!**

- Tham số cuối cùng của lệnh `docker build` chính là **Build Context** — tức là **thư mục gốc mà Docker Client sẽ gom toàn bộ file bên trong đó gửi cho Docker Daemon**.
- Mọi lệnh `COPY` trong `Dockerfile` đều tính đường dẫn tương đối từ **Build Context** này, và **Docker không bao giờ cho phép bạn `COPY` một file nằm ngoài Build Context** (vì lý do bảo mật)!

```ini
Giả sử bạn có cấu trúc thư mục:
demo/
├── file3.txt
├── file4.txt
└── test/
    ├── Dockerfile   (Bên trong có lệnh: COPY . /app)
    ├── file1.txt
    └── file2.txt
```

- **Trường hợp 1 (Build Context là `demo/test`):**
  Bạn chạy `docker image build -f demo/test/Dockerfile -t img-th1 demo/test`
  → Docker chỉ gửi thư mục `demo/test` lên Daemon. Kết quả trong `/app` của container **chỉ có `file1.txt` và `file2.txt`**. Hai file `file3.txt`, `file4.txt` nằm ngoài `demo/test` nên không được copy!
- **Trường hợp 2 (Build Context là `demo`):**
  Bạn chạy `docker image build -f demo/test/Dockerfile -t img-th2 demo`
  → Dù `Dockerfile` vẫn nằm tít bên trong `demo/test/`, nhưng vì Build Context là `demo`, lệnh `COPY . /app` sẽ chép **toàn bộ `file3.txt`, `file4.txt` và cả thư mục con `test/`** vào trong container!

### 1.3. Cơ chế Layer Caching & Tại sao thứ tự dòng lệnh trong Dockerfile lại trị giá hàng giờ đồng hồ?

```sh
      ❌ CÁCH VIẾT NGÂY THƠ (V1)                         ✅ CÁCH VIẾT THÔNG MINH (V2 & V3)
+-----------------------------------------+       +-----------------------------------------+
| 1. FROM node:20-alpine     (Cached)     |       | 1. FROM node:20-alpine     (Cached)     |
+-----------------------------------------+       +-----------------------------------------+
| 2. WORKDIR /app            (Cached)     |       | 2. WORKDIR /app            (Cached)     |
+-----------------------------------------+       +-----------------------------------------+
| 3. COPY . .                             |       | 3. COPY package*.json ./   (Cached!)    |
| -> Bạn chỉ sửa 1 dấu chấm trong main.ts |       | -> package.json KHÔNG ĐỔI               |
| -> LAYER NÀY BỊ VỠ CACHE!               |       +-----------------------------------------+
+-----------------------------------------+       | 4. RUN npm install         (Cached!)    |
| 4. RUN npm install                      |       | -> Lấy ngay từ Cache trong 0.0 giây!    |
| -> Vì Layer 3 bên trên đã đổi, Docker   |       +-----------------------------------------+
|    BẮT BUỘC phải chạy lại npm install!  |       | 5. COPY . .                (Build lại)  |
|    (Mất oan 30 - 60 giây mỗi lần sửa!)  |       | -> Chỉ chạy lại từ bước nhẹ nhàng này!  |
+-----------------------------------------+       +-----------------------------------------+
```

📌 **Nguyên tắc vàng của Layer Caching:**

1. _Đặt những thứ ít thay đổi (`package.json`, cài đặt hệ thống) lên TRÊN._
2. _Đặt những thứ thay đổi liên tục từng phút (source code `src/`) xuống DƯỚI CÙNG._
3. _Khi 1 Layer bị thay đổi (Cache Miss), **toàn bộ các Layer nằm phía sau nó đều bị vô hiệu hóa Cache** (kể cả câu lệnh ở các layer sau không hề thay đổi)._

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Kiểm chứng trực tiếp bài toán Build Context (`demo/test` vs `demo`)

Bấm `▶ Run` để tận mắt thấy cùng 1 file `Dockerfile` nhưng thay đổi Build Context ở cuối câu lệnh sẽ cho ra 2 kết quả trái ngược nhau:

```bash {"terminalRows":"30"}
rm -rf docker-mastery-lab/context-demo
mkdir -p docker-mastery-lab/context-demo/demo/test

# Tạo các file mẫu giống hệt sơ đồ lý thuyết
touch docker-mastery-lab/context-demo/demo/file3.txt
touch docker-mastery-lab/context-demo/demo/file4.txt
touch docker-mastery-lab/context-demo/demo/test/file1.txt
touch docker-mastery-lab/context-demo/demo/test/file2.txt

cat << 'EOF' > docker-mastery-lab/context-demo/demo/test/Dockerfile
FROM alpine
WORKDIR /app
COPY . .
EOF

echo "=== TH1: Build với Context là 'demo/test' ==="
docker image build -q -f docker-mastery-lab/context-demo/demo/test/Dockerfile -t context-th1 docker-mastery-lab/context-demo/demo/test
echo "Các file bên trong container TH1:"
docker container run --rm context-th1 ls -1 /app

echo ""
echo "=== TH2: Cùng Dockerfile đó nhưng Build với Context là 'demo' ==="
docker image build -q -f docker-mastery-lab/context-demo/demo/test/Dockerfile -t context-th2 docker-mastery-lab/context-demo/demo
echo "Các file bên trong container TH2:"
docker container run --rm context-th2 ls -1 /app

# Dọn dẹp
docker image rm -f context-th1 context-th2 >/dev/null
rm -rf docker-mastery-lab/context-demo
```

### Bước 2: Tiến hóa Dockerfile cho dự án NestJS (`v1-naive` → `v2-layered` → `v3-optimized`)

Chúng ta sẽ tạo file `.dockerignore` và 3 phiên bản `Dockerfile` cho ứng dụng `nestjs-app`, sau đó kiểm nghiệm tốc độ Cache khi sửa code!

```bash {"terminalRows":"30"}
cd docker-mastery-lab/nestjs-app

# 1. Tạo file .dockerignore (Ngăn gửi rác và lộ file .env vào Docker Daemon)
cat << 'EOF' > .dockerignore
node_modules
dist
.git
.env
.env.*
*.md
Dockerfile*
EOF

# 2. Dockerfile.v1-naive (Cách viết sai: Copy toàn bộ trước khi npm install)
cat << 'EOF' > Dockerfile.v1-naive
FROM node:20-alpine
WORKDIR /app
# ❌ SAI LẦM: Copy hết source code trước -> Sửa 1 dòng code là mất cache npm install!
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
EOF

# 3. Dockerfile.v2-layered (Tối ưu thứ tự Layer để tận dụng Cache)
cat << 'EOF' > Dockerfile.v2-layered
FROM node:20-alpine
WORKDIR /app
# ✅ ĐÚNG: Chỉ copy package.json trước -> Chừng nào chưa thêm thư viện mới thì bước npm install luôn được CACHED!
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
EOF

echo "🔨 Đang build lần đầu cho cả v1 và v2..."
docker image build -f Dockerfile.v1-naive -t nestjs-lab:v1 .
docker image build -f Dockerfile.v2-layered -t nestjs-lab:v2 .
echo "✅ Đã build xong lần 1!"
```

### Bước 3: Thử sửa 1 dòng code trong `src/main.ts` và đo tốc độ Rebuild (`v1` vs `v2`)

```bash
cd docker-mastery-lab/nestjs-app

# Giả lập lập trình viên sửa 1 dòng comment trong file src/main.ts
echo "// Cap nhat luc $(date)" >> src/main.ts

echo "⏱️ 1. Thời gian build lại với Dockerfile.v1-naive (Bị vỡ cache npm install):"
time docker image build -f Dockerfile.v1-naive -t nestjs-lab:v1 . 2>&1 | grep -E "CACHED|RUN npm install|DONE" || true

echo ""
echo "⚡ 2. Thời gian build lại với Dockerfile.v2-layered (Giữ nguyên CACHED ở bước npm install):"
time docker image build -f Dockerfile.v2-layered -t nestjs-lab:v2 . 2>&1 | grep -E "CACHED|RUN npm install|DONE" || true
```

**Quan sát kết quả:** Ở `Dockerfile.v2-layered`, bạn sẽ thấy dòng `CACHED [3/5] RUN npm install` xuất hiện ngay lập tức mà không tốn một giây nào tải lại thư viện!

---

# 📘 MODULE 04: CONTAINERS DEEP DIVE — VÒNG ĐỜI, DEBUGGING & HIỆN TƯỢNG OOM KILL (EXIT CODE 137)

> 🎯 **Mục tiêu:** Làm chủ vòng đời Container, phân biệt `docker stop` (`SIGTERM`) và `docker kill` (`SIGKILL`), sử dụng bộ công cụ giải cứu khi lỗi (`logs`, `exec`, `inspect`, `stats`), và trực tiếp tái hiện vụ án **Tràn RAM bị Kernel tiêu diệt (OOM Killed - Exit Code 137)**.

## 1. Lý thuyết Chuyên sâu (Dành cho người mới bắt đầu)

### 1.1. Bản chất thật sự: Container là gì bên trong hệ điều hành Linux?

Nhiều người nghĩ container là một cỗ máy tính ảo chạy ngầm. **Thực chất không phải vậy!**

> 💡 **Ẩn dụ:** Một Container chỉ là một **Tiến trình (Process) bình thường nhưng bị nhốt trong một "Căn phòng kính cách âm" có lính gác xung quanh**:
>
> 1. **Gọng kìm 1 — Kính cách âm một chiều (Linux Namespaces):** Tiến trình bên trong chỉ nhìn thấy cây thư mục và card mạng của riêng nó, hoàn toàn không thấy và không thể can thiệp vào các ứng dụng khác đang chạy trên máy tính của bạn.
> 2. **Gọng kìm 2 — Lính gác tài nguyên (Linux cgroups):** Lính gác đứng ngoài cửa giám sát: _"Tiến trình này chỉ được phép ăn tối đa 256MB RAM và 1 CPU, nếu vượt quá sẽ bị xử lý ngay!"_.

---

### 1.2. Sơ đồ Vòng đời (Lifecycle) & Bảng Giải mã "Mã Bệnh Án" (Exit Codes)

```ini
                 docker create                    docker start                     docker pause
 (Image) ----------------------------> [ CREATED ] ----------> [ RUNNING ] <=========================> [ PAUSED ]
                                            |                    |     ^        docker unpause          (Đóng băng
                                            |       docker stop  |     | docker start / restart          trong RAM)
                                            |       docker kill  v     |
                                            |                 [ STOPPED / EXITED ]
                                            v                    |
                       ( docker rm : Xóa vĩnh viễn )             +--> Exit Code 0   : Tắt bình thường, êm đẹp
                                                                 +--> Exit Code 1   : Sập do lỗi code ứng dụng
                                                                 +--> Exit Code 137 : Bị Kernel tiêu diệt cưỡng bức (OOM Kill!)
```

#### 🩺 Bảng giải mã các mã lỗi thoát (Exit Codes) bạn sẽ gặp khi đi làm:

| Exit Code        | Ý nghĩa bệnh án                              | Nguyên nhân & Cách khắc phục                                                                                                                                                                                          |
| :--------------- | :------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`0`**          | **Khỏe mạnh (Success)**                      | Container đã hoàn thành xong nhiệm vụ hoặc nhận lệnh tắt an toàn (`docker stop`).                                                                                                                                     |
| **`1` hoặc `2`** | **Lỗi Code ứng dụng**                        | Code NestJS bị văng lỗi (Uncaught Exception), sai cú pháp, hoặc bị trùng cổng (EADDRINUSE). Mở `docker logs` để đọc file báo lỗi.                                                                                     |
| **`137`**        | **Bị bắn hạ cưỡng bức (SIGKILL / OOM Kill)** | **Bệnh kinh điển nhất:** Ứng dụng ăn vượt quá mức RAM được cấp (`--memory`). Cảnh sát Linux Kernel (OOM Killer) lập tức nổ súng tiêu diệt tiến trình ngay trong 0.001 giây! _(Mã 137 = 128 + Tín hiệu số 9 SIGKILL)_. |
| **`143`**        | **Tắt ngang xương (SIGTERM)**                | Nhận lệnh tắt nhưng code app không xử lý kịp tín hiệu tắt máy nên bị dừng giữa chừng. _(Mã 143 = 128 + Tín hiệu số 15 SIGTERM)_.                                                                                      |

---

### 1.3. Sự khác nhau giữa `docker stop` (Lịch sự) và `docker kill` (Cục súc)

- **`docker stop` (Gõ cửa báo trước):**
  1.  Docker gửi tín hiệu lịch sự **`SIGTERM`** vào trong container: _"Này app, hãy chuẩn bị lưu nốt đơn hàng dở dang, đóng kết nối Database và tắt máy nhé!"_.
  2.  Cho phép ứng dụng một khoảng ân huệ mặc định là **10 giây** để tự dọn dẹp (Graceful Shutdown).
  3.  Nếu quá 10 giây mà ứng dụng vẫn bị đơ/treo cứng, Docker mới rút súng bắn tín hiệu `SIGKILL` để ép tắt.

- **`docker kill` (Cúp cầu dao điện đột ngột):**
  - Bắn thẳng tín hiệu **`SIGKILL`** chặt đứt tiến trình ngay lập tức mà không chờ đợi 1 giây nào.
  - ⚠️ **Nguy cơ:** Rất dễ làm hỏng file dữ liệu đang ghi dở hoặc làm rác database!

---

### 1.4. Bộ tứ "Bác sĩ Cấp cứu" khi Container gặp nạn:

Khi một container bị lỗi hoặc sập, đừng đoán mò! Hãy dùng 4 công cụ sau theo thứ tự:

1. **`docker logs -f <tên>` (Ống nghe nhịp tim):** Xem toàn bộ những gì ứng dụng in ra màn hình `console.log` để tìm dòng báo lỗi đỏ.
2. **`docker inspect <tên>` (Hồ sơ bệnh án chi tiết dạng JSON):** Xem cờ `"OOMKilled": true/false`, địa chỉ IP nội bộ, và mã thoát `"ExitCode"`.
3. **`docker stats` (Máy đo điện tâm đồ thời gian thực):** Xem container đang ngốn bao nhiêu % CPU, bao nhiêu MB RAM theo thời gian thực.
4. **`docker exec -it <tên> sh` (Chui trực tiếp vào phòng bệnh):** Mở cửa chui vào trong container đang chạy để kiểm tra file, ping mạng và test kết nối Database.

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Khởi chạy ứng dụng `nestjs-lab:v2` với giới hạn RAM chỉ `80MB`

```bash
docker container rm -f nest-oom-demo 2>/dev/null || true

# Chạy container giới hạn cứng 80MB RAM (và tắt Swap để thấy OOM ngay lập tức)
docker container run -d \
  --name nest-oom-demo \
  --memory="80m" \
  --memory-swap="80m" \
  -p 3000:3000 \
  nestjs-lab:v2

sleep 2
echo "=== Kiểm tra ứng dụng đang sống khỏe mạnh ==="
curl -s http://localhost:3000
echo ""
echo "=== Xem mức tiêu thụ RAM/CPU hiện tại (docker stats --no-stream) ==="
docker container stats --no-stream nest-oom-demo
```

### Bước 2: Kích hoạt bom nổ chậm `/stress-ram` để chứng kiến **OOM Kill (Exit Code 137)**!

Ở Module 00, chúng ta đã cài sẵn API `/stress-ram` (mỗi lần gọi sẽ bơm 100MB vào RAM). Vì container chỉ được cấp tối đa `80MB`, hãy xem chuyện gì xảy ra khi chúng ta gọi vào API này:

```bash
echo "💣 Đang gọi vào http://localhost:3000/stress-ram để ép container dùng 100MB RAM (vượt ngưỡng 80MB)..."
curl -s http://localhost:3000/stress-ram || echo "⚡ Kết nối bị ngắt đột ngột vì Container vừa bị Kernel tiêu diệt!"

sleep 1
echo ""
echo "=== 1. Kiểm tra trạng thái Container (docker container ls -a) ==="
docker container ls -a --filter "name=nest-oom-demo"

echo ""
echo "=== 2. Dùng docker inspect để khám nghiệm tử thi Container ==="
docker container inspect nest-oom-demo --format 'Status: {{.State.Status}} | ExitCode: {{.State.ExitCode}} | OOMKilled: {{.State.OOMKilled}}'

# Dọn dẹp sau thí nghiệm
docker container rm -f nest-oom-demo >/dev/null
```

**Bài học xương máu của Senior Developer:**
Khi đi làm, nếu thấy container tự nhiên chết với chữ **`Exited (137)`**, bạn đừng mất công mò code tìm lỗi cú pháp! Hãy chạy ngay lệnh `docker inspect` ở trên: nếu thấy **`OOMKilled: true`**, thủ phạm 100% là ứng dụng đã dùng lố giới hạn RAM!

---

# 📘 MODULE 05: VOLUMES, BIND MOUNTS & UTILITY CONTAINERS — DỮ LIỆU SỐNG Ở ĐÂU?

> 🎯 **Mục tiêu:** Giải quyết bài toán mất dữ liệu khi xóa container, phân biệt rạch ròi **Bind Mount** vs **Named Volume**, giải đáp câu hỏi phỏng vấn về `:ro` (Read-Only), khám phá **Anonymous Volume** tự sinh trong MySQL/Postgres, và ứng dụng **Utility Containers**.

## 1. Lý thuyết Chuyên sâu

### 1.1. Bản chất Container là "Tạm bợ" (Ephemeral) & Ẩn dụ "Máy tính ở quán Net"

Để hiểu tại sao cần lưu trữ dữ liệu trong Docker, hãy tưởng tượng bạn đi chơi game ngoài **quán Net**:

- Máy tính ở quán Net luôn cài phần mềm "đóng băng ổ cứng" (DeepFreeze). Bạn ngồi chơi tải game, lưu tài liệu ra màn hình Desktop. Nhưng khi bạn bấm nút khởi động lại máy, **toàn bộ dữ liệu bạn vừa tải hay lưu trên Desktop sẽ bốc hơi 100% không để lại dấu vết**!
- Container trong Docker cũng hoạt động hệt như vậy. Chúng được thiết kế theo nguyên lý **"Ephemeral" (Sống tạm bợ)**. Mọi file mới sinh ra trong lúc container chạy đều được ghi vào **Writable Layer** (Tầng ghi tạm). Khi container bị lỗi và bạn xóa nó đi (`docker rm`), **tầng ghi tạm này sẽ bị tiêu hủy vĩnh viễn cùng với container**!

> 💥 **Nguy hiểm chết người:** Nếu bạn chạy cơ sở dữ liệu (PostgreSQL, MySQL, MongoDB) trong Container mà không gắn ổ cứng ngoài, thì chỉ cần một lệnh xóa container là **toàn bộ dữ liệu tài khoản, đơn hàng của khách hàng sẽ mất trắng hoàn toàn**!

Vậy bạn làm thế nào để lưu giữ tài liệu khi chơi ở quán Net?
👉 **Bạn cắm một chiếc USB vào máy!** Chiếc USB nằm bên ngoài chiếc máy tính. Khi máy tính tắt hay bị đập nát, dữ liệu trong USB vẫn an toàn tuyệt đối. Trong Docker, "chiếc USB" đó chính là **Persistent Storage (Lưu trữ bền vững)**.

---

### 1.2. Ba loại "Ổ cứng ngoài" trong Docker (Phân biệt rạch ròi cho người mới)

Docker cung cấp 3 cách gắn dữ liệu từ ngoài vào Container:

```ini
+---------------------------------------------------------------------------------------+
|                                    MÁY CHỦ CỦA BẠN (HOST OS)                          |
|                                                                                       |
|   1. BIND MOUNT                        2. NAMED VOLUME                 3. TMPFS MOUNT |
|   Thư mục code dự án                   Khu vực Docker tự quản          Bộ nhớ RAM     |
|   /home/user/project/src               /var/lib/docker/volumes/...     (Không lưu ổ)  |
+------------|-----------------------------------|------------------------------|-------+
             |                                   |                              |
             v (Gắn vào)                         v (Gắn vào)                    v
+------------|-----------------------------------|------------------------------|-------+
|         /app/src                       /var/lib/postgresql/data             /tmp      |
|                                                                                       |
|                                BÊN TRONG CONTAINER                                    |
+---------------------------------------------------------------------------------------+
```

#### 1. Bind Mount — "Ống nhòm xuyên tường" nối trực tiếp máy thật vào Container

- **Bản chất:** Bạn chỉ đích danh một thư mục cụ thể trên máy tính của bạn (ví dụ: `C:/Project/src` hoặc `/home/code/src`) và bảo Docker: _"Hãy khoét một lỗ trên tường container để nó nhìn thẳng vào thư mục này trên máy tôi"_.
- **Đặc điểm:** Mọi thay đổi trên máy tính cá nhân sẽ ngay lập tức xuất hiện bên trong container và ngược lại.
- **Mục đích sử dụng:** Dành riêng cho **Môi trường Phát triển (Development)**. Bạn dùng VS Code sửa code ở ngoài máy thật, tính năng Hot-Reload của NestJS trong container sẽ tự động cập nhật ngay mà bạn không cần phải tốn công build lại Image!
- **Nhược điểm:** Phụ thuộc vào đường dẫn máy tính cá nhân (không mang sang máy khác chạy ngay được). Tốc độ đọc ghi có thể chậm hơn trên macOS/Windows do phải chạy bắc cầu qua máy ảo Docker Desktop.

#### 2. Named Volume — "Tủ gửi đồ chuyên dụng" do chính Docker bảo quản

- **Bản chất:** Bạn không cần quan tâm dữ liệu nằm ở đâu trên ổ cứng máy thật, bạn chỉ cần đặt cho nó một cái tên (ví dụ: `pgdata`). Docker sẽ tự động cấp một khu vực an toàn nhất trên máy host (mặc định tại `/var/lib/docker/volumes/pgdata/_data` trên Linux) để lưu trữ.
- **Đặc điểm:**
  - Docker toàn quyền quản trị, bảo mật và tối ưu tốc độ đọc ghi (I/O).
  - Độc lập hoàn toàn với vòng đời của Container. Khi bạn gõ `docker rm` xóa container, Named Volume vẫn nằm nguyên đó. Khi tạo container mới, chỉ cần gắn lại tên volume cũ là dữ liệu tiếp tục phục hồi!
  - **Tính năng ma thuật (Data Initialization):** Nếu trong container tại thư mục đích đã có sẵn các file cài đặt gốc (như cấu hình mặc định của PostgreSQL), khi bạn gắn một Named Volume rỗng vào lần đầu, **Docker sẽ tự động sao chép toàn bộ file gốc đó ra Volume** giúp bạn!

- **Mục đích sử dụng:** Tiêu chuẩn bắt buộc cho **Cơ sở dữ liệu (Postgres, MySQL, Redis, MongoDB)** trên cả môi trường Dev và Production.

#### 3. tmpfs Mount — "Bộ nhớ tạm bốc hơi" nằm trên RAM

- **Bản chất:** Dữ liệu chỉ được ghi tạm thời vào bộ nhớ RAM của máy chủ, không bao giờ chạm xuống ổ cứng vật lý.
- **Đặc điểm:** Tốc độ đọc ghi cực nhanh. Khi container dừng lại, toàn bộ dữ liệu trên tmpfs sẽ biến mất ngay lập tức.
- **Mục đích sử dụng:** Lưu trữ các thông tin cực kỳ nhạy cảm (Private Keys, Session Tokens tạm thời) mà bạn không muốn để lại dấu vết trên đĩa cứng, hoặc các thư mục cache cần tốc độ cao.

---

### 1.3. Bảng so sánh toàn diện: Chọn loại Storage nào khi làm việc?

| Tiêu chí                 | Bind Mount                                         | Named Volume (Khuyên dùng)                                           | tmpfs Mount                                   |
| :----------------------- | :------------------------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------- |
| **Vị trí lưu trữ**       | Thư mục bất kỳ do bạn chỉ định trên máy Host       | Vùng lưu trữ riêng do Docker quản lý (`/var/lib/docker/volumes/...`) | Bộ nhớ RAM của máy Host                       |
| **Quản lý bởi**          | Bạn tự quản lý đường dẫn file                      | Docker Engine tự quản lý                                             | Hệ điều hành (RAM)                            |
| **Tính độc lập**         | Phụ thuộc vào cấu trúc thư mục máy Host            | Độc lập hoàn toàn, dễ dàng sao lưu di chuyển                         | Gắn liền với tiến trình container             |
| **Khi xóa Container?**   | File trên máy host vẫn nguyên vẹn 100%             | Volume vẫn còn nguyên (trừ khi gõ lệnh xóa volume)                   | Mất sạch 100% ngay lập tức                    |
| **Tốc độ đọc ghi (I/O)** | Trung bình (chậm hơn trên macOS/Windows)           | Nhanh và tối ưu nhất cho Linux/Production                            | Nhanh nhất (tốc độ của RAM)                   |
| **Trường hợp dùng**      | **Gắn Source Code khi lập trình (Dev Hot-Reload)** | **Database (Postgres, MySQL) & Dữ liệu Production**                  | **Dữ liệu nhạy cảm, Secret Keys, Temp Cache** |

---

### 1.4. Cạm bẫy "Hộp quà thủng đáy" với lệnh `VOLUME` trong Dockerfile

Nhiều lập trình viên mới học thường viết Dockerfile như thế này và bị bất ngờ:

```dockerfile
FROM alpine
VOLUME /app/data
RUN echo "hello docker" > /app/data/message.txt
CMD ["cat", "/app/data/message.txt"]
```

Khi build và chạy container, ứng dụng sẽ báo lỗi ngay: `cat: can't open '/app/data/message.txt': No such file or directory`! Tại sao file `message.txt` vừa tạo ở dòng trên lại biến mất?

```ini
CƠ CHẾ "HỘP QUÀ THỦNG ĐÁY":
1. Gặp lệnh: VOLUME /app/data
   ==> Docker tạo ra một Anonymous Volume riêng cho Container tạm của bước này.
2. Gặp lệnh: RUN echo "hello docker" > /app/data/message.txt
   ==> File được ghi vào Anonymous Volume tạm thời đó.
3. Chuyển sang bước tiếp theo:
   ==> Docker tạo Container tạm MỚI TINH nhưng KHÔNG HỀ gắn Anonymous Volume của bước trước!
   ==> File message.txt bị bỏ rơi vĩnh viễn trong hư vô!
```

> ⚠️ **Quy tắc vàng:** Không bao giờ dùng lệnh `RUN` để tạo hay sửa đổi dữ liệu bên trong một thư mục đã được khai báo `VOLUME` ở các dòng lệnh phía trên! Chỉ khai báo `VOLUME` ở gần cuối Dockerfile sau khi đã chuẩn bị xong xuôi mọi file tĩnh.

---

### 1.5. Ba tình huống thực tế kinh điển khi đi làm & Phỏng vấn

#### Tình huống 1: Câu hỏi phỏng vấn về cờ `:ro` (Read-Only)

- Khi gắn Bind Mount, ta có thể thêm đuôi **`:ro`** (Read-Only) để bảo vệ file trên máy host: `-v $(pwd)/src:/app/src:ro`. Bên trong container chỉ được phép đọc, nếu cố tình sửa hay xóa file sẽ bị báo lỗi `Read-only file system`.
- **Câu hỏi phỏng vấn:** _Giả sử Container A mount vào thư mục code ở chế độ `:ro` (chỉ đọc), Container B mount vào cùng thư mục đó ở chế độ `:rw` (được ghi). Nếu Container B tạo mới file `test.txt`, thì Container A có nhìn thấy file đó không?_
- **Đáp án chuẩn:** **CÓ NHÌN THẤY NGAY LẬP TỨC!** Vì cả hai container đều đang nhìn chung vào một thư mục vật lý duy nhất trên máy Host. Chữ `:ro` chỉ cấm Container A tự tay ghi/xóa, chứ không hề làm mờ mắt nó khi người khác (máy host hoặc Container B) sửa đổi thư mục đó!

#### Tình huống 2: Bí mật về Anonymous Volume (Volume không tên) tự sinh trong Postgres/MySQL

- Nếu bạn chạy `docker run postgres` mà **quên không truyền `-v`**, Docker vẫn âm thầm tự tạo ra một Volume có tên là một dãy ký tự ngẫu nhiên dài ngoằng.
- **Tại sao lại có hiện tượng này?** Vì đội ngũ phát triển Image chính thức của PostgreSQL đã cẩn thận ghi sẵn dòng `VOLUME /var/lib/postgresql/data` bên trong Dockerfile gốc của họ! Họ làm vậy để bảo vệ bạn: nếu container bị sập, dữ liệu của bạn vẫn chưa mất ngay mà vẫn nằm lại trong Anonymous Volume đó.
- Để dọn dẹp các Anonymous Volume rác này khi container dừng, bạn nhớ thêm cờ `--rm` khi chạy thử nghiệm (`docker run --rm ...`).

#### Tình huống 3: Utility Containers (Container tiện ích đa năng)

- Máy bạn đang cài Node 18, nhưng sếp muốn bạn chạy thử một dự án NestJS yêu cầu **Node 22**? Thay vì cài đè làm hỏng môi trường máy tính, bạn chỉ cần dùng Docker như một "công cụ cầm tay":

```bash
docker run --rm -v $(pwd):/app -w /app node:22-alpine npm install
```

Docker sẽ lấy thư mục code hiện tại gắn vào container Node 22, tải xong thư viện thì container tự động biến mất (`--rm`), để lại kết quả thư mục `node_modules` sạch sẽ trên máy bạn mà không cần cài đặt Node 22 vào máy thật!

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Thực nghiệm câu hỏi phỏng vấn — 2 Container cùng Bind Mount 1 thư mục (`:ro` vs `:rw`)

```bash
rm -rf docker-mastery-lab/shared-host-folder
mkdir -p docker-mastery-lab/shared-host-folder
docker container rm -f container-ro container-rw 2>/dev/null || true

HOST_DIR="$(pwd)/docker-mastery-lab/shared-host-folder"

# 1. Tạo container-ro gắn quyền CHỈ ĐỌC (:ro)
docker container run -d --name container-ro -v "${HOST_DIR}:/app:ro" alpine sleep 3600

# 2. Tạo container-rw gắn quyền ĐỌC GHI (:rw) vào cùng thư mục đó
docker container run -d --name container-rw -v "${HOST_DIR}:/app" alpine sleep 3600

echo "=== 1. Thử tạo file từ bên trong container-ro (Sẽ bị báo lỗi Read-only file system!) ==="
docker container exec container-ro touch /app/hack.txt || true

echo ""
echo "=== 2. Tạo file 'thuan.js' từ bên trong container-rw ==="
docker container exec container-rw sh -c "echo 'console.log(123)' > /app/thuan.js"

echo "=== 3. Kiểm tra xem container-ro có nhìn thấy file 'thuan.js' không? ==="
docker container exec container-ro ls -la /app

echo "=== 4. Kiểm tra trên máy Host của bạn cũng xuất hiện file 'thuan.js' ==="
ls -la "${HOST_DIR}"

# Dọn dẹp
docker container rm -f container-ro container-rw >/dev/null
rm -rf "${HOST_DIR}"
```

### Bước 2: Thực hành Named Volume, `--volumes-from` và Backup Volume ra file `.tar.gz`

```bash {"terminalRows":"40"}
docker container rm -f vol-leader vol-follower 2>/dev/null || true
docker volume rm -f my-persistent-data 2>/dev/null || true
mkdir -p docker-mastery-lab/backups

# 1. Tạo container 'vol-leader' gắn Named Volume 'my-persistent-data'
docker container run -d --name vol-leader -v my-persistent-data:/data alpine sleep 3600
docker container exec vol-leader sh -c "echo 'Du lieu quan trong cua khach hang!' > /data/secret.txt"

# 2. Xem đường dẫn thật của Volume được Docker quản lý bằng docker volume inspect
echo "=== Thông tin chi tiết của Named Volume 'my-persistent-data' ==="
docker volume inspect my-persistent-data

# 3. Tạo container 'vol-follower' lấy toàn bộ volume từ 'vol-leader' bằng --volumes-from
docker container run --rm --name vol-follower --volumes-from vol-leader alpine cat /data/secret.txt

# 4. Tuyệt chiêu Backup Named Volume ra file .tar.gz trên máy Host
echo ""
echo "📦 Đang backup dữ liệu trong Volume ra file backup.tar.gz..."
docker container run --rm \
  -v my-persistent-data:/volume-data:ro \
  -v "$(pwd)/docker-mastery-lab/backups:/backup" \
  alpine tar czf /backup/backup.tar.gz -C /volume-data .

ls -lh docker-mastery-lab/backups/backup.tar.gz

# Dọn dẹp
docker container rm -f vol-leader >/dev/null
docker volume rm my-persistent-data >/dev/null
rm -rf docker-mastery-lab/backups
```

### Bước 3: Sử dụng "Utility Container" — Chạy thử phiên bản Node.js bất kỳ mà không cần cài lên máy!

```bash
# Chạy câu lệnh kiểm tra phiên bản Node 22 trực tiếp trên thư mục nestjs-app rồi tự xóa sạch container (--rm)
docker container run --rm \
  -v "$(pwd)/docker-mastery-lab/nestjs-app:/app" \
  -w /app \
  node:22-alpine \
  sh -c "echo 'Phiên bản Node bên trong Utility Container:' && node -v && ls -1"
```

---

# 📘 MODULE 06: DOCKER NETWORKING — BRIDGE, CUSTOM DNS, MULTI-NETWORK & LOAD BALANCING

> 🎯 **Mục tiêu:** Hiểu cách Docker dùng tường lửa (`iptables`) để định tuyến mạng, tại sao mạng `bridge` mặc định không phân giải tên (DNS) được mà phải dùng **Custom Bridge Network**, kỹ thuật tách mạng bảo mật (Multi-Network) và cân bằng tải bằng **Network Alias**.

## 1. Lý thuyết Chuyên sâu

### 1.1. Bốn loại Network Driver trong Docker: Bản chất & Ẩn dụ Đời thường

Hãy tưởng tượng bạn có 2 container: **`web` (NestJS backend)** và **`db` (PostgreSQL database)**. Làm sao để `web` có thể gửi dữ liệu sang `db` để lưu trữ? Docker cung cấp 4 chế độ mạng với các đặc tính hoàn toàn khác nhau:

```ini {"terminalRows":"40"}
+---------------------------------------------------------------------------------------------------+
|                                        MÁY HOST CỦA BẠN                                           |
|                                                                                                   |
|  1. MẠNG DEFAULT BRIDGE (bridge)               2. MẠNG CUSTOM BRIDGE (Do bạn tạo - KHUYÊN DÙNG!)  |
|  +-----------------------------------+         +-----------------------------------------------+  |
|  | [app-1]              [db-1]       |         |  Embedded DNS Server (127.0.0.11)             |  |
|  | 172.17.0.2           172.17.0.3   |         |  [web] <---- Gọi thẳng bằng tên ----> [api]   |  |
|  |  * Ping qua IP: ĐƯỢC              |         |  * Ping qua IP: ĐƯỢC                          |  |
|  |  * Ping qua tên 'db-1': THẤT BẠI! |         |  * Ping qua tên container: THÀNH CÔNG 100%!   |  |
|  +-----------------------------------+         +-----------------------------------------------+  |
|                                                                                                   |
|  3. MẠNG HOST (--network host)                 4. MẠNG NONE (--network none)                      |
|  +-----------------------------------+         +-----------------------------------------------+  |
|  | Gắn thẳng vào cổng mạng máy Host, |         | Cô lập tuyệt đối 100%, không có Internet,     |  |
|  | không qua NAT/Tường lửa Docker.   |         | không giao tiếp được với bất kỳ ai.           |  |
|  +-----------------------------------+         +-----------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

#### 1. Mạng Mặc định (Default Bridge) — _"Hội trường đông người nhưng không có danh bạ"_

- **Cách hoạt động:** Khi bạn gõ `docker run` mà không truyền cờ `--network`, container tự động rơi vào mạng này.
- **Đặc điểm:** Mỗi container được cấp 1 địa chỉ IP nội bộ ngẫu nhiên (ví dụ `172.17.0.2`, `172.17.0.3`). Các container có thể ping nhau qua IP.
- ❌ **Nhược điểm chết người (Không có DNS):** Các container **KHÔNG THỂ GỌI NHAU BẰNG TÊN**.
  - Nếu trong code NestJS bạn cấu hình `DATABASE_HOST=db-1` → **Báo lỗi sập ngay!** Docker không biết `db-1` là ai.
  - Bạn buộc phải điền IP cứng `172.17.0.3`. Nhưng ngày mai container DB restart, Docker cấp IP mới `172.17.0.5` → Toàn bộ hệ thống Backend mất kết nối DB!
  - 👉 **Quy tắc:** Trong môi trường dự án thực tế, **KHÔNG AI DÙNG mạng Default Bridge** này.

---

#### 2. Mạng Tự tạo (Custom Bridge) — _"Phòng họp có Thư ký danh bạ"_ ⭐ (BẮT BUỘC DÙNG KHI ĐI LÀM)

- **Cách tạo:** Bạn tự tạo mạng riêng bằng lệnh `docker network create my-net` và chạy container với `--network my-net`.
- **Điểm kỳ diệu:** Docker tự động kích hoạt một "anh thư ký" tên là **Embedded DNS Server** (IP nội bộ `127.0.0.11`).
- **Lợi ích tuyệt đối:**
  - Các container **gọi nhau bằng TÊN thoải mái**!
  - Trong code NestJS, bạn chỉ cần điền `DATABASE_HOST=db-1`.
  - Container `web` hỏi anh thư ký DNS: _"db-1 đang ở đâu?"_ → DNS lập tức trả về IP chính xác của container đó.
  - Container có restart hay bị đổi IP bao nhiêu lần thì gọi bằng tên vẫn trúng đích 100%!
  - 👉 **Lưu ý:** Đây chính là mạng mà **Docker Compose** tự động tạo ra cho bạn khi chạy nhiều dịch vụ cùng lúc.

---

#### 3. Mạng Host (`--network host`) — _"Ngồi chung bàn làm việc với chủ nhà"_

- **Cách hoạt động:** Container **bỏ hết tường lửa bảo vệ, hòa làm một với card mạng của máy thật**.
- **Đặc điểm:**
  - Nếu app NestJS nghe cổng 3000, nó chiếm luôn cổng 3000 trên máy thật mà **không cần dùng cờ `-p 3000:3000`**.
  - **Ưu điểm:** Tốc độ truyền mạng cực nhanh (không phải đi qua bộ chuyển đổi địa chỉ NAT của Docker).
  - **Nhược điểm:** Mất tính cô lập bảo mật, dễ xung đột cổng (nếu 2 container cùng chạy cổng 3000 thì container thứ 2 sẽ bị lỗi văng ra ngay).

---

#### 4. Mạng None (`--network none`) — _"Căn phòng cách ly tuyệt đối"_

- **Đặc điểm:** Container bị cắt đứt hoàn toàn mọi kết nối: không có Internet, không thấy máy host, các container khác không thể chạm tới nó.
- **Dùng khi nào?** Dùng cho các tác vụ **siêu bảo mật**: Ví dụ chạy một chương trình kiểm tra mã độc, xử lý băm mật khẩu, mã hóa dữ liệu nhạy cảm hoặc chạy batch jobs offline mà công ty muốn đảm bảo 100% không một hacker nào có thể rò rỉ dữ liệu đó ra Internet!

---

### 1.2. Bảng so sánh tổng hợp 4 loại Network Drivers

| Loại Mạng          | Tự động phân giải tên (DNS)?            | Cần dùng `-p` để mở cổng?               | Tốc độ mạng | Trường hợp sử dụng thực tế                               |
| :----------------- | :-------------------------------------- | :-------------------------------------- | :---------- | :------------------------------------------------------- |
| **Default Bridge** | ❌ **Không** (chỉ gọi bằng IP)          | ✅ Có                                   | Vừa phải    | Thử nghiệm nhanh 1 container đơn lẻ.                     |
| **Custom Bridge**  | ✅ **Có 100%** (gọi bằng tên container) | ✅ Có                                   | Vừa phải    | **95% các dự án Web, Microservices, Compose.**           |
| **Host**           | ❌ Không (dùng DNS của máy host)        | ❌ **Không cần** (chiếm cổng trực tiếp) | Cực nhanh   | Ứng dụng xử lý luồng video, game server cần độ trễ thấp. |
| **None**           | ❌ Không                                | ❌ Không thể                            | 0           | Chạy thuật toán mã hóa, xử lý offline bảo mật cao.       |

### 1.3. Hai kỹ thuật Kiến trúc Mạng Cấp độ Master (Multi-Network & Load Balancing)

Khi thiết kế hệ thống Microservices chạy Production, các kỹ sư DevOps thường áp dụng 2 "tuyệt kỹ" mạng nâng cao sau:

---

#### 🛡️ Kỹ thuật 1: Một Container tham gia 2 mạng cùng lúc (Multi-Network Security Isolation)

##### 1. Nguy cơ tiềm ẩn nếu để chung 1 mạng (Cách làm ngây thơ):

Nhiều người mới học thường ném tất cả container vào chung một mạng:

```sh
INTERNET ---> [ web (Nginx) ] ---chung mạng---> [ api (NestJS) ] ---chung mạng---> [ db (PostgreSQL) ]
```

- **Kịch bản hacker tấn công:** Cổng Nginx mở toang ra Internet. Một ngày nọ, hacker khai thác được một lỗ hổng trong Nginx và chiếm quyền điều khiển container `web`.
- Vì `web` và `db` nằm chung một mạng, hacker chỉ cần đứng từ `web` gõ lệnh dò quét mạng nội bộ → **Chọc thẳng vào Database cướp toàn bộ thông tin tài khoản của khách hàng!**

##### 2. Giải pháp "Cắm 2 dây mạng" (Mô hình DMZ 3 lớp chuẩn Doanh nghiệp):

Bạn tạo ra **2 mạng riêng biệt**: `frontend-net` (mạng ngoài) và `backend-net` (mạng nội bộ).

```ini
        INTERNET
           │
           ▼
     [ web (Nginx) ]       <--- Chỉ cắm vào 'frontend-net' (Cổng 80/443 mở ra ngoài)
           │
           ▼ (frontend-net)
    ┌───────────────────────────────────────────────┐
    │              [ api (NestJS) ]                 │  <--- BẬT CHẾ ĐỘ "CẦU NỐI":
    │    (Có 2 Card mạng: eth0 và eth1)             │       Cắm cả 2 mạng cùng lúc!
    └───────────────────────────────────────────────┘
           │ (backend-net)
           ▼
    [ db (PostgreSQL) ]    <--- Chỉ cắm vào 'backend-net' (KHÔNG mở cổng ra ngoài)
```

- **Lệnh thực hiện:**

```bash
docker network create frontend-net
docker network create backend-net

# Khởi chạy web trên frontend-net, db trên backend-net
docker run -d --name web --network frontend-net nginx
docker run -d --name db --network backend-net postgres:16-alpine

# Cho NestJS cắm dây mạng vào CẢ 2 BÊN:
docker run -d --name api --network frontend-net my-nestjs-app
docker network connect backend-net api
```

- **Kết quả bảo mật tuyệt đối:**
  - `web` gửi request sang `api` bình thường.
  - `api` truy vấn dữ liệu từ `db` bình thường.
  - **NHƯNG:** `web` và `db` hoàn toàn không có đường dây mạng nào nối với nhau! Dù hacker có chiếm được `web` thì gõ `ping db` cũng vô vọng vì ở `frontend-net` không hề biết sự tồn tại của `db` ở mạng trong!

---

#### ⚖️ Kỹ thuật 2: Network Alias (`--network-alias`) — Cân bằng tải tự nhiên (Round-Robin DNS)

##### 1. Bài toán giờ cao điểm:

App NestJS của bạn có 10.000 người vào cùng lúc, 1 container CPU quá tải 100%. Bạn muốn bật 3 container NestJS chạy song song để cùng gánh tải:

- `api-1`
- `api-2`
- `api-3`

Nhưng Nginx làm sao biết gửi request vào container nào mà không phải sửa đi sửa lại file config Nginx mỗi khi tăng giảm số lượng container?

##### 2. Giải pháp bằng `Network Alias` (Biệt danh chung):

Khi khởi động 3 container, bạn đặt cho chúng **cùng chung một "biệt danh" (alias)** là `api-service`:

```bash
docker run -d --name api-1 --network my-net --network-alias api-service my-nestjs-app
docker run -d --name api-2 --network my-net --network-alias api-service my-nestjs-app
docker run -d --name api-3 --network my-net --network-alias api-service my-nestjs-app
```

```ini
                        Khách gọi vào: http://api-service
                                      │
                        ┌─────────────┴─────────────┐
                        │ Docker Embedded DNS Server│
                        │    (127.0.0.11)           │
                        └─────────────┬─────────────┘
                                      │ (Chia bài luân phiên Round-Robin)
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
    [ api-1 (172.18.0.2) ]      [ api-2 (172.18.0.3) ]      [ api-3 (172.18.0.4) ]
       (Nhận Request 1, 4...)      (Nhận Request 2, 5...)      (Nhận Request 3, 6...)
```

- **Cơ chế hoạt động:** Anh thư ký **DNS nội bộ của Docker** sẽ tự động làm nhiệm vụ **"Chia bài" (Round-Robin)**:
  - Lần gọi thứ 1 vào `http://api-service` → DNS chuyển sang `api-1`.
  - Lần gọi thứ 2 vào `http://api-service` → DNS chuyển sang `api-2`.
  - Lần gọi thứ 3 vào `http://api-service` → DNS chuyển sang `api-3`.
  - Lần gọi thứ 4 → Quay vòng lại `api-1`.

- 👉 **Lợi ích:** Bạn vừa xây dựng xong một cụm **Cân bằng tải (Load Balancer)** tự động cực kỳ thông minh ngay từ tầng DNS nội bộ của Docker mà không cần phải cài thêm bất kỳ tool nào!

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Chứng minh Default Bridge không có DNS, còn Custom Network có sẵn DNS

```bash
docker container rm -f default-a default-b custom-a custom-b 2>/dev/null || true
docker network rm my-custom-net 2>/dev/null || true

# 1. Chạy 2 container trên mạng bridge mặc định
docker container run -d --name default-a alpine sleep 3600
docker container run -d --name default-b alpine sleep 3600

echo "=== 1. Thử ping bằng TÊN trên mạng Default Bridge (Sẽ THẤT BẠI!) ==="
docker container exec default-a ping -c 1 default-b || echo "❌ Không thể phân giải tên 'default-b' trên mạng bridge mặc định!"

# 2. Tạo mạng Custom Bridge và chạy 2 container trên đó
docker network create my-custom-net
docker container run -d --name custom-a --network my-custom-net alpine sleep 3600
docker container run -d --name custom-b --network my-custom-net alpine sleep 3600

echo ""
echo "=== 2. Thử ping bằng TÊN trên mạng Custom Network (THÀNH CÔNG NGAY!) ==="
docker container exec custom-a ping -c 2 custom-b

# Dọn dẹp
docker container rm -f default-a default-b custom-a custom-b >/dev/null
docker network rm my-custom-net >/dev/null
```

### Bước 2: Thực hành Kiến trúc Bảo mật Đa tầng (`frontend-net` & `backend-net`) và `Network Alias`

```bash
docker container rm -f net-web net-api net-db search-1 search-2 2>/dev/null || true
docker network rm frontend-net backend-net 2>/dev/null || true

# 1. Tạo 2 mạng tách biệt
docker network create frontend-net
docker network create backend-net

# 2. Đặt 'net-web' ở frontend-net, 'net-db' ở backend-net
docker container run -d --name net-web --network frontend-net alpine sleep 3600
docker container run -d --name net-db  --network backend-net  alpine sleep 3600

# 3. Đặt 'net-api' ở frontend-net, sau đó nối thêm vào backend-net!
docker container run -d --name net-api --network frontend-net alpine sleep 3600
docker network connect backend-net net-api

echo "=== 1. Kiểm tra: 'net-api' ping được cả 'net-web' lẫn 'net-db' ==="
docker container exec net-api ping -c 1 net-web | grep "bytes from"
docker container exec net-api ping -c 1 net-db  | grep "bytes from"

echo ""
echo "=== 2. Kiểm tra Bảo mật: 'net-web' cố tình chọc thẳng vào 'net-db' (Sẽ bị chặn đứng!) ==="
docker container exec net-web ping -c 1 -W 1 net-db || echo "🛡️ BẢO MẬT THÀNH CÔNG: 'net-web' không thể nhìn thấy 'net-db'!"

echo ""
echo "=== 3. Thử nghiệm Network Alias (Gom 2 container vào chung 1 tên 'search') ==="
docker container run -d --name search-1 --network backend-net --network-alias search alpine sleep 3600
docker container run -d --name search-2 --network backend-net --network-alias search alpine sleep 3600

echo "Khi 'net-api' tra cứu DNS của tên 'search', Docker trả về IP của CẢ 2 container:"
docker container exec net-api nslookup search || true

# Dọn dẹp
docker container rm -f net-web net-api net-db search-1 search-2 >/dev/null
docker network rm frontend-net backend-net >/dev/null
```

---

# 📘 MODULE 07: DOCKER COMPOSE BASICS — ORCHESTRATE HỆ THỐNG MULTI-CONTAINER

> 🎯 **Mục tiêu:** Thay thế hàng chục câu lệnh `docker run` dài dòng bằng một file `docker-compose.yml` duy nhất, hiểu và xử lý triệt để cái bẫy kinh điển: **"Tại sao có `depends_on` mà ứng dụng vẫn sập vì Database chưa sẵn sàng?"**.

## 1. Lý thuyết Chuyên sâu

### 1.1. Docker Compose là gì? Ẩn dụ "Nhạc trưởng dàn nhạc giao hưởng"

Khi bạn mới học Docker ở các Module trước, bạn chạy từng container đơn lẻ bằng lệnh `docker run`:
* Chạy 1 container NestJS.
* Chạy 1 container PostgreSQL.
* Chạy 1 container Redis.

Điều này giống như một sân khấu có 3 nhạc công (trống, kèn, đàn) nhưng **không có nhạc trưởng**:
1. Bạn phải tự chạy đến từng nhạc công nhắc họ bắt đầu chơi.
2. Bạn phải tự tay kéo dây điện nối từng người với nhau (`docker network create`, `docker network connect`).
3. Bạn phải tự phân chia tủ đựng nhạc cụ cho từng người (`docker volume create`).
4. Nếu có 10 dịch vụ (Microservices), bạn sẽ phải nhớ và gõ 10 câu lệnh `docker run` dài cả trang giấy với hàng chục biến môi trường `-e`, `-p`, `-v`. Chỉ cần gõ sai 1 dấu cách là toàn bộ hệ thống sập!

👉 **Docker Compose chính là "Vị Nhạc Trưởng tài ba":**
* File `docker-compose.yml` chính là **bản tổng phổ giao hưởng**. Trong file này, bạn ghi rõ: Cần bao nhiêu dịch vụ, dùng image nào, nối mạng ra sao, dùng ổ cứng nào.
* Bạn chỉ cần vung đũa một nhịp: **`docker compose up -d`** → Toàn bộ hệ thống gồm API, Database, Redis, Nginx sẽ tự động được khởi tạo, tự nối mạng với nhau và đồng loạt cất tiếng!

---

### 1.2. Giải phẫu cấu trúc 4 tầng của file `docker-compose.yml`

Một file Docker Compose chuẩn luôn được tổ chức thành 4 khối chức năng rõ ràng:

```yaml
version: '3.8' # (Tùy chọn ở các bản Compose mới)

# TẦNG 1: KHAI BÁO CÁC CONTAINER CẦN CHẠY
services:
  api: # Tên service (cũng là tên miền nội bộ để các service khác gọi tới)
    image: nestjs-lab:v2
    ports:
      - "3000:3000" # Mở cổng ra ngoài máy thật (Host:Container)
    environment:
      - DATABASE_HOST=db # Trỏ thẳng đến tên service 'db' bên dưới!
    depends_on:
      db:
        condition: service_healthy # Đợi DB khỏe mạnh mới khởi động

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret_password
    volumes:
      - pgdata:/var/lib/postgresql/data # Gắn Named Volume cấp toàn cục

# TẦNG 2: KHAI BÁO VÙNG LƯU TRỮ TOÀN CỤC (PERSISTENT VOLUMES)
volumes:
  pgdata: # Docker tự quản lý an toàn, xóa container không sợ mất dữ liệu

# TẦNG 3: KHAI BÁO MẠNG TOÀN CỤC (NETWORKS)
networks:
  default: # Nếu không khai báo, Compose tự tạo mạng riêng tên là <thư_mục>_default
```

> 💡 **Cơ chế DNS nội bộ thần kỳ:** Trong mạng của Docker Compose, các service tìm thấy nhau thông qua chính **Tên Service**! Trong mã nguồn NestJS, biến kết nối DB của bạn chỉ cần đặt là `postgres://postgres:password@db:5432/mydb` — Docker sẽ tự động dịch chữ `db` thành địa chỉ IP chính xác của container PostgreSQL!

---

### 1.3. Cái bẫy chết người của `depends_on` mặc định & Giải pháp `service_healthy`

Rất nhiều lập trình viên khi mới dùng Compose thường viết:
```yaml
services:
  api:
    image: my-nestjs-app
    depends_on:
      - db
  db:
    image: postgres:16-alpine
```
Họ đinh ninh rằng: Có chữ `depends_on: - db` thì container `api` chắc chắn sẽ đợi `db` xong xuôi rồi mới chạy. Nhưng thực tế khi gõ `docker compose up`, **ứng dụng NestJS vẫn bị sập ngay lập tức với lỗi `ECONNREFUSED`**!

#### Tại sao lại có nghịch lý này?
* **"Khởi động" (Started) KHÁC HOÀN TOÀN với "Sẵn sàng" (Ready):**
  * `depends_on` mặc định chỉ kiểm tra xem Docker Engine đã **bấm nút khởi động** container `db` hay chưa (mất 0.1 giây). Việc này giống như Shipper vừa dắt xe ra khỏi tiệm.
  * Trong khi đó, tiến trình PostgreSQL bên trong container cần tới **3 đến 5 giây** để nạp file hệ thống, tạo cơ sở dữ liệu mặc định và mở cổng mạng 5432 lắng nghe.
  * Khi container `db` vừa bấm nút start ở giây 0.1, Docker thấy điều kiện `depends_on` đã thỏa mãn nên lập tức cho `api` khởi chạy! Ứng dụng NestJS lao vào kết nối cổng 5432 trong khi PostgreSQL vẫn chưa mở cửa → **Crash sập ứng dụng!**

```ini
❌ KHI CHỈ DÙNG depends_on THÔNG THƯỜNG:
[DB Container]  : Bấm Start (0.1s) ---> Đang khởi tạo database ngầm (Mất 4s)...
[API Container] : Thấy DB vừa "Started" ở giây 0.1 là lao vào kết nối ngay!
                  ==> 💥 LỖI ECONNREFUSED! Ứng dụng NestJS sập lập tức!

✅ KHI KẾT HỢP healthcheck + condition: service_healthy:
[DB Container]  : Start ---> Khởi tạo DB ---> Docker tự gõ thử 'pg_isready' ---> Báo HEALTHY! (Giây thứ 4)
[API Container] : Ngoan ngoãn đứng chờ ở trạng thái Created... Giây thứ 4 DB HEALTHY mới bật!
                  ==> 🚀 KẾT NỐI DATABASE THÀNH CÔNG 100%!
```

#### Cấu hình chuẩn mực loại bỏ 100% lỗi ECONNREFUSED:
```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 2s
      timeout: 3s
      retries: 10

  api:
    image: my-nestjs-app
    depends_on:
      db:
        condition: service_healthy
```

---

### 1.4. Bộ 5 câu lệnh Docker Compose sống còn khi đi làm

1. **`docker compose up -d`**: Khởi động toàn bộ hệ thống dưới chế độ chạy ngầm (*Detached mode*). Tự động tạo Network và Volume nếu chưa có.
2. **`docker compose ps`**: Xem danh sách các service đang chạy kèm trạng thái sức khỏe (*healthy / starting / unhealthy*).
3. **`docker compose logs -f <service>`**: Soi logs theo thời gian thực của riêng một service (ví dụ: `docker compose logs -f api`).
4. **`docker compose exec <service> <lệnh>`**: Chui vào container để thao tác lệnh mà không cần phải tìm Container ID dài ngoằng (ví dụ: `docker compose exec api sh` hoặc `docker compose exec db psql -U postgres`).
5. **`docker compose down` vs `docker compose down -v` (CẢNH BÁO NGUY HIỂM):**
   * `docker compose down`: Dừng và xóa containers + network an toàn. **Dữ liệu trong Volume vẫn giữ nguyên 100%**.
   * `docker compose down -v`: Thêm cờ `-v` sẽ **xóa sạch toàn bộ Volumes**. Mọi dữ liệu khách hàng trong Database sẽ bốc hơi vĩnh viễn! Tuyệt đối không dùng cờ `-v` trên máy chủ Production!

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Tạo hệ thống Full-Stack (`NestJS` + `PostgreSQL` + `Redis` + `Adminer`) với `docker-compose.v3-full.yml`

```bash
mkdir -p docker-mastery-lab/module-07

# Tạo file cấu hình biến môi trường .env
cat << 'EOF' > docker-mastery-lab/module-07/.env
NODE_ENV=development
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret_password_123
POSTGRES_DB=nestjs_mastery_db
DATABASE_HOST=db
REDIS_HOST=redis
REDIS_PASSWORD=redis_secret_123
EOF

# Tạo file docker-compose.yml hoàn chỉnh có Healthcheck cho cả DB và Redis
cat << 'EOF' > docker-mastery-lab/module-07/docker-compose.yml
services:
  api:
    image: nestjs-lab:v2
    container_name: m07-nestjs-api
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    container_name: m07-postgres-db
    env_file:
      - .env
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 3s
      timeout: 3s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    container_name: m07-redis-cache
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 3s
      timeout: 3s
      retries: 5
    networks:
      - app-network

volumes:
  pgdata:
  redisdata:

networks:
  app-network:
    driver: bridge
EOF

echo "✅ Đã tạo xong file docker-compose.yml và .env tại docker-mastery-lab/module-07!"
```

### Bước 2: Khởi chạy toàn bộ cụm Multi-Container và kiểm tra trạng thái `Healthy`

```bash
cd docker-mastery-lab/module-07
docker compose up -d

echo ""
echo "=== 1. Danh sách các Services đang chạy (Chú ý cột STATUS có chữ 'healthy') ==="
docker compose ps

echo ""
echo "=== 2. Gọi thử API NestJS xem đã nhận cấu hình DATABASE_HOST và REDIS_HOST chưa ==="
sleep 2
curl -s http://localhost:3000

echo ""
echo ""
echo "=== 3. Chạy thử câu lệnh SQL trực tiếp bên trong container PostgreSQL ==="
docker compose exec -T db psql -U postgres -d nestjs_mastery_db -c "SELECT version();"
```

### Bước 3: Dọn dẹp hệ thống Module 07

```bash
cd docker-mastery-lab/module-07
docker compose down -v
echo "🧹 Đã dừng và xóa sạch cụm containers + volumes của Module 07!"
```

---

# 📘 MODULE 08: DOCKER COMPOSE ADVANCED — OVERRIDE FILES, PROFILES & MAKEFILE THỰC CHIẾN

> 🎯 **Mục tiêu:** Tổ chức bộ file Docker Compose theo chuẩn doanh nghiệp (tách `base`, `override` cho Dev, `prod` cho Production), dùng `profiles` để bật/tắt công cụ phụ trợ và tạo `Makefile` rút gọn câu lệnh.

## 1. Lý thuyết Chuyên sâu

### 1.1. Nỗi đau thực tế: Tại sao Dev và Prod không thể dùng chung 1 file Docker Compose?

Khi phát triển ứng dụng NestJS, môi trường **Development (máy của bạn)** và **Production (máy chủ thật)** có những nhu cầu **hoàn toàn đối lập nhau**:

```ini
+------------------------------------+------------------------------------+
|   MÔI TRƯỜNG DEVELOPMENT (DEV)     |   MÔI TRƯỜNG PRODUCTION (PROD)     |
+------------------------------------+------------------------------------+
| 1. Cần Bind Mount source code      | 1. CẤM BIND MOUNT! Phải dùng image |
|    để code sửa đến đâu nhận tới đó |    đã build đóng gói sẵn (an toàn) |
| 2. Cần mở cổng Debug (vd: 9229)    | 2. CẤM MỞ CỔNG DEBUG! Hacker sẽ    |
|    để cắm breakpoint trên VS Code  |    chui qua cổng này cướp server!  |
| 3. Mở toang cổng Database (5432)   | 3. KHÔNG EXPOSE cổng DB ra ngoài,  |
|    để dùng DBeaver/Navicat soi data|    chỉ cho app NestJS gọi nội bộ!  |
| 4. Không cần giới hạn RAM/CPU      | 4. BẮT BUỘC giới hạn RAM/CPU       |
|                                    |    tránh app bị rò rỉ RAM đơ VPS!  |
| 5. Lệnh chạy: npm run start:dev    | 5. Lệnh chạy: node dist/main.js    |
+------------------------------------+------------------------------------+
```

👉 **Vấn đề:** Nếu viết tất cả vào 1 file `docker-compose.yml`:

- Lấy đâu ra chỗ cho cả 2 môi trường cùng tồn tại?
- Nếu tạo 2 file riêng rẽ hoàn toàn (`docker-compose-dev.yml` và `docker-compose-prod.yml`), bạn sẽ bị **trùng lặp code 80%** (khai báo image, tên DB, biến môi trường chung...). Mỗi lần sửa tên database lại phải đi sửa cả 2 file!

---

### 1.2. Giải pháp Chuẩn Doanh nghiệp: Kỹ thuật Kế thừa & Ghi đè (Compose Merging)

Docker Compose giải quyết vấn đề này bằng cách chia cấu hình thành **Bộ 3 file thông minh**:

```ini
                       ┌───────────────────────────────┐
                       │     docker-compose.yml        │  <--- BẢN GỐC (BASE):
                       │ (Chứa 80% khung xương chung:  │       Chỉ khai báo tên dịch vụ,
                       │  services, database, networks)│       tên network, volume chung.
                       └───────────────┬───────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│  docker-compose.override.yml  │             │    docker-compose.prod.yml    │
│  (Cấu hình riêng cho DEV):    │             │  (Cấu hình riêng cho PROD):   │
│  - Bind mount code hot-reload │             │  - Giới hạn RAM: 512MB        │
│  - Mở cổng debug 9229         │             │  - Restart policy: always     │
│  - Mở cổng DB ra máy host     │             │  - Khóa kín cổng nội bộ       │
└───────────────────────────────┘             └───────────────────────────────┘
```

#### 🌟 Cơ chế ngầm kỳ diệu của cái tên `docker-compose.override.yml`:

Tại sao file Dev lại được đặt tên là `override.yml` mà không phải `dev.yml`?

- Docker Compose có một **quy ước ngầm tự động**:
  Khi bạn đứng ở thư mục dự án và chỉ gõ lệnh vỏn vẹn:

```bash
docker compose up
```

Docker Compose sẽ **TỰ ĐỘNG** tìm file `docker-compose.yml` rồi tự động lấy file `docker-compose.override.yml` đắp đè lên trên! Lập trình viên làm việc hàng ngày không cần gõ thêm bất kỳ cờ lệnh dài dòng nào.

- **Còn khi lên Production trên VPS:**
  Bạn chỉ định rõ ràng 2 file muốn ghép:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

👉 Lúc này, Docker Compose thấy bạn đã tự truyền cờ `-f`, nó sẽ **hoàn toàn lờ đi file `override.yml`**! Hệ thống chạy bằng cấu hình Production an toàn 100%!

---

### 1.3. Bẫy lỗi sống còn: Quy tắc "Trộn File" (Merging Rules) của Docker Compose

Nhiều lập trình viên tưởng rằng file sau sẽ thay thế hoàn toàn file trước. **HOÀN TOÀN SAI!** Docker Compose trộn file theo 2 quy tắc rất nghiêm ngặt:

1. **Với các giá trị đơn lẻ (Key-Value, chuỗi string): FILE SAU SẼ GHI ĐÈ FILE TRƯỚC**
   - Trong `base`: `image: nestjs:v1`
   - Trong `override`: `image: nestjs:dev`
   - → Kết quả trộn: `image: nestjs:dev` (Được ghi đè chuẩn xác).

2. **Với các danh sách mảng (Lists như `ports`, `volumes`, `environment`): FILE SAU SẼ ĐƯỢC NỐI THÊM (APPEND) VÀO FILE TRƯỚC!**
   - ⚠️ **Bẫy kinh điển:**
     - Trong `base`: bạn khai báo `ports: ["3000:3000"]`.
     - Trong `override`: bạn muốn đổi cổng nên ghi `ports: ["8080:3000"]`.
     - → **Kết quả:** Docker Compose mở **CẢ HAI CỔNG 3000 và 8080** chứ không hề xóa cổng 3000 cũ đi!

   - 👉 **Quy tắc vàng:** Trong file `base`, chỉ khai báo những cổng và volume thực sự dùng chung cho mọi môi trường!

---

### 1.4. Chiếc "Kính Chiếu Yêu": Lệnh `docker compose config`

Làm sao bạn biết sau khi Docker Compose trộn 2 file lại thì kết quả thực sự trông như thế nào? Đừng đoán mò! Hãy chạy lệnh:

```bash
# Xem kết quả trộn của môi trường Dev:
docker compose config

# Xem kết quả trộn của môi trường Production:
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
```

Lệnh này sẽ in ra toàn bộ file YAML thành phẩm cuối cùng sau khi trộn để bạn kiểm tra từng dòng trước khi quyết định bật container lên!

---

### 1.5. Tính năng `profiles` — "Bật công cụ nặng theo yêu cầu"

Trong dự án, ngoài app chính và Database, bạn thường có thêm các dịch vụ phụ trợ như **Adminer/pgAdmin** (Giao diện Web xem DB) hoặc **Prometheus/Grafana** (Công cụ giám sát hệ thống).

- Nếu cứ gõ `docker compose up` mà bật hết đống này thì máy tính sẽ bị ngốn hàng GB RAM vô ích.
- **Giải pháp với `profiles`:**

```yaml
adminer:
  image: adminer
  profiles: ["tools"] # <--- Đặt nhãn profile

```

- Khi gõ `docker compose up` → `adminer` **ngủ yên không chạy**.
- Chỉ khi nào bạn cần dùng giao diện soi DB, bạn mới gọi:

```bash
docker compose --profile tools up -d
```

---

### 1.6. Makefile — Vũ khí "chống gãy tay" cho Lập trình viên

Bạn có muốn ngày nào cũng phải gõ câu lệnh dài ngoằng này không?

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

Chắc chắn là không! Chỉ cần gõ sai 1 ký tự là lỗi.
Do đó, các dự án chuẩn luôn đi kèm một file **`Makefile`**:

- Gõ **`make dev`** → Tự động bật môi trường Dev.
- Gõ **`make prod`** → Tự động bật môi trường Prod với đầy đủ cờ lệnh.
- Gõ **`make clean`** → Dọn dẹp sạch sẽ rác và container tạm.

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Tạo bộ 3 file (`docker-compose.yml`, `override.yml`, `prod.yml`) và kiểm tra bằng `docker compose config`

Lệnh `docker compose config` là "kính chiếu yêu" giúp bạn xem kết quả cuối cùng sau khi Docker trộn nhiều file YAML lại với nhau:

```bash {"terminalRows":"40"}
mkdir -p docker-mastery-lab/module-08
cd docker-mastery-lab/module-08

# 1. File Base (Chung cho cả Dev và Prod)
cat << 'EOF' > docker-compose.yml
services:
  api:
    image: nestjs-lab:v2
    ports:
      - "3000:3000"

  # Công cụ quản lý DB qua giao diện Web - Chỉ bật khi gọi profile 'tools'
  adminer:
    image: adminer:latest
    profiles: ["tools"]
    ports:
      - "8081:8080"
EOF

# 2. File Override (Tự động được ghép khi chạy ở máy Dev)
cat << 'EOF' > docker-compose.override.yml
services:
  api:
    environment:
      - NODE_ENV=development
      - DEBUG_MODE=true
    ports:
      - "9229:9229"
EOF

# 3. File Production (Chỉ dùng khi gọi tường minh trên Server/VPS)
cat << 'EOF' > docker-compose.prod.yml
services:
  api:
    environment:
      - NODE_ENV=production
      - DEBUG_MODE=false
    restart: always
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
EOF

echo "=== 1. Kết quả tự động trộn khi chạy ở môi trường DEV (docker compose config) ==="
docker compose config

echo ""
echo "=== 2. Kết quả khi chạy ở môi trường PRODUCTION (-f docker-compose.yml -f docker-compose.prod.yml) ==="
docker compose -f docker-compose.yml -f docker-compose.prod.yml config
```

---

# 📘 MODULE 09: MULTI-STAGE BUILDS — ÉP CÂN IMAGE TỪ ~1.1GB XUỐNG ~90MB

> 🎯 **Mục tiêu:** Hiểu tư duy _"Lấy Output của Stage trước làm Input của Stage sau"_, loại bỏ hoàn toàn trình biên dịch TypeScript, `devDependencies` và mã nguồn `.ts` khỏi Image cuối cùng.

## 1. Lý thuyết Chuyên sâu

### 1.1. Ẩn dụ Đời thường: "Công trường xây dựng" vs "Căn hộ bàn giao"

Hãy tưởng tượng quá trình làm phần mềm giống như việc **Xây dựng một ngôi nhà**:

- **Giai đoạn thi công (Lúc Build):** Bạn cần rất nhiều công cụ cồng kềnh: máy trộn bê tông, giàn giáo sắt, xe cần cẩu, gạch vữa vụn, bản thiết kế... (Tương đương: trình biên dịch `typescript`, `@nestjs/cli`, `eslint`, thư viện dev, code gốc `.ts`).
- **Giai đoạn bàn giao để ở (Lúc Run trên Production):** Khi chủ nhà dọn vào ở, bạn phải **dọn dẹp sạch sẽ toàn bộ giàn giáo, máy trộn bê tông vứt đi**, chỉ bàn giao lại ngôi nhà hoàn thiện sạch đẹp! (Tương đương: chỉ cần duy nhất thư mục `dist/` chứa mã JavaScript đã dịch xong và các thư viện thực tế để chạy).

> ❌ **Single-Stage Build (Cách làm cũ):** Giống như việc bạn **để nguyên cả chiếc máy trộn bê tông và đống giàn giáo sắt ngổn ngang trong phòng khách** rồi bàn giao cho gia chủ! Kết quả là căn nhà nặng tới 1.2GB rác rưởi không bao giờ dùng tới!
>
> ✅ **Multi-Stage Build (Chuẩn mực):** Dùng 2 căn phòng riêng biệt: Căn phòng số 1 dùng để nhào nặn gạch vữa. Sau khi hoàn thành, bạn chỉ **bưng đúng tác phẩm hoàn thiện** sang Căn phòng số 2 sạch bóng, còn căn phòng số 1 bị phá hủy hoàn toàn!

---

### 1.2. Tại sao Image nặng 1.2GB lại là "Ác mộng" trên Production?

Nhiều người nghĩ: _"Ổ cứng máy chủ bây giờ rẻ bèo, Image nặng 1GB hay 90MB thì có gì to tát đâu?"_. Nhưng trên Production, Image nặng gây ra **3 thảm họa lớn**:

```ini {"terminalRows":"40"}
+---------------------------------------------------------------------------------------------------+
|                            3 TÁC HẠI LỚN CỦA DOCKER IMAGE NẶNG (> 1GB)                            |
+---------------------------------------------------------------------------------------------------+
| 1. TỐN TIỀN BĂNG THÔNG & LƯU TRỮ (Cloud Storage Bill):                                            |
|    - Mỗi ngày team push 20 bản build lên Docker Hub/AWS ECR = tiêu tốn 25GB dung lượng.           |
|    - Hóa đơn lưu trữ đám mây cuối tháng tăng vọt phi mã!                                          |
|                                                                                                   |
| 2. TỐC ĐỘ DEPLOY & AUTO-SCALE CHẬM NHƯ RÙA:                                                       |
|    - Vào giờ cao điểm, hệ thống Kubernetes cần bật gấp 10 Pods mới để cứu server.                |
|    - Server mất 5-10 phút chỉ để tải 12GB image qua mạng -> Web sập trước khi Pods kịp khởi động! |
|    - Với image 90MB: Tải xong trong 2 giây, server hồi sinh ngay lập tức!                         |
|                                                                                                   |
| 3. BỀ MẶT TẤN CÔNG (ATTACK SURFACE) RỘNG MÊNH MÔNG:                                               |
|    - Image 1.2GB chứa cả Python, GCC, Make, Bash, Git, Wget...                                   |
|    - Nếu hacker tìm thấy 1 lỗ hổng nhỏ, chúng có sẵn cả một "kho vũ khí hạng nặng" trong tay để   |
|      tải và biên dịch mã độc ngay trên server của bạn!                                            |
+---------------------------------------------------------------------------------------------------+
```

---

### 1.3. Bí mật bên trong: Lệnh `COPY --from` hoạt động như thế nào?

Bí quyết của Multi-Stage Build nằm ở việc sử dụng **nhiều chỉ thị `FROM` trong cùng 1 Dockerfile**:

```dockerfile
# =========================================================================
# GIAI ĐOẠN 1: BẬT "CÔNG TRƯỜNG" LÊN ĐỂ BIÊN DỊCH CODE (Đặt tên là: builder)
# =========================================================================
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci              # Cài HẾT cả TypeScript, Nest CLI...
COPY . .
RUN npm run build       # Biên dịch TypeScript -> sinh ra thư mục /app/dist

# =========================================================================
# GIAI ĐOẠN 2: TẠO "CĂN PHÒNG MỚI TINH" ĐỂ CHẠY THẬT (Đặt tên là: runner)
# =========================================================================
FROM node:20-alpine AS runner

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production   # Chỉ cài thư viện chạy thật, KHÔNG cài TypeScript!

# 🌟 DÒNG LỆNH MA THUẬT:
COPY --from=builder /app/dist ./dist
# 👉 "Docker ơi, hãy nhảy vào Stage 'builder' lấy đúng thư mục dist bỏ sang đây!"

CMD ["node", "dist/main.js"]
```

#### 💡 Cơ chế dọn rác tự động của Docker:

- Khi gặp dòng `FROM` thứ hai, Docker sẽ **tạo ra một Image hoàn toàn mới, trắng tinh 100%**.
- Toàn bộ các công cụ nặng hàng trăm MB ở Stage 1 (`builder`) sẽ **bị vứt bỏ hoàn toàn vào sọt rác**!
- Chỉ có duy nhất những gì bạn chỉ định trong lệnh `COPY --from=builder` mới được bưng sang Stage 2.
- 👉 **Kết quả:** Image cuối cùng chỉ chứa code JavaScript đã dịch (`dist/`) và `node_modules` tối thiểu!

---

### 1.4. Bảng so sánh 3 Thế hệ Image (Từ Nặng nề đến Bất khả xâm phạm)

| Tiêu chí                    | Thế hệ 1: Single-Stage  | Thế hệ 2: Multi-Stage (Alpine) | Thế hệ 3: Google Distroless ⭐        |
| :-------------------------- | :---------------------- | :----------------------------- | :------------------------------------ |
| **Kích thước**              | ~1.1 GB (Siêu nặng)     | ~180 MB (Giảm 85%)             | **~85 MB (Giảm hơn 92%)**             |
| **Có Shell (`sh`/`bash`)?** | ✅ Có                   | ✅ Có (`sh`)                   | ❌ **CẤM HOÀN TOÀN (Không có Shell)** |
| **Có Trình quản lý gói?**   | ✅ Đầy đủ               | ✅ Có `apk`                    | ❌ **Không có cả `apt`, `apk`**       |
| **Mức độ bảo mật**          | ⚠️ Nguy cơ cao          | 🛡️ Tốt                         | 🔒 **Tối thượng (Hacker bất lực)**    |
| **Trường hợp dùng**         | Thử nghiệm nháp lúc đầu | Tiêu chuẩn đa số dự án         | Ngân hàng, Tài chính, E-commerce      |

> 🛡️ **Tại sao Hacker "khóc thét" trước Google Distroless?**
> Ngay cả khi hacker khai thác được một lỗ hổng trong code của bạn để gõ lệnh tấn công từ xa (RCE - Remote Code Execution):
>
> - Hacker muốn mở terminal → Máy chủ báo: `sh: not found` (Không có shell!).
> - Hacker muốn tải tool độc hại về → Máy chủ báo: `curl: not found`, `wget: not found`.
> - Hacker muốn cài mã độc → Máy chủ báo: `apt: not found`, `apk: not found`.
>   Hacker hoàn toàn bị "trói tay trói chân" vì bên trong container không có bất kỳ công cụ nào để thực thi!

---

## 2. Thực hành Tương tác (Bấm `▶ Run` để so sánh kích thước 3 thế hệ Image)

Hãy bấm `▶ Run` để tự động tạo và build 3 thế hệ `Dockerfile`:

1. `Dockerfile.v1-single` (Dùng `node:20` bản đầy đủ, 1 stage duy nhất)
2. `Dockerfile.v2-multistage` (Dùng Multi-stage với `node:20-alpine`)
3. `Dockerfile.v3-distroless` (Dùng 3 stages kết hợp `gcr.io/distroless/nodejs20-debian12`)

```bash
cd docker-mastery-lab/nestjs-app

# 1. Single-stage trên nền node:20 full (~1.1GB)
cat << 'EOF' > Dockerfile.v1-single
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
EOF

# 2. Multi-stage trên nền node:20-alpine (~140MB)
cat << 'EOF' > Dockerfile.v2-multistage
# --- STAGE 1: BUILDER ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: PRODUCTION RUNNER ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
EOF

# 3. Multi-stage kết hợp Google Distroless (Không có cả shell sh/bash!)
cat << 'EOF' > Dockerfile.v3-distroless
# --- STAGE 1: BUILDER ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: PROD DEPS ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# --- STAGE 3: GOOGLE DISTROLESS RUNNER ---
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["dist/main.js"]
EOF

echo "🔨 Đang build cả 3 thế hệ Image để đặt lên bàn cân (Lần đầu kéo base image có thể mất 20-40s)..."
docker image build -q -f Dockerfile.v1-single     -t nestjs-size:1-single .
docker image build -q -f Dockerfile.v2-multistage -t nestjs-size:2-multistage .
docker image build -q -f Dockerfile.v3-distroless -t nestjs-size:3-distroless .

echo ""
echo "📊 BẢNG SO SÁNH KÍCH THƯỚC 3 THẾ HỆ IMAGE:"
echo "=================================================================="
docker image ls "nestjs-size*" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
echo "=================================================================="
```

### Bước 2: Thử đột nhập (`docker exec`) vào Container Distroless xem chuyện gì xảy ra!

```bash
docker container rm -f test-distroless 2>/dev/null || true
docker container run -d --name test-distroless -p 3000:3000 nestjs-size:3-distroless
sleep 2

echo "=== 1. Ứng dụng NestJS bên trong Distroless vẫn trả lời API cực nhanh ==="
curl -s http://localhost:3000

echo ""
echo ""
echo "=== 2. Giả lập Hacker cố tình mở shell (sh) chui vào Container Distroless ==="
docker container exec test-distroless sh || echo "🛡️ CHẶN ĐỨNG! Container Distroless không hề có file '/bin/sh' để Hacker mở Terminal!"

# Dọn dẹp
docker container rm -f test-distroless >/dev/null
docker image rm -f nestjs-size:1-single >/dev/null
```

---

# 📘 MODULE 10: DEVELOPMENT VS PRODUCTION — HAI THẾ GIỚI ĐỐI LẬP

> 🎯 **Mục tiêu:** Thiết lập môi trường Dev (Hot-reload khi sửa code, bảo vệ `node_modules` trong container) và môi trường Production (Tích hợp `HEALTHCHECK` tự động và kiểm chứng **Graceful Shutdown** khi nhận tín hiệu `SIGTERM`).

## 1. Lý thuyết Chuyên sâu

### 1.1. Bảng đối chiếu 2 thế giới: Development (Phòng thí nghiệm) vs Production (Chiến trường)

| Tiêu chí | Môi trường Development (Lập trình viên) | Môi trường Production (Chạy thật trên VPS) |
| :--- | :--- | :--- |
| **Mục tiêu tối thượng** | Sửa code trên VS Code là thấy thay đổi ngay lập tức (**Hot-Reload**), dễ dàng gắn Debugger | Chạy nhanh, ổn định 24/7, dung lượng nhẹ, bảo mật tuyệt đối, tự phục hồi khi gặp sự cố |
| **Cách đưa Code vào** | Dùng **Bind Mount** (`-v ./src:/app/src`) để đồng bộ trực tiếp từ máy tính cá nhân | Đóng gói cố định (`COPY --from=builder`) vào trong **Multi-Stage Image**. Cấm tuyệt đối Bind Mount code! |
| **Thư viện (`node_modules`)** | Cần cả `devDependencies` (TypeScript, Jest, ESLint, Prettier) | Chỉ giữ lại thư viện chạy thật (`--omit=dev`). Vứt bỏ toàn bộ devDependencies |
| **Lệnh khởi chạy (`CMD`)** | `npm run start:dev` (Chế độ Watch theo dõi file thay đổi) | `["node", "dist/main.js"]` (Chạy file JS đã biên dịch bằng Exec Form) |
| **Quyền người dùng (`USER`)** | Có thể dùng `root` hoặc `node` để tiện debug, cài thêm tool | Bắt buộc chạy bằng **Non-root User** (`USER node`) |
| **Kiểm tra sức khỏe** | Không bắt buộc | Bắt buộc có **`HEALTHCHECK`** định kỳ tự gõ vào `/health` |

---

### 1.2. Tuyệt chiêu "Anonymous Volume" cứu nguy cho `node_modules` khi Dev

Khi lập trình dự án NestJS với Docker, bạn muốn sửa code ở máy thật là container nhận ngay, nên bạn dùng Bind Mount:
```yaml
services:
  api:
    volumes:
      - ./:/app # Gắn toàn bộ thư mục hiện tại vào container
```
Nhưng ngay khi gõ `docker compose up`, container lập tức báo lỗi sập: `Cannot find module '@nestjs/core'` hoặc lỗi kiến trúc nhị phân `invalid ELF header`!

#### Nguyên nhân do đâu?
1. Máy tính cá nhân của bạn có thể đang dùng **Windows hoặc macOS (chip Apple M-series)**, trong khi container Docker chạy **Linux**.
2. Khi bạn gắn `- ./:/app`, thư mục `node_modules` trên máy thật của bạn sẽ **đè bẹp hoàn toàn** lên thư mục `node_modules` bên trong container Linux!
3. Các thư viện nhị phân biên dịch sẵn (như `bcrypt`, `sharp`, `prisma`) được build cho Windows/macOS sẽ không thể nào chạy được trên nhân Linux của container!

#### Giải pháp "Một dòng lệnh ma thuật":
```yaml
services:
  api:
    volumes:
      - ./:/app              # 1. Bind Mount code máy host vào container
      - /app/node_modules    # 2. DÒNG MA THUẬT: Tạo Anonymous Volume riêng cho node_modules!
```
* **Cơ chế hoạt động:** Docker có quy tắc ưu tiên đường dẫn dài và chi tiết hơn. Vì `/app/node_modules` dài và cụ thể hơn `/app`, Docker sẽ bọc riêng thư mục `node_modules` của container vào một Anonymous Volume độc lập.
* 👉 **Kết quả:** Bạn thoải mái sửa code NestJS trên máy thật, code vẫn cập nhật tự động vào container, nhưng thư mục `node_modules` chuẩn Linux của container thì được bảo vệ nguyên vẹn 100%, không bao giờ bị máy host đè lên!

---

### 1.3. Hiện tượng "Chết lâm sàng" & Sứ mệnh của `HEALTHCHECK`

* **Ẩn dụ "Bệnh nhân tim ngừng đập nhưng máy thở vẫn chạy":**
  Nhiều khi tiến trình `node` bên trong container bị treo cứng (vòng lặp vô tận, cạn kiệt bộ nhớ, hoặc mất kết nối vĩnh viễn tới Database). Docker Engine ở bên ngoài chỉ nhìn vào bảng tiến trình của hệ điều hành: Thấy mã tiến trình Node vẫn còn đó, Docker vẫn báo trạng thái màu xanh **`Up (Running)`**! Nhưng khách hàng truy cập website thì bị xoay tròn và nhận mã lỗi `504 Gateway Timeout`.
* **`HEALTHCHECK` đóng vai trò là "Bác sĩ đo nhịp tim định kỳ":**
  Chỉ thị `HEALTHCHECK` yêu cầu Docker cứ mỗi vài giây tự động gõ một lệnh kiểm tra (ví dụ: `wget -qO- http://localhost:3000/health || exit 1`).
  * Nếu endpoint `/health` trả về `200 OK` → Container được gắn nhãn **`(healthy)`**.
  * Nếu quá 3 lần kiểm tra liên tiếp bị thất bại → Docker đổi ngay nhãn trạng thái thành **`(unhealthy)`**!
  * Nhờ nhãn `unhealthy` này, các hệ thống cân bằng tải (Nginx, Traefik, AWS ALB) sẽ lập tức ngừng chuyển khách hàng vào container bị bệnh, tránh làm khách hàng gặp lỗi!

---

### 1.4. Nghệ thuật Tắt êm ái (Graceful Shutdown) vs "Bị rút phích cắm" (`SIGKILL`)

Tưởng tượng bạn đang ngồi trên máy tính gõ dở một bài luận văn quan trọng:
* **Cách thô bạo (`SIGKILL` - Rút phích cắm):** Ai đó đột ngột giật phụt dây nguồn máy tính ra khỏi ổ điện! Toàn bộ bài luận văn đang lưu dở bị hỏng, mất sạch dữ liệu.
* **Cách văn minh (`SIGTERM` - Graceful Shutdown):** Người đó đến vỗ vai bạn bảo: *"Tôi sẽ tắt máy sau 10 giây nữa nhé, bạn lưu bài cẩn thận đi"*. Bạn kịp bấm Save, đóng file word, rồi máy mới tắt an toàn.

#### Trong môi trường Production thực tế:
Khi bạn cập nhật phiên bản mới của ứng dụng trên VPS, Docker sẽ gửi lệnh `docker stop` tới container cũ.
1. **Nếu không có Graceful Shutdown:** Container bị ngắt đột ngột. Một khách hàng đang bấm nút "Thanh toán đơn hàng 10 triệu đồng" đúng ở giây thứ 0.5 sẽ bị đứt kết nối giữa chừng, tiền bị trừ ở ngân hàng nhưng đơn hàng chưa kịp lưu vào Database!
2. **Khi có Graceful Shutdown (NestJS kích hoạt `app.enableShutdownHooks()`):**
   * Docker gửi tín hiệu **`SIGTERM`** (Tín hiệu xin phép dừng lịch sự).
   * Ứng dụng NestJS đón nhận tín hiệu và lập tức:
     1. Ngừng nhận thêm các lượt truy cập mới từ bên ngoài.
     2. Kiên nhẫn chờ các giao dịch thanh toán đang xử lý dở hoàn tất nốt.
     3. Đóng kết nối Database, đóng kết nối Redis an toàn, dọn dẹp file tạm.
     4. Tự động thoát với mã lỗi thành công **`Exit Code 0`**.

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Xây dựng `Dockerfile.prod` có tích hợp `HEALTHCHECK` và kiểm chứng Graceful Shutdown

```bash
cd docker-mastery-lab/nestjs-app
docker container rm -f prod-graceful-test 2>/dev/null || true

cat << 'EOF' > Dockerfile.prod
# --- STAGE 1: BUILDER ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: PRODUCTION HARDENED ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

# Chạy dưới quyền user 'node' (không phải root)
USER node
EXPOSE 3000

# Tích hợp HEALTHCHECK tự động kiểm tra API /health mỗi 5 giây
HEALTHCHECK --interval=5s --timeout=3s --start-period=2s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Dùng Exec Form để tiến trình 'node' làm PID 1, trực tiếp nhận tín hiệu SIGTERM
CMD ["node", "dist/main.js"]
EOF

docker image build -q -f Dockerfile.prod -t nestjs-prod:v1 .
docker container run -d --name prod-graceful-test -p 3000:3000 nestjs-prod:v1

echo "⏳ Chờ 6 giây để Docker chạy HEALTHCHECK lần đầu tiên..."
sleep 6

echo "=== 1. Kiểm tra trạng thái Container (Chú ý chữ 'healthy' trong cột STATUS) ==="
docker container ls --filter "name=prod-graceful-test"

echo ""
echo "=== 2. Gửi lệnh 'docker stop' và xem Logs để kiểm chứng GRACEFUL SHUTDOWN ==="
docker container stop prod-graceful-test
docker container logs prod-graceful-test

# Dọn dẹp
docker container rm -f prod-graceful-test >/dev/null
```

**Quan sát kết quả Logs:**
Bạn sẽ thấy dòng chữ:
`⚠️ Nhận tín hiệu SIGTERM từ Docker! Đang đóng kết nối an toàn (Graceful Shutdown)...`
`✅ Đã đóng toàn bộ kết nối HTTP an toàn. Tạm biệt!`
và lệnh `docker stop` hoàn tất chỉ trong chưa đầy **0.5 giây** (thay vì bị treo cứng 10 giây chờ `SIGKILL`)!

---

# 📘 MODULE 11: SECURITY HARDENING & DEBUGGING CHUYÊN SÂU

> 🎯 **Mục tiêu:** Gia cố bảo mật Container lên mức tối đa (Non-root, Read-only Filesystem, Drop Linux Capabilities) và thực hành giải cứu một Container đang bị **Crash-Loop (Khởi động lại liên tục do 3 lỗi ngầm)**.

## 1. Lý thuyết Chuyên sâu

### 1.1. Giải ảo hiểu lầm về "Vỏ bọc Container" & Nguy cơ Vượt ngục (Container Breakout)

Rất nhiều bạn mới học lầm tưởng rằng: *"Container là một chiếc hộp kín cách ly như máy ảo, hacker dù có chiếm được ứng dụng bên trong container thì cũng chỉ quậy phá trong cái hộp đó thôi, máy chủ VPS của mình vẫn an toàn 100%"*.

> 💥 **Thực tế phũ phàng:** Container **KHÔNG PHẢI** là máy ảo! Container chỉ là một tiến trình bình thường chạy chung **nhân Linux (Linux Kernel)** của máy chủ VPS!
> * Mặc định khi bạn không khai báo `USER`, ứng dụng NestJS sẽ chạy dưới quyền **`root`** (`uid=0`).
> * Quyền `root` này đối với nhân Linux là **thật 100%**. Nếu mã nguồn của bạn có lỗ hổng bảo mật kết hợp với một lỗi trong nhân Linux, hacker có thể thực hiện kỹ thuật **Container Breakout (Vượt ngục container)**: Chúng sẽ nhảy thẳng từ bên trong container ra ngoài máy chủ VPS và trở thành chúa tể `root` trên toàn bộ hệ thống của bạn!

---

### 1.2. Ba lớp "Áo giáp chống đạn" bảo vệ Container trên Production

Để bảo vệ hệ thống trước các cuộc tấn công mạng, một Kỹ sư DevOps chuyên nghiệp luôn trang bị 3 lớp áo giáp sau:

```ini
+-----------------------------------------------------------------------------------------+
|                                    MÁY CHỦ VPS THẬT (UBUNTU)                            |
|                                                                                         |
|   +---------------------------------------------------------------------------------+   |
|   |                       CONTAINER PRODUCTION ĐÃ ĐƯỢC BẢO VỆ                       |   |
|   |                                                                                 |   |
|   |   🛡️ LỚP 1: USER node (uid=1000)                                                |   |
|   |   * Tuyệt đối không chạy quyền root. Hacker chiếm quyền chỉ là "dân thường".    |   |
|   |                                                                                 |   |
|   |   🛡️ LỚP 2: HỆ THỐNG FILE CHỈ ĐỌC (--read-only)                                  |   |
|   |   * Đóng băng Writable Layer. Hacker tải mã độc về sẽ bị chặn: 'Read-only fs'!   |   |
|   |   * Cần chỗ lưu ảnh tạm upload? Cấp RAM tạm qua: --tmpfs /tmp:rw,noexec         |   |
|   |                                                                                 |   |
|   |   🛡️ LỚP 3: TƯỚC BỎ NĂNG LỰC NHÂN LINUX (--cap-drop=ALL)                         |   |
|   |   * Tước sạch mọi Linux Capabilities (đổi IP, mount ổ đĩa, can thiệp kernel).   |   |
|   +---------------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------------+
```

1. **Lớp 1 — Áp dụng nguyên lý Quyền tối thiểu (`USER node`):**
   Trong `Dockerfile.prod`, luôn thêm chỉ thị `USER node` ở dòng cuối cùng trước `CMD`. Nếu hacker chiếm được server, chúng cũng không thể cài thêm phần mềm độc hại bằng lệnh hệ thống.
2. **Lớp 2 — Đóng băng hệ thống file (`--read-only` kết hợp `--tmpfs /tmp`):**
   * **Ẩn dụ "Bảo tàng tranh":** Trong bảo tàng, tranh ảnh chỉ để ngắm chứ không ai được phép vẽ bậy lên. Trong Production, code NestJS đã được build cố định vào thư mục `dist/`, không có bất kỳ lý do gì ứng dụng phải tự sửa code của chính nó!
   * Cờ `--read-only` biến toàn bộ hệ thống file trong container thành **chỉ đọc**. Nếu hacker cố tình chui vào container và gõ lệnh tải virus `wget hack.sh`, hệ điều hành lập tức chặn đứng với thông báo lỗi: `Read-only file system`!
   * Nếu ứng dụng cần một góc nhỏ để ghi file tạm (ví dụ: người dùng upload file CSV lên xử lý trước khi lưu)? Ta cấp riêng một vùng nhớ RAM bằng cờ: `--tmpfs /tmp:rw,noexec,nosuid,size=64m` (vừa ghi tạm được, vừa cấm thực thi file mã độc bằng `noexec`).
3. **Lớp 3 — Tước bỏ vũ khí nhân Linux (`--cap-drop=ALL` & `no-new-privileges`):**
   Nhân Linux chia nhỏ quyền lực của root thành hàng chục năng lực (*Capabilities*). Cờ `--cap-drop=ALL` sẽ tước bỏ 100% mọi quyền lực này. Tiến trình chỉ còn giữ lại năng lực thuần túy là tính toán số học và phục vụ cổng mạng!

---

### 1.3. Quy trình 4 bước "Khám nghiệm tử thi" Container bị sập liên tục (Crash-Loop)

Một tình huống vô cùng phổ biến khi đi làm: Bạn vừa gõ `docker run` hoặc deploy lên server, container vừa hiện lên được 0.5 giây thì **lập tức biến mất hoặc chuyển sang trạng thái `Exited (1)`**. Lúc này bạn gõ lệnh `docker exec -it <tên> sh` để chui vào kiểm tra thì nhận ngay gáo nước lạnh:
`Error response from daemon: Container is not running`!

Đừng hoảng loạn! Hãy bình tĩnh làm theo đúng quy trình 4 bước của chuyên gia:

```ini
[CONTAINER VỪA BẬT ĐÃ SẬP]
           |
           v
Bước 1: docker logs <name>            ===> Đọc lời trăng trối cuối cùng của ứng dụng
           |
           v
Bước 2: docker inspect <name>         ===> Soi mã tử vong (ExitCode 137, 127) và biến môi trường
           |
           v
Bước 3: Ghi đè lệnh bằng sh           ===> docker run --rm -it --entrypoint sh <image>
           |                               (Tự tay bước vào bên trong khám nghiệm từng file!)
           v
Bước 4: docker diff <name>            ===> Soi xem container kịp tạo file rác nào trước khi chết
```

1. **Bước 1 — Đọc lời trăng trối (`docker container logs <tên>`):**
   Xem 5 dòng log cuối cùng. 90% nguyên nhân container sập là do: thiếu biến môi trường cấu hình DB (`DATABASE_URL is undefined`), gõ sai cổng, hoặc code NestJS bị dính Syntax Error.
2. **Bước 2 — Soi mã tử vong (`docker container inspect <tên>`):**
   * Nếu thấy **`ExitCode: 137`** và **`OOMKilled: true`**: Container bị tràn RAM và bị hệ điều hành bắn tỉa tiêu diệt.
   * Nếu thấy **`ExitCode: 127`**: Không tìm thấy file chạy (sai đường dẫn trong lệnh `CMD` hoặc quên cài Node.js).
   * Soi kỹ mục `Config.Cmd` và `Config.Env` để xem biến môi trường truyền vào có bị thiếu dấu cách hay viết sai chính tả không.
3. **Bước 3 — Mổ khám nghiệm bằng cách ghi đè lệnh chạy (`--entrypoint sh`):**
   Đây là vũ khí tối thượng của DevOps! Bạn không thể `exec` vào container đã chết, nhưng bạn hoàn toàn có thể chạy một container **MỚI** từ chính Image đó nhưng **ghi đè lệnh khởi động thành `sh`**:
   ```bash
   docker run --rm -it --entrypoint sh nestjs-prod:v1
   ```
   Lúc này container sẽ không chạy code NestJS lỗi nữa mà mở thẳng Terminal cho bạn. Bạn có thể gõ `ls -la dist/` xem file `main.js` nằm ở đâu, hoặc tự tay gõ `node dist/main.js` để xem lỗi bắn ra trực tiếp trước mắt!
4. **Bước 4 — Soi dấu vết thay đổi (`docker container diff <tên>`):**
   Xem danh sách các file mà container đã kịp tạo ra (`A`), sửa đổi (`C`) trước khi qua đời.

---

### 1.4. Quét lỗ hổng tự động với Trivy (Bác sĩ tầm soát mã độc)

Trước khi đem bất kỳ Image nào lên máy chủ Production, hãy chạy công cụ bảo mật tiêu chuẩn mã nguồn mở **Trivy**:
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image nestjs-prod:v1
```
Trivy sẽ quét toàn bộ các gói thư viện `npm` và các file hệ điều hành, lập tức cảnh báo nếu Image của bạn chứa các lỗ hổng bảo mật nghiêm trọng (*CRITICAL / HIGH CVE*) kèm theo gợi ý phiên bản an toàn cần cập nhật.

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Chạy Container NestJS ở chế độ "Bất khả xâm phạm" (`--read-only` + `--cap-drop=ALL`)

```bash
docker container rm -f ultra-secure-app 2>/dev/null || true

docker container run -d \
  --name ultra-secure-app \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop=ALL \
  --security-opt=no-new-privileges:true \
  -p 3000:3000 \
  nestjs-prod:v1

sleep 2
echo "=== 1. Kiểm tra API của ứng dụng vẫn hoạt động bình thường ==="
curl -s http://localhost:3000

echo ""
echo ""
echo "=== 2. Kiểm tra User đang chạy bên trong Container (Không phải root!) ==="
docker container exec ultra-secure-app id

echo ""
echo "=== 3. Giả lập Hacker cố tình ghi file mã độc vào thư mục /app (Bị chặn đứng!) ==="
docker container exec ultra-secure-app touch /app/malware.sh || echo "🛡️ HỆ THỐNG FILE CHỈ ĐỌC (Read-only file system): Không ai có thể sửa đổi code trong Container!"

# Dọn dẹp
docker container rm -f ultra-secure-app >/dev/null
```

### Bước 2: Bài tập Thực chiến "Bắt bệnh Container bị Crash" (Debugging Challenge)

Ô lệnh bên dưới sẽ tạo ra một container tên là `broken-container` bị sập ngay sau khi vừa khởi chạy. Hãy bấm `▶ Run` để dùng bộ công cụ điều tra nguyên nhân và sửa lỗi:

```bash
docker container rm -f broken-container fixed-container 2>/dev/null || true

# Cố tình chạy một container bị cấu hình sai tên file thực thi
docker container run -d --name broken-container nestjs-prod:v1 node dist/wrong-file-name.js || true
sleep 1

echo "=== BƯỚC 1: Kiểm tra trạng thái container (docker container ls -a) ==="
docker container ls -a --filter "name=broken-container"

echo ""
echo "=== BƯỚC 2: Đọc Logs để tìm nguyên nhân cái chết (docker container logs) ==="
docker container logs broken-container || true

echo ""
echo "=== BƯỚC 3: Soi lệnh khởi chạy đã truyền vào container (docker container inspect) ==="
docker container inspect broken-container --format 'Lệnh đã chạy: {{.Path}} {{.Args}} | Mã lỗi: {{.State.ExitCode}}'

echo ""
echo "=== BƯỚC 4: Ghi đè lệnh chạy bằng 'ls' để xem file thật sự trong /app/dist tên là gì ==="
docker container run --rm nestjs-prod:v1 ls -la /app/dist

# Dọn dẹp
docker container rm -f broken-container >/dev/null
```

---

# 🌐 MODULE 12: CI/CD THỰC CHIẾN TRÊN VPS THẬT, MONITORING & BƯỚC ĐỆM KUBERNETES

> 🎯 **Mục tiêu:** Đưa toàn bộ kiến thức từ Module 01 → 11 lên một **VPS Linux thật**. Thiết lập quy trình tự động hóa hoàn chỉnh với **GitHub Actions**: Bạn chỉ cần `git push` ở máy cá nhân → GitHub tự chạy Test → Tự Build Multi-Stage Image → Đẩy lên Registry → Tự động SSH vào VPS cập nhật phiên bản mới mà không cần làm thủ công!

## 1. Lý thuyết Chuyên sâu

### 1.1. CI/CD là gì? Ẩn dụ "Dây chuyền đóng chai tự động"

Hãy tưởng tượng bạn mở một xưởng sản xuất nước cam ép:
* **Cách làm thủ công (Không có CI/CD):** Mỗi lần có mẻ cam mới, bạn tự tay vắt cam, tự nếm thử xem có chua không, tự rót vào chai, tự dán nhãn, rồi tự lái xe máy chở từng thùng nước cam đến các siêu thị. Nếu một ngày bạn mệt mỏi quên không kiểm tra, một chai nước cam hỏng sẽ lọt ra thị trường làm mất uy tín công ty!
* **Dây chuyền tự động (Có CI/CD):**
  * **CI (Continuous Integration - Tích hợp liên tục):** Ngay khi bạn đưa cam vào máng (`git push`), robot tự động phân loại, chạy kiểm thử nồng độ đường (chạy Test tự động), biên dịch code TypeScript và đóng vào các thùng hàng chuẩn hóa (**Build Docker Image**). Nếu có lỗi, còi báo động réo lên ngay lập tức và dừng dây chuyền!
  * **CD (Continuous Deployment - Triển khai liên tục):** Sau khi thùng hàng đã đóng gói hoàn hảo và gửi vào kho trung chuyển (**Docker Hub / GitHub Packages**), hệ thống tự động phát tín hiệu cho xe tải chở đến máy chủ (**VPS**) và thay thế các chai cũ bằng chai mới mà siêu thị không phải đóng cửa ngừng bán dù chỉ 1 giây!

---

### 1.2. Kiến trúc Luồng CI/CD Thực tế từ Máy tính lên VPS

```ini
+--------------------+      1. git push       +---------------------------------------------------+
|  MÁY TÍNH CỦA BẠN  | ---------------------> |              GITHUB REPOSITORY                    |
|  (Code NestJS)     |                        |  Kích hoạt GitHub Actions (.github/workflows/...) |
+--------------------+                        +---------------------------------------------------+
                                                         |                             |
                                   2. Build Multi-Stage  |                             | 3. SSH vào VPS & chạy lệnh
                                      & Push Image       v                             v    docker compose pull + up -d
                                       +----------------------------------+   +-----------------------------------+
                                       |  CONTAINER REGISTRY              |   |       VPS THẬT CỦA BẠN (Ubuntu)   |
                                       |  (Docker Hub hoặc ghcr.io)       |   |  +-----------------------------+  |
                                       |                                  |-->|  | Nginx Reverse Proxy (80/443)|  |
                                       |  Image: user/nestjs-app:latest   |   |  | NestJS Container (Port 3000)|  |
                                       |  Image: user/nestjs-app:<git-sha>|   |  | Postgres + Redis (Internal) |  |
                                       +----------------------------------+   +-----------------------------------+
```

---

### 1.3. Cảnh báo sống còn: Tại sao KHÔNG NÊN chạy `docker build` trực tiếp trên VPS giá rẻ?

Nhiều lập trình viên mới thuê máy chủ VPS giá rẻ (loại 4 đến 5 USD/tháng, chỉ có 1GB hoặc 2GB RAM) thường có thói quen: Cài git lên VPS, kéo source code về rồi gõ `docker compose up --build` trực tiếp trên VPS.

#### Hậu quả khôn lường:
1. Quá trình biên dịch TypeScript (`npm run build` / `nest build`) và cài đặt thư viện ngốn rất nhiều RAM và đẩy CPU lên 100%.
2. Con VPS 1GB RAM ngay lập tức bị tràn bộ nhớ. Trình quản lý bộ nhớ của Linux (OOM Killer) sẽ thức giấc và **bắn chết ngay lập tức các tiến trình đang phục vụ khách hàng (Database, Nginx, API)**, thậm chí làm treo cứng cả tiến trình SSH khiến bạn không thể đăng nhập vào VPS được nữa!

#### Giải pháp chuẩn Master:
* Tận dụng **siêu máy tính miễn phí của GitHub Actions** (có sẵn 7GB RAM và nhiều CPU Cores tốc độ cao).
* GitHub Actions sẽ gánh toàn bộ tải nặng: Chạy Test, Build Multi-Stage Image siêu nhẹ (~140MB), rồi đẩy lên **Docker Hub / ghcr.io**.
* Máy chủ VPS của bạn chỉ làm một việc duy nhất cực kỳ nhẹ nhàng: **`docker compose pull`** (tải Image đã nấu chín về trong 3 giây) rồi khởi động lên. CPU của VPS hầu như không nhúc nhích!

---

### 1.4. Zero-Downtime Deployment & Bước đệm tiến lên Kubernetes (K8s)

#### 1. Zero-Downtime Deployment (Thay lốp xe khi xe vẫn chạy):
* Nếu cập nhật bằng cách: `docker compose down` rồi `docker compose up -d`, website của bạn sẽ bị "chết" khoảng 10-20 giây trong lúc container mới khởi động. Khách hàng bấm mua hàng lúc này sẽ gặp lỗi kết nối.
* Cách xử lý chuẩn: Container mới được bật lên song song với container cũ. Khi container mới báo **`healthy`**, hệ thống mạng mới chuyển luồng khách hàng sang container mới và tắt container cũ đi một cách êm ái (Graceful Shutdown).

#### 2. Khi nào nên dùng Docker Compose và khi nào cần Kubernetes (K8s)?

| Tiêu chí so sánh | Docker Compose | Kubernetes (K8s) |
| :--- | :--- | :--- |
| **Quy mô hạ tầng** | **1 máy chủ duy nhất (Single Node VPS)** | **Cụm hàng chục, hàng trăm máy chủ (Cluster)** |
| **Độ phức tạp** | Rất đơn giản, học trong 1 ngày là làm chủ | Rất phức tạp, cần đội ngũ DevOps chuyên trách |
| **Khả năng chịu lỗi** | Nếu con VPS bị cháy nguồn/mất mạng → Toàn bộ website sập | 1 máy chủ cháy nổ → Tự động dời container sang máy khác trong 5 giây |
| **Tự động mở rộng (Autoscale)** | Không hỗ trợ tự động scale theo tải thực tế | Tự động tăng từ 3 lên 50 container khi có Flash Sale |
| **Khi nào nên dùng?** | Startup, dự án vừa và nhỏ, chi phí tiết kiệm (1 VPS) | Doanh nghiệp lớn, thương mại điện tử, tài chính ngân hàng |
---

## 2. Hướng dẫn Từng bước Chuẩn bị VPS Thật (Chỉ mất 5 phút)

Khi bạn đã sẵn sàng thuê 1 con VPS Ubuntu (22.04 hoặc 24.04 LTS trên Hetzner, DigitalOcean, Vultr, Linode...), bạn chỉ cần SSH vào VPS và chạy 3 bước chuẩn bị duy nhất sau:

### Bước 2.1: Cài đặt Docker Engine & Docker Compose chính chủ lên VPS Ubuntu

_(Chạy khối lệnh này trên Terminal của VPS)_:

```bash
# Cài đặt Docker chính chủ bằng script chuẩn của Docker (Chỉ chạy trên VPS Ubuntu)
# curl -fsSL https://get.docker.com | sh
# sudo usermod -aG docker $USER
```

### Bước 2.2: Tạo cặp khóa SSH chuyên dụng cho GitHub Actions

Để GitHub Actions có thể tự động đăng nhập vào VPS của bạn và cập nhật container, bạn tạo một khóa SSH không mật khẩu:

1. Chạy lệnh tạo khóa (bấm `▶ Run` bên dưới để xem thử cách tạo khóa mẫu ngay trong phòng Lab):
2. Copy nội dung **Public Key** (`id_ed25519_cicd.pub`) dán vào file `~/.ssh/authorized_keys` trên VPS.
3. Copy nội dung **Private Key** (`id_ed25519_cicd`) đem lên GitHub Repo của bạn → **Settings** → **Secrets and variables** → **Actions** và tạo 4 Secrets:
   - `VPS_HOST`: Địa chỉ IP của VPS (ví dụ: `159.223.x.x`)
   - `VPS_USER`: Tên user trên VPS (ví dụ: `ubuntu` hoặc `root`)
   - `VPS_SSH_KEY`: Toàn bộ nội dung Private Key.
   - `DOCKERHUB_USERNAME` & `DOCKERHUB_TOKEN`: Tài khoản và Access Token của bạn trên Docker Hub.

---

## 3. Thực hành Tương tác: Sinh bộ File CI/CD, Production Compose, Monitoring & K8s

👉 **Bấm nút `▶ Run` bên dưới để tự động sinh toàn bộ bộ khung CI/CD chuẩn Production vào thư mục `docker-mastery-lab/module-12-cicd`:**

```bash
mkdir -p docker-mastery-lab/module-12-cicd/.github/workflows
mkdir -p docker-mastery-lab/module-12-cicd/vps-deploy
mkdir -p docker-mastery-lab/module-12-cicd/k8s-intro

# 1. File GitHub Actions Pipeline (.github/workflows/docker-ci-cd.yml)
cat << 'EOF' > docker-mastery-lab/module-12-cicd/.github/workflows/docker-ci-cd.yml
name: Docker CI/CD to Production VPS

on:
  push:
    branches: [ "main" ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: 1. Checkout Source Code
        uses: actions/checkout@v4

      - name: 2. Set up Docker Buildx (Hỗ trợ Cache Layer trên Cloud)
        uses: docker/setup-buildx-action@v3

      - name: 3. Đăng nhập vào Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 4. Build Multi-Stage Image & Push lên Docker Hub
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/nestjs-mastery:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/nestjs-mastery:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-to-vps:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - name: 5. SSH vào VPS và Cập nhật Container mới nhất
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nestjs-production
            # Kéo image mới nhất vừa được GitHub Actions build xong
            docker compose -f docker-compose.prod.yml pull api
            # Khởi tạo lại riêng container api với image mới, không làm gián đoạn DB/Redis
            docker compose -f docker-compose.prod.yml up -d --no-deps --remove-orphans api
            # Dọn dẹp các image cũ bị thừa trên VPS để tránh đầy ổ cứng
            docker image prune -f
EOF

# 2. File docker-compose.prod.yml đặt trên VPS (/opt/nestjs-production/docker-compose.prod.yml)
cat << 'EOF' > docker-mastery-lab/module-12-cicd/vps-deploy/docker-compose.prod.yml
services:
  api:
    # Trên VPS không cần source code hay Dockerfile, chỉ cần kéo thẳng Image đã build sẵn!
    image: ${DOCKERHUB_USERNAME:-myuser}/nestjs-mastery:latest
    container_name: prod-nestjs-api
    restart: always
    ports:
      - "127.0.0.1:3000:3000"   # Chỉ mở cho Nginx trên VPS gọi vào, không phơi trực tiếp ra ngoài
    env_file:
      - .env.prod
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - backend-net
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
    logging:
      driver: "json-file"
      options:
        max-size: "10m"         # Giới hạn file log tối đa 10MB để không bao giờ làm tràn ổ cứng VPS!
        max-file: "3"

  db:
    image: postgres:16-alpine
    container_name: prod-postgres-db
    restart: always
    env_file:
      - .env.prod
    volumes:
      - pgdata_prod:/var/lib/postgresql/data
    # LƯU Ý BẢO MẬT: KHÔNG dùng 'ports:' cho DB trên Production để chặn mọi kết nối trái phép từ Internet!
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - backend-net

  redis:
    image: redis:7-alpine
    container_name: prod-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD:-super_secret_redis}
    volumes:
      - redisdata_prod:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-super_secret_redis}", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - backend-net

  # Dozzle: Công cụ xem Logs Realtime của toàn bộ Containers trên trình duyệt cực nhẹ (~10MB RAM)
  dozzle:
    image: amir20/dozzle:latest
    container_name: prod-dozzle-logs
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - "127.0.0.1:8888:8080"

volumes:
  pgdata_prod:
  redisdata_prod:

networks:
  backend-net:
    driver: bridge
EOF

# 3. File Kubernetes Intro (k8s-intro/deployment-and-service.yaml)
cat << 'EOF' > docker-mastery-lab/module-12-cicd/k8s-intro/deployment-and-service.yaml
# ============================================================================
# BƯỚC ĐỆM TỪ DOCKER COMPOSE LÊN KUBERNETES (K8S 101)
# ============================================================================
# - Trong Docker Compose: Bạn quản lý các Containers trên 1 máy chủ (1 VPS).
# - Trong Kubernetes (K8s): Bạn quản lý hàng trăm Containers trải đều trên NHIỀU máy chủ!
#   + Pod        = Đơn vị nhỏ nhất bọc 1 (hoặc vài) Docker Container.
#   + Deployment = Quản lý việc nhân bản (Replicas) và cập nhật (Rolling Update) các Pod.
#   + Service    = Cấp IP tĩnh nội bộ và cân bằng tải giữa các Pod.
# ============================================================================
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nestjs-api-deployment
spec:
  replicas: 3   # Tự động chạy 3 bản sao (containers) song song để chịu tải cao!
  selector:
    matchLabels:
      app: nestjs-api
  template:
    metadata:
      labels:
        app: nestjs-api
    spec:
      containers:
        - name: nestjs-api
          image: myuser/nestjs-mastery:latest
          ports:
            - containerPort: 3000
          resources:
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: nestjs-api-service
spec:
  selector:
    app: nestjs-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
EOF

echo "✅ Đã khởi tạo trọn bộ tài nguyên Module 12 tại 'docker-mastery-lab/module-12-cicd'!"
ls -R docker-mastery-lab/module-12-cicd
```

### Bước 4: Trải nghiệm Công cụ Giám sát Logs qua Giao diện Web (`Dozzle`) ngay trên máy bạn!

Trước khi đem lên VPS, bạn có thể bấm `▶ Run` bên dưới để bật thử **Dozzle** — giao diện Web siêu nhẹ giúp bạn theo dõi toàn bộ Container và Logs theo thời gian thực mà không cần gõ `docker logs`:

```bash
docker container rm -f dozzle-demo 2>/dev/null || true

docker container run -d \
  --name dozzle-demo \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -p 8888:8080 \
  amir20/dozzle:latest

echo "✅ Dozzle đã chạy! Hãy mở trình duyệt truy cập: http://localhost:8888 để xem bảng điều khiển Container!"
```

---

# 🧹 TRẠM DỌN DẸP TỔNG (RESET PHÒNG LAB VỀ TRẠNG THÁI SẠCH BONG 100%)

> 💡 Bất cứ khi nào bạn học xong hoặc muốn xóa toàn bộ các file nháp, image thực hành (`nestjs-lab`, `nestjs-size`, `nestjs-prod`) và container thử nghiệm (`dozzle-demo`) để trả lại ổ cứng sạch sẽ nguyên trạng cho máy tính của mình, chỉ cần bấm nút **`▶ Run`** ở ô cuối cùng này:

```bash
echo "🧹 Đang dọn dẹp toàn bộ Containers và Images của phòng Lab..."

# 1. Xóa các containers thực hành nếu còn đang chạy
docker container rm -f dozzle-demo my-nginx test-apache demo-writable nest-oom-demo \
  container-ro container-rw vol-leader prod-graceful-test ultra-secure-app broken-container 2>/dev/null || true

# 2. Xóa các images của bài thực hành
docker image rm -f nestjs-lab:v1 nestjs-lab:v2 \
  nestjs-size:1-single nestjs-size:2-multistage nestjs-size:3-distroless \
  nestjs-prod:v1 image-from-commit:v1 2>/dev/null || true

# 3. Xóa thư mục docker-mastery-lab (Nếu bạn muốn giữ lại code thì comment dòng rm -rf bên dưới)
rm -rf docker-mastery-lab

echo "✨ HOÀN TẤT! Máy tính của bạn đã sạch bong 100%, không còn bất kỳ file rác nào!"
```