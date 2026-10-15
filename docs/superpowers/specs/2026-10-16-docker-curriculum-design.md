# Docker Curriculum Design Spec — Beginner to Master

> **Mục tiêu**: Tạo cụm bài giảng Docker hoàn chỉnh trong repo `learn-nestjs`, đi từ zero đến production-ready. Mỗi bài có lý thuyết + code chạy được + bài tập. Người học chỉ việc run và check kết quả.

---

## 1. Đối tượng & Bối cảnh

- **Đối tượng**: Developer đã biết TypeScript/NestJS cơ bản, muốn học Docker từ đầu.
- **Phong cách học**: Giống IoC/ folder hiện tại — code-first, comment giải thích chi tiết bằng tiếng Việt, tiến hóa dần từng version.
- **Subject app**: Chính project NestJS đang có trong repo. Qua 12 modules, app này sẽ được containerize hoàn chỉnh.
- **Mục đích kép**: Vừa tự học, vừa là tài liệu chia sẻ cho team/sinh viên.

## 2. Kiến trúc Thư mục

```
Docker/
├── README.md                              # Lộ trình tổng quan + prerequisites + cách dùng
│
├── nestjs-app/                            # NestJS app mẫu dùng xuyên suốt 12 modules
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── users/                         # CRUD module đơn giản (dùng từ module-07 trở đi)
│   │       ├── users.module.ts
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.entity.ts
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .gitignore
│
├── module-01-hello-docker/
│   ├── LESSON.md                          # Lý thuyết + hướng dẫn step-by-step
│   ├── commands.sh                        # Tất cả câu lệnh trong bài, chạy được
│   └── exercises/
│       ├── EXERCISES.md                   # Đề bài (3-5 bài/module)
│       └── SOLUTIONS.md                   # Đáp án chi tiết
│
├── module-02-images/
│   ├── LESSON.md
│   ├── commands.sh
│   ├── Dockerfile.v1-basic               # Dockerfile đầu tiên, comment từng dòng
│   └── exercises/
│
├── module-03-dockerfile-fundamentals/
│   ├── LESSON.md
│   ├── Dockerfile.v1-naive               # Cách viết sai/chưa tốt
│   ├── Dockerfile.v2-layered             # Cải tiến: layer ordering
│   ├── Dockerfile.v3-optimized           # Cải tiến: cache, .dockerignore
│   ├── .dockerignore                     # File mẫu có comment
│   └── exercises/
│
├── module-04-containers-deep-dive/
│   ├── LESSON.md
│   ├── commands.sh
│   └── exercises/
│
├── module-05-volumes/
│   ├── LESSON.md
│   ├── commands.sh
│   ├── docker-compose.volume-demo.yml
│   └── exercises/
│
├── module-06-networking/
│   ├── LESSON.md
│   ├── commands.sh
│   ├── docker-compose.network-demo.yml
│   └── exercises/
│
├── module-07-compose-basics/
│   ├── LESSON.md
│   ├── docker-compose.v1-simple.yml      # NestJS only
│   ├── docker-compose.v2-with-db.yml     # NestJS + PostgreSQL
│   ├── docker-compose.v3-full.yml        # NestJS + PostgreSQL + Redis
│   ├── .env.example
│   └── exercises/
│
├── module-08-compose-advanced/
│   ├── LESSON.md
│   ├── docker-compose.yml
│   ├── docker-compose.override.yml
│   ├── docker-compose.prod.yml
│   ├── Makefile                           # Shortcuts cho các lệnh thường dùng
│   └── exercises/
│
├── module-09-multistage-builds/
│   ├── LESSON.md
│   ├── Dockerfile.v1-single-stage        # ~1.2GB image
│   ├── Dockerfile.v2-multi-stage         # ~200MB image
│   ├── Dockerfile.v3-distroless          # ~80MB image
│   ├── compare-sizes.sh                  # Script so sánh kích thước
│   └── exercises/
│
├── module-10-dev-vs-prod/
│   ├── LESSON.md
│   ├── Dockerfile.dev                    # Hot-reload, debug tools
│   ├── Dockerfile.prod                   # Optimized, security hardened
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── .env.dev
│   ├── .env.prod
│   ├── healthcheck.sh                    # Script healthcheck có comment
│   └── exercises/
│
├── module-11-security-and-debugging/
│   ├── LESSON.md
│   ├── commands.sh
│   ├── Dockerfile.secure                 # Non-root user, read-only fs, secrets
│   ├── docker-compose.debug.yml          # Debug setup với Node inspector
│   └── exercises/
│
└── module-12-cicd-and-beyond/
    ├── LESSON.md
    ├── .github/
    │   └── workflows/
    │       └── docker-ci.yml             # GitHub Actions pipeline
    ├── docker-compose.monitoring.yml     # Prometheus + Grafana
    ├── k8s-intro/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   └── INTRO.md
    └── exercises/
```

## 3. Nội dung Chi tiết Từng Module

### Module 01: Hello Docker — Docker là gì?

**Mục tiêu**: Hiểu Docker giải quyết vấn đề gì, cài đặt, chạy container đầu tiên.

