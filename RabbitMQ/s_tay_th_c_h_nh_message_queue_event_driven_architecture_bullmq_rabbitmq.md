# 📨 MESSAGE QUEUE & EVENT-DRIVEN ARCHITECTURE: TỪ ZERO ĐẾN MASTER (BULLMQ & RABBITMQ)

> **Cuốn sách thực hành tương tác (Interactive Runme Notebook) dành cho người mới bắt đầu từ con số 0 tiến lên cấp độ System Architect.**
> Bạn chỉ cần mở file này bằng extension **Runme** trên VS Code và bấm nút **`▶ Run`** ở từng khối lệnh. Toàn bộ môi trường (Redis, RabbitMQ kèm giao diện Web UI, và các kịch bản Node.js thực tế) đều chạy cô lập 100% trong thư mục `./mq-mastery-lab` và Docker Container, **đảm bảo không cài rác hay làm hỏng máy tính của bạn**.

---

## 🗺️ BẢN ĐỒ LỘ TRÌNH 10 MODULES (TỪ BEGINNER ĐẾN PRODUCTION ARCHITECT)

| Module | Chủ đề cốt lõi | Bài toán & Case Study Thực Tế Giải Quyết Được |
| :--- | :--- | :--- |
| **Module 00** | **Khởi tạo Phòng Lab (Redis + RabbitMQ UI)** | Dựng Redis + RabbitMQ Management UI (`http://localhost:15672`) & cài thư viện trong hộp cát |
| **Module 01** | **Nhập môn Message Queue (Từ con số 0)** | Tại sao gọi API đồng bộ làm sập server? So sánh **BullMQ vs RabbitMQ vs Kafka** & Demo giảm phản hồi từ `3.000ms` xuống `5ms` |
| **Module 02** | **BullMQ Cơ bản & Vòng đời của 1 Job** | Giải phẫu 6 trạng thái của Job, điều chỉnh `Concurrency`, theo dõi `% tiến độ` & tự động Retry khi lỗi mạng |
| **Module 03** | **BullMQ Thực chiến Nâng cao (4 Case Study)** | **1.** Tự hủy đơn hàng sau 15 phút (`Delayed Job`)<br>**2.** Chống vượt hạn mức API bên thứ 3 (`Rate Limiter`)<br>**3.** Cronjob không bị lặp khi chạy 5 server (`Job Scheduler`)<br>**4.** Tác vụ Cha-Con (`BullMQ Flows`) |
| **Module 04** | **Giải phẫu Kiến trúc RabbitMQ (AMQP 0-9-1)** | Tại sao Producer **KHÔNG BAO GIỜ** gửi thẳng tin nhắn vào Queue? Hiểu rõ `Connection`, `Channel`, `Exchange`, `Binding`, `Routing Key` |
| **Module 05** | **Thực chiến 4 Loại Exchange của RabbitMQ** | Chạy code thật với **`Direct`**, **`Fanout`** (Broadcast sự kiện), **`Topic`** (`order.*.vn`) và **`Headers` Exchange** |
| **Module 06** | **Cơ chế `ACK`/`NACK`, `Prefetch (QoS)` & Chống mất tin** | Chuyện gì xảy ra khi Worker đang xử lý thì mất điện? Thực hành chuyển giao việc tự động khi Worker chết & chia tải công bằng với `prefetch(1)` |
| **Module 07** | **Dead Letter Queue (DLQ) & Retry Exponential Backoff** | Trị dứt điểm lỗi **"Poison Message"** (Tin nhắn độc lặp vô tận): Tự động thử lại sau $1\text{s} \rightarrow 2\text{s} \rightarrow 4\text{s}$ rồi cách ly vào hàng đợi chết (**DLQ**) |
| **Module 08** | **Idempotent Consumer (Chống xử lý trùng lặp)** | Tại sao Queue luôn có nguy cơ gửi 1 tin nhắn 2 lần (*At-Least-Once*)? Cách thiết kế Consumer không bao giờ trừ tiền hoặc gửi mail đúp |
| **Module 09** | **Đỉnh cao: Transactional Outbox Pattern** | Giải quyết bài toán kinh điển: *"Lưu đơn hàng vào DB xong nhưng mất điện trước khi bắn vào Queue"* đảm bảo đồng nhất dữ liệu $100\%$ |
| **Module 10** | **Checklist Production cho NestJS & Dọn dẹp Lab** | Quy tắc Graceful Shutdown cho Worker khi deploy CI/CD, cách giám sát Queue và nút xóa sạch phòng Lab |

---

# 🚀 MODULE 00: KHỞI TẠO PHÒNG LAB (REDIS + RABBITMQ MANAGEMENT UI)

> 🎯 **Mục tiêu:** Chỉ với 1 cú click chuột, dựng ngay 1 container **Redis** (cấu hình chuẩn cho BullMQ) và 1 container **RabbitMQ** (kèm giao diện quản trị Web trực quan tại `http://localhost:15672`), đồng thời cài đặt gói thư viện `bullmq` và `amqplib` gói gọn bên trong thư mục `./mq-mastery-lab`.

### Lưu ý sống còn khi cấu hình Redis cho BullMQ
Ở khóa học Redis trước, khi dùng Redis làm bộ nhớ đệm (Cache), chúng ta đặt chính sách `maxmemory-policy allkeys-lru` (đầy RAM thì tự xóa key cũ). **NHƯNG với BullMQ**, mỗi key trong Redis là một công việc (Job) quan trọng của khách hàng! Nếu Redis tự ý xóa key khi đầy RAM, hàng đợi sẽ bị hỏng cấu trúc ngay lập tức. Vì vậy, Redis chạy BullMQ **BẮT BUỘC phải cấu hình `maxmemory-policy noeviction`**.

👉 **Bấm nút `▶ Run` bên dưới để khởi tạo toàn bộ Phòng Lab (Mất khoảng 10–15 giây cho lần đầu tiên):**

```bash
set -e
mkdir -p mq-mastery-lab

# 1. Dọn dẹp container cũ nếu đã tồn tại
docker container rm -f mq-redis mq-rabbit 2>/dev/null || true

# 2. Khởi chạy Redis ở cổng 6380 (với chính sách bắt buộc của BullMQ: maxmemory-policy noeviction)
docker container run -d \
  --name mq-redis \
  -p 6380:6379 \
  redis:7-alpine \
  redis-server --maxmemory-policy noeviction

# 3. Khởi chạy RabbitMQ 3.13 kèm giao diện Web Management UI
#    - Cổng 5672: Cổng giao thức AMQP để code Node.js/NestJS kết nối
#    - Cổng 15672: Cổng giao diện Web UI để bạn nhìn tận mắt Exchange & Queue
docker container run -d \
  --name mq-rabbit \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=secret123 \
  rabbitmq:3.13-management-alpine

# 4. Khởi tạo dự án Node.js hộp cát bên trong thư mục ./mq-mastery-lab
cat << 'EOF' > mq-mastery-lab/package.json
{
  "name": "mq-mastery-sandbox",
  "version": "1.0.0",
  "type": "module",
  "description": "Phong Lab thuc hanh BullMQ va RabbitMQ",
  "dependencies": {
    "amqplib": "^0.10.4",
    "bullmq": "^5.12.0",
    "ioredis": "^5.4.1"
  }
}
EOF

echo "📦 Đang cài đặt thư viện 'bullmq', 'ioredis' và 'amqplib' vào thư mục './mq-mastery-lab'..."
npm install --prefix mq-mastery-lab --silent

echo "⏳ Đang chờ RabbitMQ Server khởi động hoàn tất..."
until docker container exec mq-rabbit rabbitmq-diagnostics -q ping > /dev/null 2>&1; do
  sleep 2
done

echo "✅ PHÒNG LAB ĐÃ SẴN SÀNG 100%!"
echo "🌐 Bạn có thể mở trình duyệt vào RabbitMQ Web UI tại: http://localhost:15672"
echo "🔑 Tài khoản đăng nhập RabbitMQ UI: Username = admin | Password = secret123"
```

---

# 📘 MODULE 01: NHẬP MÔN MESSAGE QUEUE — TẠI SAO GỌI API ĐỒNG BỘ LÀM SẬP SERVER?

> 🎯 **Mục tiêu:** Hiểu từ gốc rễ tại sao chúng ta cần Message Queue qua ví dụ đời thường, nắm vững 4 thuật ngữ cốt lõi (`Producer`, `Queue`, `Consumer/Worker`, `Broker`) và biết khi nào chọn **BullMQ**, khi nào chọn **RabbitMQ**, khi nào chọn **Kafka**.

## 1. Lý thuyết Chuyên sâu (Giải thích cho người chưa từng dùng Queue)

### 1.1. Câu chuyện Quán Cà Phê: Đồng bộ (Synchronous) vs Bất đồng bộ (Asynchronous)

Hãy tưởng tượng bạn mở một quán cà phê chỉ có **1 nhân viên thu ngân**:

1. **Cách làm Đồng bộ (Synchronous — Không có Queue):**
   * Khách hàng A vào gọi 1 ly cà phê $\rightarrow$ Thu ngân nhận tiền $\rightarrow$ **Tự mình quay vào bếp xay cà phê, pha chế, đóng hộp mất 5 phút** $\rightarrow$ Đưa ly nước cho Khách A $\rightarrow$ Lúc này mới quay ra hỏi Khách hàng B đang đứng sau!
   * **Hậu quả:** Chỉ cần 10 khách vào cùng lúc, người thứ 10 phải đứng chờ $10 \times 5 = 50\text{ phút}$! Quán tắc nghẽn, khách bỏ về (giống hệt lỗi **`504 Gateway Timeout`** trên web). Tệ hơn, nếu máy xay cà phê bị kẹt, thu ngân đứng đơ luôn và không ai mua được bánh ngọt nữa!

2. **Cách làm Bất đồng bộ với Hàng đợi (Asynchronous — Có Message Queue):**
   * Khách hàng A vào gọi 1 ly cà phê $\rightarrow$ Thu ngân (**`Producer`**) thu tiền, in ngay 1 tờ phiếu order gắn lên **Thanh kẹp giấy (`Message Queue`)**, rồi đưa cho Khách A chiếc thẻ rung hẹn giờ. Tổng thời gian thu ngân tiếp Khách A chỉ mất **5 giây**!
   * Bên trong quầy pha chế, có 3 nhân viên pha chế (**`Consumers / Workers`**) cứ thấy trên **Thanh kẹp giấy (`Queue`)** có phiếu mới là lần lượt rút xuống làm. Khi làm xong, họ bấm nút báo cho khách!
   * **Kết quả kỳ diệu:**
     * Dù có 100 khách ập vào cùng lúc (Flash Sale), thu ngân vẫn nhận đơn mượt mà trong 5 giây/người (**Chống sốc tải / Load Leveling**).
     * Nếu 1 nhân viên pha chế bị ốm nghỉ, 2 người còn lại vẫn rút phiếu làm tiếp, không tờ phiếu nào bị rơi mất (**Chịu lỗi / Fault Tolerance**).
     * Lúc quán đông khách, chủ quán chỉ cần điều thêm 2 nhân viên pha chế vào đứng quầy là tốc độ tăng gấp đôi (**Dễ dàng mở rộng / Horizontal Scaling**).

