# 🟩 NGINX & DOCKER PRODUCTION MASTERY: TỪ BEGINNER ĐẾN MASTER (RUNME NOTEBOOK)

> **Cuốn sách thực hành tương tác (Interactive Runme Notebook) dành cho người chưa từng biết Nginx là gì tiến lên cấp độ System Architect.**
> Bạn chỉ cần mở file này bằng extension **Runme** trên VS Code và bấm nút **`▶ Run`** ở từng khối lệnh. Toàn bộ môi trường (1 container Nginx + 3 containers Backend giả lập NestJS) đều chạy cô lập 100% bên trong thư mục `./nginx-mastery-lab` và Docker Network riêng, **đảm bảo không cài rác hay làm ảnh hưởng 1% nào đến máy tính chính của bạn**.

---

## 🗺️ BẢN ĐỒ LỘ TRÌNH 10 MODULES (TỪ CON SỐ 0 ĐẾN PRODUCTION MASTER)

| Module | Chủ đề cốt lõi | Bài toán & Case Study Thực Tế Giải Quyết Được |
| :--- | :--- | :--- |
| **Module 00** | **Khởi tạo Phòng Lab (Nginx + 3 Backends)** | Dựng mạng Docker nội bộ `nginx-lab-net`, bật 3 server Backend (`api-1`, `api-2`, `api-3`) và 1 cổng Nginx |
| **Module 01** | **Nhập môn Nginx & Kiến trúc Event-Driven** | Tại sao NestJS cần Nginx đứng trước? Kiến trúc `Master/Worker`, giải phẫu `nginx.conf` & `nginx -s reload` không gián đoạn |
| **Module 02** | **Web Server Tĩnh, Thứ tự `location` & SPA** | Bảng thứ tự ưu tiên `location` (`=`, `^~`, `~*`, `/`), bẫy `root` vs `alias`, trị lỗi `404 Not Found` khi nhấn F5 trên React/Vue (`try_files`) |
| **Module 03** | **Reverse Proxy & Bẫy Dấu Gạch Chéo `/`** | Sự khác biệt sinh tử giữa `proxy_pass http://api:3000` và `http://api:3000/`, cách giữ nguyên IP thật của khách (`X-Forwarded-For`) |
| **Module 04** | **Load Balancing (Cân bằng tải) & Tự chịu lỗi** | Chia tải `Round-Robin`, `least_conn`, `ip_hash`, giữ kết nối ấm (`keepalive`) & tự động chuyển hướng khi 1 server sập (`proxy_next_upstream`) |
| **Module 05** | **Trị Dứt Điểm Bẫy Docker DNS Cache (`502`)** | Tại sao deploy lại container Backend hay làm Nginx chết cứng với lỗi `502 Bad Gateway`? Giải pháp `resolver 127.0.0.11` + biến động |
| **Module 06** | **Bảo mật Tầng Biên (Rate Limit & Hardening)** | Chống DDoS/Brute-force mật khẩu bằng `limit_req_zone` (`429`), sửa lỗi upload ảnh `413 Too Large`, ẩn phiên bản Nginx & gắn Security Headers |
| **Module 07** | **Tăng Tốc Gấp 50 Lần: Microcaching & Gzip** | Cấu hình `proxy_cache` + `proxy_cache_lock` (chống Cache Stampede) giảm thời gian phản hồi từ `400ms` xuống `2ms` & nén JSON bằng Gzip |
| **Module 08** | **HTTPS / SSL Termination & Chuẩn Bảo Mật** | Tạo chứng chỉ SSL/TLS, cấu hình HTTPS + HTTP/2, tự động chuyển hướng `HTTP -> HTTPS (301)` và cơ chế HSTS |
| **Module 09** | **WebSockets, Distributed Tracing & JSON Logs** | Cấu hình Reverse Proxy cho Socket.IO/WebSocket (`101 Switching Protocols`), gắn mã vết `$request_id` và xuất Log JSON cho Grafana Loki |
| **Module 10** | **Zero-Downtime Deploy & Docker Master Add-ons** | Nâng cấp `v1.0` $\rightarrow$ `v2.0` không rớt 1 request nào + 5 kỹ thuật Docker Master (BuildKit Cache/Secret, PID 1 `init`, V8 RAM, Migration Container) |

---

# 🚀 MODULE 00: KHỞI TẠO PHÒNG LAB (1 NGINX + 3 BACKEND CONTAINERS)

> 🎯 **Mục tiêu:** Chỉ với 1 cú click chuột, tự động dựng một kiến trúc Production thu nhỏ gồm **3 containers Backend (`api-1`, `api-2`, `api-3`)** ẩn mình trong mạng nội bộ `nginx-lab-net` và **1 container Nginx (`lab-nginx`)** đứng gác ở cửa ngõ cổng `8080` (HTTP) và `8443` (HTTPS).

### Sơ đồ Kiến trúc Phòng Lab của chúng ta

```
                         Mạng nội bộ Docker (nginx-lab-net)
                       +------------------------------------+
                       |         +---> [ api-1 :3000 ]      |
[ Trình duyệt / curl ] |         |                          |
  http://localhost:8080+---> [ NGINX ]---> [ api-2 :3000 ]  |
  https://localhost:8443     (80 / 443)                     |
                       |         |                          |
                       |         +---> [ api-3 :3000 ]      |
                       +------------------------------------+
```

👉 **Bấm nút `▶ Run` bên dưới để khởi tạo Phòng Lab:**

```bash
set -e
mkdir -p ./nginx-mastery-lab/html ./nginx-mastery-lab/conf.d ./nginx-mastery-lab/ssl ./nginx-mastery-lab/backend

# 1. Tạo mạng nội bộ Docker (Custom Bridge Network có sẵn DNS 127.0.0.11)
docker network create nginx-lab-net 2>/dev/null || true

# 2. Tạo code cho Server Backend giả lập NestJS (hỗ trợ Healthcheck, API chậm 400ms, WebSocket và đọc Headers)
cat << 'EOF' > ./nginx-mastery-lab/backend/server.js
const http = require('http');
const os = require('os');

const SERVER_NAME = process.env.SERVER_NAME || os.hostname();
const APP_VERSION = process.env.APP_VERSION || 'v1.0';

const server = http.createServer((req, res) => {
  // 1. Endpoint kiểm tra sức khỏe (Healthcheck)
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'OK', server: SERVER_NAME, version: APP_VERSION }));
  }

  // 2. Endpoint giả lập truy vấn Database nặng mất 400ms (Dùng cho Module 07: Microcaching)
  if (req.url.startsWith('/api/slow-products')) {
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        server: SERVER_NAME,
        version: APP_VERSION,
        note: 'Du lieu nang lay tu Database (mat 400ms)',
        generated_at: new Date().toISOString(),
        items: Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          name: `San pham Cong nghe #${i + 1}`,
          description: 'Mo ta chi tiet san pham de kiem tra kha nang nen Gzip cua Nginx tren moi truong Production'
        }))
      }));
    }, 400);
    return;
  }

  // 3. Mô phỏng bắt tay nâng cấp kết nối WebSocket (Dùng cho Module 09)
  if (req.headers['upgrade'] && req.headers['upgrade'].toLowerCase() === 'websocket') {
    res.writeHead(101, {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
      'X-Handled-By': SERVER_NAME
    });
    return res.end();
  }

  // 4. Phản hồi mặc định: In ra chi tiết URL và các Headers mà Backend nhận được từ Nginx
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    handled_by: SERVER_NAME,
    version: APP_VERSION,
    received_url: req.url,
    method: req.method,
    direct_socket_ip: req.socket.remoteAddress,
    headers_received: {
      host: req.headers['host'],
      x_real_ip: req.headers['x-real-ip'] || '(chua co)',
      x_forwarded_for: req.headers['x-forwarded-for'] || '(chua co)',
      x_forwarded_proto: req.headers['x-forwarded-proto'] || '(chua co)',
      x_request_id: req.headers['x-request-id'] || '(chua co)'
    }
  }, null, 2));
});