**Lý thuyết:**
- "It works on my machine" problem → Docker giải quyết thế nào
- Container vs Virtual Machine — diagram + so sánh thực tế
- Docker Engine architecture: Docker Daemon, Docker Client, Docker Registry
- Giải thích khái niệm: Image, Container, Registry, Dockerfile

**Hands-on (commands.sh):**
```bash
# 1. Kiểm tra Docker đã cài chưa
docker version
docker info

# 2. Chạy container đầu tiên — giải thích từng phần lệnh
docker run hello-world
# → Giải thích: Docker pull image từ Docker Hub → tạo container → chạy → in output → dừng

# 3. Chạy container interactive
docker run -it ubuntu bash
# → Bên trong: ls, cat /etc/os-release, exit
# → Giải thích: -i (interactive), -t (pseudo-TTY)

# 4. Chạy container detached (background)
docker run -d -p 8080:80 --name my-nginx nginx
# → Mở browser: http://localhost:8080
# → Giải thích: -d (detached), -p (port mapping host:container), --name

# 5. Xem containers đang chạy
docker ps
docker ps -a   # Cả container đã dừng

# 6. Dừng và xóa
docker stop my-nginx
docker rm my-nginx
```

**Bài tập:**
1. Chạy một container `alpine` và in ra "Xin chào Docker!" bằng lệnh `echo`
2. Chạy container `httpd` (Apache) trên port 3000, truy cập browser, rồi dừng nó
3. Liệt kê tất cả containers (cả đang chạy và đã dừng), sau đó xóa sạch

---

### Module 02: Docker Images — Hiểu sâu về Image

**Mục tiêu**: Hiểu image là gì, layer system, pull/inspect/tag/push.

**Lý thuyết:**
- Image = Read-only template, gồm nhiều layers xếp chồng
- Union File System — diagram giải thích layer stacking
- Image vs Container: Image là "class", Container là "instance"
- Docker Hub, Official Images, Tags (latest, alpine, slim, bullseye)
- Image naming convention: `registry/user/repo:tag`

**Hands-on:**
```bash
# 1. Pull image và xem layers
docker pull node:20-alpine
docker history node:20-alpine
# → Giải thích từng layer: base OS, npm install, etc.

# 2. Inspect image metadata
docker inspect node:20-alpine
# → Giải thích: Env, Cmd, Layers, Architecture

# 3. So sánh kích thước các variants
docker pull node:20           # ~1GB
docker pull node:20-slim      # ~250MB
docker pull node:20-alpine    # ~130MB
docker images | grep node
# → Giải thích tại sao chọn alpine cho production

# 4. Tag và đặt tên image
docker tag node:20-alpine my-node:v1
docker images | grep my-node

# 5. Build image đầu tiên từ Dockerfile
docker build -t my-first-app:v1 .
```

**Dockerfile.v1-basic** (Dockerfile đầu tiên, comment chi tiết):
```dockerfile
# ============================================================================
# DOCKERFILE ĐẦU TIÊN — Hiểu từng dòng lệnh
# ============================================================================

# FROM: Chọn base image — giống như "kế thừa" từ một OS/environment có sẵn
# node:20-alpine = Node.js phiên bản 20, chạy trên Alpine Linux (nhẹ, ~5MB)
FROM node:20-alpine

# WORKDIR: Đặt thư mục làm việc bên trong container
# Giống như "cd /app" — mọi lệnh sau đây sẽ chạy trong /app
WORKDIR /app

# COPY: Sao chép file từ máy host vào trong container
# COPY <nguồn trên host> <đích trong container>
COPY package*.json ./

# RUN: Chạy lệnh trong quá trình BUILD image (không phải khi chạy container)
RUN npm install

# COPY: Sao chép toàn bộ source code vào container
COPY . .

# EXPOSE: Khai báo port mà app sẽ lắng nghe
# LƯU Ý: EXPOSE chỉ là "tài liệu" — KHÔNG tự mở port. Phải dùng -p khi docker run
EXPOSE 3000

# CMD: Lệnh mặc định khi container KHỞI CHẠY
# Chỉ được có 1 CMD trong Dockerfile (cái cuối cùng có hiệu lực)
CMD ["npm", "run", "start"]
```

**Bài tập:**
1. Pull 3 variants của image `python` (latest, slim, alpine), so sánh kích thước, giải thích sự khác biệt
2. Dùng `docker history` phân tích layers của image `nginx:alpine`, đếm có bao nhiêu layers
3. Build Dockerfile.v1-basic với NestJS app, chạy container, truy cập từ browser
4. Tag image vừa build thành 2 versions: `my-nestjs:dev` và `my-nestjs:v1.0.0`

---

### Module 03: Dockerfile Fundamentals — Viết Dockerfile đúng cách

**Mục tiêu**: Master các instruction, hiểu layer caching, tối ưu build time.

