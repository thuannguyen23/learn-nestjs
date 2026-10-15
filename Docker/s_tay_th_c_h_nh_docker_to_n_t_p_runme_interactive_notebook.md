# 🐳 DOCKER MASTERY: TỪ BEGINNER ĐẾN MASTER (INTERACTIVE RUNME NOTEBOOK)

> **Chào mừng bạn đến với lộ trình học Docker thực chiến!**
> Tài liệu này được thiết kế như một **Phòng Lab Tương tác (Interactive Notebook)** dành riêng cho VS Code với extension **Runme**. Bạn vừa đọc lý thuyết chuyên sâu, vừa bấm nút **`▶ Run`** ngay bên cạnh từng khối lệnh để thấy kết quả trực tiếp mà không cần gõ lại hay chuyển cửa sổ.

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT RUNME & CAM KẾT "AN TOÀN 100% CHO MÁY CHÍNH"

### 1. Cách biến file `.md` này thành Notebook giống Google Colab trên VS Code

1. Mở **VS Code** trên máy của bạn.
2. Vào mục **Extensions** (`Ctrl+Shift+X` hoặc `Cmd+Shift+X`), tìm từ khóa **`Runme`** (ID: `stateful.runme`) và bấm **Install**.
3. Lưu file này với tên `DOCKER_MASTERY_RUNME.md` vào một thư mục trống trên máy.
4. Nhấp chuột phải vào file `DOCKER_MASTERY_RUNME.md` $\rightarrow$ chọn **Open With...** $\rightarrow$ chọn **Runme Notebook** (hoặc đặt làm mặc định).
5. Ngay lập tức, mọi khối lệnh `bash` bên dưới sẽ xuất hiện nút **`▶ Run`**. Khi bạn bấm chạy, Terminal tích hợp sẽ thực thi và in kết quả ngay bên dưới khối lệnh đó!

### 2. Tại sao chạy trên máy cá nhân по lộ trình này lại KHÔNG BAO GIỜ làm hỏng máy?

Nhiều người mới học sợ chạy lệnh tạo file, cài cắm thư viện làm rác hệ điều hành. Trong tài liệu này:

- **Cô lập hoàn toàn trong thư mục `./docker-mastery-lab`:** Mọi câu lệnh tạo code, tạo `Dockerfile`, `docker-compose.yml` đều tự động gom vào thư mục con `./docker-mastery-lab`. Bạn không cần cài PostgreSQL, Redis, MySQL hay thậm chí không cần cài Node.js lên máy thật!
- **Mỗi Module đều có nút "🧹 Dọn dẹp an toàn":** Cuối mỗi bài học đều có một ô lệnh giúp bạn xóa sạch các container/network nháp của bài đó.
- **Module 01 $\rightarrow$ 11 chạy trên máy cá nhân, Module 12 chạy trên VPS thật:** Bạn học và hiểu rõ bản chất ở máy mình trước, sau đó đến bài cuối sẽ đẩy toàn bộ hệ thống lên VPS thật qua GitHub Actions CI/CD.

---

## 🗺️ BẢN ĐỒ LỘ TRÌNH 12 MODULES (BEGINNER $\rightarrow$ MASTER)

| Module        | Tên Module                    | Trọng tâm cốt lõi & Case Study thực tế                                                                               | Môi trường   |
| :------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------- | :----------- |
| **Module 00** | **Lab Setup & Subject App**   | Tự động khởi tạo dự án NestJS mẫu có sẵn các API test lỗi, RAM, DB, Redis                                            | Máy cá nhân  |
| **Module 01** | **Hello Docker & Kiến trúc**  | Bài toán "Chạy được trên máy tôi", Container vs VM, kiến trúc Client-Host-Registry                                   | Máy cá nhân  |
| **Module 02** | **Giải phẫu Docker Images**   | UnionFS Layers, Writable Layer, `docker diff`, `commit`, đóng gói `.tar` (`save`/`load`)                             | Máy cá nhân  |
| **Module 03** | **Dockerfile Mastery**        | Layer Caching, bẫy Build Context (`demo/test` vs `demo`), `.dockerignore`, tiến hóa `v1` $\rightarrow$ `v3`          | Máy cá nhân  |
| **Module 04** | **Containers Deep Dive**      | Vòng đời, `SIGTERM` vs `SIGKILL`, `exec`/`inspect`, ép tràn RAM xem **OOM Kill (Exit 137)**                          | Máy cá nhân  |
| **Module 05** | **Volumes & Bind Mounts**     | Persistent Data, bẫy `:ro` vs `:rw`, Anonymous Volume của MySQL, Utility Containers                                  | Máy cá nhân  |
| **Module 06** | **Docker Networking**         | IPTables/NAT, Default Bridge (`--link`) vs Custom Bridge (DNS), Multi-Network, Network Alias                         | Máy cá nhân  |
| **Module 07** | **Docker Compose Cơ bản**     | Tiến hóa `v1` $\rightarrow$ `v3` (NestJS + Postgres + Redis + Adminer), bẫy `depends_on` & `healthcheck`             | Máy cá nhân  |
| **Module 08** | **Docker Compose Nâng cao**   | Cơ chế Auto-merge `override.yml`, tách `prod.yml`, `profiles` và `Makefile` chuẩn công ty                            | Máy cá nhân  |
| **Module 09** | **Multi-Stage Builds**        | Tận dụng output stage trước làm input stage sau: Ép cân Image từ **~1.1GB xuống ~90MB**                              | Máy cá nhân  |
| **Module 10** | **Development vs Production** | Hot-reload + Debug (`9229`) cho Dev vs Non-root + Healthcheck + Graceful Shutdown cho Prod                           | Máy cá nhân  |
| **Module 11** | **Security & Debugging**      | Chống leo thang đặc quyền (`--read-only`, `cap-drop`), quét lỗ hổng, bắt bệnh Crash-Loop                             | Máy cá nhân  |
| **Module 12** | **CI/CD trên VPS & Beyond**   | GitHub Actions tự động Build $\rightarrow$ Push Registry $\rightarrow$ SSH Deploy lên **VPS thật**, Monitoring & K8s | **VPS Thật** |

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