server.listen(3000, () => console.log(`🚀 ${SERVER_NAME} (${APP_VERSION}) đang lắng nghe tại cổng 3000`));
EOF

# 3. Khởi chạy 3 containers Backend (api-1, api-2, api-3) chỉ nằm trong mạng nội bộ (KHÔNG mở port ra máy Host!)
for i in 1 2 3; do
  docker container rm -f api-$i 2>/dev/null || true
  docker container run -d \
    --name api-$i \
    --network nginx-lab-net \
    -e SERVER_NAME="Backend-API-$i" \
    -e APP_VERSION="v1.0" \
    -v "$(pwd)/nginx-mastery-lab/backend:/app:ro" \
    node:20-alpine node /app/server.js > /dev/null
done

# 4. Tạo cấu hình mặc định ban đầu cho Nginx và khởi chạy container lab-nginx
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        default_type text/plain;
        return 200 "🎉 Phong Lab Nginx da san sang!\n";
    }
}
EOF

docker container rm -f lab-nginx 2>/dev/null || true
docker container run -d \
  --name lab-nginx \
  --network nginx-lab-net \
  -p 8080:80 \
  -p 8443:443 \
  -v "$(pwd)/nginx-mastery-lab/conf.d:/etc/nginx/conf.d" \
  -v "$(pwd)/nginx-mastery-lab/html:/usr/share/nginx/html" \
  -v "$(pwd)/nginx-mastery-lab/ssl:/etc/nginx/ssl" \
  nginx:1.27-alpine > /dev/null

sleep 2
echo "✅ Đã khởi tạo xong toàn bộ Phòng Lab! Danh sách các container đang chạy:"
docker container ls --filter "network=nginx-lab-net" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -s http://localhost:8080/
```

---

# 📘 MODULE 01: NHẬP MÔN NGINX — TẠI SAO NESTJS CẦN NGINX & KIẾN TRÚC EVENT-DRIVEN

> 🎯 **Mục tiêu:** Hiểu rõ tại sao không bao giờ phơi trực tiếp cổng `:3000` của NestJS ra Internet, nắm vững kiến trúc `Master Process` vs `Worker Processes`, ngữ pháp của file `nginx.conf` và quy trình nạp lại cấu hình trong $0\text{ ms}$ (`nginx -t` & `nginx -s reload`).

## 1. Lý thuyết Chuyên sâu (Dành cho người mới bắt đầu từ con số 0)

### 1.1. Câu chuyện "Đầu bếp trưởng" (NestJS) và "Đội ngũ Lễ tân & Bảo vệ" (Nginx)

Khi bạn viết ứng dụng **NestJS (`app.listen(3000)`)**, bản thân NestJS đã có sẵn một HTTP Server. Vậy tại sao mọi công ty chuyên nghiệp đều bắt buộc đặt **Nginx** đứng chắn phía trước NestJS?

Hãy tưởng tượng **NestJS là một Đầu bếp trưởng** cực giỏi nấu các món ăn phức tạp (tính toán tiền bạc, kiểm tra nghiệp vụ, truy vấn PostgreSQL, gọi Redis).
* **Nếu KHÔNG có Nginx:** Đầu bếp trưởng vừa phải đứng bếp nấu ăn, vừa phải tự chạy ra cổng soát vé, tự đuổi kẻ gian gây rối, tự đóng gói hộp mang về, tự bê nước lọc cho 5.000 thực khách. Chỉ cần 500 người hỏi cùng lúc là đầu bếp kiệt sức, quán sập!
* **Nếu CÓ Nginx đứng ở cửa ngõ (Cổng 80 / 443):** Nginx đóng vai **Đội ngũ Lễ tân & Bảo vệ siêu hạng**:
  1. **Giấu kín toàn bộ hệ thống bên trong (Reverse Proxy):** Khách hàng chỉ biết địa chỉ của Lễ tân (Nginx). Các container `api-1`, `api-2`, `api-3` hoàn toàn không mở cổng ra ngoài Internet, hacker không thể chạm trực tiếp vào Node.js.
  2. **Chia việc công bằng cho nhiều Đầu bếp (Load Balancing):** Khi quán đông khách, bạn nhân bản thêm 3 hoặc 10 containers NestJS. Nginx đứng ngoài tự động chia đều khách vào từng container.
  3. **Chặn đứng kẻ phá rối ngay tại cổng (Rate Limiting & SSL):** Nginx giải mã ổ khóa bảo mật HTTPS và chặn đứng các đợt spam DDoS bằng ngôn ngữ C siêu nhẹ trước khi chúng kịp làm tốn dù chỉ $1\text{ MB}$ RAM của NestJS!

### 1.2. Tại sao Nginx lại chịu được hàng chục nghìn kết nối cùng lúc? (`Master` & `Worker` Event Loop)

```
+-------------------------------------------------------------------------+
| MASTER PROCESS (Chạy quyền root - Chỉ đọc file cấu hình & quản lý)      |
+-----------------+-------------------------------------+-----------------+
                  |                                     |
                  v (Đẻ ra theo số nhân CPU)            v
+-----------------------------------+ +-----------------------------------+
| WORKER PROCESS #1 (User: nginx)   | | WORKER PROCESS #2 (User: nginx)   |
| - Chạy vòng lặp Non-blocking I/O  | | - Chạy vòng lặp Non-blocking I/O  |
| - Phục vụ ~10.000 kết nối/worker  | | - Phục vụ ~10.000 kết nối/worker  |
+-----------------------------------+ +-----------------------------------+
```

* Thay vì đẻ ra 1 luồng (thread) mới cho mỗi khách hàng như các server cổ điển, mỗi nhân CPU của bạn sẽ có **1 `Worker Process`** chạy vòng lặp sự kiện bất đồng bộ (`epoll` trên Linux — giống hệt Redis và Node.js!).
* Nhờ vậy, Nginx có thể giữ hàng vạn kết nối mạng cùng lúc mà chỉ tiêu tốn khoảng **$15\text{ MB} - 30\text{ MB}$ RAM**!

### 1.3. Giải phẫu ngữ pháp `nginx.conf` (Chỉ có 2 khái niệm: `Directive` và `Context`)

Bạn không cần học lập trình để viết cấu hình Nginx. Mọi file cấu hình Nginx chỉ gồm:
1. **`Directive` (Chỉ thị đơn):** Gồm `tên_chỉ_thị giá_trị;` và **BẮT BUỘC kết thúc bằng dấu chấm phẩy `;`**. (Quên dấu `;` là lỗi phổ biến số 1 của người mới!).
2. **`Context` (Khối ngữ cảnh `{ ... }`):** Các khối lồng nhau theo phân cấp từ lớn đến nhỏ:
   * `main` (Toàn cục) $\rightarrow$ `events` (Quản lý kết nối) $\rightarrow$ `http` (Giao thức Web) $\rightarrow$ `server` (Một trang web / tên miền) $\rightarrow$ `location` (Một đường dẫn URL cụ thể như `/api/` hay `/images/`).

### 1.4. Quy tắc Vàng khi sửa cấu hình: `nginx -t` và `nginx -s reload`

Khi đang chạy Production, **TUYỆT ĐỐI KHÔNG dùng `docker restart lab-nginx`** chỉ để cập nhật cấu hình mới, vì `restart` sẽ làm đứt toàn bộ kết nối của khách hàng đang mua hàng!
Thay vào đó, ta luôn chạy 2 lệnh:
1. **`nginx -t`**: Kiểm tra xem file cấu hình có gõ sai chính tả hay thiếu dấu `;` không.
2. **`nginx -s reload`**: Tiến trình `Master` đọc cấu hình mới, tạo ra lứa `Worker` mới để đón khách mới, trong khi lứa `Worker` cũ chờ xử lý xong nốt request đang dở rồi mới tự rút lui êm thấm!

---

## 2. Thực hành Tương tác: Soi tiến trình `Master/Worker` và thực hiện `Hot Reload` $0\text{ ms}$

👉 **Bấm `▶ Run` để xem cấu trúc tiến trình bên trong Nginx và thử nghiệm cố tình viết sai cấu hình để xem `nginx -t` bảo vệ bạn như thế nào:**

```bash
echo "=== 1. QUAN SÁT TIẾN TRÌNH MASTER (PID 1) VÀ CÁC WORKER BÊN TRONG CONTAINER ==="
docker container exec lab-nginx ps aux