**Lý thuyết:**
- Dockerfile Instructions: FROM, RUN, COPY, ADD, WORKDIR, ENV, ARG, EXPOSE, CMD, ENTRYPOINT
- CMD vs ENTRYPOINT — khi nào dùng cái nào (bảng so sánh + ví dụ)
- COPY vs ADD — tại sao ưu tiên COPY
- Layer caching mechanism — diagram flow quyết định cache hit/miss
- .dockerignore — tại sao quan trọng
- Build context — Docker gửi gì cho daemon khi build

**Hands-on — 3 versions tiến hóa:**

**Dockerfile.v1-naive**: Cách viết sai/chưa tốt
```dockerfile
# ❌ VERSION 1: CÁCH VIẾT CHƯA TỐT — ĐỌC COMMENT ĐỂ HIỂU TẠI SAO
FROM node:20

# ❌ Sai: COPY tất cả trước khi npm install
# → Mỗi khi sửa 1 dòng code, Docker phải npm install lại từ đầu (mất cache)
COPY . /app
WORKDIR /app
RUN npm install

# ❌ Sai: Dùng node:20 (full image ~1GB), thừa rất nhiều tool không cần
# ❌ Sai: Không có .dockerignore → node_modules từ host bị copy vào container

EXPOSE 3000
CMD ["npm", "run", "start"]
```

**Dockerfile.v2-layered**: Cải tiến layer ordering
```dockerfile
# ✅ VERSION 2: SẮP XẾP LAYERS THÔNG MINH
FROM node:20-alpine

WORKDIR /app

# ✅ Đúng: COPY package.json TRƯỚC, npm install TRƯỚC
# → Chỉ khi package.json thay đổi mới cần npm install lại
# → Sửa source code? Docker dùng cache cho bước npm install (tiết kiệm ~60 giây)
COPY package*.json ./
RUN npm install

# ✅ Source code thay đổi thường xuyên → đặt SAU các layer ít thay đổi
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
```

**Dockerfile.v3-optimized**: Tối ưu hoàn chỉnh
```dockerfile
# ✅ VERSION 3: TỐI ƯU HOÀN CHỈNH
FROM node:20-alpine

# ✅ Tạo user không phải root (bảo mật)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# ✅ Chỉ copy đúng những gì cần cho npm install
COPY package.json package-lock.json ./

# ✅ npm ci thay vì npm install: deterministic, nhanh hơn, phù hợp CI/CD
# ✅ --only=production: chỉ cài dependencies thật, bỏ devDependencies
RUN npm ci --only=production

COPY . .

# ✅ Build TypeScript → JavaScript
RUN npm run build

# ✅ Chuyển sang user không phải root
USER appuser

EXPOSE 3000

# ✅ Dùng node trực tiếp thay vì npm (giảm 1 process, signal handling tốt hơn)
CMD ["node", "dist/main.js"]
```

**.dockerignore** (có comment):
```
# node_modules từ host — KHÔNG BAO GIỜ copy vào container
# Container phải tự npm install để đảm bảo dependencies đúng cho Linux
node_modules

# Build output — container sẽ tự build
dist

# Git history — không cần trong container
.git
.gitignore

# IDE configs
.vscode
.idea
*.swp

# Docker files — tránh vòng lặp
Dockerfile*
docker-compose*
.dockerignore

# Docs — không cần trong production
*.md
docs/

# Env files — KHÔNG BAO GIỜ đưa secrets vào image
.env
.env.*
```

**Bài tập:**
1. Build cả 3 versions, so sánh kích thước image và thời gian build
2. Sửa 1 dòng code trong app.service.ts, rebuild cả 3 → so sánh thời gian (v1 vs v2 vs v3)
3. Viết Dockerfile cho một Python Flask app đơn giản, áp dụng các best practices từ v3
4. Thêm LABEL và HEALTHCHECK vào Dockerfile.v3, giải thích tác dụng
5. Thử bỏ .dockerignore, build lại → so sánh build context size

---

### Module 04: Containers Deep Dive — Quản lý Container

**Mục tiêu**: Master container lifecycle, debugging, resource management.

**Lý thuyết:**
- Container lifecycle: Created → Running → Paused → Stopped → Deleted
- Process isolation: PID namespace, Network namespace, Mount namespace
- Container vs Process — container chỉ là 1 process có boundary
- Resource limits: CPU, Memory — tại sao quan trọng trong production
- Logging drivers và log rotation