## 1. Lý thuyết Chuyên sâu (Dành cho người mới bắt đầu)

### 1.1. Cơn ác mộng "Trên máy em vẫn chạy ngon mà!" (It works on my machine)

Hãy tưởng tượng một quy trình làm phần mềm thực tế trong công ty:

1. **Môi trường Dev (Máy của bạn):** Bạn viết code trên máy tính đang cài **Node.js v20**, thư viện xử lý ảnh hệ thống bản mới nhất, chạy trên Windows/macOS. Mọi thứ mượt mà!
2. **Môi trường QA/Test (Máy của Tester):** Bạn gửi code qua cho Tester. Máy Tester đang cài sẵn **Node.js v16** từ dự án cũ và thiếu thư viện hệ thống $\rightarrow$ **Báo lỗi đỏ lòm không chạy được!**
3. **Môi trường Production (VPS Ubuntu cho người dùng thật):** Sau khi chật vật cài lại máy cho Tester, bạn đem code lên VPS Linux. Do khác hệ điều hành và phiên bản thư viện C++ bên dưới $\rightarrow$ **Server sập ngay lúc nửa đêm!**

💡 **Giải pháp của Docker ("Build Once, Run Anywhere"):**
Thay vì chỉ gửi mỗi "source code", Docker đóng gói **Source Code + Node.js đúng phiên bản + Thư viện hệ thống + Cấu hình môi trường** vào một chiếc hộp tiêu chuẩn duy nhất gọi là **Container**. Đem chiếc hộp này sang máy Tester hay lên VPS đều chạy giống hệt nhau 100%!

### 1.2. Container là gì? (3 tính chất vàng)

Container là một môi trường ảo hóa ở tầng hệ điều hành, có 3 đặc trưng:

1. **Độc lập (Isolated):** Chương trình bên trong container có hệ thống file riêng, cổng mạng riêng, danh sách tiến trình riêng. Nó không biết và không thể tự ý chọc phá các chương trình ngoài máy chính (Host) của bạn.
2. **Hoàn chỉnh (Self-contained):** Chứa đầy đủ mọi thứ ứng dụng cần để sống.
3. **Dễ thay thế & Nhẹ (Lightweight & Disposable):** Tạo mới chỉ mất chưa tới 1 giây, hỏng là xóa đi tạo lại ngay lập tức mà không để lại rác trên máy chính.

### 1.3. Tại sao Container lại nhẹ và nhanh hơn Máy ảo (Virtual Machine - VM) gấp chục lần?

```ml
+---------------------------------------+       +---------------------------------------+
|         MÁY ẢO (VIRTUAL MACHINE)      |       |            DOCKER CONTAINER           |
+---------------------------------------+       +---------------------------------------+
|  +---------------+ +---------------+  |       |  +---------------+ +---------------+  |
|  |   App A +     | |   App B +     |  |       |  |   App A +     | |   App B +     |  |
|  |  Bins/Libs    | |  Bins/Libs    |  |       |  |  Bins/Libs    | |  Bins/Libs    |  |
|  +---------------+ +---------------+  |       |  +---------------+ +---------------+  |
|  | Guest OS Full | | Guest OS Full |  |       +---------------------------------------+
|  | (Ubuntu 4GB)  | | (CentOS 4GB)  |  |       |           DOCKER ENGINE               |
|  +---------------+ +---------------+  |       +---------------------------------------+
|  |     HYPERVISOR (VMware/VBox)    |  |       |      HOST OS KERNEL (Dùng chung)      |
+--+---------------------------------+--+       +---------------------------------------+
|            HOST OS KERNEL             |       |         PHẦN CỨNG (CPU/RAM/SSD)       |
+---------------------------------------+       +---------------------------------------+
|         PHẦN CỨNG (CPU/RAM/SSD)       |
+---------------------------------------+
```

- **Máy ảo (VM):** Ảo hóa đến tận phần cứng. Muốn chạy 3 ứng dụng độc lập, bạn phải cài **3 hệ điều hành riêng biệt (Guest OS)**. Mỗi máy ảo ngốn hàng Gigabyte RAM, hàng chục GB ổ cứng và mất 1–2 phút để khởi động.
- **Docker Container:** **Sử dụng chung Nhân hệ điều hành (OS Kernel)** của máy chủ. Bản chất một Container trên máy bạn **chỉ là một tiến trình (process) bình thường** nhưng được nhân Linux dựng rào chắn xung quanh! Nhờ vậy:
  - Khởi động trong **vài mili-giây**.
  - Dung lượng chỉ từ **5MB – 150MB**.
  - Không chiếm cứng RAM/CPU như VM (dùng bao nhiêu lấy bấy nhiêu).

### 1.4. Kiến trúc của Docker (Client – Host – Registry)

```md
+-------------------+          REST API          +----------------------------------------+          Internet          +-----------------------+
|   DOCKER CLIENT   | -------------------------> |              DOCKER HOST               | -------------------------> |    DOCKER REGISTRY    |
| (Lệnh CLI bạn gõ) |                            |  +----------------------------------+  |                            |  (Kho chứa: DockerHub,|
|  - docker run     |                            |  |    Docker Daemon (dockerd)       |  |                            |   GHCR, AWS ECR...)   |
|  - docker build   |                            |  +----------------------------------+  |                            |                       |
|  - docker pull    |                            |  | Images:     [nginx] [postgres]   |  |                            |  - nginx:latest       |
+-------------------+                            |  | Containers: [app-1] [db-1]       |  |                            |  - node:20-alpine     |
                                                 +----------------------------------------+                            +-----------------------+
```

- **Docker Client (`docker`):** Là công cụ dòng lệnh (CLI) nơi bạn gõ lệnh rồi gửi yêu cầu tới Docker Host.
- **Docker Host (`dockerd` - Docker Daemon):** "Trái tim" chạy ngầm dưới nền, trực tiếp tải image, tạo container, quản lý mạng và ổ đĩa.
- **Docker Registry:** Kho lưu trữ các bản khuôn mẫu (Image) trên đám mây (mặc định là **Docker Hub**).