echo ""
echo "=== 2. THỬ CỐ TÌNH VIẾT THIẾU DẤU CHẤM PHẨY (;) VÀ CHẠY 'nginx -t' ==="
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
server {
    listen 80
    server_name localhost;
}
EOF

# Lệnh nginx -t sẽ phát hiện ngay lỗi thiếu dấu ';' ở dòng 3 trong khi Nginx đang chạy vẫn an toàn!
docker container exec lab-nginx nginx -t || echo "🛡️ 'nginx -t' đã bắt được lỗi cú pháp kịp thời trước khi áp dụng!"

echo ""
echo "=== 3. SỬA LẠI ĐÚNG CÚ PHÁP VÀ NẠP LẠI CẤU HÌNH BẰNG 'nginx -s reload' ==="
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location /status-check {
        default_type application/json;
        return 200 '{"status": "Reloaded_Successfully", "downtime_ms": 0}\n';
    }
}
EOF

docker container exec lab-nginx nginx -t
docker container exec lab-nginx nginx -s reload
curl -s http://localhost:8080/status-check
```

---

# 📘 MODULE 02: WEB SERVER TĨNH, THỨ TỰ ƯU TIÊN `location` & TRỊ LỖI 404 CHO REACT/VUE SPA

> 🎯 **Mục tiêu:** Thuộc lòng bảng thứ tự ưu tiên của các khối `location`, phân biệt rõ `root` và `alias`, và sử dụng `try_files` để giải quyết lỗi kinh điển: *"Tại sao ứng dụng React/Vue/Angular chạy ngon ở trang chủ nhưng bấm F5 ở trang con `/profile` lại bị lỗi `404 Not Found`?"*.

## 1. Lý thuyết Chuyên sâu

### 1.1. Bảng Thứ Tự Ưu Tiên Của `location` (Câu hỏi phỏng vấn kinh điển)

Nginx **KHÔNG chạy từ trên xuống dưới** đối với tất cả các khối `location`, mà nó chấm điểm ưu tiên theo **ký hiệu đứng sau chữ `location`**:

| Độ ưu tiên | Ký hiệu cú pháp | Cơ chế so khớp | Ví dụ thực tế |
| :--- | :--- | :--- | :--- |
| **1 (Cao nhất)** | `location = /path` | **Khớp chính xác 100%** từng ký tự. Trúng là dừng tìm kiếm ngay lập tức! | `location = /health` (Tối ưu tốc độ cực đại cho API kiểm tra sức khỏe) |
| **2** | `location ^~ /prefix` | **Tiền tố ưu tiên (Preferential Prefix):** Nếu bắt đầu bằng cụm này, chọn luôn và **bỏ qua không xét Regex nữa**. | `location ^~ /assets/` (Chứa file tĩnh, không cần chạy Regex tốn CPU) |
| **3** | `location ~` hoặc `~*` | **Biểu thức chính quy (Regex):** `~` phân biệt hoa/thường, `~*` không phân biệt hoa/thường. *(Trong nhóm Regex thì viết trên ăn trước).* | `location ~* \.(png\|jpg\|css\|js)$` (Khớp các đuôi file ảnh, CSS, JS) |
| **4 (Thấp nhất)** | `location /prefix` | **Tiền tố thông thường:** Nếu nhiều tiền tố cùng khớp, Nginx chọn **cái dài nhất (chi tiết nhất)**. | `location /` (Khớp mọi đường dẫn còn lại — Fallback mặc định) |

### 1.2. Cạm bẫy giữa `root` và `alias` khi phục vụ file trên ổ cứng

Giả sử bạn có khối `location /static/ { ... }` và người dùng gọi URL `/static/logo.png`:
* **Nếu dùng `root /var/www;`:** Nginx lấy đường dẫn `root` **CỘNG THÊM** cả chữ `/static/` $\rightarrow$ Tìm file tại `/var/www/static/logo.png`.
* **Nếu dùng `alias /var/www/public_files/;`:** Nginx lấy đường dẫn `alias` **THAY THẾ** cho chữ `/static/` $\rightarrow$ Tìm file tại `/var/www/public_files/logo.png`. *(Lưu ý: `alias` bắt buộc phải có dấu `/` ở cuối!).*

### 1.3. Giải cứu lỗi `404 Not Found` khi F5 trang React / Vue / Next.js tĩnh bằng `try_files`

Khi bạn đóng gói web React/Vue (Single Page Application), toàn bộ trang web chỉ có **1 file `index.html` duy nhất**. Các đường dẫn như `/dashboard/orders` là do thư viện React Router tự vẽ ra trên trình duyệt.
Khi người dùng nhấn **F5 (Tải lại trang)** tại `/dashboard/orders`, trình duyệt hỏi Nginx: *"Cho tôi xin file `/usr/share/nginx/html/dashboard/orders`"*. Vì trên đĩa cứng không có file đó, Nginx trả về **`404 Not Found`**!

🛡️ **Giải pháp chuẩn với `try_files`:**
```nginx
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```
Ý nghĩa: *"1. Tìm thử xem có file thật tên là `$uri` không (như `/main.js`) $\rightarrow$ 2. Không có thì tìm thư mục `$uri/` $\rightarrow$ 3. Vẫn không có thì trả về `/index.html` để React Router tự hiển thị giao diện!"*

---

## 2. Thực hành Tương tác: Kiểm chứng Thứ tự Ưu tiên `location`, `alias` và `try_files`

👉 **Bấm `▶ Run` để kiểm tra cả 4 mức ưu tiên của `location` và xác nhận nhấn F5 ở URL bất kỳ của React SPA không còn bị lỗi 404:**

```bash
mkdir -p ./nginx-mastery-lab/html/my-uploads
echo "<h1>Giao dien React SPA (index.html) - Khong bao gio bi 404 khi F5!</h1>" > ./nginx-mastery-lab/html/index.html
echo "Day la noi dung file tai lieu nam trong thu muc my-uploads" > ./nginx-mastery-lab/html/my-uploads/guide.txt

cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    # [Ưu tiên 4 - Thấp nhất] Fallback cho React/Vue SPA
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # [Ưu tiên 3 - Regex] Bắt mọi file có đuôi .txt
    location ~* \.txt$ {
        default_type text/plain;
        return 200 "🎯 [Uu tien 3 - Regex] Da bat duoc file .txt!\n";
    }

    # [Ưu tiên 2 - Tiền tố ưu tiên ^~] Dù gọi file .txt bên trong /files/ nhưng ^~ thắng cả Regex!
    location ^~ /files/ {
        alias /usr/share/nginx/html/my-uploads/;
    }

    # [Ưu tiên 1 - Chính xác tuyệt đối =]
    location = / {
        default_type text/plain;
        return 200 "🥇 [Uu tien 1 - Chinh xac '='] Ban dang o Trang Chu!\n";
    }
}
EOF

docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== 1. Gọi '/' (Khớp ưu tiên số 1: location = /) ==="
curl -s http://localhost:8080/