### 1.2. Ánh xạ vào Kiến trúc Hệ thống Backend Thực Tế

```
❌ MÔ HÌNH ĐỒNG BỘ (SYNCHRONOUS HTTP - DỄ TIMEOUT & SẬP DÂY CHUYỀN):
[User bấm Đặt Hàng]
       |
       v (Phải ngồi nhìn vòng xoay Loading chờ toàn bộ 4 bước xong!)
+-------------------------------------------------------------------+
| API Checkout (NestJS):                                            |
|   1. Lưu đơn vào DB                 (  20 ms )                    |
|   2. Tạo file Hóa đơn PDF           (1500 ms )                    |
|   3. Gọi cổng SMTP gửi Email        (2500 ms ) <-- SMTP lag = Treo|
|   4. Bắn thông báo Zalo/Telegram    ( 800 ms )                    |
+-------------------------------------------------------------------+
       |
       v (Tổng thời gian chờ: 4.820 ms! Nếu 500 người bấm cùng lúc -> Treo Server!)


✅ MÔ HÌNH BẤT ĐỒNG BỘ QUA MESSAGE QUEUE (ASYNCHRONOUS - PHẢN HỒI TRONG 25ms!):
[User bấm Đặt Hàng]
       |
       v
+-------------------------------------+       Đẩy 1 gói tin JSON (3ms)       +-----------------------------------+
| API Checkout ( đóng vai PRODUCER ): | ===================================> |          MESSAGE QUEUE            |
|   1. Lưu đơn vào DB (20 ms)         |   {"orderId": 101, "email": "a@..."} |  [Job #1] -> [Job #2] -> [Job #3] |
|   2. Đẩy việc phụ vào Queue (3 ms)  |                                      +-----------------+-----------------+
+-------------------------------------+                                                        |
       |                                                                                       | Rút từng việc về làm ngầm
       v (Trả kết quả ngay sau 23 ms!)                                                         v (Chậm rãi, an toàn, có Retry)
[🎉 "Đặt hàng thành công!"]                                                  +-----------------------------------+
                                                                             |      WORKERS / CONSUMERS          |
                                                                             | - Tạo PDF, Gửi Email, Bắn Zalo... |
                                                                             +-----------------------------------+
```

### 1.3. Giải nghĩa 4 Thuật ngữ Bạn Sẽ Gặp Mỗi Ngày

1. **`Producer` (hoặc `Publisher` — Người gửi việc):** Chính là API Controller / Service trong NestJS của bạn. Khi có sự kiện (khách đặt hàng, upload video), nó đóng gói thông tin thành một cục JSON nhỏ (gọi là **Message** hoặc **Job**) rồi gửi vào hàng đợi.
2. **`Message / Job` (Gói tin / Công việc):** Dữ liệu mô tả công việc cần làm (ví dụ: `{"orderId": 999, "userEmail": "khach@gmail.com"}`). *Lưu ý vàng: Chỉ gửi ID và thông tin gọn nhẹ vào Queue, KHÔNG nhét cả file ảnh/video nặng hàng chục MB vào trong Message!*
3. **`Queue` (Hàng đợi) & `Broker` (Trạm điều phối):** Nơi cất giữ các Message theo thứ tự (thường là vào trước ra trước - FIFO) trên RAM/Ổ cứng cho đến khi có người nhận xử lý xong.
4. **`Consumer` (hoặc `Worker` — Người làm việc):** Một tiến trình chạy ngầm (có thể nằm chung hoặc tách riêng thành một container khác) chuyên lắng nghe Queue, bốc từng Message ra để thực thi các việc nặng (gửi mail, xuất Excel, gọi ngân hàng...).

### 1.4. Bảng So Sánh Chọn Công Cụ: Khi nào dùng **BullMQ**, **RabbitMQ** hay **Apache Kafka**?

Rất nhiều người mới học bị rối không biết dự án của mình nên dùng BullMQ hay RabbitMQ. Hãy nhìn vào bảng phân định rạch ròi dưới đây:

| Tiêu chí | **BullMQ** *(Chạy trên nền Redis)* | **RabbitMQ** *(Chuẩn AMQP Enterprise Broker)* | **Apache Kafka** *(Distributed Event Streaming)* |
| :--- | :--- | :--- | :--- |
| **Bản chất cốt lõi** | **Thư viện quản lý Background Jobs & Task Queue** dành riêng cho hệ sinh thái Node.js / TypeScript (NestJS). | **Trạm trung chuyển tin nhắn (Smart Broker)** đa ngôn ngữ, cực mạnh về định tuyến phức tạp. | **Nhật ký sự kiện phân tán (Append-only Log)** lưu trữ dữ liệu khổng lồ cho Big Data. |
| **Điểm mạnh nhất** | Có sẵn **Hẹn giờ (`Delay`)**, **Lập lịch (`Cron`)**, **Đếm `% tiến độ`**, **Luồng Cha-Con (`Flows`)**, tích hợp sẵn trong `@nestjs/bullmq`. | Định tuyến linh hoạt qua **4 loại Exchange (`Direct`, `Fanout`, `Topic`, `Headers`)**, kết nối giữa **Node.js $\leftrightarrow$ Java $\leftrightarrow$ Python $\leftrightarrow$ Go**. | Thông lượng cực đại (**hàng triệu sự kiện/giây**), giữ lại lịch sử sự kiện nhiều ngày để tua lại (**Replay**). |
| **Khi nào NÊN DÙNG?** | Dự án dùng **Node.js / NestJS**, cần xử lý việc ngầm (gửi mail, xuất PDF, hủy đơn quá hạn 15 phút, chạy Cronjob chuẩn xác). | Hệ thống **Microservices nhiều ngôn ngữ khác nhau**, cần phát tán 1 sự kiện (`OrderCreated`) cho 5 dịch vụ khác nhau cùng nhận, hoặc cần quy tắc DLQ/Routing chặt chẽ. | Hệ thống Tracking hành vi người dùng, Log tập trung, Phân tích dữ liệu thời gian thực quy mô rất lớn. |

---

## 2. Thực hành Tương tác: Trải nghiệm sự khác biệt giữa "Không có Queue" và "Có Queue"

👉 **Bấm `▶ Run` để xem cách chúng ta giải phóng người dùng khỏi 3 giây chờ đợi bằng cách đẩy tác vụ nặng sang Queue:**

```bash
node - << 'EOF'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function checkoutWithoutQueue(orderId) {
  const start = Date.now();
  console.log(`\n🐢 [KHÔNG DÙNG QUEUE] Khách bấm đặt đơn #${orderId}...`);
  await sleep(20);   // 1. Lưu DB (20ms)
  await sleep(1000); // 2. Tạo hóa đơn PDF (1000ms)
  await sleep(1500); // 3. Gửi Email qua SMTP (1500ms)
  console.log(`😓 [KHÔNG DÙNG QUEUE] Khách phải đợi tận ${Date.now() - start}ms mới nhận được thông báo thành công!`);
}

async function checkoutWithQueue(orderId) {
  const start = Date.now();
  console.log(`\n⚡ [CÓ DÙNG QUEUE] Khách bấm đặt đơn #${orderId}...`);
  await sleep(20);   // 1. Lưu DB (20ms)
  await sleep(3);    // 2. Đẩy Job {"orderId": 101} vào Queue (Chỉ mất 3ms!)
  console.log(`🎉 [CÓ DÙNG QUEUE] Trả kết quả HTTP 200 cho khách ngay lập tức chỉ sau ${Date.now() - start}ms!`);
  console.log(`   └── (Trong khi đó, Worker ở hậu trường bắt đầu âm thầm tạo PDF và gửi Email...)`);
}

await checkoutWithoutQueue(101);
await checkoutWithQueue(102);
EOF
```

---

# 📘 MODULE 02: LÀM CHỦ BULLMQ CƠ BẢN & VÒNG ĐỜI CỦA MỘT JOB (JOB LIFECYCLE)

> 🎯 **Mục tiêu:** Hiểu rõ 6 trạng thái của một Job trong BullMQ, tự tay viết cặp `Queue` (Producer) + `Worker` (Consumer), cấu hình số luồng xử lý song song (`concurrency`), cập nhật `% tiến độ` và cấu hình **Tự động thử lại (Retry với Exponential Backoff)** khi gặp lỗi.

## 1. Lý thuyết Chuyên sâu: Sơ đồ Vòng Đời Của Một Job Trong BullMQ

Khi bạn gọi lệnh `queue.add('send-email', data)`, công việc đó không biến mất mà đi qua một máy trạng thái (State Machine) cực kỳ chặt chẽ được BullMQ quản lý bằng các cấu trúc `List`, `ZSET`, `Hash` và `Stream` bên trong Redis:

```
                       queue.add(..., { delay: 60000 })
                      +--------------------------------+
                      |                                |
                      |                                v
[PRODUCER] -----> ( 1. WAITING ) <---- Đến giờ ---- ( 2. DELAYED )
 (queue.add)          |                            (Chờ đến hẹn trong ZSET)
                      | Worker bốc việc
                      v
                 ( 3. ACTIVE ) ---- Cập nhật % ----> [Sự kiện 'progress': 25%..100%]
                 (Đang xử lý)
                  /         \
       Thành công/           \ Ném lỗi (throw Error)
                v             v
      ( 4. COMPLETED )   Còn lượt thử lại (attempts)?
                         /                     \
                   Có   /                       \ Không (Đã hết lượt thử)
                       v                         v
            Quay về ( DELAYED )           ( 5. FAILED )
         (Chờ 2s -> 4s -> 8s rồi thử lại) (Lưu lại lỗi để Dev kiểm tra)