> 🔍 **4 Tình huống thực tế bạn cần nhớ:**
>
> 1. **Khi máy chưa có Image:** Bạn gõ `docker run nginx` $\rightarrow$ Docker Daemon thấy trong máy chưa có khuôn `nginx` $\rightarrow$ Tự động lên Docker Hub tải (`pull`) về $\rightarrow$ Tạo và bật Container.
> 2. **Khi máy đã có sẵn Image:** Lần thứ 2 bạn gõ `docker run nginx` $\rightarrow$ Docker Daemon lấy ngay khuôn có sẵn trong máy để đẻ ra Container mới trong 0.2 giây mà không cần tải lại!
> 3. **Client và Host không nằm cùng 1 máy:** Bạn có thể ngồi ở laptop cá nhân (Docker Client) gõ lệnh điều khiển Docker Daemon đang chạy trên một con VPS ở tận Singapore!
> 4. **Private Registry:** Các công ty lớn không đẩy code mật lên Docker Hub công khai mà tự dựng Registry riêng (Harbor, GitHub Container Registry, AWS ECR).

### 1.5. Phân biệt `Docker Image` và `Docker Container`

- **Docker Image (Khuôn đúc bánh / Class trong OOP):** Là một file mẫu **chỉ đọc (Read-only)** chứa code và môi trường.
- **Docker Container (Chiếc bánh thật / Instance trong OOP):** Là thực thể đang chạy được sinh ra từ Image.
- 📌 **Quy tắc bất di bất dịch:** _1 Docker Image có thể tạo ra N Docker Container, nhưng 1 Docker Container chỉ được tạo ra từ đúng 1 Docker Image._

### 1.6. Cấu trúc chuẩn của mọi câu lệnh Docker hiện đại

Thay vì học vẹt hàng trăm lệnh rời rạc, bạn chỉ cần nhớ đúng 1 công thức:
$$\text{docker } \underbrace{\langle\text{object}\rangle}_{\text{Đối tượng}} \text{ } \underbrace{\langle\text{command}\rangle}_{\text{Hành động}} \text{ } \underbrace{\langle\text{options}\rangle}_{\text{Tham số}}$$

- `<object>`: `container`, `image`, `volume`, `network`, `system`...
- `<command>`: `run`, `ls`, `stop`, `rm`, `inspect`, `logs`, `prune`...
- Ví dụ: `docker container ls`, `docker image ls`, `docker volume ls`, `docker network ls`. _(Lưu ý: `docker ps` là cách viết tắt cũ của `docker container ls`)._

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Kiểm tra kết nối giữa Docker Client và Docker Daemon

Bấm `▶ Run` để xem phiên bản của cả Client lẫn Server (Daemon):

```bash
docker version
```

**Giải thích:** Nếu bạn thấy cả 2 phần `Client:` và `Server: Docker Engine` hiện ra, nghĩa là Docker Daemon trên máy bạn đang sống khỏe mạnh!

### Bước 2: Chạy Container đầu tiên (`hello-world`)

```bash
docker container run hello-world
```

**Chuyện gì vừa xảy ra trong 2 giây đó?**

1. Docker Client gửi lệnh `run hello-world` cho Docker Daemon.
2. Daemon tìm trong máy chưa thấy image `hello-world:latest` $\rightarrow$ Tự kéo từ Docker Hub về.
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

```bash
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

## 1. Lý thuyết Chuyên sâu

### 1.1. Hệ thống File phân lớp (Union File System) & Cấu tạo của Image

Một **Docker Image** không phải là 1 cục file khổng lồ nguyên khối, mà được ghép từ **một chuỗi các lớp chỉ đọc (Read-only Layers) xếp chồng lên nhau**.

- Mỗi câu lệnh trong `Dockerfile` tạo ra một Layer mới chỉ ghi nhận **sự thay đổi (delta)** so với Layer ngay bên dưới nó.
- **Tổng kích thước của các Layer chính là kích thước của Image.**
- **Tại sao có những Layer kích thước bằng `0B`?** Vì những câu lệnh như `ENV`, `EXPOSE`, `WORKDIR`, `VOLUME`, `CMD` chỉ thay đổi thông tin cấu hình (metadata JSON) chứ không tạo thêm hay sửa file nào trên ổ cứng!

### 1.2. Chuyện gì xảy ra khi tạo Container từ Image? (Bí mật của Writable Layer)

```ini
+-------------------------------------------------------------------+
|  CONTAINER LAYER (Read-Write / Writable Layer)                    | <-- Mọi file thêm/sửa/xóa khi
|  - Khi container chạy, mọi thay đổi chỉ nằm ở lớp mỏng trên cùng  |     container chạy đều nằm ở đây!
+===================================================================+
|  Layer 4: CMD ["node", "dist/main.js"]           (0B - Read Only) | \
+-------------------------------------------------------------------+  |
|  Layer 3: COPY . /app                            (2MB - Read Only)|  |  IMAGE LAYERS
+-------------------------------------------------------------------+  |  (Bất biến / Read-Only,
|  Layer 2: RUN npm install                       (85MB - Read Only)|  |   dùng chung cho mọi Container)
+-------------------------------------------------------------------+  |
|  Layer 1: Base Image (node:20-alpine)          (135MB - Read Only)| /
+-------------------------------------------------------------------+
```

- Khi bạn khởi tạo một Container từ Image, Docker giữ nguyên toàn bộ các lớp của Image ở trạng thái **Read-Only** (để 10 container cùng chạy 1 image có thể dùng chung các lớp này mà không tốn gấp 10 lần ổ cứng!).
- Docker chỉ đặt thêm **1 lớp mỏng có thể đọc-ghi (Writable Layer)** lên trên cùng.
- Khi bạn vào trong container tạo file `hihi.txt` hoặc xóa một file có sẵn:
  - Các lớp Read-only bên dưới **không hề bị ảnh hưởng**.
  - Thay đổi đó được ghi nhận trên **Writable Layer** (cơ chế _Copy-on-Write_).
  - Bạn có thể dùng lệnh `docker container diff <tên_container>` để soi toàn bộ những gì đã bị thay đổi trên Writable Layer:
    - **`A` (Added):** File/thư mục mới được thêm vào.
    - **`C` (Changed):** File/thư mục có sẵn bị chỉnh sửa.
    - **`D` (Deleted):** File/thư mục bị xóa (thực chất là bị đánh dấu ẩn đi trên lớp Writable).

### 1.3. Hai cách để tạo ra Docker Image & Hai cách để phân phối Image

1. **Cách tạo ra Docker Image:**
   - **Cách 1 (Chuẩn công nghiệp - Khuyên dùng 99%):** Viết kịch bản trong file `Dockerfile` rồi chạy `docker image build`.
   - **Cách 2 (Đóng băng Writable Layer):** Sửa đổi trực tiếp bên trong một Container đang chạy, sau đó dùng lệnh `docker container commit` để biến lớp **Writable** của container đó thành một lớp **Read-only** mới, tạo thành Image mới. _(Hữu ích khi muốn cứu dữ liệu khẩn cấp hoặc lưu lại hiện trạng debug)._

2. **Cách phân phối (chia sẻ) Docker Image cho người khác hoặc đem lên Server:**
   - **Qua Docker Registry (Docker Hub / GHCR):** Đổi tên image theo chuẩn `<username>/<tên_image>:<tag>` bằng `docker image tag`, sau đó đẩy lên mạng bằng `docker image push`.
   - **Đóng gói thành file `.tar` (Khi Server không có mạng Internet hoặc chặn Docker Hub):** Dùng `docker image save -o file.tar <tên_image>` để nén toàn bộ image thành 1 file `.tar`, chép qua USB/SCP sang máy khác rồi nạp lại bằng `docker image load -i file.tar`.

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Mổ xẻ các Layer của một Image bằng `docker image history`

Hãy kéo image `node:20-alpine` về và soi từng lớp bên trong nó:

```bash
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