echo ""
echo "=== 2. Gọi '/readme.txt' (Khớp ưu tiên số 3: Regex \.txt$) ==="
curl -s http://localhost:8080/readme.txt

echo ""
echo "=== 3. Gọi '/files/guide.txt' (Dù có đuôi .txt nhưng '^~ /files/' có ưu tiên số 2 cao hơn Regex + Dùng alias) ==="
curl -s http://localhost:8080/files/guide.txt

echo ""
echo "=== 4. Gọi '/dashboard/settings/profile' (URL ảo của React SPA -> try_files trả về index.html!) ==="
curl -s http://localhost:8080/dashboard/settings/profile
```

---

# 📘 MODULE 03: REVERSE PROXY THỰC CHIẾN & "BẪY DẤU GẠCH CHÉO `/`" TRONG `proxy_pass`

> 🎯 **Mục tiêu:** Hiểu rõ sự khác biệt một trời một vực giữa `proxy_pass http://api-1:3000;` và `proxy_pass http://api-1:3000/;`, đồng thời cấu hình bộ Header chuẩn để NestJS nhận biết được IP thật và giao thức thật của khách hàng.

## 1. Lý thuyết Chuyên sâu

### 1.1. Cạm bẫy kinh điển: Có hay Không có dấu `/` ở cuối `proxy_pass`?

Giả sử khách hàng gọi vào URL: **`http://localhost:8080/api/users/99`** và đi vào khối `location /api/ { ... }`:

```
TRƯỜNG HỢP A: KHÔNG CÓ DẤU '/' Ở CUỐI (proxy_pass http://api-1:3000;)
  Khách gọi: /api/users/99  ===>  Nginx giữ nguyên 100%  ===>  Backend nhận được: /api/users/99
  (Dùng khi trong NestJS bạn đã đặt app.setGlobalPrefix('api'))

TRƯỜNG HỢP B: CÓ DẤU '/' Ở CUỐI (proxy_pass http://api-1:3000/;)
  Khách gọi: /api/users/99  ===>  Nginx cắt bỏ chữ '/api' ===>  Backend nhận được: /users/99
  (Dùng khi trong NestJS các Controller chỉ khai báo @Controller('users') mà không có tiền tố /api)
```

### 1.2. Tại sao phải truyền bộ tứ `proxy_set_header` vào cho Backend?

Khi Nginx nhận request từ người dùng rồi gọi tiếp vào NestJS, đối với NestJS thì **người đang nói chuyện trực tiếp với nó là Nginx** (có IP nội bộ `172.x.x.x`). Nếu không truyền thêm các Header sau, NestJS sẽ bị "mù" thông tin của khách hàng thật:
* `proxy_set_header Host $host;`: Giữ nguyên tên miền gốc khách hàng gõ (ví dụ `api.shop.vn`).
* `proxy_set_header X-Real-IP $remote_addr;`: Ghi lại địa chỉ IP thật của người dùng.
* `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`: Chuỗi danh sách IP nếu đi qua cả Cloudflare $\rightarrow$ Nginx $\rightarrow$ NestJS.
* `proxy_set_header X-Forwarded-Proto $scheme;`: Cho NestJS biết khách đang gọi bằng `http` hay `https` (rất quan trọng khi tạo cookie `secure` hoặc đường dẫn redirect OAuth2).

---

## 2. Thực hành Tương tác: So sánh trực tiếp 2 kiểu `proxy_pass` và kiểm tra Headers bên trong Backend

👉 **Bấm `▶ Run` để xem chính xác những gì container `api-1` nhận được trong cả 2 trường hợp:**

```bash
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    # 1. KHÔNG có dấu '/' ở cuối -> Giữ nguyên tiền tố /giu-nguyen/
    location /giu-nguyen/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://api-1:3000;
    }

    # 2. CÓ dấu '/' ở cuối -> Cắt bỏ tiền tố /cat-bo/ trước khi gửi vào Backend
    location /cat-bo/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://api-1:3000/;
    }
}
EOF

docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== 1. GỌI '/giu-nguyen/orders/555' (Quan sát trường 'received_url' giữ nguyên '/giu-nguyen/orders/555') ==="
curl -s http://localhost:8080/giu-nguyen/orders/555

echo ""
echo "=== 2. GỌI '/cat-bo/orders/555' (Quan sát trường 'received_url' đã bị cắt còn '/orders/555') ==="
curl -s http://localhost:8080/cat-bo/orders/555
```

---

# 📘 MODULE 04: LOAD BALANCING (CÂN BẰNG TẢI) & TỰ ĐỘNG CHỊU LỖI (FAILOVER)

> 🎯 **Mục tiêu:** Gom cả 3 containers `api-1`, `api-2`, `api-3` vào một cụm `upstream` để chia tải tự động, cấu hình tái sử dụng kết nối (`keepalive`), và thiết lập cơ chế **Tự động chuyển hướng (`proxy_next_upstream`)** để khi 1 server chết đột ngột, người dùng vẫn không gặp bất kỳ lỗi nào!

## 1. Lý thuyết Chuyên sâu

### 1.1. Các thuật toán chia tải trong khối `upstream`

| Thuật toán | Cách khai báo | Khi nào nên sử dụng? |
| :--- | :--- | :--- |
| **Round-Robin** *(Mặc định)* | Không cần ghi gì thêm | Chia vòng tròn lần lượt $1 \rightarrow 2 \rightarrow 3 \rightarrow 1$. Phù hợp khi các container có cấu hình CPU/RAM bằng nhau và các API có thời gian xử lý đồng đều. |
| **Weighted Round-Robin** | `server api-1:3000 weight=3;` | Khi `api-1` được cấp nhiều CPU/RAM gấp 3 lần `api-2`, ta gán `weight=3` để cứ 4 requests vào thì `api-1` nhận 3, `api-2` nhận 1. |
| **Least Connections** *(Khuyên dùng)* | `least_conn;` | Nginx tự động gửi request mới vào **server nào đang có ít kết nối xử lý dở nhất**. Cực kỳ tốt khi có những API chạy lâu xen kẽ API chạy nhanh! |
| **IP Hash** | `ip_hash;` | Băm địa chỉ IP của khách để 1 khách hàng luôn được đưa vào cố định 1 server. *(Lưu ý: Trong kiến trúc hiện đại, ta lưu Session vào **Redis** như bạn đã học ở khóa trước nên ưu tiên dùng `least_conn` hơn `ip_hash`).* |

### 1.2. Cơ chế Tự Động Cách Ly Server Chết (`max_fails` + `proxy_next_upstream`)

Khi bạn cấu hình:
* `server api-2:3000 max_fails=1 fail_timeout=10s;`
* Kèm theo `proxy_next_upstream error timeout http_500 http_502 http_503 http_504;` bên trong `location`:
Nếu `api-2` bị sập nguồn, ngay khi một request của khách hàng chạm vào `api-2` và bị từ chối kết nối, **Nginx không trả lỗi 502 cho khách mà lập tức chuyền quả bóng đó sang cho `api-3` xử lý hộ**, đồng thời tạm nghỉ chơi với `api-2` trong 10 giây!

---

## 2. Thực hành Tương tác: Chia tải 3 Containers & Rút dây điện `api-2` xem Nginx tự cứu nguy

👉 **Bấm `▶ Run` để xem 6 requests đầu chia đều $1 \rightarrow 2 \rightarrow 3$, sau đó ta đánh sập `api-2` và bắn tiếp 6 requests mà không hề có 1 lỗi nào xảy ra:**