```

### Giải thích 3 tham số cấu hình quan trọng nhất khi tạo Job & Worker:
1. **`concurrency` (Trên Worker):** Mặc định một Worker chỉ làm từng việc một (`concurrency: 1`). Nếu tác vụ của bạn chủ yếu là chờ mạng I/O (như gọi API gửi mail, gửi tin nhắn), bạn có thể đặt `concurrency: 10` để 1 Worker xử lý **10 jobs song song cùng lúc** bằng bất đồng bộ!
2. **`attempts` & `backoff` (Khi thêm Job):**
   * Nếu bạn gọi sang cổng thanh toán hoặc máy chủ gửi Email mà bên đó bị chập chờn mạng trong 2 giây, đừng để Job chết luôn!
   * Hãy cấu hình `attempts: 3, backoff: { type: 'exponential', delay: 1000 }`. Công thức thời gian chờ giữa các lần thử lại theo hàm mũ (**Exponential Backoff**) trong BullMQ là:
     $$\text{Thời gian chờ ở lần thử thứ } n = \text{delay} \times 2^{n - 1}$$
     * Lần lỗi 1 $\rightarrow$ Chờ $1000 \times 2^0 = 1\text{ giây}$ rồi thử lại.
     * Lần lỗi 2 $\rightarrow$ Chờ $1000 \times 2^1 = 2\text{ giây}$ rồi thử lại.
     * Lần lỗi 3 $\rightarrow$ Chờ $1000 \times 2^2 = 4\text{ giây}$ rồi thử lại.
3. **`removeOnComplete` & `removeOnFail` (Chống tràn RAM Redis!):**
   * ⚠️ **Sai lầm chết người của người mới:** Mặc định, các Job sau khi `completed` hoặc `failed` vẫn được giữ lại mãi mãi trong Redis! Sau 1 tháng chạy Production với 10 triệu jobs, Redis của bạn sẽ bị nổ RAM!
   * 🛡️ **Best Practice:** Luôn đặt `removeOnComplete: { count: 100, age: 3600 }` (chỉ giữ lại tối đa 100 jobs thành công gần nhất hoặc trong 1 giờ để tra cứu) và `removeOnFail: { count: 500 }`.

---

## 2. Thực hành Tương tác: Chạy Producer + Worker với Tiến Độ (`%`) & Tự Động Retry Exponential Backoff

Trong kịch bản thực tế dưới đây, chúng ta tạo một hàng đợi **`video-transcoding`** (Xử lý xuất file báo cáo / render video):
* **Job #1 (`Bao_Cao_Tai_Chinh.pdf`):** Chạy mượt mà từ `10% -> 50% -> 100%` và thành công ngay lần đầu.
* **Job #2 (`Gui_Webhook_Ngan_Hang`):** Giả lập ngân hàng bị lỗi mạng ở 2 lần gọi đầu tiên, BullMQ tự động chờ `500ms` rồi `1000ms` để thử lại và **thành công ở lần thử thứ 3**!

👉 **Bấm `▶ Run` để quan sát trực tiếp vòng đời của BullMQ:**

```bash
cat << 'EOF' > mq-mastery-lab/bullmq-basics.mjs
import { Queue, Worker, QueueEvents } from 'bullmq';

const connection = { host: '127.0.0.1', port: 6380 };
const QUEUE_NAME = 'report-and-webhook-queue';

// 1. Khởi tạo Queue (Producer) và QueueEvents (để lắng nghe sự kiện toàn cục)
const myQueue = new Queue(QUEUE_NAME, { connection });
const queueEvents = new QueueEvents(QUEUE_NAME, { connection });

// Lắng nghe sự kiện tiến độ và hoàn thành
queueEvents.on('progress', ({ jobId, data }) => {
  console.log(`📊 [Tiến độ Job #${jobId}]: Đã xử lý được ${data}%...`);
});

// 2. Khởi tạo Worker (Consumer) với concurrency = 2 (xử lý tối đa 2 việc cùng lúc)
const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === 'export-pdf') {
      console.log(`👷 [Worker] Bắt đầu xuất file PDF cho đơn hàng: ${job.data.orderId}`);
      await job.updateProgress(30);
      await new Promise((r) => setTimeout(r, 200));
      await job.updateProgress(100);
      return { pdfUrl: `https://cdn.shop.vn/invoices/${job.data.orderId}.pdf` };
    }

    if (job.name === 'call-bank-webhook') {
      // job.attemptsStarted đếm xem đây là lần thử thứ mấy (1, 2, 3...)
      console.log(`🔄 [Worker] Đang gọi API Ngân hàng (Lần thử thứ ${job.attemptsStarted}/${job.opts.attempts})...`);
      if (job.attemptsStarted < 3) {
        throw new Error('Cổng Ngân hàng đang bảo trì tạm thời (HTTP 503)!');
      }
      return { status: 'BANK_CONFIRMED', attemptUsed: job.attemptsStarted };
    }
  },
  { connection, concurrency: 2 }
);

worker.on('completed', (job, returnvalue) => {
  console.log(`✅ [THÀNH CÔNG] Job #${job.id} (${job.name}) hoàn tất! Kết quả:`, JSON.stringify(returnvalue));
});

worker.on('failed', (job, err) => {
  console.log(`⚠️ [THẤT BẠI LẦN ${job.attemptsStarted}] Job #${job.id} (${job.name}) báo lỗi: ${err.message}`);
});

// 3. Đẩy 2 Jobs vào hàng đợi
await myQueue.obliterate({ force: true }); // Làm sạch queue trước khi chạy demo

console.log('🚀 [Producer] Đang đẩy 2 công việc vào BullMQ...');
await myQueue.add('export-pdf', { orderId: 'ORD_999' }, {
  removeOnComplete: { count: 50 }
});

await myQueue.add('call-bank-webhook', { transactionId: 'TX_888' }, {
  attempts: 3, // Cho phép thử tối đa 3 lần
  backoff: { type: 'exponential', delay: 400 }, // Lần 1 chờ 400ms, Lần 2 chờ 800ms
  removeOnComplete: { count: 50 }
});

// Chờ 2.5 giây cho tất cả các lần retry hoàn tất rồi đóng kết nối gọn gàng
await new Promise((r) => setTimeout(r, 2500));
await worker.close();
await queueEvents.close();
await myQueue.close();
EOF

node mq-mastery-lab/bullmq-basics.mjs
```

---

# 📘 MODULE 03: BULLMQ THỰC CHIẾN NÂNG CAO — 4 CASE STUDY ĐẮT GIÁ NHẤT TRONG DOANH NGHIỆP

> 🎯 **Mục tiêu:** Giải quyết 4 bài toán thực tế mà mọi hệ thống Thương mại điện tử / Fintech dùng NestJS + BullMQ đều phải làm:
> 1. **Tự động hủy đơn hàng sau 15 phút chưa thanh toán (`Delayed Jobs`)**.
> 2. **Giới hạn tốc độ gọi API bên thứ 3 (`Worker Rate Limiting`)**.
> 3. **Chạy Cronjob định kỳ không bao giờ bị lặp khi chạy nhiều container (`Job Schedulers`)**.
> 4. **Luồng công việc Cha – Con (`FlowProducer`)**.

## 1. Lý thuyết Chuyên sâu cho 4 Case Study Thực Tế

### Case 1: Hủy đơn hàng quá hạn thanh toán 15 phút (Tại sao không dùng Cronjob quét DB mỗi phút?)
* **Cách làm cũ (Quét Database):** Cứ mỗi phút chạy `SELECT * FROM orders WHERE status = 'UNPAID' AND created_at < NOW() - INTERVAL '15 minutes'`. Cách này vừa làm nặng Database vừa bị trễ (đơn hàng có thể bị hủy ở phút thứ 15:59 thay vì đúng 15:00).
* **Cách làm chuẩn với BullMQ `Delayed Job`:**
  * Ngay giây phút khách bấm tạo đơn hàng `#101`, bạn đẩy luôn 1 Job vào BullMQ với tham số `{ delay: 15 * 60 * 1000, jobId: 'cancel_order_101' }`.
  * Nếu khách thanh toán thành công ở phút thứ 3, bạn chỉ cần gọi `queue.remove('cancel_order_101')` để hủy lịch hẹn giờ đó!
  * Nếu đúng 15 phút mà khách chưa trả tiền, Job tự động thức dậy kiểm tra DB và hủy đơn để hoàn lại tồn kho!

### Case 2: Chống bị khóa tài khoản khi gọi API bên thứ 3 (`Rate Limiter`)
* Giả sử bạn gửi 5.000 tin nhắn ZNS (Zalo) hoặc Email qua AWS SES, nhưng nhà cung cấp quy định: **"Tài khoản của bạn chỉ được gọi tối đa 10 requests / giây, vượt quá sẽ bị khóa IP!"**.
* Trong BullMQ Worker, bạn chỉ cần khai báo `limiter: { max: 10, duration: 1000 }`. Dù bạn có chạy 20 containers Worker trên VPS, BullMQ vẫn dùng Redis để đếm chung và đảm bảo **toàn bộ cụm server cộng lại không bao giờ xử lý quá 10 jobs mỗi giây**!

### Case 3: Chạy Cronjob trên nhiều Container NestJS không bị lặp (`upsertJobScheduler`)
* **Thảm họa thực tế:** Bạn dùng thư viện `node-cron` hoặc `@nestjs/schedule` đặt lịch *"8h00 sáng chủ nhật gửi mã giảm giá cho khách"*. Khi công ty scale lên **5 containers NestJS**, đúng 8h00 sáng cả 5 containers cùng chạy hàm đó $\rightarrow$ **Khách hàng nhận được 5 mã giảm giá giống hệt nhau (Công ty lỗ nặng)!**
* **Giải pháp với BullMQ (`upsertJobScheduler` trong BullMQ v5+):** Lịch chạy Cron được lưu tập trung duy nhất trên Redis. Dù có 100 containers cùng gọi `upsertJobScheduler('weekly-voucher', { pattern: '0 8 * * 0' })`, đúng 8h00 sáng Redis chỉ sinh ra **ĐÚNG 1 JOB DUY NHẤT** và giao cho **1 container duy nhất** thực thi!

### Case 4: Tác vụ Phụ thuộc Cha – Con (`FlowProducer`)
* **Bài toán:** Để hoàn tất việc **"Đóng gói Hồ sơ Vay vốn Ngân hàng (Job Cha)"**, hệ thống bắt buộc phải chạy xong 3 việc độc lập (**3 Jobs Con**):
  1. Kiểm tra điểm tín dụng CIC.
  2. Quét nhận diện khuôn mặt eKYC.
  3. Tính hạn mức thu nhập từ sao kê.
* Với **`FlowProducer`**, BullMQ sẽ tự động cho 3 Jobs Con chạy song song trước. **Chỉ khi cả 3 Jobs Con đều `COMPLETED`, Job Cha mới tự động được kích hoạt** cùng với toàn bộ kết quả của các con!

---

## 2. Thực hành Tương tác: Chạy Trọn Bộ 4 Case Study BullMQ Nâng Cao