```bash
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

# 📘 MODULE 03: DOCKERFILE MASTERY — BUILD CONTEXT, LAYER CACHING & TIẾN HÓA V1 $\rightarrow$ V3

> 🎯 **Mục tiêu:** Nắm vững toàn bộ các chỉ thị trong `Dockerfile`, hiểu rõ bẫy **Build Context** (`demo/test` vs `demo`), cơ chế **Layer Caching** và cách tối ưu thời gian build từ 60 giây xuống còn 1 giây.

## 1. Lý thuyết Chuyên sâu

### 1.1. Bảng phân biệt các chỉ thị dễ nhầm lẫn nhất trong `Dockerfile`

| Cặp chỉ thị                   | Sự khác biệt cốt lõi & Quy tắc thực chiến                                                                                                                                                                                                                                                                                      |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`RUN`** vs **`CMD`**        | - **`RUN`** chạy trong lúc **BUILD Image** (để cài gói phần mềm, biên dịch code, tạo ra layer mới).<br>- **`CMD`** chạy vào thời điểm **CONTAINER KHỞI ĐỘNG** (chỉ định lệnh mặc định để bật ứng dụng).                                                                                                                        |
| **`COPY`** vs **`ADD`**       | - **`COPY`**: Chỉ làm đúng 1 việc minh bạch là chép file/thư mục từ máy Host vào Image.<br>- **`ADD`**: Ngoài việc copy còn tự động giải nén file `.tar.gz` và tải được link URL $\rightarrow$ dễ gây rủi ro bảo mật ngoài ý muốn. **Quy tắc: Luôn dùng `COPY`, chỉ dùng `ADD` khi thực sự muốn bung nén file `.tar` nội bộ.** |
| **`ARG`** vs **`ENV`**        | - **`ARG`**: Biến chỉ tồn tại trong lúc **build image** (biến mất khi container chạy).<br>- **`ENV`**: Biến môi trường tồn tại **cả lúc build lẫn lúc container đang chạy** (code đọc được qua `process.env`).                                                                                                                 |
| **`CMD`** vs **`ENTRYPOINT`** | - **`CMD`**: Lệnh mặc định nhưng **dễ dàng bị ghi đè** nếu người dùng truyền lệnh khác ở cuối `docker run`.<br>- **`ENTRYPOINT`**: Khóa chặt chương trình thực thi chính của container; mọi tham số truyền thêm ở `docker run` sẽ biến thành tham số đuôi cho `ENTRYPOINT`.                                                    |

> ⚠️ **Lưu ý sống còn cho Node.js/NestJS (Exec Form vs Shell Form):**
>
> - **Shell Form:** `CMD npm run start` $\rightarrow$ Docker sẽ bọc lệnh của bạn trong `/bin/sh -c "npm run start"`. Lúc này `/bin/sh` chiếm `PID 1` và **nuốt mất tín hiệu `SIGTERM`** khi tắt container, khiến ứng dụng không thể Graceful Shutdown và bị treo 10 giây trước khi bị giết cưỡng bức!
> - **Exec Form (Bắt buộc dùng cho Production):** `CMD ["node", "dist/main.js"]` $\rightarrow$ Tiến trình `node` trực tiếp làm `PID 1` và nhận tín hiệu tắt an toàn ngay lập tức.

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
  $\rightarrow$ Docker chỉ gửi thư mục `demo/test` lên Daemon. Kết quả trong `/app` của container **chỉ có `file1.txt` và `file2.txt`**. Hai file `file3.txt`, `file4.txt` nằm ngoài `demo/test` nên không được copy!
- **Trường hợp 2 (Build Context là `demo`):**
  Bạn chạy `docker image build -f demo/test/Dockerfile -t img-th2 demo`
  $\rightarrow$ Dù `Dockerfile` vẫn nằm tít bên trong `demo/test/`, nhưng vì Build Context là `demo`, lệnh `COPY . /app` sẽ chép **toàn bộ `file3.txt`, `file4.txt` và cả thư mục con `test/`** vào trong container!

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

```bash
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

### Bước 2: Tiến hóa Dockerfile cho dự án NestJS (`v1-naive` $\rightarrow$ `v2-layered` $\rightarrow$ `v3-optimized`)

Chúng ta sẽ tạo file `.dockerignore` và 3 phiên bản `Dockerfile` cho ứng dụng `nestjs-app`, sau đó kiểm nghiệm tốc độ Cache khi sửa code!