**Hands-on:**
```bash
# === LIFECYCLE ===
docker create --name my-app my-nestjs:v1     # Tạo nhưng chưa chạy
docker start my-app                           # Bắt đầu chạy
docker pause my-app                           # Tạm dừng (freeze process)
docker unpause my-app                         # Tiếp tục
docker stop my-app                            # Dừng gracefully (SIGTERM → 10s → SIGKILL)
docker kill my-app                            # Dừng ngay (SIGKILL)
docker rm my-app                              # Xóa container

# === DEBUGGING — Khi container lỗi, dùng các lệnh này ===

# Xem logs (quan trọng nhất khi debug)
docker logs my-app                            # Tất cả logs
docker logs --tail 50 my-app                  # 50 dòng cuối
docker logs -f my-app                         # Follow realtime (Ctrl+C để thoát)
docker logs --since 5m my-app                 # Logs trong 5 phút qua

# "Chui vào" container đang chạy
docker exec -it my-app sh                     # Mở shell bên trong
docker exec my-app ls /app                    # Chạy 1 lệnh rồi thoát
docker exec my-app cat /app/package.json      # Xem file trong container

# Xem thông tin chi tiết
docker inspect my-app                         # Toàn bộ metadata (JSON)
docker inspect --format '{{.State.Status}}' my-app   # Lấy 1 field cụ thể
docker inspect --format '{{.NetworkSettings.IPAddress}}' my-app

# Xem processes bên trong container
docker top my-app

# Xem resource usage realtime
docker stats                                  # Tất cả containers
docker stats my-app                           # 1 container cụ thể

# === RESOURCE LIMITS ===
# Giới hạn memory (container bị kill nếu vượt quá)
docker run -d --memory=256m --name limited-app my-nestjs:v1

# Giới hạn CPU (0.5 = nửa core)
docker run -d --cpus=0.5 --name cpu-limited my-nestjs:v1

# Kết hợp
docker run -d --memory=512m --cpus=1 --name prod-like my-nestjs:v1

# === CLEANUP ===
docker container prune                        # Xóa tất cả stopped containers
docker system prune -a                        # Xóa TẤT CẢ: stopped containers + unused images + networks
docker system df                              # Xem Docker chiếm bao nhiêu disk
```

**Bài tập:**
1. Chạy container với `--memory=64m`, để app cố dùng quá 64MB → quan sát OOM Kill trong logs
2. Chạy 3 containers cùng image, dùng `docker stats` so sánh resource usage
3. Container bị crash? Dùng `docker logs` + `docker inspect` tìm nguyên nhân (bài tập có bug cố ý)
4. Dùng `--restart=unless-stopped` → kill container → quan sát auto-restart
5. Export filesystem của container thành tar file, inspect nội dung

---

### Module 05: Volumes & Data Persistence — Dữ liệu sống ở đâu?

**Mục tiêu**: Hiểu tại sao container mất data khi xóa, cách giữ data với volumes.

**Lý thuyết:**
- Container layer = writable nhưng ephemeral (mất khi xóa container)
- 3 cách lưu data: Volumes, Bind Mounts, tmpfs
- Volumes vs Bind Mounts — bảng so sánh + khi nào dùng cái nào
- Named volumes vs Anonymous volumes
- Volume drivers — local driver mặc định

**Hands-on:**
```bash
# === THÍ NGHIỆM: Chứng minh container mất data ===
docker run -it --name test-data alpine sh
# Bên trong: echo "Hello" > /data.txt && cat /data.txt
# exit
docker rm test-data
docker run -it --name test-data alpine sh
# Bên trong: cat /data.txt   → FILE KHÔNG TỒN TẠI! Data đã mất.

# === NAMED VOLUMES ===
docker volume create my-data
docker volume ls
docker volume inspect my-data

# Gắn volume vào container
docker run -it -v my-data:/app/data alpine sh
# Bên trong: echo "Persistent!" > /app/data/hello.txt
# exit

# Xóa container, tạo container MỚI với cùng volume
docker rm <container-id>
docker run -it -v my-data:/app/data alpine sh
# Bên trong: cat /app/data/hello.txt   → "Persistent!" VẪN CÒN!

# === BIND MOUNTS (gắn thư mục từ host) ===
# Quan trọng cho DEVELOPMENT: code thay đổi trên host → container thấy ngay
docker run -d \
  -v $(pwd)/nestjs-app/src:/app/src:ro \  # :ro = read-only (bảo vệ source)
  -p 3000:3000 \
  my-nestjs:v1

# === VOLUME VỚI DATABASE ===
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=nestjs_db \
  -v pgdata:/var/lib/postgresql/data \  # Database files persist qua restart
  -p 5432:5432 \
  postgres:16-alpine

# Restart container → data vẫn còn
docker stop my-postgres && docker start my-postgres
```

**docker-compose.volume-demo.yml:**
```yaml
# Minh họa cả 3 loại mount trong 1 file
version: '3.8'
services:
  app:
    image: node:20-alpine
    volumes:
      # Named volume: dữ liệu app cần persist
      - app-uploads:/app/uploads

      # Bind mount: source code từ host (cho development)
      - ./nestjs-app/src:/app/src

      # tmpfs: dữ liệu tạm, không ghi disk (nhanh, bảo mật)
    tmpfs:
      - /app/temp

  db:
    image: postgres:16-alpine
    volumes:
      # Named volume: database files PHẢI persist
      - db-data:/var/lib/postgresql/data

      # Bind mount: init scripts chạy khi DB tạo lần đầu
      - ./init-db:/docker-entrypoint-initdb.d

# Khai báo named volumes ở cuối file
volumes:
  app-uploads:     # Docker quản lý, nằm trong /var/lib/docker/volumes/
  db-data:
```