👉 **Bấm `▶ Run` để xem cách code cả 4 tính năng: Hẹn giờ hủy đơn, Rate Limiter, Job Scheduler và Luồng Cha-Con (`FlowProducer`):**

```bash
cat << 'EOF' > mq-mastery-lab/bullmq-advanced.mjs
import { Queue, Worker, FlowProducer } from 'bullmq';

const connection = { host: '127.0.0.1', port: 6380 };

// ============================================================================
// 1. DEMO DELAYED JOB (Hẹn giờ tự động hủy đơn hàng nếu chưa thanh toán)
// ============================================================================
console.log('=== 1. THỰC HÀNH DELAYED JOB (Hẹn giờ 1 giây kiểm tra hủy đơn quá hạn) ===');
const orderQueue = new Queue('order-timeout-queue', { connection });
await orderQueue.obliterate({ force: true });

const orderWorker = new Worker('order-timeout-queue', async (job) => {
  console.log(`⏰ [Delayed Worker] Đã hết thời gian chờ! Đang kiểm tra đơn #${job.data.orderId}: Tự động HỦY ĐƠN & hoàn kho!`);
}, { connection });

// Khách tạo đơn #101 và #102 (Đặt hẹn giờ 1000ms sau sẽ hủy nếu chưa thanh toán)
await orderQueue.add('check-unpaid', { orderId: 101 }, { delay: 1000, jobId: 'cancel_101' });
await orderQueue.add('check-unpaid', { orderId: 102 }, { delay: 1000, jobId: 'cancel_102' });

// Giả sử sau 200ms, khách hàng của đơn #101 thanh toán thành công -> Ta xóa lịch hẹn hủy của đơn #101!
await new Promise((r) => setTimeout(r, 200));
const job101 = await orderQueue.getJob('cancel_101');
if (job101) {
  await job101.remove();
  console.log('💳 [Khách Hàng] Đơn #101 vừa thanh toán xong -> Đã gỡ bỏ lệnh hẹn giờ hủy đơn #101!');
}

await new Promise((r) => setTimeout(r, 1100));
await orderWorker.close();
await orderQueue.close();

// ============================================================================
// 2. DEMO FLOW PRODUCER (3 Jobs Con chạy xong hết mới kích hoạt Job Cha)
// ============================================================================
console.log('\n=== 2. THỰC HÀNH FLOW PRODUCER (3 Tác vụ Con -> 1 Tác vụ Cha) ===');
const flowProducer = new FlowProducer({ connection });
const stepWorker = new Worker('loan-steps-queue', async (job) => {
  console.log(`   🔹 [Job Con] Đang xử lý bước: ${job.name}...`);
  return { step: job.name, passed: true };
}, { connection, concurrency: 3 });

const finalWorker = new Worker('loan-final-queue', async (job) => {
  // Lấy toàn bộ kết quả trả về từ các Jobs Con
  const childrenValues = await job.getChildrenValues();
  console.log(`   🏆 [Job Cha - DUYỆT HỒ SƠ] Cả 3 bước con đã xong! Tổng hợp kết quả:`, JSON.stringify(childrenValues));
}, { connection });

await flowProducer.add({
  name: 'approve-loan-application',
  queueName: 'loan-final-queue',
  data: { applicant: 'Nguyen Van A' },
  children: [
    { name: 'check-cic-credit', queueName: 'loan-steps-queue', data: { cccd: '001200012345' } },
    { name: 'verify-ekyc-face', queueName: 'loan-steps-queue', data: { imageId: 'img_99' } },
    { name: 'analyze-bank-statement', queueName: 'loan-steps-queue', data: { salary: 25000000 } }
  ]
});

await new Promise((r) => setTimeout(r, 1000));
await stepWorker.close();
await finalWorker.close();
await flowProducer.close();
EOF

node mq-mastery-lab/bullmq-advanced.mjs
```

---

# 📘 MODULE 04: GIẢI PHẪU KIẾN TRÚC RABBITMQ (AMQP 0-9-1) — TẠI SAO PRODUCER KHÔNG BAO GIỜ GỬI THẲNG VÀO QUEUE?

> 🎯 **Mục tiêu:** Chuyển từ tư duy Task Queue đơn giản sang tư duy **Enterprise Message Broker (RabbitMQ)**. Hiểu rõ mối quan hệ giữa `Connection` vs `Channel`, và lý do tại sao trong RabbitMQ phải có **Tổng đài phân loại thư (`Exchange`)** đứng chắn trước các **Hòm thư (`Queue`)**.

## 1. Lý thuyết Chuyên sâu: Sự khác biệt căn bản giữa BullMQ và RabbitMQ

Trong **BullMQ**, Producer biết rõ tên Queue và nhét thẳng công việc vào Queue đó.
Nhưng trong kiến trúc Microservices lớn dùng **RabbitMQ**, **Producer KHÔNG BAO GIỜ gửi tin nhắn trực tiếp vào Queue!** Thậm chí Producer còn không hề biết trong hệ thống đang có bao nhiêu Queue tồn tại!

### 1.1. Câu chuyện Tổng Đài Bưu Điện (`Exchange`) và Các Hòm Thư (`Queues`)

Hãy nhìn vào sơ đồ kiến trúc chuẩn của RabbitMQ (Giao thức AMQP 0-9-1):

```
                                   +------------ RABBITMQ BROKER ------------+
                                   |                                         |
+------------------+               |  +-------------+   Binding (Luật nối)   |   +--------------------+     +--------------------+
|     PRODUCER     | --- Publish ---> |             | =====================> |   | Queue: Inventory   | --> | Inventory Service  |
| (Order Service)  |  Routing Key: |  |  EXCHANGE   |   Binding (Luật nối)   |   +--------------------+     +--------------------+
|                  | "order.paid"  |  | (Tổng đài   | =====================> |   | Queue: Notification| --> | Email/SMS Service  |
+------------------+               |  |  phân loại) |   Binding (Luật nối)   |   +--------------------+     +--------------------+
                                   |  +-------------+ =====================> |   | Queue: Analytics   | --> | Data Warehouse Svc |
                                   |                                         |   +--------------------+     +--------------------+
                                   +-----------------------------------------+
```

**Tại sao thiết kế qua trung gian `Exchange` lại thiên tài đến vậy?**
* Giả sử bạn viết **Order Service (Producer)**. Khi khách vừa thanh toán đơn hàng, Order Service chỉ cần hét lên vào **Exchange (`order_events`)** đúng 1 câu: *"Có một sự kiện thuộc nhãn `order.paid` vừa xảy ra đây!"*.
* Lúc ban đầu, công ty chỉ có 2 dịch vụ cần nghe sự kiện này là **Kho hàng (`Inventory Queue`)** và **Thông báo (`Notification Queue`)**.
* 6 tháng sau, Giám đốc yêu cầu xây thêm dịch vụ **Tích điểm Thành viên (`Loyalty Service`)** và **Phát hiện Gian lận AI (`Fraud Detection Service`)** cũng cần nhận thông tin mỗi khi có đơn hàng thanh toán xong.
* 💡 **Điều kỳ diệu:** Bạn **KHÔNG CẦN SỬA DÙ CHỈ 1 DÒNG CODE NÀO Ở ORDER SERVICE (Producer)**! Bạn chỉ cần tạo thêm 2 Queue mới và nối dây (**`Binding`**) chúng vào `Exchange` sẵn có là tự khắc chúng nhận được bản sao của sự kiện! Đó gọi là **Loose Coupling (Liên kết lỏng — Chuẩn mực của kiến trúc Event-Driven)**.

### 1.2. Bốn Khái Niệm Cốt Lõi Của RabbitMQ Bạn Cần Thuộc Lòng

1. **`Connection` (Kết nối TCP vật lý) vs `Channel` (Đường ống ảo bên trong Connection):**
   * Việc mở một kết nối TCP (`Connection`) tới RabbitMQ rất tốn kém (phải bắt tay 3 bước TCP, xác thực tài khoản). Vì vậy, **mỗi ứng dụng (Container NestJS) chỉ nên mở 1 `Connection` (hoặc 1 cho Producer, 1 cho Consumer)**.
   * Bên trong 1 `Connection` duy nhất đó, bạn có thể tạo ra hàng chục **`Channel` (Kênh truyền ảo siêu nhẹ)** cho các luồng công việc khác nhau. Mọi thao tác gửi/nhận tin nhắn đều thực hiện trên `Channel`.
2. **`Exchange` (Bộ định tuyến / Tổng đài phân loại):** Nơi nhận tin nhắn từ Producer và quyết định xem tin nhắn này sẽ được nhân bản vào những `Queue` nào (hoặc vứt bỏ nếu không có Queue nào đăng ký nhận).
3. **`Routing Key` (Nhãn địa chỉ gắn trên phong bì):** Khi Producer gửi tin nhắn vào Exchange, nó đính kèm một chuỗi văn bản gọi là `Routing Key` (ví dụ: `"order.created.vn"` hoặc `"log.error"`).
4. **`Binding` & `Binding Key` (Dây nối & Luật lọc giữa Exchange và Queue):** Là quy tắc bạn dặn Exchange: *"Hễ thấy tin nhắn nào có `Routing Key` khớp với `Binding Key` này thì hãy bỏ vào `Queue` của tôi nhé!"*.

---

# 📘 MODULE 05: THỰC CHIẾN 4 LOẠI EXCHANGE CỦA RABBITMQ (`DIRECT`, `FANOUT`, `TOPIC`, `HEADERS`)

> 🎯 **Mục tiêu:** Nắm vững cơ chế hoạt động và các ký tự đại diện (`*` và `#`) của cả 4 loại Exchange trong RabbitMQ, đồng thời chạy kịch bản thực tế kiểm chứng từng loại.

## 1. Lý thuyết Chuyên sâu: So sánh 4 Loại Exchange trong RabbitMQ