```bash
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

## 1. Lý thuyết Chuyên sâu

### 1.1. Sơ đồ Vòng đời (Lifecycle) của một Container

```md
                 docker create                    docker start                     docker pause
 (Image) ----------------------------> [ CREATED ] ----------> [ RUNNING ] <=========================> [ PAUSED ]
                                            |                    |     ^        docker unpause          (Đóng băng
                                            |                    |     |                                 trong RAM)
                                            |       docker stop  |     | docker start / restart
                                            |       docker kill  v     |
                                            |                 [ STOPPED / EXITED ]
                                            |                    |     |
                                            |                    |     +--> Exit Code 0   : Tắt bình thường, êm đẹp
                                            |                    |     +--> Exit Code 1   : Sập do lỗi code (Uncaught Exception)
                                            |                    |     +--> Exit Code 137 : Bị giết cưỡng bức (SIGKILL / OOM Kill!)
                                            v                    v
                                       ( docker rm : Xóa hoàn toàn Container & Writable Layer )
```

### 1.2. Sự khác biệt sống còn giữa `docker stop` và `docker kill`

- **`docker container stop <name>`:**
  1.  Gửi tín hiệu lịch sự **`SIGTERM`** vào tiến trình chính (`PID 1`) bên trong container, báo rằng: _"Này, chuẩn bị tắt máy nhé, hãy lưu nốt dữ liệu và đóng kết nối DB đi!"_.
  2.  Chờ ân huệ mặc định **10 giây**. Nếu ứng dụng tự tắt trước 10 giây (như hàm `process.on('SIGTERM')` trong `nestjs-app` của chúng ta), container dừng ngay với **Exit Code 0**.
  3.  Nếu quá 10 giây mà ứng dụng vẫn cố tình treo, Docker mới rút súng bắn tín hiệu **`SIGKILL`**.

- **`docker container kill <name>`:** Bắn thẳng tín hiệu **`SIGKILL`** vào nhân hệ điều hành để chặt đứt tiến trình ngay lập tức (0 giây chờ đợi). Rất dễ gây hỏng dữ liệu đang ghi dở!

### 1.3. Tại sao trong thực tế bạn bắt buộc phải giới hạn RAM/CPU (`--memory`, `--cpus`)?

Mặc định, một Container có thể ăn **100% RAM và CPU của máy chủ**. Nếu ứng dụng Node.js của bạn bị rò rỉ bộ nhớ (Memory Leak), nó sẽ nuốt sạch RAM của toàn bộ VPS và kéo sập luôn cả Database lẫn các dịch vụ khác!

- Khi bạn đặt `--memory=64m`, nhân Linux (cgroups) sẽ canh gác container đó.
- Ngay giây phút container đòi dùng sang MB thứ 65, **Linux Kernel OOM Killer (Out-Of-Memory Killer)** sẽ lập tức tiêu diệt container với **`Exit Code 137`** ($128 + 9$, trong đó $9$ là mã của tín hiệu `SIGKILL`) và bật cờ `"OOMKilled": true` bên trong `docker inspect`.

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

### 1.1. Tại sao cần Persistent Data (Dữ liệu bền vững)?

Như đã học ở Module 02, mọi dữ liệu phát sinh khi container chạy đều nằm ở **Writable Layer**. Khi container bị lỗi và bạn xóa nó đi để tạo container mới (`docker rm`), **toàn bộ Writable Layer sẽ bị hủy diệt vĩnh viễn**. Nếu bạn chạy Database (MySQL, PostgreSQL) mà không tách dữ liệu ra ngoài, xóa container là mất trắng toàn bộ dữ liệu khách hàng!

### 1.2. So sánh Bản chất của `Bind Mount` và `Volume` (Sơ đồ ánh xạ ổ cứng)

```ini
====================================================================================
1. BIND MOUNT (Chiều thuận: Bạn tự chọn 1 thư mục cụ thể trên máy Host gắn vào Container)
====================================================================================
   [ MÁY HOST CỦA BẠN ]                              [ BÊN TRONG CONTAINER ]
   /Users/ban/code/nestjs-app/src   <=============>  /app/src
                 \                                  /
                  +---> Cùng trỏ vào 1 vùng ổ cứng-+
   * Đặc điểm: Bạn kiểm soát đường dẫn tuyệt đối trên máy Host. Sửa code bằng VS Code
               ở ngoài máy Host thì bên trong Container cập nhật ngay lập tức!

====================================================================================
2. NAMED VOLUME (Chiều ngược lại: Docker tự quản lý vùng nhớ ngầm trên máy Host)
====================================================================================
   [ DO DOCKER TỰ QUẢN LÝ NGẦM TRÊN HOST ]           [ BÊN TRONG CONTAINER ]
   /var/lib/docker/volumes/pgdata/_data  <========>  /var/lib/postgresql/data
   * Đặc điểm: Bạn chỉ cần đặt tên Volume (ví dụ: 'pgdata'). Docker tự lo nơi cất giữ
               tối ưu và an toàn nhất. Nếu thư mục trong container có sẵn file mẫu,
               Named Volume sẽ tự động copy các file mẫu đó ra Volume ở lần đầu tiên!