**Bài tập:**
1. Tạo PostgreSQL container với volume, insert data, xóa container, tạo lại → chứng minh data còn
2. Dùng bind mount để mount source code, sửa file trên host → xác nhận container thấy thay đổi
3. Dùng `docker volume inspect` tìm physical path của volume trên host, xem nội dung trực tiếp
4. Backup volume bằng `docker run --rm -v source:/data -v $(pwd):/backup alpine tar czf /backup/data.tar.gz /data`
5. Tạo volume read-only (`:ro`), thử ghi file từ trong container → quan sát lỗi

---

### Module 06: Docker Networking — Container nói chuyện với nhau

**Mục tiêu**: Hiểu network isolation, container communication, DNS resolution.

**Lý thuyết:**
- Default networks: bridge, host, none
- Custom bridge network — tại sao luôn dùng custom thay vì default bridge
- DNS resolution: container tìm nhau bằng tên, không cần IP
- Port mapping: host → container
- Network isolation: container trên khác network không thấy nhau

**Hands-on:**
```bash
# === DEFAULT BRIDGE — Hạn chế ===
docker network ls
docker network inspect bridge

# Chạy 2 containers trên default bridge
docker run -d --name app1 nginx
docker run -d --name app2 nginx

# Thử ping bằng tên → THẤT BẠI trên default bridge
docker exec app1 ping app2   # ❌ Cannot resolve 'app2'

# === CUSTOM BRIDGE — Best Practice ===
docker network create my-network
docker network inspect my-network

# Chạy 2 containers trên custom network
docker run -d --name web --network my-network nginx
docker run -d --name api --network my-network nginx

# Ping bằng tên → THÀNH CÔNG trên custom network
docker exec web ping api     # ✅ DNS resolution tự động!

# === THỰC TẾ: NestJS + PostgreSQL ===
docker network create nestjs-net

# PostgreSQL trên custom network
docker run -d \
  --name db \
  --network nestjs-net \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=nestjs \
  postgres:16-alpine

# NestJS app kết nối DB bằng TÊN container (không cần IP)
docker run -d \
  --name api \
  --network nestjs-net \
  -e DATABASE_HOST=db \        # ← Dùng tên container "db" thay vì IP!
  -e DATABASE_PORT=5432 \
  -p 3000:3000 \
  my-nestjs:v1

# === NETWORK ISOLATION ===
docker network create frontend-net
docker network create backend-net

# Container có thể join nhiều networks
docker network connect frontend-net api     # api thấy cả frontend và backend
# Container "db" chỉ ở backend-net → frontend không truy cập được DB trực tiếp
```

**Bài tập:**
1. Tạo 3 containers (web, api, db) trên 2 networks: web↔api (frontend-net), api↔db (backend-net). Chứng minh web KHÔNG ping được db
2. Dùng `docker network inspect` xem IP addresses của các containers
3. Chạy NestJS + PostgreSQL trên custom network, app kết nối DB thành công
4. So sánh `--network host` vs `--network bridge` — chạy nginx trên cả 2, kiểm tra port behavior

---

### Module 07: Docker Compose Basics — Orchestrate Multi-Container

**Mục tiêu**: Dùng docker-compose quản lý nhiều services, từ simple đến NestJS + DB + Redis.

**Lý thuyết:**
- Docker Compose là gì — tool quản lý multi-container apps bằng YAML
- docker-compose.yml structure: version, services, volumes, networks
- Lifecycle commands: up, down, build, logs, ps, exec
- depends_on vs healthcheck — tại sao depends_on không đủ
- Environment variables: .env file, environment, env_file

**Hands-on — 3 versions tiến hóa:**

**docker-compose.v1-simple.yml**: NestJS only
```yaml
# ============================================================================
# VERSION 1: CHỈ NESTJS — Bước đầu làm quen docker-compose
# ============================================================================
# Chạy: docker compose -f docker-compose.v1-simple.yml up --build
# Dừng: docker compose -f docker-compose.v1-simple.yml down

version: '3.8'

services:
  # Tên service = tên DNS tự động trong network
  api:
    # build: Docker sẽ build image từ Dockerfile thay vì pull từ registry
    build:
      context: ../nestjs-app     # Thư mục chứa source code
      dockerfile: Dockerfile     # Tên Dockerfile (mặc định)

    # Port mapping: truy cập từ host qua localhost:3000
    ports:
      - "3000:3000"

    # Biến môi trường
    environment:
      - NODE_ENV=development
      - PORT=3000
```

**docker-compose.v2-with-db.yml**: NestJS + PostgreSQL
```yaml
# ============================================================================
# VERSION 2: NESTJS + POSTGRESQL — Multi-service thực tế
# ============================================================================
version: '3.8'

services:
  api:
    build:
      context: ../nestjs-app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_HOST=db           # ← Tên service "db" = hostname trong Docker network
      - DATABASE_PORT=5432
      - DATABASE_USER=postgres
      - DATABASE_PASSWORD=secret
      - DATABASE_NAME=nestjs_db
    depends_on:
      db:
        condition: service_healthy  # ✅ Chờ DB THẬT SỰ sẵn sàng, không chỉ chờ container start
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=nestjs_db
    volumes:
      - pgdata:/var/lib/postgresql/data   # Data persist qua restart
    ports:
      - "5432:5432"                        # Expose để có thể dùng pgAdmin từ host
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
    driver: bridge
```