```
1. DIRECT EXCHANGE (So khớp chính xác 100%: Routing Key == Binding Key)
   [Msg: routingKey="error"] ---> (Direct Exchange) ===(bindingKey="error")===> [Queue: Alert_Telegram]
                                                    ===(bindingKey="info") ===> [Queue: Save_Disk_Log] (Không nhận)

2. FANOUT EXCHANGE (Loa phóng thanh / Broadcast: Phớt lờ Routing Key, nhân bản cho TẤT CẢ Queue đang nối vào!)
   [Msg: "User_101_Registered"] -> (Fanout Exchange) ======> [Queue 1: Tạo Ví Mặc Định]    (Nhận bản sao #1)
                                                     ======> [Queue 2: Gửi Email Chào Mừng] (Nhận bản sao #2)
                                                     ======> [Queue 3: Cộng Điểm Giới Thiệu](Nhận bản sao #3)

3. TOPIC EXCHANGE (Khớp mẫu thông minh theo dấu chấm '.' với ký tự đại diện '*' và '#')
   - Dấu sao   '*' : Khớp với ĐÚNG 1 TỪ (ngăn cách bởi dấu chấm).
   - Dấu thăng '#' : Khớp với KHÔNG, MỘT hoặc NHIỀU TỪ bất kỳ!
   Ví dụ: Routing Key = "order.created.vn"
   (Topic Exchange) ===(bindingKey = "order.*.vn") ===> [Queue: Đội Vận Hành Việt Nam]   (Khớp! Vì * = created)
                    ===(bindingKey = "order.#")    ===> [Queue: Kho Lưu Trữ Toàn Cầu]    (Khớp! Vì # = created.vn)
                    ===(bindingKey = "*.failed.*") ===> [Queue: Đội Xử Lý Lỗi Thanh Toán] (Không khớp!)

4. HEADERS EXCHANGE (Phớt lờ Routing Key, lọc dựa trên các thuộc tính Key-Value trong phần 'headers' của tin nhắn)
   - x-match = "all" : Phải khớp TẤT CẢ các cặp header (Phép VÀ - AND).
   - x-match = "any" : Chỉ cần khớp ÍT NHẤT 1 cặp header (Phép HOẶC - OR).
```

---

## 2. Thực hành Tương tác: Chạy Thử Nghiệm Cả 4 Loại Exchange Trên RabbitMQ Thật

Trong ô lệnh bên dưới, code sẽ tự động tạo ra các Exchange và Queue trên container `mq-rabbit` của bạn, gửi các sự kiện thực tế và in ra chính xác Queue nào nhận được tin nhắn nào! *(Sau khi chạy xong, bạn còn có thể mở `http://localhost:15672/#/exchanges` để ngắm nhìn chúng trên giao diện đồ họa!)*

👉 **Bấm `▶ Run` để thực hành cả `Direct`, `Fanout` và `Topic Exchange`:**

```bash
cat << 'EOF' > mq-mastery-lab/rabbitmq-exchanges.mjs
import amqp from 'amqplib';

const conn = await amqp.connect('amqp://admin:secret123@127.0.0.1:5672');
const ch = await conn.createChannel();

// ============================================================================
// 1. DEMO FANOUT EXCHANGE (1 Sự kiện phát ra -> Cả 3 Microservices cùng nhận được!)
// ============================================================================
console.log('=== 1. FANOUT EXCHANGE: Khi User đăng ký tài khoản mới ===');
const FANOUT_EX = 'ex.user.registered.fanout';
await ch.assertExchange(FANOUT_EX, 'fanout', { durable: false });

// Tạo 3 Queue đại diện cho 3 dịch vụ độc lập và nối (bind) vào Fanout Exchange
for (const qName of ['q.wallet.init', 'q.email.welcome', 'q.crm.sync']) {
  await ch.assertQueue(qName, { durable: false });
  await ch.purgeQueue(qName);
  await ch.bindQueue(qName, FANOUT_EX, ''); // Fanout không cần routingKey
}

// Producer bắn ĐÚNG 1 TIN NHẮN vào Fanout Exchange
ch.publish(FANOUT_EX, '', Buffer.from(JSON.stringify({ userId: 101, name: 'Nguyen Van A' })));
await new Promise((r) => setTimeout(r, 200));

for (const qName of ['q.wallet.init', 'q.email.welcome', 'q.crm.sync']) {
  const msg = await ch.get(qName, { noAck: true });
  console.log(`   📩 [${qName}] nhận được bản sao:`, msg.content.toString());
}

// ============================================================================
// 2. DEMO TOPIC EXCHANGE (Định tuyến thông minh bằng dấu '*' và '#')
// ============================================================================
console.log('\n=== 2. TOPIC EXCHANGE: Định tuyến đơn hàng đa quốc gia bằng ký tự * và # ===');
const TOPIC_EX = 'ex.orders.topic';
await ch.assertExchange(TOPIC_EX, 'topic', { durable: false });

await ch.assertQueue('q.vietnam.ops', { durable: false });
await ch.assertQueue('q.critical.alerts', { durable: false });
await ch.assertQueue('q.all.orders.audit', { durable: false });
await ch.purgeQueue('q.vietnam.ops');
await ch.purgeQueue('q.critical.alerts');
await ch.purgeQueue('q.all.orders.audit');

// Luật 1: Đội vận hành VN chỉ nhận đơn hàng ở VN: "order.*.vn" (* khớp đúng 1 từ ở giữa)
await ch.bindQueue('q.vietnam.ops', TOPIC_EX, 'order.*.vn');
// Luật 2: Đội trực lỗi chỉ nhận các đơn bị lỗi ở mọi quốc gia: "order.failed.#"
await ch.bindQueue('q.critical.alerts', TOPIC_EX, 'order.failed.#');
// Luật 3: Hệ thống Kiểm toán (Audit) nhận TẤT CẢ sự kiện bắt đầu bằng "order.#"
await ch.bindQueue('q.all.orders.audit', TOPIC_EX, 'order.#');

// Bắn 2 sự kiện với Routing Key khác nhau:
ch.publish(TOPIC_EX, 'order.created.vn', Buffer.from('Đơn hàng mới tạo tại Việt Nam (#VN01)'));
ch.publish(TOPIC_EX, 'order.failed.us',  Buffer.from('Đơn hàng thanh toán lỗi tại Mỹ (#US99)'));
await new Promise((r) => setTimeout(r, 200));

for (const qName of ['q.vietnam.ops', 'q.critical.alerts', 'q.all.orders.audit']) {
  console.log(`   🗂️ Kiểm tra hòm thư [${qName}]:`);
  while (true) {
    const msg = await ch.get(qName, { noAck: true });
    if (!msg) break;
    console.log(`      └── Nhận tin (RoutingKey: "${msg.fields.routingKey}"): ${msg.content.toString()}`);
  }
}

await ch.close();
await conn.close();
EOF

node mq-mastery-lab/rabbitmq-exchanges.mjs
```

---

# 📘 MODULE 06: CƠ CHẾ `ACK` / `NACK`, `PREFETCH (QoS)` & CHỐNG MẤT TIN KHI WORKER CHẾT

> 🎯 **Mục tiêu:** Hiểu điều gì xảy ra nếu Worker đang tạo báo cáo đến giây thứ 9 thì bị sập nguồn (`OOM Kill` hoặc mất mạng). Làm chủ cơ chế xác nhận thủ công (**Manual `ACK` / `NACK`**), chia tải công bằng (**`channel.prefetch(1)`**) và cấu hình chống mất dữ liệu khi chính RabbitMQ khởi động lại.

## 1. Lý thuyết Chuyên sâu: Tại sao `noAck: true` (Auto-ACK) là Tử Tội trên Production?

### 1.1. Chuyện gì xảy ra khi dùng `noAck: true` (Tự động xác nhận) so với `noAck: false` (Xác nhận thủ công)?

```
❌ KHI BẬT AUTO-ACK (noAck: true):
   [Queue] ---(Vừa gửi gói tin ra khỏi cửa là XÓA LUÔN khỏi Queue!)---> [Worker A]
                                                                            |
                                                                            v (Đang xử lý ở giây thứ 2 thì SẬP NGUỒN!)
                                                                       💥 MẤT VĨNH VIỄN ĐƠN HÀNG!


✅ KHI DÙNG MANUAL ACK (noAck: false - Chuẩn Production):
   Bước 1: [Queue] ---(Giao tin cho Worker A, nhưng đánh dấu trạng thái "UNACKED" giữ trong RAM)---> [Worker A]
   Bước 2 (Nếu Worker A bị sập nguồn / đứt kết nối TCP trước khi gửi lệnh channel.ack(msg)):
           [Queue] ---(Phát hiện kết nối tới Worker A đã chết! Tự động chuyển gói tin về "READY")
                   ---(Và giao ngay gói tin đó cho Worker B đang sống khỏe mạnh xử lý thay!)------> [Worker B]
```

### 1.2. Ba Lệnh Phản Hồi Của Worker Với RabbitMQ

Khi để `noAck: false`, sau khi xử lý xong (hoặc gặp lỗi), Worker có 3 cách trả lời RabbitMQ:
1. **`channel.ack(msg)` (Xác nhận thành công):** *"Tôi đã lưu DB và gửi email xong xuôi 100% rồi, RabbitMQ hãy xóa vĩnh viễn gói tin này khỏi Queue đi nhé!"*.
2. **`channel.nack(msg, false, true)` (`requeue = true` — Trả lại hàng đợi):** *"Hiện tại DB đang quá tải tạm thời, hãy nhét lại gói tin này về lại Queue để lát nữa thử lại!"*.
3. **`channel.nack(msg, false, false)` (`requeue = false` — Từ chối và đẩy sang Dead Letter Queue):** *"Gói tin này bị sai định dạng JSON hoặc đã quá số lần thử lại rồi, ĐỪNG nhét lại vào Queue chính nữa mà hãy tống nó sang Hàng Đợi Chết (DLQ)!"*.

### 1.3. Cạm bẫy Chia Việc Mù Quáng (Round-Robin) và Giải pháp `channel.prefetch(1)`

* **Mặc định khi KHÔNG có `prefetch`:** Nếu có 100 jobs đẩy vào Queue và bạn có 2 Workers (`Worker A` và `Worker B`), RabbitMQ sẽ chia chẵn ngay lập tức lúc đầu: đẩy một mạch 50 jobs chẵn vào mạng của `Worker A`, 50 jobs lẻ vào mạng của `Worker B`!
* **Hậu quả:** Giả sử các jobs số chẵn đều là xuất video nặng tốn 10 phút/job, còn các jobs số lẻ chỉ tốn 1 giây/job $\rightarrow$ `Worker B` làm xong sạch 50 việc chỉ trong 50 giây rồi ngồi chơi xơi nước, trong khi `Worker A` bị ngộp thở suốt 8 tiếng đồng hồ!
* 🛡️ **Giải pháp Vàng (`await channel.prefetch(1)` hoặc `prefetch(5)`):**
  Dặn RabbitMQ: *"Chỉ giao tối đa `1` (hoặc `5`) việc một lúc cho mỗi Worker thôi! Bao giờ Worker đó gọi `channel.ack(msg)` báo làm xong việc cũ thì mới được giao việc tiếp theo!"*.

### 1.4. Bộ Ba Bất Tử (Chống mất tin nhắn khi chính máy chủ RabbitMQ bị rút dây điện)