```

### 1.3. Ba trường hợp thực tế cực hay bạn phải biết (Từ Tài liệu 2)

1. **Bài toán phỏng vấn kinh điển về `Bind Mount` và cờ `:ro` (Read-Only):**
   - Để ngăn không cho tiến trình bên trong Container sửa hoặc xóa nhầm code trên máy Host, ta gắn thêm đuôi **`:ro`** vào cuối đường dẫn mount: `-v /host/folder:/container/folder:ro`.
   - **Câu hỏi phỏng vấn:** _Giả sử Container A (`thuan-nginx-1`) và Container B (`thuan-nginx-2`) cùng Bind Mount vào chung 1 thư mục trên máy Host. Container A mount ở chế độ chỉ đọc (`:ro`), còn Container B mount ở chế độ được phép ghi (`:rw`). Nếu Container B tạo mới file `thuan.js`, thì bên trong Container A (vốn là `:ro`) có nhìn thấy file `thuan.js` đó không?_
   - **Đáp án:** **CÓ NHÌN THẤY NGAY LẬP TỨC!** Vì cả 2 container đều đang nhìn vào **cùng một vùng ổ cứng vật lý trên máy Host**. Cờ `:ro` trên Container A chỉ cấm Container A _tự tay ghi/xóa_ lên vùng ổ cứng đó, chứ không hề đóng băng tầm nhìn của nó khi người khác (Máy Host hoặc Container B) sửa vùng ổ cứng đó!

2. **Trường hợp đặc biệt: Anonymous Volume tự sinh trong Image của MySQL / PostgreSQL:**
   - Nếu bạn chạy `docker run nginx`, Docker không tự tạo ra cái Volume nào cả.
   - Nhưng nếu bạn chạy `docker run mysql` hoặc `postgres` **mà quên không truyền `-v`**, Docker vẫn **tự động tạo ra một Volume có tên là một chuỗi Hash dài ngoằng ngẫu nhiên** (Anonymous Volume)!
   - **Tại sao lại như vậy?** Vì những người tạo ra Official Image của MySQL/Postgres đã cẩn thận viết sẵn dòng lệnh `VOLUME ["/var/lib/mysql"]` bên trong `Dockerfile` gốc của họ để cứu bạn khỏi mất dữ liệu nếu lỡ quên gắn volume! _(Lưu ý: Nếu chạy kèm cờ `--rm` thì khi dừng container, các Anonymous Volume không tên này cũng sẽ tự động bị dọn sạch)._

3. **Chia sẻ toàn bộ Volume bằng `--volumes-from` & Utility Containers:**
   - Bạn có thể cho Container C kế thừa toàn bộ các Volume mà Container A đang gắn bằng cờ `--volumes-from <Container_A>`.
   - **Utility Container (Container Tiện ích):** Giả sử máy bạn đang cài Node 18, nhưng bạn muốn test nhanh một lệnh với **Node 22** mà không muốn cài đè làm hỏng máy? Bạn chỉ cần chạy một container `node:22-alpine`, dùng Bind Mount gắn thư mục hiện tại `$(pwd):/app` vào rồi chạy lệnh xong là xóa (`--rm`)!

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

```bash
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

### 1.1. Bốn loại Network Driver trong Docker

```ini
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

### 1.2. Tại sao tuyệt đối không nên dùng IP tĩnh giữa các Container mà phải dùng Custom Network DNS?

- Mỗi lần một container (như Database) khởi động lại, địa chỉ IP nội bộ của nó (`172.17.0.x`) **có thể bị thay đổi**! Nếu bạn điền cứng IP vào code NestJS, mỗi lần restart container là sập hệ thống.
- Trên mạng **`bridge` mặc định**, Docker không bật DNS tự động (muốn gọi theo tên phải dùng cờ `--link` đã cũ kỹ và bị khuyến cáo ngừng dùng).
- Khi bạn tự tạo một **Custom Network** (`docker network create my-net`), Docker nhúng sẵn một máy chủ **DNS nội bộ** vào mạng đó. Container `api` chỉ cần gọi `DATABASE_HOST=db` là Docker tự động dịch chữ `db` ra đúng địa chỉ IP hiện tại của container `db`!

### 1.3. Hai kỹ thuật Kiến trúc Mạngระดับ Master (Từ Tài liệu 1 & 2)

1. **Một Container tham gia 2 mạng cùng lúc (Multi-Network Security Isolation):**
   - Bạn tạo 2 mạng: `frontend-net` và `backend-net`.
   - Cho `web` (Nginx) nằm ở `frontend-net`.
   - Cho `db` (Postgres) nằm ở `backend-net`.
   - Cho `api` (NestJS) nằm ở **CẢ 2 MẠNG** (dùng lệnh `docker network connect`).
   - **Kết quả bảo mật tuyệt đối:** `web` nói chuyện được với `api`, `api` nói chuyện được với `db`, nhưng nếu hacker chiếm được `web` thì **không tài nào ping hay chọc trực tiếp vào `db` được** vì 2 mạng tách rời nhau!

2. **Network Alias (`--network-alias`) — Cân bằng tải (Load Balancing) tự nhiên:**
   - Nếu bạn chạy 2 hoặc 3 container cùng thực hiện một nhiệm vụ (ví dụ 2 bản sao của `search-service`) trong cùng một Custom Network và đặt chung cờ `--network-alias search`, khi container khác gọi tới địa chỉ `http://search`, DNS của Docker sẽ **luân phiên phân phối ngẫu nhiên (Round-Robin)** vào từng container bên dưới!

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

### 1.1. Nỗi khổ khi không có Docker Compose vs Khi có Docker Compose

Để chạy một hệ thống Backend thực tế gồm **4 thành phần** (`NestJS API` + `PostgreSQL` + `Redis` + `Adminer GUI`), nếu làm thủ công bạn phải:

1. Tạo Custom Network.
2. Tạo 2 Named Volumes cho Postgres và Redis.
3. Gõ 4 câu lệnh `docker run` dài cả trang giấy với hàng chục biến `-e`, `-v`, `-p`, `--network`.

Với **Docker Compose**, bạn khai báo toàn bộ kiến trúc vào 1 file YAML và chỉ cần gõ:

- `docker compose up -d`: Tự tạo Network riêng, tự tạo Volumes, tự build và khởi chạy toàn bộ hệ thống theo đúng thứ tự!
- `docker compose down`: Dừng và gỡ bỏ toàn bộ containers + network trong 1 nốt nhạc (nhưng vẫn giữ nguyên dữ liệu trong Volumes trừ khi bạn thêm cờ `-v`).

### 1.2. Cái bẫy chết người của `depends_on` mặc định & Giải pháp `service_healthy`