**docker-compose.v3-full.yml**: NestJS + PostgreSQL + Redis
```yaml
# ============================================================================
# VERSION 3: FULL STACK — NestJS + PostgreSQL + Redis + pgAdmin
# ============================================================================
version: '3.8'

services:
  api:
    build:
      context: ../nestjs-app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.example              # ✅ Dùng env_file thay vì inline — sạch hơn, dễ quản lý
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped        # ✅ Auto-restart khi crash

  db:
    image: postgres:16-alpine
    env_file:
      - .env.example
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD:-redis123}
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:-redis123}", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  # pgAdmin — GUI để quản lý PostgreSQL (truy cập http://localhost:5050)
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@local.dev
      - PGADMIN_DEFAULT_PASSWORD=admin
    ports:
      - "5050:80"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

volumes:
  pgdata:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**.env.example:**
```env
# === APP ===
NODE_ENV=development
PORT=3000

# === DATABASE ===
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
POSTGRES_DB=nestjs_db
DATABASE_HOST=db
DATABASE_PORT=5432

# === REDIS ===
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis123
```

**Bài tập:**
1. Chạy v1, v2, v3 lần lượt. Quan sát sự khác biệt khi `docker compose up`
2. Dùng `docker compose logs -f api` theo dõi logs của service api
3. Dùng `docker compose exec db psql -U postgres -d nestjs_db` truy cập PostgreSQL
4. `docker compose down` rồi `up` lại → chứng minh data trong DB vẫn còn (nhờ volume)
5. Thêm service `adminer` (lightweight DB admin) vào v3, truy cập từ browser

---

### Module 08: Docker Compose Advanced — Dev Workflow thực chiến

**Mục tiêu**: Override files, profiles, Makefile shortcuts, production compose.

**Lý thuyết:**
- docker-compose.override.yml — tự động merge với docker-compose.yml
- Multiple compose files: `-f base.yml -f override.yml`
- Profiles: nhóm services theo mục đích (dev, debug, monitoring)
- Makefile — tạo shortcuts cho các lệnh dài
- Compose Watch (Docker Compose v2.22+) — hot-reload cho development

**Hands-on:**

**docker-compose.yml** (base — dùng cho cả dev và prod):
```yaml
version: '3.8'
services:
  api:
    build:
      context: ../nestjs-app
    networks:
      - app-network
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
```

**docker-compose.override.yml** (dev — auto-merged):
```yaml
# File này TỰ ĐỘNG được merge khi chạy `docker compose up`
# Không cần chỉ định -f flag
version: '3.8'
services:
  api:
    build:
      target: development          # Multi-stage: dùng stage "development"
    ports:
      - "3000:3000"
      - "9229:9229"                # Node.js debugger port
    volumes:
      - ../nestjs-app/src:/app/src  # Bind mount: hot-reload khi sửa code
    environment:
      - NODE_ENV=development
    command: npm run start:dev       # Override CMD → chạy dev mode

  db:
    ports:
      - "5432:5432"                # Expose DB port cho local tools (pgAdmin, DBeaver)
    environment:
      - POSTGRES_PASSWORD=dev_password
      - POSTGRES_DB=nestjs_dev
```

**docker-compose.prod.yml** (production):
```yaml
# Chạy production: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
version: '3.8'
services:
  api:
    build:
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
    restart: always

  db:
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}  # Từ biến môi trường host
      - POSTGRES_DB=nestjs_prod
    restart: always
    # KHÔNG expose port ra ngoài trong production!
```

**Makefile:**
```makefile
# ============================================================================
# MAKEFILE — Shortcuts cho Docker commands
# ============================================================================
# Sử dụng: make <target>
#   make dev        → Khởi chạy môi trường development
#   make prod       → Khởi chạy môi trường production
#   make logs       → Xem logs realtime
#   make clean      → Dọn dẹp sạch sẽ

.PHONY: dev prod logs clean rebuild shell db-shell

# === DEVELOPMENT ===
dev:
	docker compose up --build -d
	@echo "✅ Dev environment running at http://localhost:3000"

dev-logs:
	docker compose up --build

# === PRODUCTION ===
prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
	@echo "✅ Production running at http://localhost:3000"

# === UTILITIES ===
logs:
	docker compose logs -f

rebuild:
	docker compose up --build --force-recreate -d

shell:
	docker compose exec api sh

db-shell:
	docker compose exec db psql -U postgres -d nestjs_dev

# === CLEANUP ===
stop:
	docker compose down

clean:
	docker compose down -v --rmi local
	@echo "🧹 Cleaned: containers, volumes, local images"

nuke:
	docker system prune -af --volumes
	@echo "💥 Nuked: ALL Docker resources on this machine"