Để tin nhắn không bị mất ngay cả khi container RabbitMQ bị restart, bạn phải kết hợp đủ **3 chốt chặn**:
1. **Queue bền vững:** `await channel.assertQueue('my_q', { durable: true })` (Lưu cấu trúc Queue xuống đĩa).
2. **Tin nhắn bền vững:** `channel.publish(ex, key, content, { persistent: true })` (tương đương `deliveryMode: 2` — Ghi nội dung tin nhắn xuống ổ cứng).
3. **Publisher Confirms:** Sử dụng `await conn.createConfirmChannel()` và `await channel.waitForConfirms()` để đảm bảo ổ cứng của RabbitMQ đã thực sự ghi xong tin nhắn trước khi Producer báo thành công!

---

## 2. Thực hành Tương tác: Mô phỏng Worker A Bị Sập Nguồn Giữa Chừng & Worker B Tự Động Cứu Nguy!

👉 **Bấm `▶ Run` để chứng kiến tận mắt: `Worker_A` nhận đơn hàng `#ORD_777` nhưng bị ngắt điện trước khi kịp `ack`, và ngay lập tức RabbitMQ thu hồi đơn hàng đó giao cho `Worker_B` xử lý!**

```bash
cat << 'EOF' > mq-mastery-lab/rabbitmq-crash-recovery.mjs
import amqp from 'amqplib';

const QUEUE = 'q.payment.high_reliability';
const connProducer = await amqp.connect('amqp://admin:secret123@127.0.0.1:5672');
const chProducer = await connProducer.createConfirmChannel();

await chProducer.assertQueue(QUEUE, { durable: true });
await chProducer.purgeQueue(QUEUE);

// 1. Producer gửi 1 đơn hàng quan trọng với cờ persistent: true
chProducer.sendToQueue(QUEUE, Buffer.from(JSON.stringify({ orderId: 'ORD_777', amount: 5000000 })), {
  persistent: true
});
await chProducer.waitForConfirms();
console.log('📤 [Producer] Đã gửi đơn hàng #ORD_777 (5.000.000đ) vào Queue bền vững.');

// 2. WORKER A kết nối vào, nhận đơn hàng nhưng ĐỘT NGỘT SẬP NGUỒN (Đóng kết nối mà chưa gọi ack!)
const connWorkerA = await amqp.connect('amqp://admin:secret123@127.0.0.1:5672');
const chWorkerA = await connWorkerA.createChannel();
await chWorkerA.prefetch(1);

await chWorkerA.consume(QUEUE, async (msg) => {
  const data = JSON.parse(msg.content.toString());
  console.log(`👷 [Worker A] Đã nhận đơn #${data.orderId} (Trạng thái trong RabbitMQ lúc này: UNACKED)...`);
  console.log(`💥 [Worker A] Đang xử lý dở thì服务器 bị OOM Kill / Mất điện đột ngột (Chưa kịp gọi ack)!`);
  // Giả lập Worker A chết đột ngột bằng cách đóng thẳng kết nối TCP!
  await connWorkerA.close();
}, { noAck: false });

await new Promise((r) => setTimeout(r, 400));

// 3. WORKER B đang chạy trên một container khác sẽ lập tức nhận được đơn hàng #ORD_777 do RabbitMQ hoàn trả lại!
const connWorkerB = await amqp.connect('amqp://admin:secret123@127.0.0.1:5672');
const chWorkerB = await connWorkerB.createChannel();
await chWorkerB.prefetch(1);

await chWorkerB.consume(QUEUE, (msg) => {
  const data = JSON.parse(msg.content.toString());
  console.log(`🦸 [Worker B - Cứu nguy!] Nhận lại đơn #${data.orderId} từ RabbitMQ (Cờ redelivered = ${msg.fields.redelivered})!`);
  console.log(`✅ [Worker B] Đã xử lý thanh toán hoàn tất và gửi lệnh ACK xác nhận xóa khỏi Queue!`);
  chWorkerB.ack(msg);
}, { noAck: false });

await new Promise((r) => setTimeout(r, 400));
await connWorkerB.close();
await connProducer.close();
EOF

node mq-mastery-lab/rabbitmq-crash-recovery.mjs
```

**Quan sát kết quả cực kỳ ấn tượng:**
Bạn thấy cờ `msg.fields.redelivered = true` ở `Worker B`! Nhờ cơ chế `noAck: false`, ngay khoảnh khắc kết nối TCP của `Worker A` bị đứt, RabbitMQ lập tức thu hồi gói tin đang `UNACKED` và trao lại cho `Worker B` kèm nhãn `redelivered = true`! Không một đồng nào của khách hàng bị thất lạc!

---

# 📘 MODULE 07: DEAD LETTER QUEUE (DLQ) & RETRY EXPONENTIAL BACKOFF TRÊN RABBITMQ

> 🎯 **Mục tiêu:** Giải quyết thảm họa **"Poison Message" (Tin nhắn độc)** và tự tay thiết kế kiến trúc **Retry tự động theo cấp số nhân ($1\text{s} \rightarrow 2\text{s}$) kết hợp Hàng Đợi Chết (`DLQ`)** chuẩn Enterprise trên RabbitMQ.

## 1. Lý thuyết Chuyên sâu: Tại sao gọi `nack(msg, false, true)` trực tiếp lại gây treo toàn bộ hệ thống?

Hãy tưởng tượng có 1 gói tin bị lỗi dữ liệu hoặc dịch vụ thứ 3 đang sập trong 10 giây:
* Nếu trong khối `catch (err)`, bạn viết `channel.nack(msg, false, true)` (`requeue = true`):
  1. Gói tin đó được trả lại ngay đầu hàng đợi trong **`0.1 mili-giây`**.
  2. Ngay mili-giây tiếp theo, Worker lại bốc trúng chính gói tin đó $\rightarrow$ Lại lỗi $\rightarrow$ Lại `nack(requeue: true)` $\rightarrow$ Lại bốc lên!
  3. Chỉ trong 1 giây, vòng lặp vô tận này quay **10.000 vòng**, đốt cháy 100% CPU, làm tràn cứng ổ đĩa chứa Log và chặn đứng các gói tin hợp lệ phía sau! Hiện tượng này gọi là **Poison Message Loop**.

### Kiến trúc Chuẩn Công Nghiệp: `Main Queue` $\leftrightarrow$ `Retry Wait Queue (TTL)` $\rightarrow$ `Parking Lot DLQ`

Trong RabbitMQ không có sẵn hàm `backoff` tự động như BullMQ, mà các kiến trúc sư sử dụng sự kết hợp tuyệt đẹp giữa **Dead Letter Exchange (`x-dead-letter-exchange`)** và **Thời gian hết hạn tin nhắn (`expiration / TTL`)**:

```
                                     +------------------------------------------------------+
                                     |      3. Hết giờ chờ (TTL 1s -> 2s -> 4s hết hạn)     |
                                     |      RabbitMQ tự động đẩy ngược về lại Main Queue!   |
                                     v                                                      |
[Producer] ---> (ex.main) ---> [ 1. MAIN QUEUE ] ---> [ WORKER XỬ LÝ ]                      |
                                                          |                                 |
                                            Gặp lỗi mạng! | Kiểm tra header 'x-retry-count' |
                                                          v                                 |
                                              Đã thử quá 3 lần chưa?                        |
                                              /                    \                        |
                                   Chưa (< 3)/                      \ Rồi (>= 3 lần vẫn lỗi)|
                                            v                        v                      |
                            2. Đẩy vào [ RETRY WAIT QUEUE ]    4. Đẩy vào [ DEAD LETTER QUEUE (DLQ) ]
                               (Gắn TTL = 1000ms * 2^retry)       (Cách ly hoàn toàn để Dev kiểm tra,
                                            |                      bắn cảnh báo Slack/Telegram!)
                                            +-----------------------------------------------+
```

**Giải thích cơ chế "Mượn tay TTL + Dead Letter để làm bộ hẹn giờ":**
1. Một gói tin trong RabbitMQ sẽ biến thành **"Dead Letter" (Thư chết)** và được tự động chuyển sang `x-dead-letter-exchange` khi xảy ra 1 trong 3 việc:
   * Bị Worker từ chối bằng `nack` / `reject` với `requeue = false`.
   * **Hoặc gói tin đó hết hạn thời gian sống (`TTL / expiration`) mà không có ai đọc!**
   * Hoặc hàng đợi bị đầy quá giới hạn `x-max-length`.
2. Ta tạo một **`q.order.retry_wait`** KHÔNG CÓ WORKER NÀO ĐỌC, nhưng cấu hình: *"Hễ tin nhắn nào nằm trong `q.order.retry_wait` mà hết hạn TTL thì hãy tự động chuyển tiếp nó quay về lại `q.order.main`!"*.
3. Khi Worker xử lý lỗi ở lần 1, nó gửi tin nhắn vào `q.order.retry_wait` với `expiration: '400'` ($400\text{ ms}$). Đúng $400\text{ ms}$ sau, tin nhắn hết hạn trong phòng chờ và tự động nhảy ngược về `q.order.main` để Worker thử lại lần 2! Nếu quá 3 lần vẫn lỗi, Worker tống thẳng nó vào **`q.order.dlq` (Nghĩa địa thư lỗi)**!

---

## 2. Thực hành Tương tác: Chạy Hệ Thống Tự Động Retry $3$ Lần Theo Cấp Số Nhân Rồi Cách Ly Vào `DLQ`

👉 **Bấm `▶ Run` để xem một gói tin bị lỗi được RabbitMQ tự động đưa vào phòng chờ $300\text{ms} \rightarrow 600\text{ms}$ để thử lại, và sau khi thất bại đủ 3 lần thì bị tống vào `DLQ` an toàn:**

```bash
cat << 'EOF' > mq-mastery-lab/rabbitmq-dlq-retry.mjs
import amqp from 'amqplib';

const conn = await amqp.connect('amqp://admin:secret123@127.0.0.1:5672');
const ch = await conn.createChannel();

const MAIN_EX  = 'ex.payment.main';
const DLX_EX   = 'ex.payment.dlx';

const MAIN_Q   = 'q.payment.main';
const WAIT_Q   = 'q.payment.retry_wait';
const DLQ_Q    = 'q.payment.dlq';

await ch.assertExchange(MAIN_EX, 'direct', { durable: true });
await ch.assertExchange(DLX_EX,  'direct', { durable: true });

// 1. Hàng đợi chính (MAIN_Q)
await ch.assertQueue(MAIN_Q, { durable: true });
await ch.bindQueue(MAIN_Q, MAIN_EX, 'process');