```bash
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
upstream nestjs_backend_cluster {
    # Chia tải vòng tròn kèm kiểm tra lỗi tự động
    server api-1:3000 max_fails=1 fail_timeout=10s;
    server api-2:3000 max_fails=1 fail_timeout=10s;
    server api-3:3000 max_fails=1 fail_timeout=10s;

    # Giữ sẵn 32 kết nối TCP ấm tới dàn Backend để tăng tốc độ phản hồi
    keepalive 32;
}

server {
    listen 80;
    server_name localhost;

    location /api/ {
        # Bộ cấu hình bắt buộc để kích hoạt Keepalive tới upstream
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;

        # Tự động nhảy sang server khác trong vòng 1 giây nếu server hiện tại bị sập!
        proxy_connect_timeout 1s;
        proxy_read_timeout 5s;
        proxy_next_upstream error timeout http_502 http_503 http_504;

        proxy_pass http://nestjs_backend_cluster/;
    }
}
EOF

docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== 1. KHI CẢ 3 CONTAINERS ĐỀU SỐNG: Bắn 6 requests liên tiếp ==="
for i in $(seq 1 6); do
  handled=$(curl -s http://localhost:8080/api/orders | grep "handled_by" | cut -d'"' -f4)
  echo "   ➡️ Request #$i được xử lý bởi: $handled"
done

echo ""
echo "=== 2. ĐÁNH SẬP ĐỘT NGỘT CONTAINER 'api-2' ==="
docker container stop api-2 > /dev/null
echo "💥 Container 'api-2' đã chết! Bắn tiếp 6 requests xem người dùng có gặp lỗi 502 nào không:"

for i in $(seq 1 6); do
  handled=$(curl -s http://localhost:8080/api/orders | grep "handled_by" | cut -d'"' -f4)
  echo "   🛡️ Request #$i được tự động điều hướng sang: $handled (Thành công 100%!)"
done

# Khởi động lại api-2 cho các bài tiếp theo
docker container start api-2 > /dev/null
echo "✅ Đã bật lại container 'api-2'!"
```

---

# 📘 MODULE 05: TRỊ DỨT ĐIỂM "BẪY DOCKER DNS CACHE" (NGUYÊN NHÂN SỐ 1 GÂY LỖI `502 BAD GATEWAY`)

> 🎯 **Mục tiêu:** Hiểu tại sao khi chạy Nginx trong Docker, mỗi lần bạn recreate container Backend (làm đổi IP nội bộ) thì Nginx lại bị lỗi `502 Bad Gateway` mãi mãi, và cách giải quyết triệt để bằng `resolver 127.0.0.11` kết hợp biến động `$variable`.

## 1. Lý thuyết Chuyên sâu: Tại sao Nginx lại nhớ chết địa chỉ IP cũ của Container?

```
LÚC NGINX MỚI KHỞI ĐỘNG:
  [Nginx] ---(Hỏi DNS Docker 127.0.0.11: "api-1 có IP là gì?")---> Nhận về: 172.20.0.2 (Lưu cứng vào RAM mãi mãi!)

SAU KHI BẠN DEPLOY CODE MỚI CHO 'api-1' (Xóa container cũ, tạo container mới):
  Container 'api-1' mới được Docker cấp IP mới: 172.20.0.8
  Nhưng nếu cấu hình tĩnh (proxy_pass http://api-1:3000;):
  [Nginx] ---(Vẫn gửi request vào IP cũ 172.20.0.2!)---> 💥 LỖI 502 BAD GATEWAY TOÀN HỆ THỐNG!
```

🛡️ **Giải pháp chuẩn khi dùng Docker (`resolver 127.0.0.11` + Biến `$variable`):**
Trong Docker Custom Network, máy chủ DNS nội bộ luôn nằm ở địa chỉ cố định là **`127.0.0.11`**.
Khi bạn khai báo `resolver 127.0.0.11 valid=5s ipv6=off;` và đặt tên miền vào một **biến (`set $backend "http://api-1:3000"; proxy_pass $backend;`)**, Nginx sẽ tự động hỏi lại DNS của Docker sau mỗi 5 giây và cập nhật IP mới ngay lập tức!

---

## 2. Thực hành Tương tác: Đổi IP của `api-1` và xem Nginx tự động nhận diện không cần Reload

👉 **Bấm `▶ Run` để xóa `api-1`, ép nó nhận một địa chỉ IP hoàn toàn mới và kiểm chứng Nginx tự động bắt kịp IP mới:**

```bash
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    # Khai báo máy chủ DNS nội bộ của Docker Engine (127.0.0.11), làm mới cache mỗi 2 giây
    resolver 127.0.0.11 valid=2s ipv6=off;

    location / {
        # Khi dùng biến ($dynamic_backend), Nginx bắt buộc phải tra cứu lại DNS theo chu kỳ valid=2s
        set $dynamic_backend "http://api-1:3000";
        proxy_set_header Host $host;
        proxy_pass $dynamic_backend;
    }
}
EOF

docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

OLD_IP=$(docker container inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api-1)
echo "📌 Địa chỉ IP cũ của 'api-1' là: $OLD_IP"

# Xóa api-1, cho 1 container tạm chiếm mất IP cũ, rồi tạo lại api-1 ở IP mới
docker container rm -f api-1 > /dev/null
docker container run -d --name ip-holder --network nginx-lab-net alpine sleep 30 > /dev/null

docker container run -d \
  --name api-1 \
  --network nginx-lab-net \
  -e SERVER_NAME="Backend-API-1" \
  -e APP_VERSION="v1.0" \
  -v "$(pwd)/nginx-mastery-lab/backend:/app:ro" \
  node:20-alpine node /app/server.js > /dev/null

docker container rm -f ip-holder > /dev/null
NEW_IP=$(docker container inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api-1)
echo "📌 Địa chỉ IP MỚI của 'api-1' là: $NEW_IP (Đã thay đổi hoàn toàn!)"

echo "⏳ Chờ 3 giây để DNS Cache (valid=2s) của Nginx tự làm mới..."
sleep 3

echo "=== GỌI THỬ QUA NGINX MÀ KHÔNG CẦN RELOAD NGINX ==="
curl -s http://localhost:8080/kiem-tra-dns | grep -E "handled_by|received_url"
```

---

# 📘 MODULE 06: BẢO MẬT TẦNG BIÊN (EDGE SECURITY) — CHỐNG SPAM/DDOS (`limit_req_zone`) & HARDENING

> 🎯 **Mục tiêu:** Thiết lập lá chắn chống Brute-force mật khẩu / DDoS ngay từ cửa ngõ Nginx bằng `limit_req_zone` (trả về mã chuẩn `429 Too Many Requests`), khắc phục lỗi `413 Request Entity Too Large` khi upload file, ẩn thông tin phiên bản Nginx và gắn bộ Security Headers.

## 1. Lý thuyết Chuyên sâu

### 1.1. Giải mã `limit_req_zone` và tham số `burst` + `nodelay`

```nginx
# Cấp 10MB RAM (~160.000 địa chỉ IP) để theo dõi tần suất gọi của từng IP khách ($binary_remote_addr)
limit_req_zone $binary_remote_addr zone=login_shield:10m rate=1r/s;

server {
    location /api/login {
        limit_req zone=login_shield burst=2 nodelay;
        limit_req_status 429;
        proxy_pass http://api-1:3000;
    }
}
```
* **`rate=1r/s`**: Mỗi địa chỉ IP chỉ được cấp hạn mức trung bình **1 request mỗi giây**.
* **`burst=2 nodelay`**: Cho phép người dùng bình thường có thể bấm nhanh tối đa thêm 2 cái tức thời (tổng cộng 3 cái liên tiếp được đi qua ngay lập tức mà không bị phạt trễ giờ). Nhưng nếu kẻ tấn công dùng tool bắn tới cái thứ 4, thứ 5, thứ 6 trong cùng giây đó $\rightarrow$ Nginx lập tức chặn đứng tại cửa và trả về **`HTTP 429 Too Many Requests`**, NestJS bên trong không tốn $1\%$ CPU nào!