```ini
❌ KHI CHỈ DÙNG depends_on THÔNG THƯỜNG:
[Container DB]  : Bắt đầu tạo container (0.5s) ---> Đang khởi tạo file hệ thống Postgres (Mất thêm 5s)...
[Container API] : Thấy Container DB vừa "Created/Started" ở giây 0.5 là nhảy vào kết nối cổng 5432 ngay!
                  ==> 💥 LỖI ECONNREFUSED! App NestJS sập ngay lập tức!

✅ KHI KẾT HỢP healthcheck + condition: service_healthy:
[Container DB]  : Bắt đầu tạo (0.5s) ---> Khởi tạo DB ---> Chạy thử lệnh 'pg_isready' ---> Báo trạng thái HEALTHY!
[Container API] : Kiên nhẫn đứng chờ đến khi DB chính thức đạt trạng thái HEALTHY mới khởi chạy!
                  ==> 🚀 KẾT NỐI THÀNH CÔNG 100%!
```

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

### 1.1. Cơ chế Auto-Merge kỳ diệu của `docker-compose.override.yml`

Trong một dự án thực tế, bạn không nên nhét cả cấu hình Dev (như Bind Mount code, mở cổng Debug `9229`) lẫn cấu hình Production vào chung 1 file. Docker Compose hỗ trợ cơ chế **Ghi đè đa tầng (Multi-file Merging)**:

- **`docker-compose.yml` (Base):** Chỉ chứa khung sườn chung nhất (tên services, networks, volumes).
- **`docker-compose.override.yml` (Dev):** Khi bạn gõ lệnh `docker compose up` mà không truyền cờ `-f`, Docker Compose sẽ **TỰ ĐỘNG đọc `docker-compose.yml` ghép đè với `docker-compose.override.yml`**! Rất tiện cho lập trình viên ở máy local.
- **`docker-compose.prod.yml` (Production):** Khi lên VPS thật, bạn chỉ định rõ:
  `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
  $\rightarrow$ Lúc này file `override.yml` bị bỏ qua hoàn toàn, thay bằng cấu hình khóa chặt bảo mật của `prod.yml`!

### 1.2. Tính năng `profiles` — Chỉ bật công cụ nặng khi thực sự cần

Giả sử dự án của bạn có thêm `pgadmin` hoặc `adminer` (giao diện quản lý DB) hoặc `prometheus` (giám sát). Nếu lúc nào gõ `docker compose up` cũng bật hết đống này thì rất tốn RAM.

- Giải pháp: Gắn `profiles: ["tools"]` vào service `adminer`.
- Bình thường gõ `docker compose up -d` $\rightarrow$ `adminer` sẽ nằm im không chạy.
- Khi nào cần soi DB trên giao diện Web, bạn gõ: `docker compose --profile tools up -d`!

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Tạo bộ 3 file (`docker-compose.yml`, `override.yml`, `prod.yml`) và kiểm tra bằng `docker compose config`

Lệnh `docker compose config` là "kính chiếu yêu" giúp bạn xem kết quả cuối cùng sau khi Docker trộn nhiều file YAML lại với nhau:

```bash
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

### 1.1. Tại sao Image xây theo cách thông thường lại nặng tới hơn 1GB?

Khi bạn viết một ứng dụng TypeScript/NestJS (hoặc Java Spring Boot, Go, React):

- **Lúc Build (Biên dịch):** Bạn cần bộ công cụ rất nặng: `typescript`, `@nestjs/cli`, `eslint`, `prettier`, `jest`, trình biên dịch C++ (`python`, `make`, `g++`) và toàn bộ mã nguồn `.ts`.
- **Lúc Chạy thật (Runtime trên Production):** Node.js **chỉ cần duy nhất thư mục `dist/` (chứa file `.js` đã dịch xong) và các thư viện `dependencies` thực tế**! Toàn bộ đống công cụ build và code `.ts` lúc này trở thành "mỡ thừa" vừa tốn tiền lưu trữ, kéo chậm tốc độ Deploy, vừa tạo lỗ hổng cho Hacker lợi dụng.

### 1.2. Cơ chế hoạt động của Multi-Stage Build

```sh
+-------------------------------------------------------------------------+
| STAGE 1: BUILDER (FROM node:20-alpine AS builder)                       |
|  - Cài toàn bộ dependencies + devDependencies (TypeScript, CLI...)      |
|  - Chạy 'npm run build' -> Sinh ra thư mục '/app/dist' gọn nhẹ          |
+-------------------------------------------------------------------------+
                                     |
         Chỉ nhặt đúng thư mục '/app/dist' đem sang Stage sau!
         (Vứt bỏ hoàn toàn Stage 1 cùng toàn bộ rác devDependencies)
                                     v
+-------------------------------------------------------------------------+
| STAGE 2: RUNNER (FROM node:20-alpine AS runner)                         |
|  - Chỉ cài 'npm install --omit=dev' (Production dependencies)           |
|  - Lệnh vàng: COPY --from=builder /app/dist ./dist                      |
|  - Kết quả: Image siêu nhẹ, sạch bóng công cụ thừa!                     |
+-------------------------------------------------------------------------+
```

> 🛡️ **Cấp độ Tối thượng — Google Distroless Image (`gcr.io/distroless/nodejs20-debian12`):**
> Ngay cả `node:20-alpine` vẫn còn chứa trình quản lý gói `apk` và trình vỏ lệnh `sh`. Google tạo ra dòng image **Distroless** chỉ chứa **đúng file thực thi `node` và các thư viện C tối thiểu**, **KHÔNG CÓ CẢ SHELL (`sh`/`bash`)**. Nếu hacker có lợi dụng được lỗi ứng dụng để thực thi lệnh hệ thống (RCE), chúng cũng không thể mở shell hay cài mã độc vào container được!

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

### 1.1. Bảng đối chiếu 2 thế giới: Development vs Production

| Tiêu chí                      | Môi trường Development (Lập trình viên)                                                     | Môi trường Production (Chạy thật trên VPS)                                                                          |
| :---------------------------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| **Mục tiêu tối thượng**       | Sửa code trên VS Code là thấy thay đổi ngay lập tức (**Hot-Reload**), dễ dàng gắn Debugger. | Chạy nhanh, ổn định 24/7, dung lượng nhỏ, bảo mật cao, tự phục hồi khi gặp sự cố.                                   |
| **Cách đưa Code vào**         | Dùng **Bind Mount** (`-v ./src:/app/src`) để đồng bộ trực tiếp từ máy Host.                 | Đóng gói cố định (`COPY --from=builder`) vào bên trong **Multi-Stage Image**. Tuyệt đối không dùng Bind Mount code! |
| **Lệnh khởi chạy (`CMD`)**    | `npm run start:dev` (Chế độ Watch).                                                         | `["node", "dist/main.js"]` (Exec form trực tiếp).                                                                   |
| **Quyền người dùng (`USER`)** | Có thể dùng `root` hoặc `node` để tiện cài tool.                                            | Bắt buộc dùng **Non-root User** (`USER node`).                                                                      |
| **Kiểm tra sức khỏe**         | Không bắt buộc.                                                                             | Bắt buộc cấu hình **`HEALTHCHECK`** định kỳ gọi `/health`.                                                          |