// 2. Phòng chờ Retry (WAIT_Q): KHÔNG có Consumer nào đọc!
//    Khi tin nhắn trong WAIT_Q hết hạn TTL, nó tự động quay về MAIN_EX với routingKey = 'process'!
await ch.assertQueue(WAIT_Q, {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': MAIN_EX,
    'x-dead-letter-routing-key': 'process'
  }
});
await ch.bindQueue(WAIT_Q, DLX_EX, 'wait');

// 3. Hàng đợi chết cuối cùng (DLQ_Q): Nơi lưu giữ các tin nhắn đã hết cứu sau 3 lần thử
await ch.assertQueue(DLQ_Q, { durable: true });
await ch.bindQueue(DLQ_Q, DLX_EX, 'dead');

await ch.purgeQueue(MAIN_Q);
await ch.purgeQueue(WAIT_Q);
await ch.purgeQueue(DLQ_Q);

const MAX_RETRIES = 2; // Thử tối đa: 1 lần gốc + 2 lần retry = 3 lần tổng cộng

// 4. Worker xử lý trên MAIN_Q
await ch.consume(MAIN_Q, (msg) => {
  const headers = msg.properties.headers || {};
  const retryCount = headers['x-retry-count'] || 0;
  const payload = JSON.parse(msg.content.toString());

  console.log(`\n⚙️ [Worker] Đang xử lý giao dịch #${payload.txId} (Lần chạy thứ ${retryCount + 1}/${MAX_RETRIES + 1})...`);

  try {
    // Giả lập lỗi không thể phục hồi (ví dụ: Thẻ tín dụng bị khóa)
    throw new Error('Thẻ tín dụng của khách bị từ chối (ERR_CARD_DECLINED)');
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const nextRetry = retryCount + 1;
      const backoffMs = 300 * Math.pow(2, retryCount); // Lần 1 chờ 300ms, Lần 2 chờ 600ms
      console.log(`   ⏳ [Lỗi lần ${nextRetry}] Đẩy vào Phòng Chờ (${WAIT_Q}) hẹn giờ ${backoffMs}ms sau thử lại...`);

      // Đẩy sang phòng chờ kèm TTL (expiration) và tăng biến đếm x-retry-count
      ch.publish(DLX_EX, 'wait', msg.content, {
        persistent: true,
        expiration: String(backoffMs),
        headers: { ...headers, 'x-retry-count': nextRetry, 'x-last-error': err.message }
      });
      ch.ack(msg); // Xác nhận đã di chuyển khỏi MAIN_Q
    } else {
      console.log(`   💀 [HẾT LƯỢT THỬ!] Đã thất bại cả ${MAX_RETRIES + 1} lần -> Cách ly gói tin vào Nghĩa địa DLQ (${DLQ_Q})!`);
      ch.publish(DLX_EX, 'dead', msg.content, {
        persistent: true,
        headers: { ...headers, 'x-failed-reason': err.message, 'x-failed-at': new Date().toISOString() }
      });
      ch.ack(msg);
    }
  }
}, { noAck: false });

// 5. Bắn 1 giao dịch lỗi vào MAIN_EX
console.log('🚀 [Producer] Bắn giao dịch #TX_ERROR_999 vào hệ thống...');
ch.publish(MAIN_EX, 'process', Buffer.from(JSON.stringify({ txId: 'TX_ERROR_999', amount: 990000 })));

// Chờ 1.5 giây cho chu trình Retry 300ms + 600ms chạy xong
await new Promise((r) => setTimeout(r, 1500));

// 6. Kiểm tra bên trong hàng đợi DLQ xem gói tin đã nằm gọn trong đó kèm lý do lỗi chưa
const dlqMsg = await ch.get(DLQ_Q, { noAck: true });
console.log('\n🔍 [Kiểm tra Hàng Đợi Chết - DLQ]:');
console.log('   ├── Nội dung gốc:', dlqMsg.content.toString());
console.log('   └── Headers lưu vết lỗi:', JSON.stringify(dlqMsg.properties.headers));

await ch.close();
await conn.close();
EOF

node mq-mastery-lab/rabbitmq-dlq-retry.mjs
```

---

# 📘 MODULE 08: BÀI TOÁN IDEMPOTENT CONSUMER — CHỐNG TRỪ TIỀN & GỬI MAIL ĐÚP 100%

> 🎯 **Mục tiêu:** Hiểu quy luật bất di bất dịch của mọi hệ thống phân tán: **"Một tin nhắn trong Queue LUÔN CÓ NGUY CƠ được gửi tới Worker từ 2 lần trở lên (*At-Least-Once Delivery*)"**, và cách viết **Idempotent Consumer (Người nhận Bất biến)** để dù nhận trùng 10 lần cũng chỉ thực thi đúng 1 lần!

## 1. Lý thuyết Chuyên sâu: Tại sao dùng Queue chắc chắn sẽ gặp trường hợp Nhận Trùng Tin Nhắn?

Hãy xem kịch bản thực tế xảy ra hàng ngày trên Production:
1. `Worker A` nhận gói tin `"Cộng 500.000đ thưởng cho User 101"` (`messageId = "MSG_888"`).
2. `Worker A` chạy câu lệnh SQL cộng `500.000đ` vào Database và **`COMMIT` thành công 100%**.
3. Đúng $1\text{ mili-giây}$ sau, khi `Worker A` vừa định gọi lệnh `channel.ack(msg)` để báo cho RabbitMQ (hoặc BullMQ) biết là đã xong, thì **mạng LAN bị chập chờn hoặc container bị khởi động lại**!
4. Vì RabbitMQ chưa nhận được `ACK`, nó đinh ninh là `Worker A` chưa làm xong $\rightarrow$ Nó lập tức gửi lại gói tin `"MSG_888"` cho `Worker B`!
5. Nếu `Worker B` cứ thế nhắm mắt cộng thêm `500.000đ` nữa $\rightarrow$ **User 101 được cộng khống `1.000.000đ`!**

### Giải pháp Kiến trúc: Thiết kế **Idempotent Consumer**
Một hàm xử lý được gọi là **Idempotent (Bất biến / Lũy đẳng)** nếu gọi nó 1 lần hay 100 lần với cùng một `eventId / messageId` thì trạng thái dữ liệu vẫn giống hệt như gọi 1 lần:
$$\quad f(x) = f(f(x))$$

**2 Cách cài đặt Idempotent Consumer chuẩn nhất:**
1. **Tại tầng Database (An toàn 100% cho giao dịch tài chính):** Tạo bảng `processed_messages (message_id VARCHAR PRIMARY KEY, processed_at TIMESTAMPTZ)`. Trong cùng 1 Database Transaction với lệnh cộng tiền, bạn thực hiện `INSERT INTO processed_messages (message_id) VALUES ('MSG_888')`. Nếu `MSG_888` đã được xử lý trước đó, Database sẽ ném lỗi trùng khóa chính (`UNIQUE VIOLATION`) và hủy bỏ việc cộng tiền lần 2 ngay lập tức!
2. **Tại tầng Redis (Siêu nhanh cho gửi Email / Notification):** Dùng khóa `SET idempotency:msg:MSG_888 "PROCESSING" NX EX 86400`. Nếu trả về `null` (đã tồn tại), Worker bỏ qua và `ACK` luôn!

---

## 2. Thực hành Tương tác: Chống Cộng Tiền Đúp Khi Queue Phát Lại Tin Nhắn (`Redelivery`)

👉 **Bấm `▶ Run` để xem Idempotent Consumer dùng Redis/DB chặn đứng gói tin bị gửi lặp lần thứ 2 và thứ 3:**

```bash
cat << 'EOF' > mq-mastery-lab/idempotent-consumer.mjs
import Redis from 'ioredis';

const redis = new Redis({ host: '127.0.0.1', port: 6380 });
await redis.del('wallet:user:101', 'processed:MSG_REWARD_500K');

// Hàm Consumer xử lý cộng tiền thưởng có bảo vệ Idempotency
async function processRewardMessage(message) {
  const lockKey = `processed:${message.messageId}`;

  // Bước 1: Kiểm tra và đánh dấu nguyên tử bằng SET ... NX EX
  const isFirstTime = await redis.set(lockKey, 'DONE', 'NX', 'EX', 86400);

  if (!isFirstTime) {
    console.log(`🛡️ [Idempotency Guard] Phát hiện gói tin trùng lặp (${message.messageId})! Bỏ qua không cộng tiền lại và gửi ACK luôn.`);
    return;
  }

  // Bước 2: Nếu là lần đầu tiên thực sự -> Thực hiện cộng tiền
  const newBalance = await redis.incrby(`wallet:user:${message.userId}`, message.amount);
  console.log(`💰 [Xử lý Thành Công] Đã cộng +${message.amount}đ từ gói tin ${message.messageId}. Số dư mới: ${newBalance}đ`);
}

// Giả lập RabbitMQ/BullMQ gửi trùng cùng 1 gói tin 3 lần do mạng chập chờn khi gửi ACK:
const duplicateEvent = { messageId: 'MSG_REWARD_500K', userId: 101, amount: 500000 };

console.log('=== GIẢ LẬP WORKER NHẬN TRÙNG 1 GÓI TIN 3 LẦN LIÊN TIẾP ===');
await processRewardMessage(duplicateEvent); // Lần 1: Cộng tiền
await processRewardMessage(duplicateEvent); // Lần 2 (Gửi trùng): Tự động bị chặn!
await processRewardMessage(duplicateEvent); // Lần 3 (Gửi trùng): Tự động bị chặn!

const finalBalance = await redis.get('wallet:user:101');
console.log(`\n✅ Kết quả kiểm toán cuối cùng: Số dư của User 101 chuẩn xác tuyệt đối = ${finalBalance}đ!`);
await redis.quit();
EOF