### 1.2. Ba chỉ thị Bảo mật & Vận hành bắt buộc phải nhớ
1. **`server_tokens off;`**: Mặc định khi báo lỗi, Nginx in rõ `nginx/1.27.x` giúp hacker biết chính xác phiên bản để tìm lỗ hổng CVE. Bật `server_tokens off;` sẽ ẩn hoàn toàn con số phiên bản này.
2. **`client_max_body_size 20M;`**: Mặc định Nginx chỉ cho phép gửi dữ liệu lên tối đa **`1MB`**. Nếu khách upload ảnh CCCD `3MB` lên API eKYC của bạn, Nginx sẽ cắt đứt ngay và báo lỗi **`413 Request Entity Too Large`**.
3. **Security Headers (`X-Frame-Options`, `X-Content-Type-Options`):** Chống nhúng web của bạn vào `<iframe>` lừa đảo (Clickjacking) và chống giả mạo kiểu file (MIME Sniffing).

---

## 2. Thực hành Tương tác: Bắn 7 Requests liên hoàn vào `/api/login` để kiểm tra Tường Lửa Nginx

👉 **Bấm `▶ Run` để xem 3 requests đầu được đi qua (`HTTP 200`) và 4 requests spam tiếp theo bị chặn đứng (`HTTP 429`):**

```bash
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
limit_req_zone $binary_remote_addr zone=login_shield:10m rate=1r/s;

server {
    listen 80;
    server_name localhost;

    # Gia cố bảo mật & tăng giới hạn upload file lên 20MB
    server_tokens off;
    client_max_body_size 20M;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location /api/login {
        limit_req zone=login_shield burst=2 nodelay;
        limit_req_status 429;
        proxy_pass http://api-1:3000;
    }
}
EOF

docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== BẮN 7 REQUESTS LIÊN TIẾP TRONG 0.1 GIÂY VÀO /api/login ==="
for i in $(seq 1 7); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/login)
  if [ "$code" = "200" ]; then
    echo "   🟢 Request #$i -> HTTP $code OK (Hợp lệ, được đi vào NestJS)"
  else
    echo "   🔴 Request #$i -> HTTP $code Too Many Requests (Bị Nginx chặn ngay tại cửa ngõ!)"
  fi
done
```

---

# 📘 MODULE 07: TĂNG TỐC HỆ THỐNG GẤP 50 LẦN — MICROCACHING (`proxy_cache`) & NÉN GZIP

> 🎯 **Mục tiêu:** Biến một API nặng tốn **`400ms`** thành API siêu tốc phản hồi trong **`2ms`** bằng kỹ thuật **Microcaching (`proxy_cache` + `proxy_cache_lock` chống Cache Stampede)**, đồng thời bật nén **Gzip** giảm $70\%$ băng thông mạng.

## 1. Lý thuyết Chuyên sâu: Tại sao "Cache chỉ 5 giây" (Microcaching) lại cứu sống cả hệ thống?

Giả sử trang chủ sàn thương mại điện tử của bạn có API `GET /api/slow-products` tốn **`400ms`** để tổng hợp dữ liệu.
* Nếu có **1.000 người dùng** mở trang chủ trong cùng 1 giây $\rightarrow$ Backend phải gồng mình chạy 1.000 lần câu truy vấn nặng đó!
* Với **Nginx Microcaching (`proxy_cache_valid 200 5s;` + `proxy_cache_lock on;`)**:
  1. Người thứ 1 vào: Nginx thấy chưa có trong bộ nhớ đệm (`X-Cache-Status: MISS`), liền cho phép **đúng 1 request duy nhất** đi vào Backend lấy dữ liệu (nhờ `proxy_cache_lock on;`, 999 người còn lại nếu đến cùng lúc sẽ đợi kết quả của người thứ 1 chứ không ùa vào đánh sập Backend — chống **Cache Stampede**!).
  2. Suốt 5 giây tiếp theo: Mọi request gọi vào đều được Nginx trả thẳng từ bộ nhớ đệm (`X-Cache-Status: HIT`) chỉ trong **`2ms`** mà không hề làm phiền tới NestJS hay Database!

---

## 2. Thực hành Tương tác: Đo tốc độ thực tế `MISS` (`~400ms`) vs `HIT` (`~2ms`) và Kiểm tra Nén Gzip

👉 **Bấm `▶ Run` để tận mắt chứng kiến thời gian phản hồi giảm từ hơn `400ms` xuống còn vài mili-giây:**

```bash
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
# Khởi tạo vùng nhớ Cache tại /tmp/nginx_cache (10MB lưu key trên RAM, tối đa 100MB dữ liệu)
proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=microcache_zone:10m max_size=100m inactive=10m use_temp_path=off;

server {
    listen 80;
    server_name localhost;

    # Bật nén Gzip cho JSON, Text, CSS, JS
    gzip on;
    gzip_min_length 100;
    gzip_comp_level 5;
    gzip_types application/json text/plain text/css application/javascript;

    location /api/slow-products {
        proxy_cache microcache_zone;
        proxy_cache_valid 200 10s;         # Lưu kết quả HTTP 200 trong 10 giây
        proxy_cache_lock on;               # Chống Cache Stampede tuyệt đối!
        proxy_cache_use_stale updating error timeout http_500 http_502 http_503 http_504;

        # Đính kèm Header X-Cache-Status (MISS / HIT / BYPASS) để Dev dễ kiểm tra
        add_header X-Cache-Status $upstream_cache_status always;

        proxy_pass http://api-1:3000;
    }
}
EOF

docker container exec lab-nginx rm -rf /tmp/nginx_cache/* 2>/dev/null || true
docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== LẦN GỌI 1 (Chưa có Cache -> Phải chờ Backend 400ms) ==="
curl -s -D - -o /dev/null -w "⏱️ Tổng thời gian: %{time_total}s\n" http://localhost:8080/api/slow-products | grep -E "HTTP/|X-Cache-Status|⏱️"

echo ""
echo "=== LẦN GỌI 2 (Đã có trong Nginx Microcache -> Trả về tức khắc!) ==="
curl -s -D - -o /dev/null -w "⏱️ Tổng thời gian: %{time_total}s\n" http://localhost:8080/api/slow-products | grep -E "HTTP/|X-Cache-Status|⏱️"

echo ""
echo "=== KIỂM TRA NÉN GZIP (Khi trình duyệt gửi Header 'Accept-Encoding: gzip') ==="
curl -s -H "Accept-Encoding: gzip" -I http://localhost:8080/api/slow-products | grep -E "Content-Encoding|X-Cache-Status"
```

---

# 📘 MODULE 08: HTTPS / SSL TERMINATION, HTTP/2 & CHUYỂN HƯỚNG TỰ ĐỘNG (`301`)

> 🎯 **Mục tiêu:** Hiểu quy trình **SSL Termination** (Nginx đứng ngoài giải mã HTTPS rồi nói chuyện HTTP thường với NestJS ở mạng nội bộ), tự tạo chứng chỉ SSL/TLS, bật giao thức `HTTP/2` và tự động chuyển hướng mọi truy cập `http://` sang `https://`.

## 1. Lý thuyết Chuyên sâu: Tại sao không cấu hình HTTPS trực tiếp trong code NestJS?