```

**Bài tập:**
1. Chạy `make dev`, sửa 1 file source → xác nhận hot-reload hoạt động
2. Chạy `make prod`, so sánh behavior với dev (debug port? volume mount?)
3. Thêm profiles: `monitoring` (Prometheus + Grafana) chỉ chạy khi `--profile monitoring`
4. Tạo `docker-compose.test.yml` cho chạy tests trong container
5. Dùng Compose Watch thay vì bind mount, so sánh trải nghiệm

---

### Module 09: Multi-Stage Builds — Tối ưu Image Size

**Mục tiêu**: Giảm image từ 1.2GB xuống ~80MB, hiểu multi-stage pattern.

**Lý thuyết:**
- Tại sao image size quan trọng: pull time, deploy time, attack surface, cost
- Multi-stage build: nhiều FROM trong 1 Dockerfile
- Pattern: Builder stage (build) → Runner stage (chỉ copy artifacts)
- Distroless images — Google's minimal container images
- Alpine vs Slim vs Distroless — bảng so sánh

**Hands-on — 3 versions:**

**Dockerfile.v1-single-stage**: ~1.2GB
```dockerfile
# ❌ SINGLE STAGE — Image chứa CẢ build tools + source code + devDependencies
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
# → Kết quả: image ~1.2GB — chứa gcc, make, python, node-gyp... không cần thiết khi chạy
```

**Dockerfile.v2-multi-stage**: ~200MB
```dockerfile
# ✅ MULTI-STAGE — Chia thành 2 giai đoạn riêng biệt

# ============================
# STAGE 1: BUILDER — Nơi build TypeScript → JavaScript
# ============================
FROM node:20-alpine AS builder
# AS builder: đặt tên cho stage này, để stage sau tham chiếu

WORKDIR /app
COPY package*.json ./
RUN npm ci                         # Cài TẤT CẢ dependencies (kể cả dev) để build
COPY . .
RUN npm run build                  # TypeScript → JavaScript trong /app/dist

# ============================
# STAGE 2: RUNNER — Image cuối cùng, chỉ chứa những gì cần để CHẠY
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production       # ✅ Chỉ cài production dependencies

# COPY --from=builder: Copy artifacts từ stage "builder"
# Chỉ copy thư mục dist/ (JavaScript đã build) — không copy source .ts
COPY --from=builder /app/dist ./dist

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000
CMD ["node", "dist/main.js"]
# → Kết quả: image ~200MB — không còn devDependencies, source code, build tools
```

**Dockerfile.v3-distroless**: ~80MB
```dockerfile
# ✅✅ DISTROLESS — Image tối thiểu nhất có thể

# STAGE 1: BUILDER
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: PRODUCTION DEPENDENCIES
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# STAGE 3: RUNNER — Google Distroless (không có shell, không có package manager)
FROM gcr.io/distroless/nodejs20-debian12 AS runner
# ⚠️ Distroless = KHÔNG CÓ shell (sh, bash), KHÔNG CÓ package manager (apt, apk)
# → Không thể docker exec vào container — bảo mật tối đa
# → Debug bằng logs hoặc ephemeral debug container

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["dist/main.js"]
# → Kết quả: image ~80MB — attack surface cực nhỏ, phù hợp production
```

**compare-sizes.sh:**
```bash
#!/bin/bash
# Script so sánh kích thước 3 versions

echo "🔨 Building 3 versions..."
docker build -f Dockerfile.v1-single-stage -t nestjs:v1-single ../nestjs-app
docker build -f Dockerfile.v2-multi-stage -t nestjs:v2-multi ../nestjs-app
docker build -f Dockerfile.v3-distroless -t nestjs:v3-distroless ../nestjs-app