### 1.2. Tại sao `HEALTHCHECK` và `Graceful Shutdown` lại phân định giữa Amateur và Master?

1. **Container `Running` chưa chắc ứng dụng bên trong đã sống!**
   Đôi khi tiến trình `node` bị treo cứng (Deadlock) hoặc mất kết nối DB: Docker thấy tiến trình chưa thoát nên vẫn báo trạng thái `Up (Running)`, trong khi người dùng truy cập thì bị xoay vòng trắng trang! Chỉ thị `HEALTHCHECK` sẽ định kỳ gọi vào `http://localhost:3000/health` mỗi vài giây — nếu quá 3 lần không trả lời `200 OK`, Docker sẽ đánh dấu container là **`unhealthy`** để hệ thống giám sát/cân bằng tải biết đường xử lý.
2. **Graceful Shutdown (Tắt êm ái):**
   Khi bạn cập nhật phiên bản mới trên VPS, container cũ sẽ bị dừng (`docker stop`). Nếu không xử lý `SIGTERM`, một khách hàng đang thanh toán dở ở giây thứ 0.5 sẽ bị ngắt phụt kết nối! Với Graceful Shutdown, ứng dụng ngừng nhận khách mới, xử lý nốt giao dịch đang dở rồi mới thoát ra với `Exit Code 0`.

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

### 1.1. Ba lớp áo giáp Bảo mật Container trong môi trường Production

1. **Không bao giờ chạy Container dưới quyền `root` (`USER node`):** Mặc định tiến trình trong container chạy dưới quyền `root` (`uid=0`). Nếu hacker thoát được ra khỏi container (Container Escape vulnerability), chúng sẽ trở thành `root` ngay trên máy chủ VPS của bạn!
2. **Khóa ghi hệ thống file (`--read-only` kết hợp `--tmpfs /tmp`):** Một khi đã lên Production, code của bạn không bao giờ có nhu cầu tự sửa đổi chính nó. Chạy container với cờ `--read-only` sẽ biến cả **Writable Layer thành Read-Only**! Nếu ứng dụng cần chỗ ghi file tạm, chỉ cấp cho nó một vùng nhớ nhỏ trên RAM bằng `--tmpfs /tmp`.
3. **Tước bỏ đặc quyền nhân Linux (`--cap-drop=ALL` & `--security-opt=no-new-privileges`):** Ngăn chặn hoàn toàn việc tiến trình con tự nâng quyền hoặc can thiệp vào card mạng/hệ thống của nhân Linux.

### 1.2. Quy trình 4 bước của Chuyên gia khi gặp Container bị sập liên tục (Crash-Loop)

Khi một container vừa bật lên đã tắt (`Exited` hoặc `Restarting`), bạn không thể dùng `docker exec` chui vào được vì nó đã chết rồi! Hãy làm theo đúng 4 bước sau:

1. **`docker container logs <name>`:** Đọc dòng báo lỗi cuối cùng mà ứng dụng kịp in ra trước khi chết.
2. **`docker container inspect <name>`:** Kiểm tra `ExitCode`, biến môi trường `Env`, `Mounts` và lệnh khởi chạy `Cmd`.
3. **`docker container diff <name>`:** Xem container có tạo ra file rác hay thiếu quyền trên thư mục nào không.
4. **Ghi đè `ENTRYPOINT`/`CMD` để mổ khám nghiệm:** Chạy một container mới từ cùng Image đó nhưng đổi lệnh chạy thành `sh` (`docker run --rm -it --entrypoint sh <tên_image>`) để vào bên trong kiểm tra từng file!

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

> 🎯 **Mục tiêu:** Đưa toàn bộ kiến thức từ Module 01 $\rightarrow$ 11 lên một **VPS Linux thật**. Thiết lập quy trình tự động hóa hoàn chỉnh với **GitHub Actions**: Bạn chỉ cần `git push` ở máy cá nhân $\rightarrow$ GitHub tự chạy Test $\rightarrow$ Tự Build Multi-Stage Image $\rightarrow$ Đẩy lên Registry $\rightarrow$ Tự động SSH vào VPS cập nhật phiên bản mới mà không cần làm thủ công!

## 1. Kiến trúc Luồng CI/CD Thực tế từ Máy của bạn lên VPS

```sh
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

### Tại sao chúng ta KHÔNG NÊN chạy lệnh `docker build` trực tiếp trên VPS giá rẻ?

Nhiều bạn mới thuê VPS ($4–$5/tháng, chỉ có 1GB RAM) thường kéo source code về VPS rồi gõ `docker compose up --build` ngay trên VPS.

- **Hậu quả:** Quá trình `npm install` và biên dịch TypeScript (`tsc`) ngốn rất nhiều RAM và CPU $\rightarrow$ **Treo cứng cả con VPS, làm sập luôn ứng dụng đang phục vụ khách hàng!**
- **Cách làm chuẩn Master:** Tận dụng máy chủ miễn phí cực mạnh của **GitHub Actions** (có sẵn 7GB RAM, 2–4 CPU cores) để chạy Test và Build ra Multi-Stage Image siêu nhẹ (~140MB), đẩy lên **Docker Hub / GitHub Container Registry (`ghcr.io`)**. Con VPS của bạn chỉ việc `docker compose pull` (tải cái Image đã chế biến sẵn về trong 3 giây) và bật lên!

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
3. Copy nội dung **Private Key** (`id_ed25519_cicd`) đem lên GitHub Repo của bạn $\rightarrow$ **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** và tạo 4 Secrets:
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