```
[ Trình duyệt của Khách ] ===(Mạng Internet công cộng: BẮT BUỘC mã hóa HTTPS :443)===> [ NGINX (SSL Termination) ]
                                                                                              |
                                     +--------------------------------------------------------+
                                     | (Bên trong mạng nội bộ Docker an toàn: Dùng HTTP thường :3000 cho nhẹ CPU!)
                                     v
                        [ api-1 :3000 ]  /  [ api-2 :3000 ]
```
* Nếu bạn cài chứng chỉ SSL trực tiếp vào từng container NestJS, mỗi khi gia hạn chứng chỉ (90 ngày/lần với Let's Encrypt), bạn phải cập nhật và khởi động lại toàn bộ các containers Backend.
* Khi thực hiện **SSL Termination tại Nginx**, bạn chỉ cần quản lý chứng chỉ ở **1 nơi duy nhất là Nginx**, đồng thời kích hoạt **`http2 on;`** để trình duyệt tải song song nhiều API trên cùng 1 kết nối TCP!

---

## 2. Thực hành Tương tác: Tạo Chứng chỉ SSL, Bật HTTPS + HTTP/2 và Redirect `80 -> 443`

👉 **Bấm `▶ Run` để sinh cặp khóa chứng chỉ SSL bằng `openssl`, bật cổng HTTPS (`8443`) và kiểm tra chuyển hướng tự động:**

```bash
# 1. Dùng openssl bên trong container để tạo chứng chỉ SSL cho phòng Lab
docker container exec lab-nginx sh -c "
  apk add --no-cache openssl > /dev/null 2>&1
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/lab.key \
    -out /etc/nginx/ssl/lab.crt \
    -subj '/CN=localhost' > /dev/null 2>&1
"

# 2. Cấu hình HTTP tự động Redirect 301 sang HTTPS, và khối Server HTTPS chuẩn hiện đại
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
# Khối 1: Lắng nghe ở cổng 80 (HTTP) -> Chuyển hướng vĩnh viễn (301) sang HTTPS
server {
    listen 80;
    server_name localhost;
    return 301 https://$host:8443$request_uri;
}

# Khối 2: Lắng nghe ở cổng 443 (HTTPS + HTTP/2)
server {
    listen 443 ssl;
    http2 on;
    server_name localhost;

    ssl_certificate     /etc/nginx/ssl/lab.crt;
    ssl_certificate_key /etc/nginx/ssl/lab.key;

    # Chỉ cho phép các giao thức TLS mới nhất và an toàn nhất (TLSv1.2 và TLSv1.3)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # HSTS: Dặn trình duyệt lần sau chỉ kết nối bằng HTTPS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://api-1:3000;
    }
}
EOF

docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== 1. KHI GỌI VÀO CỔNG HTTP THƯỜNG (8080) -> Tự động nhận lệnh Redirect 301 sang HTTPS ==="
curl -s -I http://localhost:8080/my-account | grep -E "HTTP/|Location"

echo ""
echo "=== 2. KHI GỌI VÀO CỔNG HTTPS (8443) -> Mã hóa thành công & Backend nhận thấy 'x_forwarded_proto: https' ==="
curl -s -k https://localhost:8443/my-account | grep -E "handled_by|x_forwarded_proto"
```

---

# 📘 MODULE 09: WEBSOCKETS PROXY, DISTRIBUTED TRACING (`$request_id`) & JSON STRUCTURED LOGS

> 🎯 **Mục tiêu:** Cấu hình Nginx làm cầu nối cho **WebSockets / Socket.IO** (không bị đứt kết nối), tự động sinh mã định danh duy nhất **`$request_id`** truyền vào Backend để truy vết lỗi, và xuất **Access Log định dạng JSON** chuẩn chỉnh cho hệ thống giám sát (Grafana Loki / ELK).

## 1. Lý thuyết Chuyên sâu

### 1.1. Tại sao dùng Socket.IO / WebSocket qua Nginx mặc định lại bị lỗi không kết nối được?
Giao thức WebSocket bắt đầu bằng một request HTTP thông thường nhưng đính kèm 2 Headers đặc biệt là **`Upgrade: websocket`** và **`Connection: Upgrade`** (gọi là *Hop-by-hop headers*).
Theo chuẩn HTTP, một Proxy trung gian như Nginx **sẽ không tự động chuyển tiếp các Hop-by-hop headers này** vào cho Backend trừ khi bạn khai báo tường minh:
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

### 1.2. Truy vết xuyên dịch vụ với biến `$request_id` của Nginx
Nginx có sẵn biến nội bộ **`$request_id`** tự động sinh ra một chuỗi mã băm 32 ký tự ngẫu nhiên duy nhất cho mỗi request đi vào cổng. Khi bạn truyền `proxy_set_header X-Request-ID $request_id;` vào cho NestJS (và từ NestJS truyền tiếp vào RabbitMQ/BullMQ như đã học ở khóa Message Queue!), đồng thời ghi `$request_id` ra cả Access Log dạng JSON của Nginx, bạn có thể tra cứu toàn bộ cuộc đời của 1 request chỉ bằng 1 mã ID duy nhất!

---

## 2. Thực hành Tương tác: Nâng cấp kết nối WebSocket (`101`) & Xuất JSON Access Log kèm `$request_id`

👉 **Bấm `▶ Run` để kiểm tra bắt tay WebSocket qua Nginx và xem dòng Log định dạng JSON tuyệt đẹp:**

```bash
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
# Định nghĩa định dạng Log kiểu JSON chuẩn Observability (Grafana Loki / Elasticsearch)
log_format json_observability escape=json '{'
    '"time": "$time_iso8601", '
    '"request_id": "$request_id", '
    '"client_ip": "$remote_addr", '
    '"method": "$request_method", '
    '"uri": "$request_uri", '
    '"status": $status, '
    '"upstream_addr": "$upstream_addr", '
    '"request_time_sec": $request_time'
'}';

# Map tự động: Nếu khách có gửi header Upgrade thì đặt Connection = "upgrade", ngược lại đặt ""
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name localhost;

    # Ghi log JSON ra file riêng để dễ kiểm tra
    access_log /tmp/nginx_json_access.log json_observability;

    # 1. Cấu hình chuẩn cho WebSocket / Socket.IO
    location /socket.io/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 3600s; # Giữ kết nối WebSocket không bị cắt sớm
        proxy_pass http://api-1:3000;
    }

    # 2. Cấu hình gắn mã vết X-Request-ID cho mọi API
    location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Request-ID $request_id;
        add_header X-Request-ID $request_id always;
        proxy_pass http://api-1:3000;
    }
}
EOF

docker container exec lab-nginx rm -f /tmp/nginx_json_access.log
docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== 1. KIỂM TRA BẮT TAY WEBSOCKET QUA NGINX (Mong đợi: HTTP/1.1 101 Switching Protocols) ==="
curl -s -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://localhost:8080/socket.io/

echo ""
echo "=== 2. KIỂM TRA MÃ VẾT X-REQUEST-ID ĐƯỢC TRUYỀN TỪ NGINX VÀO BACKEND ==="
curl -s http://localhost:8080/api/check-trace | grep -E "handled_by|x_request_id"

echo ""
echo "=== 3. XEM DÒNG LOG ĐỊNH DẠNG JSON ĐƯỢC NGINX XUẤT RA (Kèm đúng mã request_id ở trên!) ==="
docker container exec lab-nginx cat /tmp/nginx_json_access.log
```

---

# 📘 MODULE 10: ZERO-DOWNTIME DEPLOYMENT & 5 KỸ THUẬT DOCKER PRODUCTION MASTER

> 🎯 **Mục tiêu:** Kết hợp toàn bộ sức mạnh của **Docker + Nginx** để thực hiện nâng cấp hệ thống từ phiên bản **`v1.0` lên `v2.0` mà không làm rớt bất kỳ 1 request nào của khách hàng (`0% Downtime`)**, đồng thời nắm trọn **5 kỹ thuật Docker Master nâng cao** cho Backend.

## 1. Lý thuyết Chuyên sâu: 5 Kỹ Thuật Docker Master Cần Bổ Sung Khi Lên Production

Trước khi chạy kịch bản Zero-Downtime, dưới đây là **5 mảnh ghép cấp độ Master** nâng cấp cho kiến thức Docker của bạn:

1. **Tăng tốc Build gấp 10 lần và Bảo mật Token với BuildKit Mounts (`Dockerfile` hiện đại):**
   * Thay vì chỉ dùng `RUN npm ci` (mỗi lần sửa `package.json` phải tải lại từ mạng mất 3 phút), hãy dùng **`RUN --mount=type=cache,target=/root/.npm npm ci`** để giữ lại kho bộ nhớ đệm của npm trên máy chủ build!
   * Khi cần truyền `.npmrc` chứa mật khẩu tải thư viện nội bộ, dùng **`RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci`** để mật khẩu không bao giờ bị lưu lại trong `docker history`.
2. **Trị dứt điểm Tiến trình Zombie (`<defunct>`) với cờ `init: true`:**
   * Khi chạy Node.js làm tiến trình gốc (**PID 1**), nếu ứng dụng của bạn gọi các tiến trình con (như `ffmpeg`, `puppeteer`) và chúng chết đi, Node.js không tự dọn xác chúng. Trong `docker-compose.yml`, luôn thêm dòng **`init: true`** (hoặc cờ `--init` khi chạy `docker run`) để Docker nhúng trình quản lý nhẹ `tini` vào làm PID 1.
3. **Đồng bộ giới hạn RAM của V8 Engine với giới hạn RAM của Container:**
   * Nếu bạn giới hạn container `memory: 512M`, hãy luôn đặt biến môi trường **`NODE_OPTIONS="--max-old-space-size=384"`** (khoảng $75\%$ RAM của container) để bộ dọn rác Garbage Collector của Node.js chủ động thu hồi bộ nhớ trước khi chạm trần bị Linux Kernel chém chết (`OOM Kill - Exit 137`).
4. **Chiến lược chạy Database Migration bằng "Init Container" (`service_completed_successfully`):**
   * Tuyệt đối không chạy lệnh sửa bảng DB (`prisma migrate deploy`) bên trong lệnh khởi động của cả 3 containers `api-1`, `api-2`, `api-3` (vì cả 3 sẽ tranh nhau khóa bảng!). Hãy tách 1 service riêng tên là `db-migrator` chỉ chạy 1 lần rồi tắt, và cấu hình các container `api` chờ `db-migrator` với điều kiện **`condition: service_completed_successfully`**.
5. **Debug Container Distroless không có Shell bằng kỹ thuật Chia sẻ Namespace (`--pid=container:api-1`):**
   * Khi container Production dùng image Distroless (không có `sh` hay `bash` để `docker exec`), bạn vẫn có thể gắn một container cứu hộ vào chung không gian tiến trình và mạng của nó bằng lệnh:
     `docker container run --rm -it --pid=container:api-1 --net=container:api-1 alpine sh`.

---

## 2. Thực hành Tương tác: Nâng cấp Rolling Update từ `v1.0` $\rightarrow$ `v2.0` với `0%` Lỗi!

Trong bài thực hành tổng kết này:
* Chúng ta cấu hình Nginx cân bằng tải cho cả 3 containers (`api-1`, `api-2`, `api-3` đang ở bản `v1.0`).
* Chúng ta sẽ lần lượt nâng cấp từng container một lên bản **`v2.0`** (cập nhật cấu hình Nginx tạm ngắt lưu lượng vào container đang nâng cấp $\rightarrow$ thay container mới kèm cờ `--init` và `NODE_OPTIONS` $\rightarrow$ đợi `/health` trả về `OK` $\rightarrow$ mở lại lưu lượng), đồng thời bắn request kiểm tra liên tục để chứng minh **100% requests đều trả về `HTTP 200 OK`!**

👉 **Bấm `▶ Run` để thực hiện quy trình Zero-Downtime Rolling Update:**

```bash
# 1. Đưa Nginx về cấu hình Load Balancing chuẩn bị nâng cấp
cat << 'EOF' > ./nginx-mastery-lab/conf.d/default.conf
upstream rolling_cluster {
    server api-1:3000 max_fails=1 fail_timeout=5s;
    server api-2:3000 max_fails=1 fail_timeout=5s;
    server api-3:3000 max_fails=1 fail_timeout=5s;
    keepalive 16;
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_connect_timeout 1s;
        proxy_next_upstream error timeout http_502 http_503 http_504;
        proxy_pass http://rolling_cluster;
    }
}
EOF
docker container exec lab-nginx nginx -t && docker container exec lab-nginx nginx -s reload

echo "=== BẮT ĐẦU QUY TRÌNH ROLLING UPDATE TỪ v1.0 LÊN v2.0 (3 CONTAINERS) ==="
SUCCESS_COUNT=0
FAIL_COUNT=0

for i in 1 2 3; do
  echo "🔄 Đang nâng cấp 'api-$i' lên phiên bản v2.0 (Các containers còn lại vẫn đang đón khách)..."
  docker container rm -f api-$i > /dev/null

  # Khởi chạy lại api-$i với phiên bản v2.0 kèm cờ --init (chống Zombie PID 1) và giới hạn V8 Heap
  docker container run -d \
    --name api-$i \
    --init \
    --network nginx-lab-net \
    -e SERVER_NAME="Backend-API-$i" \
    -e APP_VERSION="v2.0-Production" \
    -e NODE_OPTIONS="--max-old-space-size=256" \
    -v "$(pwd)/nginx-mastery-lab/backend:/app:ro" \
    node:20-alpine node /app/server.js > /dev/null

  # Chờ container mới vượt qua bài kiểm tra Healthcheck nội bộ
  until docker container exec api-$i wget -qO- http://localhost:3000/health > /dev/null 2>&1; do
    sleep 0.2
  done

  # Reload nhẹ Nginx để cập nhật lại IP mới của api-$i trong khối upstream
  docker container exec lab-nginx nginx -s reload

  # Bắn 3 requests kiểm tra ngay trong lúc đang nâng cấp
  for req in 1 2 3; do
    resp=$(curl -s -w "|%{http_code}" http://localhost:8080/check)
    http_code=$(echo "$resp" | cut -d'|' -f2)
    srv=$(echo "$resp" | grep -o '"handled_by": *"[^"]*"' | cut -d'"' -f4)
    ver=$(echo "$resp" | grep -o '"version": *"[^"]*"' | cut -d'"' -f4)
    if [ "$http_code" = "200" ]; then
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      echo "   ✅ [HTTP $http_code] Phục vụ bởi: $srv ($ver)"
    else
      FAIL_COUNT=$((FAIL_COUNT + 1))
      echo "   ❌ [HTTP $http_code] Lỗi kết nối!"
    fi
  done
done

echo ""
echo "🏆 KẾT QUẢ ROLLING UPDATE HOÀN TẤT:"
echo "   - Tổng số Requests thành công (HTTP 200): $SUCCESS_COUNT / $((SUCCESS_COUNT + FAIL_COUNT))"
echo "   - Số lượng Requests bị rớt (Downtime):    $FAIL_COUNT (0% Downtime!)"
```

---

# 🧹 TRẠM DỌN DẸP PHÒNG LAB (AN TOÀN 100% CHO MÁY CHÍNH)

Sau khi đã hoàn thành toàn bộ 10 Modules thực hành Nginx & Docker Production và muốn xóa sạch các containers (`lab-nginx`, `api-1`, `api-2`, `api-3`), mạng `nginx-lab-net` cũng như thư mục nháp `./nginx-mastery-lab`, bạn chỉ cần bấm **`▶ Run`** ở ô dưới đây:

```bash
docker container rm -f lab-nginx api-1 api-2 api-3 2>/dev/null || true
docker network rm nginx-lab-net 2>/dev/null || true
rm -rf ./nginx-mastery-lab
echo "✨ Đã tắt toàn bộ containers, xóa mạng nội bộ và dọn dẹp sạch sẽ 100% phòng Lab Nginx!"
```