echo ""
echo "📊 So sánh kích thước:"
echo "================================================"
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}" | grep nestjs
echo "================================================"
echo ""
echo "📉 Tỷ lệ giảm:"
# Script tính phần trăm giảm...
```

**Bài tập:**
1. Build cả 3, ghi lại kích thước. Tính phần trăm giảm từ v1 → v2 → v3
2. Thử `docker exec` vào container distroless → quan sát lỗi, giải thích tại sao
3. Thêm stage "test" vào multi-stage: build → test → production (chỉ copy nếu test pass)
4. Dùng `docker history` phân tích layers của mỗi version, tìm layer lớn nhất
5. Dùng `dive` tool (dive <image>) phân tích chi tiết từng layer — tìm "wasted space"

---

### Module 10: Development vs Production — 2 thế giới khác biệt

**Mục tiêu**: Setup hoàn chỉnh cho cả dev (hot-reload, debug) và production (optimized, secure).

**Lý thuyết:**
- Dev cần: hot-reload, debugger, verbose logs, exposed ports, bind mounts
- Prod cần: small image, non-root user, healthcheck, resource limits, restart policy
- Environment management: .env files, Docker secrets, ARG vs ENV
- Healthcheck patterns cho NestJS
- Graceful shutdown — tại sao quan trọng (SIGTERM handling)

**Hands-on:** Tất cả các files trong module (Dockerfile.dev, Dockerfile.prod, docker-compose.dev.yml, docker-compose.prod.yml, healthcheck.sh, .env.dev, .env.prod) — mỗi file có comment chi tiết giải thích sự khác biệt dev vs prod.

**Bài tập:**
1. Setup complete dev environment: hot-reload, debugger attach từ VS Code
2. Setup complete prod environment: multi-stage, non-root, healthcheck, resource limits
3. Implement graceful shutdown trong NestJS, test bằng `docker stop` → quan sát logs
4. Dùng Docker secrets thay vì env vars cho database password
5. Load test với `hey` hoặc `ab`: so sánh performance dev vs prod image

---

### Module 11: Security & Debugging — Bảo mật và xử lý sự cố

**Mục tiêu**: Secure containers, debug production issues, scan vulnerabilities.

**Lý thuyết:**
- Non-root user — tại sao KHÔNG BAO GIỜ chạy container as root
- Read-only filesystem
- Docker Scout / Trivy — scan vulnerabilities
- Debug techniques: logs, exec, network debugging, ephemeral containers
- Docker events — monitoring container lifecycle

**Hands-on:** Dockerfile.secure (non-root, read-only fs, no new privileges), debug setup với Node.js inspector, Trivy scan examples.

**Bài tập:**
1. Scan image bằng `docker scout cves` hoặc `trivy image`, fix critical vulnerabilities
2. Chạy container với `--read-only`, verify app vẫn hoạt động (cần tmpfs cho temp files)
3. Debug một container đang crash loop — bài tập có 3 bugs cố ý (wrong port, missing env, permission denied)
4. Dùng `docker events` monitor lifecycle events khi start/stop/crash containers

---

### Module 12: CI/CD & Beyond — Từ code đến production tự động

**Mục tiêu**: Automated build/test/deploy pipeline, monitoring, Kubernetes intro.

**Lý thuyết:**
- CI/CD pipeline: Code → Build Image → Test → Push to Registry → Deploy
- GitHub Actions + Docker: build, cache, multi-platform
- Docker Hub vs GitHub Container Registry (ghcr.io)
- Container monitoring: Prometheus + Grafana stack
- Kubernetes 101: Pod, Deployment, Service — khi nào cần K8s

**Hands-on:** GitHub Actions workflow, docker-compose.monitoring.yml (Prometheus + Grafana), basic K8s manifests.

**Bài tập:**
1. Push image lên Docker Hub, pull từ máy khác
2. Setup GitHub Actions: auto-build on push, tag với git SHA
3. Chạy Prometheus + Grafana, xem metrics của NestJS container
4. Deploy NestJS lên Kubernetes local (minikube/kind), scale lên 3 replicas

---

## 4. Quy tắc Thiết kế Nội dung

### Format mỗi LESSON.md:
```
# Module XX: Tiêu đề
> 🎯 Mục tiêu: [1 câu]
> ⏱️ Thời gian: XX phút
> 📋 Prerequisites: [Module trước đó]

## Lý thuyết
[Giải thích concept, có diagram ASCII/mermaid]

## Thực hành
### Bước 1: [Tiêu đề]
[Giải thích ngắn]
```bash
# Lệnh + comment giải thích
```
**Kết quả mong đợi:**
```
[Output mẫu]
```
**Giải thích:** [Tại sao kết quả như vậy]

### Bước 2: ...

## Bài tập
→ Xem exercises/EXERCISES.md

## Tổng kết
[Key takeaways dạng bullet points]

## Tiếp theo
→ Module XX+1: [Tiêu đề]
```

### Quy tắc viết:
1. **Tiếng Việt** cho giải thích, tiếng Anh cho thuật ngữ kỹ thuật và code
2. **Comment trong code** giải thích từng dòng lệnh quan trọng
3. **Kết quả mong đợi** sau mỗi lệnh — người học biết đang đi đúng hướng
4. **Giải thích "tại sao"** chứ không chỉ "làm thế nào"
5. **Tiến hóa version** (v1 → v2 → v3) khi dạy best practices — thấy rõ sự cải tiến
6. **Bài tập có đáp án** nhưng khuyến khích tự làm trước

## 5. NestJS App mẫu

Cần tạo 1 NestJS app đầy đủ hơn app hiện tại để có đủ complexity cho Docker:
- Basic REST API (CRUD users)
- PostgreSQL connection (TypeORM)
- Redis cache
- Health check endpoint (`/health`)
- Environment-based configuration
- Graceful shutdown handler

App này là "subject" xuyên suốt 12 modules — từ chạy local → containerize → orchestrate → deploy.

## 6. Prerequisites

- Docker Desktop (hoặc Docker Engine + Docker Compose trên Linux)
- Node.js 20+ (để chạy NestJS local trước khi containerize)
- Git
- Code editor (VS Code recommended)
- Terminal/Shell cơ bản

## 7. Phạm vi KHÔNG cover (ngoài scope)

- Docker Swarm (đã lỗi thời, focus vào K8s intro thay thế)
- Windows Containers
- Docker Desktop alternatives (Podman, Rancher) — chỉ mention, không dạy
- Advanced Kubernetes (chỉ 101 intro)
- Cloud-specific container services (ECS, Cloud Run, AKS) — chỉ mention