node mq-mastery-lab/idempotent-consumer.mjs
```

---

# 📘 MODULE 09: ĐỈNH CAO KIẾN TRÚC — TRANSACTIONAL OUTBOX PATTERN

> 🎯 **Mục tiêu:** Giải quyết bài toán phỏng vấn cấp độ Senior/Lead kinh điển nhất: **"Làm thế nào để vừa lưu đơn hàng vào PostgreSQL, vừa bắn sự kiện sang RabbitMQ/BullMQ mà nếu sập nguồn ở giữa 2 bước đó thì dữ liệu vẫn đồng nhất 100%?"**

## 1. Lý thuyết Chuyên sâu: Bài Toán Ghi Kép (The Dual-Write Problem)

Hãy nhìn vào đoạn code tạo đơn hàng mà 95% lập trình viên thường viết:

```typescript
// ❌ CẠM BẪY DUAL-WRITE (GHI VÀO 2 HỆ THỐNG KHÁC NHAU KHÔNG CÓ TRANSACTION CHUNG):
async function createOrder(dto) {
  // Bước 1: Lưu đơn hàng vào PostgreSQL
  const order = await this.db.orders.create(dto);

  // ⚡ Chuyện gì xảy ra nếu ngay tại dòng này: Server bị mất điện, hoặc RabbitMQ đang đứt mạng 3 giây?!
  // Bước 2: Bắn sự kiện sang RabbitMQ / BullMQ
  await this.rabbitClient.publish('ex.orders', 'order.created', order);
}
```

* **Nếu lưu DB trước rồi bắn Queue sau:** Lưu DB xong mà mất điện trước khi bắn vào Queue $\rightarrow$ Đơn hàng nằm chết dí trong DB, kho không được trừ, khách không nhận được thông báo!
* **Nếu đảo ngược lại (Bắn Queue trước rồi lưu DB sau):** Bắn vào Queue xong mà câu lệnh lưu DB bị lỗi ` Rollback` (hoặc DB chậm hơn Worker) $\rightarrow$ Worker nhận được tin nhắn đi giao hàng cho một đơn hàng... **không hề tồn tại trong Database (Ghost Order)**!

### Giải pháp Chuẩn Kiến Trúc Sư: **Transactional Outbox Pattern (Bảng Hộp Thư Đi)**

Vì chúng ta không thể tạo 1 Transaction chung vắt ngang qua cả PostgreSQL lẫn RabbitMQ, chúng ta **biến việc bắn sự kiện thành một lệnh `INSERT` vào bảng `outbox_events` nằm ngay bên trong cùng Database PostgreSQL đó**!

```
+-----------------------------------------------------------------------------------+
| BƯỚC 1: TRONG CÙNG 1 DATABASE TRANSACTION (ACID 100% - Cùng sống hoặc cùng chết!) |
|   BEGIN;                                                                          |
|     INSERT INTO orders (id, user_id, total) VALUES (101, 55, 900000);             |
|     INSERT INTO outbox_events (id, event_type, payload, status)                   |
|            VALUES ('evt_1', 'order.created', '{"orderId": 101}', 'PENDING');      |
|   COMMIT;                                                                         |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | (Dù mất điện ngay sau khi COMMIT, sự kiện vẫn nằm an toàn trong bảng outbox_events!)
                                          v
+-----------------------------------------------------------------------------------+
| BƯỚC 2: TIẾN TRÌNH OUTBOX RELAY / PUBLISHER (Chạy ngầm liên tục hoặc dùng CDC)    |
|   1. Quét các dòng status = 'PENDING' trong bảng outbox_events                    |
|      (Dùng khóa nhảy cóc: SELECT ... FOR UPDATE SKIP LOCKED đã học ở khóa DB!)    |
|   2. Đẩy sự kiện lên RabbitMQ / BullMQ (Chờ Publisher Confirm thành công).        |
|   3. Cập nhật dòng đó thành: UPDATE outbox_events SET status = 'PUBLISHED'.       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Thực hành Tương tác: Chạy Mô Hình Transactional Outbox Pattern Hoàn Chỉnh Với RabbitMQ

👉 **Bấm `▶ Run` để chứng kiến cách hệ thống vẫn tự động khôi phục và đẩy đủ 100% sự kiện lên RabbitMQ ngay cả khi API Server bị sập nguồn ngay sau khi `COMMIT` Database:**

```bash
cat << 'EOF' > mq-mastery-lab/transactional-outbox.mjs
import amqp from 'amqplib';

// Giả lập Database gồm 2 bảng nằm trong cùng 1 ACID Transaction: 'orders' và 'outbox_events'
const mockDatabase = {
  orders: [],
  outbox_events: [],
  executeTransaction(fn) {
    // Đảm bảo cả 2 bảng cùng được ghi thành công nguyên tử
    fn(this.orders, this.outbox_events);
  }
};

// ============================================================================
// BƯỚC 1: API Checkout lưu cả Order và Outbox Event trong 1 Transaction duy nhất
// ============================================================================
function checkoutApiWithOutbox(orderData) {
  console.log('🛒 [1. API Checkout] Bắt đầu Database Transaction...');
  mockDatabase.executeTransaction((ordersTable, outboxTable) => {
    ordersTable.push(orderData);
    outboxTable.push({
      eventId: `EVT_${orderData.orderId}`,
      routingKey: 'order.created',
      payload: orderData,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
  });
  console.log('✅ [1. API Checkout] Đã COMMIT cả bảng `orders` và bảng `outbox_events` thành công!');
  console.log('💥 [Giả lập Sự Cố] Đúng 1ms sau khi COMMIT, RabbitMQ bị đứt cáp mạng tạm thời! (Nhưng khách hàng vẫn nhận kết quả đặt đơn thành công, không bị lỗi 500!)');
}

checkoutApiWithOutbox({ orderId: 'ORD_2026_99', total: 2500000 });
console.log('📋 Trạng thái bảng `outbox_events` trong DB hiện tại:', JSON.stringify(mockDatabase.outbox_events));

// ============================================================================
// BƯỚC 2: Tiến trình Outbox Relay quét các dòng PENDING và bắn lên RabbitMQ
// ============================================================================
console.log('\n🔄 [2. Outbox Relay Worker] Mạng RabbitMQ đã có lại! Đang quét bảng `outbox_events` (WHERE status = PENDING FOR UPDATE SKIP LOCKED)...');

const conn = await amqp.connect('amqp://admin:secret123@127.0.0.1:5672');
const ch = await conn.createConfirmChannel();
const OUTBOX_QUEUE = 'q.outbox.verified_orders';
await ch.assertQueue(OUTBOX_QUEUE, { durable: true });
await ch.purgeQueue(OUTBOX_QUEUE);

for (const evt of mockDatabase.outbox_events.filter((e) => e.status === 'PENDING')) {
  // Bắn lên RabbitMQ kèm messageId để phía Consumer chống trùng (Idempotency)
  ch.sendToQueue(OUTBOX_QUEUE, Buffer.from(JSON.stringify(evt.payload)), {
    persistent: true,
    messageId: evt.eventId
  });
  await ch.waitForConfirms();

  // Sau khi RabbitMQ xác nhận đã lưu xuống đĩa -> Đánh dấu PUBLISHED trong DB
  evt.status = 'PUBLISHED';
  evt.publishedAt = new Date().toISOString();
  console.log(`🚀 [2. Outbox Relay Worker] Đã đẩy sự kiện ${evt.eventId} lên RabbitMQ an toàn và cập nhật status = 'PUBLISHED'!`);
}

console.log('📋 Trạng thái bảng `outbox_events` sau khi đồng bộ:', JSON.stringify(mockDatabase.outbox_events));

const received = await ch.get(OUTBOX_QUEUE, { noAck: true });
console.log('📩 [3. Kho Hàng nhận tin từ RabbitMQ]:', received.content.toString(), '| MessageID:', received.properties.messageId);

await ch.close();
await conn.close();
EOF

node mq-mastery-lab/transactional-outbox.mjs
```

---

# 📘 MODULE 10: CHECKLIST TÍCH HỢP VÀO NESTJS PRODUCTION & TRẠM DỌN DẸP PHÒNG LAB

> 🎯 **Mục tiêu:** Tổng hợp các quy tắc sống còn khi đưa **BullMQ (`@nestjs/bullmq`)** và **RabbitMQ (`@golevelup/nestjs-rabbitmq` hoặc `@nestjs/microservices`)** lên VPS Production.

## 1. 5 Quy Tắc Vàng Khi Vận Hành Message Queue Trên Production

1. **Bắt buộc bật Graceful Shutdown trong `main.ts` của NestJS (`app.enableShutdownHooks()`):**
   * Khi bạn deploy code mới bằng CI/CD trên VPS, Docker gửi tín hiệu `SIGTERM` để tắt container cũ.
   * Nếu không bật `enableShutdownHooks()`, container bị tắt ngang xương khi Worker đang chạy dở câu lệnh chuyển tiền!
   * Khi bật `enableShutdownHooks()`, `@nestjs/bullmq` và RabbitMQ sẽ **ngừng nhận Job mới**, chờ cho Job đang chạy dở xử lý xong (trong khoảng `stop_grace_period: 30s`), gửi `ACK` đàng hoàng rồi mới tắt tiến trình!
2. **Tách riêng Container API và Container Worker khi tải cao:**
   * Đừng bắt 1 tiến trình Node.js vừa trả lời HTTP request cho người dùng, vừa chạy hàm xuất file Excel 100.000 dòng (ngốn CPU làm nghẽn Event Loop). Hãy dùng cùng 1 source code nhưng bật 2 services trong `docker-compose.yml`: `nestjs-api` (chỉ đẩy việc vào Queue) và `nestjs-worker` (chỉ chạy các Consumers).
3. **Không bao giờ nhét Payload khổng lồ vào Queue:**
   * Nếu cần xử lý file ảnh/PDF nặng $20\text{ MB}$, hãy lưu file đó lên S3 / MinIO / Ổ cứng trước, rồi chỉ gửi **đường dẫn URL (`{"fileUrl": "s3://..."}`)** vào trong BullMQ / RabbitMQ.
4. **Luôn gắn `correlationId` / `traceId` vào Message Headers:**
   * Khi 1 request đi qua API $\rightarrow$ Queue $\rightarrow$ Worker, hãy truyền mã `requestId` vào trong `headers` của gói tin để khi tìm log trên Grafana Loki bạn có thể xâu chuỗi toàn bộ hành trình của đơn hàng đó.
5. **Luôn có cảnh báo (Alert) trên số lượng tin nhắn của hàng đợi `DLQ`:**
   * Hàng đợi chết (`DLQ`) bình thường phải có `0` tin nhắn. Chỉ cần số lượng tin trong `DLQ > 0`, hệ thống giám sát phải bắn tin nhắn báo ngay về Telegram/Slack cho đội phát triển!

---

## 🧹 TRẠM DỌN DẸP PHÒNG LAB (AN TOÀN 100% CHO MÁY CHÍNH)

Khi bạn đã thực hành xong và muốn tắt toàn bộ container `mq-redis`, `mq-rabbit` cũng như xóa sạch thư mục nháp `./mq-mastery-lab` để giải phóng RAM và ổ cứng, hãy bấm nút **`▶ Run`** ở ô dưới đây:

```bash
docker container rm -f mq-redis mq-rabbit 2>/dev/null || true
rm -rf mq-mastery-lab
echo "✨ Đã tắt toàn bộ container Redis, RabbitMQ và dọn dẹp sạch sẽ 100% phòng Lab!"
```