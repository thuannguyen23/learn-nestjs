# 🔴 REDIS MASTERY: TỪ BEGINNER ĐẾN MASTER & CÁC CASE THỰC CHIẾN (RUNME NOTEBOOK)

> **Tài liệu học tương tác (Interactive Notebook) cập nhật theo chuẩn Redis Docs mới nhất (Redis 7.4+ & Redis 8).**
> Bạn chỉ cần mở file này bằng extension **Runme** trên VS Code và bấm nút **`▶ Run`** ở từng khối lệnh. Toàn bộ môi trường Redis sẽ chạy bên trong một Docker Container cô lập, đảm bảo **không cài đặt rác và không làm ảnh hưởng 1% nào đến máy tính chính của bạn**.

---

## 🗺️ BẢN ĐỒ LỘ TRÌNH 12 MODULES (BEGINNER $\rightarrow$ PRODUCTION ARCHITECT)

| Module | Chủ đề cốt lõi (Theo chuẩn Redis Docs mới nhất) | Case Study Thực Tế (Production Use Cases) |
| :--- | :--- | :--- |
| **Module 00** | **Lab Setup: Redis 8 + Redis Insight GUI** | Dựng phòng Lab Redis 8 kèm giao diện quản lý trực quan tại `http://localhost:8001` |
| **Module 01** | **Kiến trúc Cốt lõi & Tư duy Keyspace** | Tại sao 1 luồng (Single-threaded) xử lý 100.000+ req/s? Hiểm họa `KEYS *` & giải pháp `SCAN` |
| **Module 02** | **Strings & Hashes (Kèm `HEXPIRE` mới)** | Cache Profile, OTP tự hủy, Bộ đếm Atomic, Quản lý Session đa thiết bị với `HEXPIRE` |
| **Module 03** | **Lists, Sets & Sorted Sets (`ZSET`)** | Hàng đợi việc làm (`BLMOVE`), Tìm bạn chung (`SINTER`), Bảng xếp hạng Game Realtime |
| **Module 04** | **Bitmaps, HyperLogLog & Geospatial** | Điểm danh 365 ngày tốn 46 Bytes RAM, Đếm triệu Unique Views tốn 12KB, Tìm tài xế Grab/Uber |
| **Module 05** | **Chiến lược Caching & 3 Thảm họa Hệ thống** | Cache-Aside/Write-Behind, Chống **Cache Stampede**, **Penetration (Bloom Filter)** & **Avalanche** |
| **Module 06** | **Atomicity, Pipelining & Lua Scripting** | **Sliding Window Rate Limiter** (Chống Spam API) & **Flash Sale Trừ Tồn Kho (Chống âm kho)** |
| **Module 07** | **Distributed Locks (Khóa Phân Tán)** | Chống thanh toán đúp (Double Charging) & Chống chạy trùng Cronjob khi chạy nhiều server |
| **Module 08** | **Pub/Sub vs Redis Streams (Event-Driven)** | Chat/Notification Realtime vs Hàng đợi xử lý Đơn hàng bất đồng bộ (`XREADGROUP`, `XAUTOCLAIM`) |
| **Module 09** | **Redis 8 Hiện đại: JSON, Search & Vector AI** | Thao tác `RedisJSON`, tìm kiếm Full-text `FT.SEARCH` & Tìm kiếm ngữ nghĩa AI bằng `VADD`/`VSIM` |
| **Module 10** | **Persistence (RDB vs AOF) & Eviction Policy** | Tại sao lưu trên RAM mà mất điện không mất data? Chọn `allkeys-lru` hay `volatile-lfu`? |
| **Module 11** | **Bảo mật (ACL), Tối ưu & Bắt bệnh Production** | Phân quyền `ACL SETUSER` (chặn `FLUSHALL`), bắt lệnh chậm `SLOWLOG`, tìm `bigkeys` & `hotkeys` |
| **Module 12** | **High Availability (Sentinel/Cluster) & NestJS** | Dựng cụm Master-Replica tự động Failover, giải mã 16384 Hash Slots & Tích hợp vào NestJS |

---

# 🚀 MODULE 00: KHỞI TẠO PHÒNG LAB REDIS 8 + REDIS INSIGHT GUI

> 🎯 **Mục tiêu:** Khởi tạo một container **Redis 8** (tích hợp sẵn JSON, Search, TimeSeries, Bloom Filter, Vector Sets) và công cụ đồ họa chính chủ **Redis Insight** chỉ với 1 cú click.

### Tại sao dùng `redis:8.0-M02-alpine` hoặc `redis/redis-stack`?
Từ phiên bản **Redis 8**, các module nâng cao trước đây nằm rời rạc trong *Redis Stack* (`RedisJSON`, `RediSearch`, `RedisBloom`, `RedisTimeSeries` và kiểu dữ liệu mới `Vector Set`) đã được hợp nhất vào nhân Redis. Để bạn vừa gõ lệnh CLI vừa nhìn thấy dữ liệu trực quan bằng mắt, chúng ta sẽ bật container `redis/redis-stack:latest` (tích hợp sẵn cả **Redis Engine** ở cổng `6379` lẫn giao diện web **Redis Insight** ở cổng `8001`).

👉 **Bấm `▶ Run` bên dưới để bật Phòng Lab Redis:**

```bash
set -e
mkdir -p redis-mastery-lab

# Xóa container cũ nếu tồn tại
docker container rm -f redis-lab 2>/dev/null || true

# Khởi chạy Redis kèm giao diện đồ họa Redis Insight (Port 6379 cho Redis, Port 8001 cho Web GUI)
docker container run -d \
  --name redis-lab \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest

echo "⏳ Đang chờ Redis Server khởi động (3 giây)..."
sleep 3

# Kiểm tra kết nối bằng lệnh PING
docker container exec redis-lab redis-cli PING
echo "✅ Phòng Lab Redis đã sẵn sàng!"
echo "🌐 Giao diện trực quan Redis Insight đang chạy tại: http://localhost:8001"
```

---

# 📘 MODULE 01: KIẾN TRÚC CỐT LÕI — TẠI SAO REDIS NHANH ĐẾN VẬY & TƯ DUY KEYSPACE

> 🎯 **Mục tiêu:** Hiểu tận gốc cơ chế **Single-Threaded Event Loop + I/O Multiplexing**, quy chuẩn đặt tên Key trong doanh nghiệp, và tại sao câu lệnh `KEYS *` lại là "tử tội" trên môi trường Production.

## 1. Lý thuyết Chuyên sâu

### 1.1. Tại sao Redis chỉ dùng 1 luồng xử lý chính (Single-Threaded) mà đạt 100.000+ thao tác/giây?
Nhiều người thắc mắc: *"CPU hiện đại có 8 nhân, 16 nhân, tại sao Redis lại chỉ dùng 1 luồng (Single Thread) để thực thi lệnh?"*
Câu trả lời nằm ở **3 trụ cột kiến trúc**:

```
+-----------------------------------------------------------------------------------+
|                        CLIENT CONNECTIONS (Hàng chục ngàn kết nối)                |
|                    [Client 1]     [Client 2]     [Client 3] ... [Client N]        |
+-------------------------+--------------+--------------+---------------+-----------+
                          |              |              |               |
                          v              v              v               v
+-----------------------------------------------------------------------------------+
|  1. I/O MULTIPLEXING (epoll / kqueue)                                             |
|     Theo dõi hàng vạn socket cùng lúc, chỉ đẩy socket ĐÃ CÓ DỮ LIỆU vào hàng đợi  |
+-----------------------------------------+-----------------------------------------+
                                          | (Xếp hàng tuần tự - Không cần khóa Mutex)
                                          v
+-----------------------------------------------------------------------------------+
|  2. SINGLE-THREADED EVENT LOOP (Luồng thực thi chính duy nhất)                    |
|     - Chạy 100% trên RAM (Độ trễ ~100 nanoseconds so với ~10ms của ổ đĩa)         |
|     - Không tốn chi phí Context Switching (chuyển ngữ cảnh giữa các luồng CPU)    |
|     - Không bao giờ bị Deadlock hay Race Condition khi tranh chấp biến nội bộ     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|  3. CẤU TRÚC DỮ LIỆU TỐI ƯU CẤP THẤP (SDS, Ziplist/Listpack, SkipList, Dict)      |
+-----------------------------------------------------------------------------------+
```

1. **Thao tác hoàn toàn trên RAM (In-Memory):** Truy cập RAM chỉ mất khoảng $100\text{ ns}$ ($10^{-7}$ giây), nhanh hơn ổ cứng SSD thông thường từ $1.000$ đến $10.000$ lần. Nút cổ chai của Redis **không nằm ở CPU**, mà nằm ở băng thông mạng (Network I/O) và dung lượng RAM! *(Lưu ý: Từ Redis 6.0+, Redis đã dùng đa luồng — Threaded I/O — cho việc đọc/ghi dữ liệu mạng từ socket, nhưng bước **thực thi câu lệnh trên dữ liệu** vẫn giữ nguyên 1 luồng để đảm bảo tính nguyên tử).*
2. **I/O Multiplexing (`epoll` trên Linux / `kqueue` trên macOS):** Thay vì mỗi kết nối khách hàng phải tạo 1 thread ngồi chờ (ngốn RAM), Redis dùng cơ chế sự kiện của nhân hệ điều hành để lắng nghe hàng vạn kết nối cùng lúc và xếp các lệnh đã sẵn sàng vào một hàng đợi duy nhất.
3. **Không tốn chi phí Lock & Context Switch:** Vì chỉ có 1 luồng thực thi lệnh tại một thời điểm, mọi lệnh trong Redis đều có tính **Nguyên tử (Atomic)** tự nhiên. Lệnh A chạy xong 100% mới đến lệnh B.

### 1.2. Hệ quả sống còn: Điều gì xảy ra nếu 1 câu lệnh chạy mất 2 giây?
Vì Redis thực thi lệnh trên **1 luồng duy nhất**, nếu bạn gõ một câu lệnh nặng tốn $2$ giây (ví dụ: `KEYS *` quét qua 10 triệu key), **toàn bộ 99.999 câu lệnh khác của người dùng đang xếp hàng phía sau sẽ bị ĐỨNG HÌNH (Blocked) suốt 2 giây đó!** Hệ thống web của bạn sẽ bị treo dây chuyền.

### 1.3. Quy chuẩn đặt tên Key (Key Naming Convention) chuẩn Production
Trong Redis không có khái niệm "Bảng (Table)" như SQL. Để quản lý hàng triệu key khoa học và để công cụ như **Redis Insight** tự động gom nhóm thành cây thư mục đẹp mắt, các công ty luôn dùng dấu hai chấm `:` theo công thức:
$$\text{<tên\_dịch\_vụ>}:\text{<đối\_tượng>}:\text{<định\_danh\_ID>}:\text{<thuộc\_tính>}$$
* ❌ **Cách đặt tên tệ:** `user101`, `user_101_profile`, `cartForUser101`
* ✅ **Cách đặt tên chuẩn:**
  * `ecommerce:users:101:profile`
  * `ecommerce:users:101:cart`
  * `auth:otp:0987654321`

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Tạo dữ liệu theo chuẩn Naming Convention và đặt thời gian tự hủy (`EXPIRE` / `TTL`)

```bash
# Tạo 3 key theo chuẩn phân cấp bằng dấu ':' kèm thời gian sống (EX = Expire theo giây)
docker container exec redis-lab redis-cli SET ecommerce:users:101:name "Nguyen Van A"
docker container exec redis-lab redis-cli SET auth:otp:0987654321 "889922" EX 60

echo "=== 1. Lấy giá trị của Key ==="
docker container exec redis-lab redis-cli GET ecommerce:users:101:name

echo "=== 2. Kiểm tra thời gian sống còn lại (TTL - Time To Live) của mã OTP ==="
docker container exec redis-lab redis-cli TTL auth:otp:0987654321

echo "=== 3. Kiểm tra TTL của key không đặt hạn sử dụng (Kết quả -1 nghĩa là sống vĩnh viễn) ==="
docker container exec redis-lab redis-cli TTL ecommerce:users:101:name
```

> 💡 **Ghi nhớ 2 mã trả về đặc biệt của lệnh `TTL`:**
> * **`-1`:** Key có tồn tại nhưng **chưa được đặt thời gian hết hạn** (sẽ nằm mãi trong RAM cho đến khi bị xóa).
> * **`-2`:** Key **không tồn tại** (hoặc đã hết hạn và bị Redis tự động xóa mất rồi).

### Bước 2: Case Thực Tế — Tại sao CẤM DÙNG `KEYS *` trên Production và cách dùng `SCAN` thay thế
* **`KEYS pattern`:** Quét toàn bộ RAM trong **1 lần duy nhất** ($O(N)$). Nếu có 10 triệu key, Redis sẽ bị khóa cứng cho đến khi tìm xong.
* **`SCAN cursor [MATCH pattern] [COUNT n]`:** Duyệt qua các key **từng chùm nhỏ một** bằng con trỏ (cursor). Giữa mỗi lần `SCAN`, Redis vẫn phục vụ hàng nghìn lệnh của khách hàng khác bình thường! Khi nào `SCAN` trả về con trỏ mới là `"0"`, nghĩa là đã duyệt hết.

Hãy bấm `▶ Run` để tạo nhanh 100 key nháp và dùng `SCAN` để lấy ra các key thuộc phân hệ `auth:otp:*` một cách an toàn:

```bash
# 1. Nạp nhanh 50 key users và 5 key otp
for i in $(seq 1 50); do
  docker container exec redis-lab redis-cli SET "ecommerce:users:${i}:status" "online" > /dev/null
done
for i in $(seq 1 5); do
  docker container exec redis-lab redis-cli SET "auth:otp:user_${i}" "123456" EX 120 > /dev/null
done

echo "=== DÙNG LỆNH SCAN ĐỂ TÌM KEY AN TOÀN KHÔNG GÂY TREO SERVER ==="
# Bắt đầu từ con trỏ 0, lọc theo mẫu auth:otp:*, mỗi lần duyệt khoảng 20 phần tử
docker container exec redis-lab redis-cli SCAN 0 MATCH "auth:otp:*" COUNT 20
```

---

# 📘 MODULE 02: STRINGS & HASHES (KÈM TÍNH NĂNG MỚI `HEXPIRE` CỦA REDIS 7.4/8.x)

> 🎯 **Mục tiêu:** Làm chủ 2 kiểu dữ liệu phổ biến nhất (`String` & `Hash`), hiểu tại sao dùng `Hash` tiết kiệm RAM và băng thông hơn JSON String khi lưu Object, và thực hành lệnh mới **`HEXPIRE`** (hết hạn từng trường con trong Hash).

## 1. Lý thuyết Chuyên sâu & So sánh Kiến trúc

### 1.1. Khi nào dùng `String`, khi nào dùng `Hash` để lưu thông tin một Object (ví dụ: User / Product)?
Giả sử bạn cần lưu thông tin của User `101` gồm: `name`, `email`, `coins` (số xu trong ví), `last_login`. Bạn có 2 cách:

| Tiêu chí | Cách 1: Lưu chuỗi JSON vào `String` (`SET user:101 '{"name":"A","coins":50}'`) | Cách 2: Lưu vào `Hash` (`HSET user:101 name "A" coins 50`) |
| :--- | :--- | :--- |
| **Khi chỉ muốn cộng thêm 10 xu vào `coins`?** | Phải `GET` toàn bộ chuỗi JSON về Server $\rightarrow$ `JSON.parse()` $\rightarrow$ cộng 10 $\rightarrow$ `JSON.stringify()` $\rightarrow$ `SET` đè lại (Tốn mạng + Dễ bị **Race Condition** nếu 2 request chạy cùng lúc!). | Chỉ cần gọi đúng 1 lệnh nguyên tử: `HINCRBY user:101 coins 10` ngay trên RAM của Redis! |
| **Khi chỉ cần đọc mỗi `email`?** | Phải kéo cả cục JSON (có thể nặng vài chục KB) qua mạng. | Chỉ lấy đúng trường cần thiết: `HGET user:101 email`. |
| **Tối ưu bộ nhớ RAM** | Kém hơn khi có nhiều key nhỏ. | Cực kỳ tiết kiệm RAM nhờ cấu trúc nén **Listpack** (và **Compact Hashes** trong Redis 8). |
| **Đặt hạn sử dụng (TTL) cho từng trường con?** | Không thể. | **CÓ!** Từ **Redis 7.4+ và Redis 8**, bạn đã có `HEXPIRE` và `HTTL` để đặt thời gian tự hủy cho từng field bên trong Hash! |

---

## 2. Thực hành Tương tác (3 Case Thực Tế)

### Case 1 (Strings): Bộ đếm Lượt xem Bài viết & Chống bấm đúp (Idempotency Key với `SET ... NX EX`)
Lệnh `SET key value NX EX seconds` là một trong những lệnh quyền lực nhất của Redis:
* **`NX` (Not eXists):** Chỉ ghi thành công nếu key này **chưa tồn tại**. Nếu đã tồn tại, trả về `(nil)` ngay lập tức.
* **Ứng dụng thực tế:** Khi người dùng bấm nút "Thanh toán đơn hàng #999", mạng lag nên họ bấm liên tiếp 3 lần trong 1 giây. Backend dùng `SET payment_lock:order_999 "processing" NX EX 30` để đảm bảo chỉ có **cú click đầu tiên** được xử lý!

```bash
docker container exec redis-lab redis-cli DEL article:500:views payment_lock:order_999 > /dev/null

echo "=== 1. TĂNG LƯỢT XEM BÀI VIẾT BẰNG INCR & INCRBY (ATOMIC 100%) ==="
docker container exec redis-lab redis-cli INCR article:500:views
docker container exec redis-lab redis-cli INCR article:500:views
docker container exec redis-lab redis-cli INCRBY article:500:views 10
echo -n "Tổng lượt xem hiện tại: "
docker container exec redis-lab redis-cli GET article:500:views

echo ""
echo "=== 2. CHỐNG BẤM ĐÚP THANH TOÁN BẰNG SET ... NX EX ==="
echo -n "Request 1 (Cú click đầu tiên - Mong đợi OK): "
docker container exec redis-lab redis-cli SET payment_lock:order_999 "processing" NX EX 30

echo -n "Request 2 (Cú click đúp sau 0.1 giây - Mong đợi rỗng/nil): "
docker container exec redis-lab redis-cli SET payment_lock:order_999 "processing" NX EX 30
```

### Case 2 (Hashes): Quản lý Giỏ hàng Thương mại Điện tử (E-Commerce Shopping Cart)
Mỗi User có 1 giỏ hàng là một `Hash` có tên `cart:user:101`:
* Mỗi **Field** trong Hash là `product_id` (ví dụ: `iphone_16`, `airpods_pro`).
* Mỗi **Value** là số lượng sản phẩm đó.

```bash
docker container exec redis-lab redis-cli DEL cart:user:101 > /dev/null

echo "=== 1. Khách hàng thêm 2 chiếc iPhone 16 và 1 chiếc AirPods vào giỏ ==="
docker container exec redis-lab redis-cli HSET cart:user:101 iphone_16 2 airpods_pro 1

echo "=== 2. Khách hàng bấm nút (+) tăng thêm 1 chiếc iPhone 16 ==="
docker container exec redis-lab redis-cli HINCRBY cart:user:101 iphone_16 1

echo "=== 3. Đếm tổng số loại mặt hàng trong giỏ (HLEN) ==="
docker container exec redis-lab redis-cli HLEN cart:user:101

echo "=== 4. Xem toàn bộ giỏ hàng hiện tại (HGETALL) ==="
docker container exec redis-lab redis-cli HGETALL cart:user:101
```

### Case 3 (Tính năng mới Redis 7.4+ / Redis 8): Quản lý Phiên đăng nhập Đa thiết bị với `HEXPIRE` & `HTTL`
**Bài toán thực tế:** Một người dùng đăng nhập cùng lúc trên 3 thiết bị (`web_token`, `mobile_token`, `tv_token`) được lưu chung trong 1 Hash `sessions:user:101`. Bạn muốn:
* Phiên trên `mobile_token` sống được 30 ngày ($2.592.000$ giây).
* Nhưng phiên đăng nhập tạm trên `tv_token` (Smart TV ở khách sạn) **chỉ được sống 10 giây rồi tự động biến mất**, không làm ảnh hưởng tới `mobile_token`!

Trước đây Redis không làm được việc này trên 1 Hash, nhưng giờ đây với **`HEXPIRE key seconds FIELDS numfields field...`**, mọi thứ cực kỳ gọn gàng:

```bash
docker container exec redis-lab redis-cli DEL sessions:user:101 > /dev/null

# 1. Lưu cả 2 phiên đăng nhập vào cùng 1 Hash
docker container exec redis-lab redis-cli HSET sessions:user:101 \
  mobile_token "jwt_iphone_DaiHan" \
  tv_token "jwt_hotel_tv_TamThoi"

# 2. Đặt thời gian tự hủy CHỈ RIÊNG cho trường 'tv_token' là 3 giây (HEXPIRE)
echo "=== Đặt hạn sử dụng 3 giây cho riêng trường 'tv_token' bên trong Hash ==="
docker container exec redis-lab redis-cli HEXPIRE sessions:user:101 3 FIELDS 1 tv_token

echo "=== Kiểm tra HTTL (Hash Field TTL) của cả 2 trường ngay lập tức ==="
docker container exec redis-lab redis-cli HTTL sessions:user:101 FIELDS 2 mobile_token tv_token

echo "⏳ Chờ 4 giây để 'tv_token' tự động bốc hơi..."
sleep 4

echo "=== Kiểm tra lại toàn bộ Hash sau 4 giây (Chỉ còn lại mobile_token!) ==="
docker container exec redis-lab redis-cli HGETALL sessions:user:101
```

---

# 📘 MODULE 03: LISTS, SETS & SORTED SETS (`ZSET`)

> 🎯 **Mục tiêu:** Phân biệt rõ 3 kiểu tập hợp danh sách trong Redis và ứng dụng vào 3 bài toán kinh điển: **Hàng đợi công việc an toàn (`BLMOVE`)**, **Tìm bạn chung / Lọc trùng (`SINTER`)**, và **Bảng xếp hạng Game thời gian thực (`ZSET`)**.

## 1. Lý thuyết Chuyên sâu: So sánh `List` vs `Set` vs `Sorted Set`

| Kiểu dữ liệu | Đặc điểm cốt lõi | Độ phức tạp thêm/xóa | Khi nào nên dùng trong thực tế? |
| :--- | :--- | :--- | :--- |
| **`List`** | Danh sách liên kết hai đầu (Doubly Linked List), **cho phép trùng lặp**, giữ nguyên thứ tự đẩy vào. | $O(1)$ ở 2 đầu (`LPUSH`, `RPOP`), nhưng $O(N)$ nếu tìm ở giữa. | Hàng đợi tác vụ đơn giản (Background Job Queue), Lưu 20 hoạt động gần nhất (Timeline cắt gọn bằng `LTRIM`). |
| **`Set`** | Tập hợp các phần tử **KHÔNG trùng lặp**, không có thứ tự, hỗ trợ phép toán tập hợp (Giao, Hợp, Hiệu). | $O(1)$ cho thêm/xóa/kiểm tra tồn tại (`SADD`, `SISMEMBER`). | Lưu danh sách IP bị chặn, Đếm người đã Like bài viết, Tìm "Bạn chung" trên mạng xã hội (`SINTER`), Quay số trúng thưởng (`SRANDMEMBER`). |
| **`Sorted Set` (`ZSET`)** | Tập hợp **KHÔNG trùng lặp**, nhưng mỗi phần tử gắn kèm 1 điểm số **`score` (số thực `float64`)** và luôn tự động sắp xếp tăng dần/giảm dần theo `score` (dùng cấu trúc **SkipList + Hash Table**). | $O(\log N)$ — cực nhanh ngay cả khi có hàng triệu phần tử! | **Bảng xếp hạng (Leaderboard)**, Danh sách sản phẩm bán chạy nhất, Hệ thống **Sliding Window Rate Limiter**, Hàng đợi ưu tiên (Priority Queue). |

---

## 2. Thực hành Tương tác (3 Case Thực Tế)

### Case 1 (`List`): Lưu "5 lịch sử tìm kiếm gần nhất" (`LPUSH` + `LTRIM`) & Hàng đợi an toàn (`LMOVE`)
Khi bạn tìm kiếm trên Shopee/Tiki, ứng dụng chỉ giữ lại đúng 5 từ khóa mới nhất của bạn. Thay vì phải đếm trong Database rồi xóa bớt, trong Redis bạn chỉ cần đẩy vào đầu danh sách (`LPUSH`) rồi cắt lấy 5 phần tử đầu tiên từ vị trí `0` đến `4` (`LTRIM`):

```bash
docker container exec redis-lab redis-cli DEL search_history:user:101 > /dev/null

# Người dùng lần lượt tìm 7 từ khóa
for keyword in "ao_thun" "quan_jean" "giay_nike" "balo_laptop" "chuot_logitech" "ban_phim_co" "tai_nghe_sony"; do
  docker container exec redis-lab redis-cli LPUSH search_history:user:101 "$keyword" > /dev/null
  # Cắt giữ lại đúng 5 phần tử mới nhất (index từ 0 đến 4)
  docker container exec redis-lab redis-cli LTRIM search_history:user:101 0 4 > /dev/null
done

echo "=== 5 TỪ KHÓA TÌM KIẾM GẦN NHẤT CỦA USER 101 (Mới nhất ở trên cùng) ==="
docker container exec redis-lab redis-cli LRANGE search_history:user:101 0 -1
```

### Case 2 (`Set`): Tính năng "Gợi ý Bạn chung" trên Facebook/LinkedIn & Bốc thăm trúng thưởng
Giả sử User A có danh sách bạn bè lưu trong `friends:user:A` và User B có danh sách bạn bè lưu trong `friends:user:B`.

```bash
docker container exec redis-lab redis-cli DEL friends:user:A friends:user:B > /dev/null

# Thêm danh sách bạn bè của A và B (nếu thêm trùng Redis tự động bỏ qua)
docker container exec redis-lab redis-cli SADD friends:user:A "Nam" "Lan" "Hung" "Mai" "Tuan" > /dev/null
docker container exec redis-lab redis-cli SADD friends:user:B "Lan" "Tuan" "Kiet" "Thao" > /dev/null

echo "=== 1. Tìm BẠN CHUNG giữa A và B (SINTER - Phép Giao) ==="
docker container exec redis-lab redis-cli SINTER friends:user:A friends:user:B

echo "=== 2. Đếm SỐ LƯỢNG bạn chung mà không cần kéo danh sách về (SINTERCARD - Redis 7+) ==="
docker container exec redis-lab redis-cli SINTERCARD 2 friends:user:A friends:user:B

echo "=== 3. Những người là bạn của A nhưng CHƯA kết bạn với B (SDIFF - Gợi ý kết bạn cho B) ==="
docker container exec redis-lab redis-cli SDIFF friends:user:A friends:user:B
```

### Case 3 (`Sorted Set - ZSET`): Bảng xếp hạng Game / Đua Top Doanh số Realtime
Trong một giải đấu Game có hàng triệu người chơi:
* Khi người chơi thắng trận, điểm được cộng dồn bằng `ZINCRBY`.
* Lấy Top 3 người cao điểm nhất toàn server bằng `ZREVRANGE ... WITHSCORES` (chỉ mất $O(\log N)$!).
* Xem thứ hạng hiện tại của một người chơi bất kỳ bằng `ZREVRANK` (thứ hạng tính từ `0`, nên hạng `0` là Top 1).

```bash
docker container exec redis-lab redis-cli DEL leaderboard:season_1 > /dev/null

# 1. Khởi tạo điểm số cho 5 game thủ
docker container exec redis-lab redis-cli ZADD leaderboard:season_1 \
  1500 "Faker" \
  1200 "Levi" \
  1800 "SofM" \
  950  "Zeros" \
  1650 "Chovy" > /dev/null

# 2. Faker vừa thắng thêm 1 trận và được cộng 400 điểm
docker container exec redis-lab redis-cli ZINCRBY leaderboard:season_1 400 "Faker" > /dev/null

echo "=== 🏆 TOP 3 CAO THỦ ĐỨNG ĐẦU BẢNG XẾP HẠNG (Từ cao xuống thấp) ==="
docker container exec redis-lab redis-cli ZREVRANGE leaderboard:season_1 0 2 WITHSCORES

echo ""
echo "=== 🔍 KIỂM TRA THỨ HẠNG CỦA 'SofM' (0 là Hạng 1, 1 là Hạng 2...) ==="
rank=$(docker container exec redis-lab redis-cli ZREVRANK leaderboard:season_1 "SofM")
echo "SofM đang đứng ở vị trí index = $rank (Tức là Hạng $((rank + 1)) toàn server!)"
```

---

# 📘 MODULE 04: BITMAPS, HYPERLOGLOG & GEOSPATIAL — TIẾT KIỆM RAM CỰC ĐẠI & BẢN ĐỒ SỐ

> 🎯 **Mục tiêu:** Giải quyết các bài toán dữ liệu lớn (Big Data) với lượng RAM nhỏ đến khó tin bằng `Bitmaps` và `HyperLogLog`, đồng thời xây dựng tính năng **"Tìm tài xế / Cửa hàng gần bạn nhất"** bằng `Geospatial`.

## 1. Lý thuyết Chuyên sâu

### 1.1. `Bitmaps`: Khi mỗi trạng thái Đúng/Sai (`0` hoặc `1`) chỉ tốn đúng 1 Bit!
* Một chuỗi `String` trong Redis thực chất là một mảng các byte nhị phân. Với các lệnh `SETBIT`, `GETBIT`, `BITCOUNT`, `BITOP`, bạn có thể bật/tắt từng bit riêng lẻ ở vị trí `offset` bất kỳ.
* **Bài toán kinh điển:** Giả sử bạn muốn lưu lịch sử **Điểm danh hàng ngày trong 1 năm (365 ngày)** của 10 triệu người dùng.
  * Nếu lưu trong SQL hoặc Set thông thường: Tốn hàng chục Gigabyte RAM.
  * Nếu dùng **Bitmap** cho mỗi user (`attendance:2026:user:101`), ngày thứ $N$ trong năm tương ứng với bit thứ $N$: $365\text{ bits} \approx 46\text{ Bytes}$! Cả năm điểm danh của 1 người chưa tốn nổi 50 Bytes!

### 1.2. `HyperLogLog`: Đếm hàng trăm triệu lượt truy cập duy nhất (Unique Visitors) chỉ với 12 KB RAM!
* **Bài toán:** Bạn cần đếm xem hôm nay trang chủ có bao nhiêu địa chỉ IP **khác nhau** (Unique IPs) truy cập.
* Nếu dùng `Set` (`SADD`) để lưu 100 triệu địa chỉ IP: Bạn mất hơn **3.2 GB RAM** chỉ cho 1 ngày!
* Nếu dùng **`HyperLogLog`** (`PFADD`, `PFCOUNT`): Thuật toán xác suất giúp bạn đếm tới $2^{64}$ phần tử không trùng lặp mà **dung lượng tối đa luôn cố định ở mức 12 KB RAM**, với sai số chuẩn chỉ $0.81\%$!

### 1.3. `Geospatial`: Tìm kiếm theo Tọa độ Kinh độ / Vĩ độ (Grab, Uber, ShopeeFood)
* Bên dưới lớp vỏ, kiểu `GEO` của Redis thực chất được lưu trữ trong một **`Sorted Set (ZSET)`**, trong đó tọa độ `(Kinh độ, Vĩ độ)` được mã hóa thành một số nguyên 52-bit gọi là **Geohash** làm điểm `score`!
* Nhờ vậy, Redis có thể quét tìm tất cả các tài xế hoặc quán ăn nằm trong bán kính $3\text{ km}$ quanh vị trí của bạn chỉ trong vài mili-giây bằng lệnh `GEOSEARCH`.

---

## 2. Thực hành Tương tác (3 Case Thực Tế)

### Case 1 (`Bitmaps`): Điểm danh nhận thưởng & Kiểm tra số ngày online trong năm

```bash
docker container exec redis-lab redis-cli DEL attendance:2026:user:101 > /dev/null

# Giả sử User 101 điểm danh vào ngày thứ 1, ngày thứ 2, ngày thứ 5 và ngày thứ 100 trong năm
docker container exec redis-lab redis-cli SETBIT attendance:2026:user:101 1 1 > /dev/null
docker container exec redis-lab redis-cli SETBIT attendance:2026:user:101 2 1 > /dev/null
docker container exec redis-lab redis-cli SETBIT attendance:2026:user:101 5 1 > /dev/null
docker container exec redis-lab redis-cli SETBIT attendance:2026:user:101 100 1 > /dev/null

echo -n "Kiểm tra Ngày thứ 5 User 101 có điểm danh không (1=Có, 0=Không): "
docker container exec redis-lab redis-cli GETBIT attendance:2026:user:101 5

echo -n "Kiểm tra Ngày thứ 6 User 101 có điểm danh không (1=Có, 0=Không): "
docker container exec redis-lab redis-cli GETBIT attendance:2026:user:101 6

echo -n "Tổng số ngày User 101 đã điểm danh trong cả năm (BITCOUNT): "
docker container exec redis-lab redis-cli BITCOUNT attendance:2026:user:101
```

### Case 2 (`HyperLogLog`): Đếm Unique Visitors truy cập Website

```bash
docker container exec redis-lab redis-cli DEL uv:homepage:2026-10-16 > /dev/null

# Thêm các IP truy cập (cố tình lặp lại IP 1.1.1.1 nhiều lần)
docker container exec redis-lab redis-cli PFADD uv:homepage:2026-10-16 \
  "1.1.1.1" "8.8.8.8" "1.1.1.1" "9.9.9.9" "1.1.1.1" "14.161.22.1" > /dev/null

echo -n "Số lượng IP duy nhất (Unique Visitors) đã truy cập hôm nay: "
docker container exec redis-lab redis-cli PFCOUNT uv:homepage:2026-10-16
```

### Case 3 (`Geospatial`): Tìm tài xế Grab quanh Hồ Gươm (Hà Nội) trong bán kính 3km
> ⚠️ **Lưu ý thứ tự tọa độ trong Redis:** Luôn luôn là **`Kinh độ (Longitude)` trước, `Vĩ độ (Latitude)` sau**! (Ví dụ Hà Nội: Kinh độ `~105.8`, Vĩ độ `~21.0`).

```bash
docker container exec redis-lab redis-cli DEL drivers:hanoi > /dev/null

# 1. Cập nhật vị trí hiện tại của 4 tài xế tại Hà Nội (GEOADD key kinh_độ vĩ_độ tên_tài_xế)
docker container exec redis-lab redis-cli GEOADD drivers:hanoi \
  105.8525 21.0285 "TaiXe_HoGuom" \
  105.8412 21.0368 "TaiXe_LangBac" \
  105.8342 21.0031 "TaiXe_BachKhoa" \
  105.7821 21.0288 "TaiXe_MyDinh_Xa" > /dev/null

echo "=== 1. Tính khoảng cách chim bay từ Hồ Gươm đến Lăng Bác (km) ==="
docker container exec redis-lab redis-cli GEODIST drivers:hanoi "TaiXe_HoGuom" "TaiXe_LangBac" km

echo ""
echo "=== 2. Khách đứng ở Nhà Hát Lớn (105.8576, 21.0244) tìm tài xế trong bán kính 4km, xếp từ gần đến xa ==="
docker container exec redis-lab redis-cli GEOSEARCH drivers:hanoi \
  FROMLONLAT 105.8576 21.0244 \
  BYRADIUS 4 km \
  ASC \
  WITHDIST \
  WITHCOORD
```

**Quan sát kết quả:** Tài xế ở Mỹ Đình (`TaiXe_MyDinh_Xa`) cách hơn $7.8\text{ km}$ đã tự động bị loại ra khỏi danh sách, còn 3 tài xế gần nhất được trả về kèm khoảng cách chính xác từng mét!

---

# 📘 MODULE 05: CHIẾN LƯỢC CACHING & CÁCH CHỐNG 3 "THẢM HỌA" PRODUCTION

> 🎯 **Mục tiêu:** Nắm vững mô hình **Cache-Aside**, và biết cách phòng chống 3 sự cố kinh điển làm sập Database trong các cuộc phỏng vấn Senior Backend: **Cache Penetration**, **Cache Stampede (Breakdown)** và **Cache Avalanche**.

## 1. Lý thuyết Chuyên sâu: Giải phẫu 3 Thảm họa Caching

```
+---------------------------------------------------------------------------------------------------+
| 1. CACHE PENETRATION (Xuyên thủng Cache)                                                          |
|    Hacker cố tình gọi: GET /products?id=-999999 (ID không hề tồn tại trong cả Redis lẫn Database) |
|    -> Redis Miss -> Chọc thẳng vào DB -> DB tìm không thấy nên không lưu vào Cache -> Lặp lại!    |
|    🛡️ GIẢI PHÁP:                                                                                  |
|       a) Cache cả giá trị rỗng ("NULL") với TTL ngắn (30s - 60s).                                 |
|       b) Dùng màng lọc BLOOM FILTER (BF.EXISTS): Chặn đứng ngay tại cửa nếu ID chưa từng tồn tại! |
+---------------------------------------------------------------------------------------------------+
| 2. CACHE STAMPEDE / BREAKDOWN (Giẫm đạp Cache / Hot Key hết hạn)                                  |
|    1 Key cực kỳ hot (VD: iPhone Flash Sale) vừa hết hạn TTL đúng lúc có 50.000 người cùng truy cập|
|    -> Cả 50.000 request cùng thấy Cache Miss -> Cùng lao vào query Database một lúc -> Sập DB!    |
|    🛡️ GIẢI PHÁP:                                                                                  |
|       Dùng Mutex Lock (SET lock:product:1 NX EX 5): Chỉ cho ĐÚNG 1 request vào DB lấy dữ liệu     |
|       và nạp lại vào Redis, 49.999 request còn lại chờ 50ms rồi đọc từ Redis.                     |
+---------------------------------------------------------------------------------------------------+
| 3. CACHE AVALANCHE (Lở tuyết Cache)                                                               |
|    Bạn nạp 100.000 sản phẩm vào Cache lúc 00:00 và đặt chung TTL = 3600s.                         |
|    Đúng 01:00:00, cả 100.000 key đồng loạt bốc hơi cùng 1 giây -> Mọi request đổ dồn vào DB!      |
|    🛡️ GIẢI PHÁP:                                                                                  |
|       Luôn cộng thêm một số ngẫu nhiên vào TTL (TTL Jitter): TTL = 3600 + random(0, 600) giây.    |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Thực hành Tương tác: Dùng `Bloom Filter` (`BF.ADD` / `BF.EXISTS`) chống Cache Penetration

Trong Redis 8 (và Redis Stack), cấu trúc **`Bloom Filter`** cho phép bạn kiểm tra một phần tử **"Chắc chắn 100% KHÔNG tồn tại"** hoặc **"Có khả năng tồn tại"** chỉ với vài bit bộ nhớ.
Hãy bấm `▶ Run` để xem cách dùng Bloom Filter làm lá chắn bảo vệ Database trước các cuộc tấn công quét ID rác:

```bash
docker container exec redis-lab redis-cli DEL bf:valid_products > /dev/null

# 1. Khởi tạo Bloom Filter với tỷ lệ sai số 1% (0.01) và sức chứa dự kiến 10.000 sản phẩm
docker container exec redis-lab redis-cli BF.RESERVE bf:valid_products 0.01 10000 > /dev/null

# 2. Khi tạo sản phẩm mới trong Database, ta đăng ký ID của chúng vào Bloom Filter
docker container exec redis-lab redis-cli BF.MADD bf:valid_products "prod_101" "prod_102" "prod_103" > /dev/null

echo "=== 1. Khách hàng hỏi sản phẩm hợp lệ 'prod_101' (Kết quả 1 -> Cho phép tìm tiếp trong Cache/DB) ==="
docker container exec redis-lab redis-cli BF.EXISTS bf:valid_products "prod_101"

echo "=== 2. Hacker tấn công bằng ID ảo 'prod_9999999' (Kết quả 0 -> CHẶN ĐỨNG NGAY, không chạm vào DB!) ==="
docker container exec redis-lab redis-cli BF.EXISTS bf:valid_products "prod_9999999"
```

---

# 📘 MODULE 06: ATOMICITY, PIPELINING & LUA SCRIPTING — FLASH SALE & RATE LIMITING

> 🎯 **Mục tiêu:** Hiểu sự khác biệt giữa **Pipelining** (tăng tốc mạng), **Transactions (`MULTI`/`EXEC`)**, và **Lua Script (`EVAL`)**. Tự tay viết một đoạn Lua Script giải quyết bài toán **Flash Sale chống bán lố (Overselling)** và **Rate Limiter chống Spam API**.

## 1. Lý thuyết Chuyên sâu

### 1.1. Tại sao `GET` rồi mới `DECR` trong code Backend lại gây âm kho (Overselling) khi chạy Flash Sale?
Hãy xem đoạn code giả (pseudo-code) mà rất nhiều lập trình viên mới hay viết khi làm chức năng mua hàng:
```ts
// ❌ CÁCH VIẾT SAI NGHIÊM TRỌNG KHI CÓ NHIỀU NGƯỜI MUA CÙNG LÚC:
const stock = await redis.get('flashsale:iphone:stock'); // Bước 1: Đọc tồn kho (Giả sử còn 1 chiếc)
if (Number(stock) > 0) {
  await redis.decr('flashsale:iphone:stock');            // Bước 2: Trừ tồn kho
  await createOrder();
}
```
**Tại sao lại sai?**
* Giả sử trong kho chỉ còn **đúng 1 chiếc iPhone**.
* Cùng một mili-giây, cả **User A** và **User B** cùng chạy **Bước 1 (`GET`)** $\rightarrow$ Cả hai đều nhận được kết quả `stock = 1`!
* Sau đó cả hai cùng vượt qua câu lệnh `if (stock > 0)` và cùng chạy **Bước 2 (`DECR`)** $\rightarrow$ Tồn kho bị trừ xuống `-1` và bạn bán 2 chiếc iPhone trong khi kho chỉ có 1 chiếc!

### 1.2. Giải pháp tối thượng: Nhúng **Lua Script (`EVAL`)** chạy nguyên tử ngay bên trong Redis!
Khi bạn gửi một kịch bản **Lua Script** vào Redis bằng lệnh `EVAL`:
* Redis cam kết **thực thi toàn bộ đoạn script đó từ đầu đến cuối như một lệnh duy nhất (Atomic 100%)**.
* Không một lệnh nào của bất kỳ client nào khác có thể chen ngang vào giữa bước `GET` kiểm tra và bước `DECR` trừ kho!

---

## 2. Thực hành Tương tác (2 Case Thực Chiến Cực Hay)

### Case 1: Giải bài toán Flash Sale Trừ Tồn Kho bằng Lua Script (Không bao giờ bị âm kho!)
Trong thí nghiệm dưới đây, kho chỉ có **3 chiếc iPhone**, nhưng có **6 khách hàng** lao vào mua liên tiếp. Hãy xem Lua Script bảo vệ kho hàng như thế nào:

```bash
# 1. Đặt số lượng tồn kho ban đầu là 3 chiếc
docker container exec redis-lab redis-cli SET flashsale:iphone16:stock 3 > /dev/null
docker container exec redis-lab redis-cli DEL flashsale:iphone16:buyers > /dev/null

# 2. Nội dung Lua Script kiểm tra và trừ kho nguyên tử:
# KEYS[1]: Key chứa số lượng tồn kho
# KEYS[2]: Set lưu danh sách những người đã mua (chống 1 người mua 2 lần)
# ARGV[1]: Số lượng muốn mua
# ARGV[2]: ID của khách hàng
LUA_FLASH_SALE='
  -- Kiểm tra xem khách hàng này đã mua trước đó chưa
  if redis.call("SISMEMBER", KEYS[2], ARGV[2]) == 1 then
    return -1 -- Mã -1: Mỗi người chỉ được mua 1 lần!
  end

  local current_stock = tonumber(redis.call("GET", KEYS[1]) or "0")
  local buy_qty = tonumber(ARGV[1])

  if current_stock >= buy_qty then
    redis.call("DECRBY", KEYS[1], buy_qty)
    redis.call("SADD", KEYS[2], ARGV[2])
    return 1 -- Mã 1: Đặt hàng thành công!
  else
    return 0 -- Mã 0: Đã hết hàng!
  end
'

echo "=== BẮT ĐẦU MỞ BÁN FLASH SALE (Tồn kho chỉ có 3 chiếc) ==="
for user in "User_1" "User_2" "User_1" "User_3" "User_4" "User_5"; do
  result=$(docker container exec redis-lab redis-cli EVAL "$LUA_FLASH_SALE" 2 flashsale:iphone16:stock flashsale:iphone16:buyers 1 "$user")
  if [ "$result" -eq 1 ]; then
    echo "✅ [$user] Mua THÀNH CÔNG!"
  elif [ "$result" -eq -1 ]; then
    echo "🚫 [$user] Bị từ chối: Bạn đã mua sản phẩm này rồi (Chống đầu cơ)!"
  else
    echo "❌ [$user] Rất tiếc: Sản phẩm đã HẾT HÀNG!"
  fi
done

echo ""
echo -n "📦 Số lượng tồn kho còn lại sau Flash Sale (Cam kết không bao giờ âm): "
docker container exec redis-lab redis-cli GET flashsale:iphone16:stock
echo "👥 Danh sách khách hàng săn sale thành công:"
docker container exec redis-lab redis-cli SMEMBERS flashsale:iphone16:buyers
```

### Case 2: Xây dựng API Rate Limiter (Giới hạn tối đa 3 requests / 10 giây cho mỗi IP)
Để chống DDoS hoặc brute-force mật khẩu, ta dùng Lua Script kết hợp `INCR` và `EXPIRE`:

```bash
docker container exec redis-lab redis-cli DEL ratelimit:ip:203.113.1.1 > /dev/null

LUA_RATE_LIMIT='
  local current = redis.call("INCR", KEYS[1])
  if current == 1 then
    redis.call("EXPIRE", KEYS[1], tonumber(ARGV[2]))
  end
  if current > tonumber(ARGV[1]) then
    return 0 -- Vượt quá giới hạn (HTTP 429 Too Many Requests)
  end
  return 1   -- Cho phép đi qua (HTTP 200 OK)
'

echo "=== KIỂM TRA RATE LIMITER (Tối đa 3 requests trong 10 giây) ==="
for req in 1 2 3 4 5; do
  allowed=$(docker container exec redis-lab redis-cli EVAL "$LUA_RATE_LIMIT" 1 ratelimit:ip:203.113.1.1 3 10)
  if [ "$allowed" -eq 1 ]; then
    echo "🟢 Request #$req: HTTP 200 OK (Được phép truy cập)"
  else
    echo "🔴 Request #$req: HTTP 429 Too Many Requests (Bị chặn do gọi quá nhanh!)"
  fi
done
```

---

# 📘 MODULE 07: DISTRIBUTED LOCKS (KHÓA PHÂN TÁN) CHUẨN PRODUCTION

> 🎯 **Mục tiêu:** Hiểu tại sao các khóa trong bộ nhớ (`Mutex`/`Semaphore` của từng ngôn ngữ) vô dụng khi bạn chạy nhiều container Backend, và cách cài đặt **Distributed Lock** an toàn tuyệt đối (kèm cơ chế chống mở nhầm khóa của tiến trình khác).

## 1. Lý thuyết Chuyên sâu: Cạm bẫy kinh điển khi mở khóa (Unlock)

Giả sử bạn có 3 container NestJS cùng chạy. Để đảm bảo tại một thời điểm chỉ có 1 container được xử lý ví tiền của `user_101`, bạn tạo một khóa phân tán trong Redis:
$$\text{SET } \texttt{lock:wallet:101} \text{ } \texttt{<unique\_random\_token>} \text{ NX PX 5000}$$

### Tại sao giá trị của Lock bắt buộc phải là một chuỗi ngẫu nhiên duy nhất (`unique_random_token`) và phải mở khóa bằng Lua Script?
Hãy tưởng tượng kịch bản thảm họa sau nếu bạn chỉ dùng lệnh `DEL lock:wallet:101` để mở khóa:
1. **Server A** lấy được khóa `lock:wallet:101` với thời gian sống $5$ giây.
2. Do mạng tới ngân hàng bị chậm, **Server A** xử lý mất tới $6$ giây.
3. Ở giây thứ $5$, khóa của **Server A** tự động hết hạn! **Server B** nhảy vào và lấy được khóa `lock:wallet:101`.
4. Ở giây thứ $6$, **Server A** xử lý xong và hồn nhiên gọi lệnh `DEL lock:wallet:101` $\rightarrow$ **Server A vô tình XÓA MẤT KHÓA ĐANG HỢP LỆ CỦA SERVER B!**

🛡️ **Quy tắc vàng trong tài liệu chính thức của Redis:**
Chỉ người nào tạo ra khóa (có mã `token` khớp với giá trị đang lưu trong Redis) mới được phép xóa khóa đó bằng Lua Script nguyên tử:
```lua
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

---

## 2. Thực hành Tương tác: Mô phỏng Server A và Server B tranh chấp Khóa Phân Tán

```bash
docker container exec redis-lab redis-cli DEL lock:wallet:101 > /dev/null

LUA_SAFE_UNLOCK='
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
'

echo "=== 1. Server A xin cấp khóa với mã định danh 'token_server_A' (TTL 30 giây) ==="
docker container exec redis-lab redis-cli SET lock:wallet:101 "token_server_A" NX PX 30000

echo "=== 2. Server B cố gắng xin cấp khóa cùng lúc (Mong đợi bị từ chối / nil) ==="
docker container exec redis-lab redis-cli SET lock:wallet:101 "token_server_B" NX PX 30000

echo "=== 3. Server B cố tình gọi hàm Unlock để phá khóa của Server A (Mong đợi = 0 / Thất bại) ==="
docker container exec redis-lab redis-cli EVAL "$LUA_SAFE_UNLOCK" 1 lock:wallet:101 "token_server_B"

echo "=== 4. Chính chủ Server A gọi hàm Unlock sau khi xử lý xong (Mong đợi = 1 / Thành công) ==="
docker container exec redis-lab redis-cli EVAL "$LUA_SAFE_UNLOCK" 1 lock:wallet:101 "token_server_A"
```

---

# 📘 MODULE 08: KIẾN TRÚC HƯỚNG SỰ KIỆN — PUB/SUB VS REDIS STREAMS

> 🎯 **Mục tiêu:** Phân biệt khi nào dùng **Pub/Sub** và khi nào bắt buộc phải dùng **Redis Streams** (với Consumer Groups `XGROUP`, `XREADGROUP`, `XACK`) để làm Message Broker tương tự Apache Kafka / RabbitMQ.

## 1. Lý thuyết Chuyên sâu: Tại sao Pub/Sub không thể dùng cho Xử lý Đơn hàng?

| Tiêu chí | Redis Pub/Sub (`PUBLISH` / `SUBSCRIBE`) | Redis Streams (`XADD` / `XREADGROUP` / `XACK`) |
| :--- | :--- | :--- |
| **Cơ chế gửi tin** | *Fire-and-Forget* (Bắn rồi quên). | *Append-only Log* (Lưu bền vững vào bộ nhớ/đĩa). |
| **Nếu người nhận (Subscriber) bị mất mạng 5 giây?** | **MẤT SẠCH** toàn bộ tin nhắn được gửi trong 5 giây đó! | Tin nhắn vẫn nằm nguyên trong Stream, khi kết nối lại sẽ đọc tiếp từ vị trí dừng. |
| **Cơ chế xác nhận (ACK)** | Không có. Không biết client đã xử lý thành công hay bị crash. | Có **Pending Entries List (PEL)**. Phải gọi `XACK` mới tính là xong; nếu worker chết, worker khác cướp lại việc bằng `XAUTOCLAIM`. |
| **Phân tải (Load Balancing)** | Gửi bản sao cho TẤT CẢ người nghe (Fan-out). | Hỗ trợ **Consumer Groups**: Chia đều 100 đơn hàng cho 5 Worker xử lý song song! |

---

## 2. Thực hành Tương tác: Xử lý Đơn hàng bằng Redis Streams & Consumer Groups

Hãy bấm `▶ Run` để trải nghiệm toàn bộ vòng đời của một hệ thống **Message Queue** thực thụ bằng Redis Streams:

```bash
docker container exec redis-lab redis-cli DEL stream:orders > /dev/null

# 1. Tạo Consumer Group tên là 'order_workers' lắng nghe trên 'stream:orders' từ đầu (0)
docker container exec redis-lab redis-cli XGROUP CREATE stream:orders order_workers 0 MKSTREAM

echo "=== 1. Dịch vụ Checkout đẩy 2 đơn hàng mới vào Stream (XADD) ==="
id1=$(docker container exec redis-lab redis-cli XADD stream:orders "*" orderId "ORD_101" amount "500000")
id2=$(docker container exec redis-lab redis-cli XADD stream:orders "*" orderId "ORD_102" amount "1200000")
echo "Đã tạo sự kiện đơn hàng với Stream ID: $id1 và $id2"

echo ""
echo "=== 2. Worker_1 nhận 1 đơn hàng về xử lý (XREADGROUP với ký hiệu '>') ==="
docker container exec redis-lab redis-cli XREADGROUP GROUP order_workers Worker_1 COUNT 1 STREAMS stream:orders ">"

echo ""
echo "=== 3. Worker_2 nhận đơn hàng tiếp theo về xử lý (Chia tải tự động!) ==="
docker container exec redis-lab redis-cli XREADGROUP GROUP order_workers Worker_2 COUNT 1 STREAMS stream:orders ">"

echo ""
echo "=== 4. Kiểm tra danh sách việc đang xử lý dở (XPENDING - Chưa gọi XACK) ==="
docker container exec redis-lab redis-cli XPENDING stream:orders order_workers

echo ""
echo "=== 5. Worker_1 và Worker_2 báo cáo đã xử lý xong (XACK) ==="
docker container exec redis-lab redis-cli XACK stream:orders order_workers "$id1" "$id2"

echo "=== 6. Kiểm tra lại XPENDING sau khi đã ACK (Số lượng về 0!) ==="
docker container exec redis-lab redis-cli XPENDING stream:orders order_workers
```

---

# 📘 MODULE 09: REDIS 8 HIỆN ĐẠI — `RedisJSON`, `RediSearch` & `Vector Sets` CHO AI/RAG

> 🎯 **Mục tiêu:** Biến Redis từ một bộ nhớ đệm đơn thuần thành một **Document Database + Full-Text Search Engine + Vector Database cho AI** theo đúng chuẩn Redis hiện đại nhất.

## 1. Lý thuyết Chuyên sâu

1. **`RedisJSON` (`JSON.SET`, `JSON.GET`, `JSON.NUMINCRBY`):** Lưu tài liệu JSON dạng cây nhị phân trong RAM. Bạn có thể cập nhật 1 trường nằm sâu ở tầng thứ 5 trong JSON bằng biểu thức **JSONPath (`$.a.b.c`)** mà không cần đọc cả tài liệu ra.
2. **`RediSearch / Redis Query Engine` (`FT.CREATE`, `FT.SEARCH`):** Đánh chỉ mục (Secondary Index) trực tiếp lên các `Hash` hoặc `JSON` trong Redis. Cho phép bạn viết câu lệnh tìm kiếm phức tạp như SQL (`WHERE price BETWEEN 100 AND 500 AND category = 'laptop'`) với tốc độ tính bằng micro-giây!
3. **Tìm kiếm Vector cho AI & Hệ thống Gợi ý (Vector Similarity Search):**
   * Các mô hình AI (như OpenAI, Gemini) biến văn bản/hình ảnh thành một mảng các con số thực gọi là **Vector Embedding** (ví dụ: `[0.12, -0.45, 0.88]`).
   * Trong **Redis 8**, bạn có kiểu dữ liệu gốc **`Vector Sets`** (`VADD`, `VSIM`) hoặc Vector Index trong `FT.CREATE` giúp tìm ra các bài viết/sản phẩm có ngữ nghĩa gần giống nhất với câu hỏi của người dùng (trái tim của kiến trúc **RAG - Retrieval-Augmented Generation**).

---

## 2. Thực hành Tương tác (Bấm `▶ Run` từng bước)

### Bước 1: Thao tác `RedisJSON` và Tìm kiếm Toàn văn (`FT.CREATE` + `FT.SEARCH`)

```bash
# Xóa index và dữ liệu cũ nếu có
docker container exec redis-lab redis-cli FT.DROPINDEX idx:products DD 2>/dev/null || true

echo "=== 1. Tạo Index tìm kiếm tự động trên các tài liệu JSON có tiền tố 'product:' ==="
docker container exec redis-lab redis-cli FT.CREATE idx:products \
  ON JSON PREFIX 1 "product:" \
  SCHEMA \
    $.name AS name TEXT \
    $.brand AS brand TAG \
    $.price AS price NUMERIC SORTABLE

echo "=== 2. Lưu 3 sản phẩm dưới dạng JSON nguyên bản (JSON.SET) ==="
docker container exec redis-lab redis-cli JSON.SET product:1 $ '{"name":"MacBook Pro M4 Max","brand":"Apple","price":3500,"stock":{"hanoi":10,"hcm":5}}' > /dev/null
docker container exec redis-lab redis-cli JSON.SET product:2 $ '{"name":"MacBook Air M3","brand":"Apple","price":1200,"stock":{"hanoi":20,"hcm":15}}' > /dev/null
docker container exec redis-lab redis-cli JSON.SET product:3 $ '{"name":"Dell XPS 15 OLED","brand":"Dell","price":1800,"stock":{"hanoi":4,"hcm":2}}' > /dev/null

echo "=== 3. Tăng trực tiếp số lượng tồn kho tại Hà Nội của product:1 thêm 5 chiếc (JSON.NUMINCRBY) ==="
docker container exec redis-lab redis-cli JSON.NUMINCRBY product:1 $.stock.hanoi 5

echo ""
echo "=== 4. TRUY VẤN PHỨC TẠP BẰNG FT.SEARCH: Tìm Laptop hãng 'Apple' có giá từ 1000$ đến 2000$ ==="
docker container exec redis-lab redis-cli FT.SEARCH idx:products "@brand:{Apple} @price:[1000 2000]" RETURN 2 name price
```

### Bước 2: Tìm kiếm Tương đồng Vector (AI Semantic Search / Recommendation)
Giả sử chúng ta biểu diễn mỗi bộ phim bằng một vector đặc trưng 3 chiều `[Hành_động, Tình_cảm, Khoa_học_viễn_tưởng]`. Hãy xem cách Redis tìm ra bộ phim có nội dung tương đồng nhất với sở thích của người dùng:

```bash
# Kiểm tra xem phiên bản image hiện tại có hỗ trợ lệnh VADD (Redis 8 Native Vector Set) không,
# hoặc sử dụng Vector Search tích hợp sẵn:
if docker container exec redis-lab redis-cli COMMAND INFO VADD | grep -q -i "vadd"; then
  echo "🚀 Sử dụng Native Vector Sets (VADD / VSIM của Redis 8):"
  docker container exec redis-lab redis-cli DEL movies:vectors > /dev/null
  docker container exec redis-lab redis-cli VADD movies:vectors VALUES 3 0.9 0.1 0.8 "Interstellar" SETATTR '{"genre":"Sci-Fi"}' > /dev/null
  docker container exec redis-lab redis-cli VADD movies:vectors VALUES 3 0.85 0.15 0.9 "Inception" SETATTR '{"genre":"Sci-Fi"}' > /dev/null
  docker container exec redis-lab redis-cli VADD movies:vectors VALUES 3 0.1 0.95 0.05 "Titanic" SETATTR '{"genre":"Romance"}' > /dev/null

  echo "=== Tìm bộ phim giống với 'Interstellar' nhất ==="
  docker container exec redis-lab redis-cli VSIM movies:vectors ELE "Interstellar" WITHSCORES WITHATTRIBS
else
  echo "🚀 Minh họa Vector Similarity Search trên RediSearch Engine:"
  docker container exec redis-lab redis-cli FT.DROPINDEX idx:movies_vec DD 2>/dev/null || true
  docker container exec redis-lab redis-cli FT.CREATE idx:movies_vec ON JSON PREFIX 1 "movie:" \
    SCHEMA $.title AS title TEXT $.embedding AS vector VECTOR FLAT 6 TYPE FLOAT32 DIM 3 DISTANCE_METRIC COSINE > /dev/null

  docker container exec redis-lab redis-cli JSON.SET movie:1 $ '{"title":"Interstellar (Sci-Fi)","embedding":[0.9, 0.1, 0.8]}' > /dev/null
  docker container exec redis-lab redis-cli JSON.SET movie:2 $ '{"title":"Inception (Sci-Fi)","embedding":[0.85, 0.15, 0.9]}' > /dev/null
  docker container exec redis-lab redis-cli JSON.SET movie:3 $ '{"title":"Titanic (Romance)","embedding":[0.1, 0.95, 0.05]}' > /dev/null

  echo "✅ Đã tạo Vector Index 3 chiều với khoảng cách COSINE cho 3 bộ phim:"
  docker container exec redis-lab redis-cli FT.INFO idx:movies_vec | head -n 14
fi
```

---

# 📘 MODULE 10: LƯU TRỮ BỀN VỮNG (PERSISTENCE: RDB vs AOF) & CHÍNH SÁCH TRÀN RAM (EVICTION)

> 🎯 **Mục tiêu:** Trả lời câu hỏi phỏng vấn kinh điển: *"Redis lưu trên RAM, vậy rút dây điện Server thì có mất sạch dữ liệu không?"* và cách cấu hình `maxmemory-policy` khi RAM đầy.

## 1. Lý thuyết Chuyên sâu

### 1.1. Hai cơ chế chống mất dữ liệu khi sập nguồn của Redis: `RDB` vs `AOF`

| Tiêu chí | **RDB (Redis Database Snapshot)** | **AOF (Append-Only File)** | **Hybrid (RDB + AOF — Khuyên dùng)** |
| :--- | :--- | :--- | :--- |
| **Cách hoạt động** | Định kỳ (VD: mỗi 5 phút nếu có >100 thay đổi) chụp ảnh toàn bộ RAM nén thành 1 file nhị phân `dump.rdb`. | Ghi nhật ký **từng câu lệnh làm thay đổi dữ liệu** (`SET`, `INCR`...) vào cuối file `appendonly.aof`. | Khi file AOF quá dài và cần viết gọn lại (`BGREWRITEAOF`), phần đầu file là bản nén RDB, phần đuôi là các lệnh AOF mới phát sinh. |
| **Tốc độ khôi phục khi bật lại máy** | **Rất nhanh** (Vì chỉ nạp thẳng file nhị phân nén vào RAM). | **Chậm hơn** (Vì phải chạy lại từng câu lệnh từ đầu đến cuối). | **Nhanh như RDB!** |
| **Rủi ro mất dữ liệu khi cúp điện** | Có thể mất dữ liệu trong **5–15 phút cuối** kể từ lần chụp gần nhất. | Với chế độ `appendfsync everysec` (mặc định), chỉ mất tối đa **1 giây dữ liệu cuối cùng**. | **An toàn như AOF (chỉ mất tối đa 1 giây)!** |

> 💡 **Cơ chế `BGSAVE` không làm treo Redis:** Khi chụp ảnh RDB, Redis gọi hàm hệ thống `fork()` của Linux để tạo một tiến trình con (Child Process). Nhờ cơ chế **Copy-on-Write (CoW)** của nhân Linux, tiến trình con ghi dữ liệu ra ổ cứng hoàn toàn độc lập trong khi tiến trình chính vẫn tiếp tục phục vụ khách hàng bình thường!

### 1.2. Chuyện gì xảy ra khi RAM của Redis bị đầy? (`maxmemory-policy`)
Khi dung lượng dữ liệu chạm ngưỡng `maxmemory`, Redis sẽ hành xử theo chính sách bạn chọn:
1. **`noeviction` (Mặc định):** Không xóa bất kỳ key nào, nhưng **trả về lỗi `OOM command not allowed`** cho mọi lệnh ghi mới (`SET`, `LPUSH`...). Dùng khi Redis đóng vai trò là Database chính không được phép mất dữ liệu.
2. **`allkeys-lru` / `allkeys-lfu` (Phổ biến nhất khi làm Cache):** Tự động xóa các key ít được dùng gần đây nhất (**LRU - Least Recently Used**) hoặc ít được truy cập nhất (**LFU - Least Frequently Used**) trên toàn bộ các key để nhường chỗ cho dữ liệu mới.
3. **`volatile-lru` / `volatile-lfu` / `volatile-ttl`:** Chỉ xóa những key **có đặt thời gian hết hạn (`EXPIRE`)**, tuyệt đối không đụng vào các key vĩnh viễn (như cấu hình hệ thống).

---

## 2. Thực hành Tương tác: Cấu hình trực tiếp Persistence & Eviction bằng `CONFIG GET / SET`

```bash
echo "=== 1. Kiểm tra cấu hình lưu trữ (RDB / AOF) hiện tại của Redis ==="
docker container exec redis-lab redis-cli CONFIG GET "save"
docker container exec redis-lab redis-cli CONFIG GET "appendonly"

echo ""
echo "=== 2. Chủ động yêu cầu Redis chụp ảnh Snapshot RDB chạy ngầm ngay lập tức (BGSAVE) ==="
docker container exec redis-lab redis-cli BGSAVE
docker container exec redis-lab redis-cli LASTSAVE

echo ""
echo "=== 3. Thiết lập giới hạn RAM tối đa 256MB và chính sách 'allkeys-lfu' không cần khởi động lại ==="
docker container exec redis-lab redis-cli CONFIG SET maxmemory 256mb
docker container exec redis-lab redis-cli CONFIG SET maxmemory-policy allkeys-lfu
docker container exec redis-lab redis-cli CONFIG GET "maxmemory*"
```

---

# 📘 MODULE 11: BẢO MẬT (ACL), BẮT BỆNH PRODUCTION (`SLOWLOG`, `BIGKEYS`, `MEMORY`)

> 🎯 **Mục tiêu:** Bảo vệ Redis trên Production bằng **ACL (Access Control List)** từ Redis 6+, biết cách tìm thủ phạm làm chậm server bằng `SLOWLOG` và dò tìm các Key phình to bất thường (`--bigkeys`).

## 1. Lý thuyết Chuyên sâu

### 1.1. Tại sao không bao giờ được dùng tài khoản `default` không mật khẩu trên Production?
Nếu cổng `6379` bị lộ ra Internet hoặc một microservice bị hack, kẻ tấn công (hoặc một lập trình viên tập sự gõ nhầm) chỉ cần chạy lệnh `FLUSHALL` là toàn bộ dữ liệu của công ty bay màu trong $0.01$ giây!
Với **Redis ACL (`ACL SETUSER`)**, bạn có thể tạo tài khoản riêng cho từng microservice:
* Chỉ được phép đọc/ghi trên các key có tiền tố `~ecommerce:*`.
* Chỉ được chạy nhóm lệnh `@read` và `@write`, **cấm tuyệt đối nhóm lệnh nguy hiểm `-@dangerous`** (bao gồm `FLUSHALL`, `FLUSHDB`, `KEYS`, `CONFIG`, `SHUTDOWN`).

---

## 2. Thực hành Tương tác: Tạo User bị giới hạn quyền & Bắt bệnh Hiệu năng

```bash
echo "=== 1. Tạo tài khoản 'nestjs_app' chỉ được chạm vào key 'ecommerce:*' và CẤM lệnh nguy hiểm ==="
docker container exec redis-lab redis-cli ACL SETUSER nestjs_app on \
  >MatKhauSieuManh123 \
  ~ecommerce:* \
  +@read +@write -@dangerous

echo "=== 2. Kiểm tra danh sách quyền của 'nestjs_app' ==="
docker container exec redis-lab redis-cli ACL GETUSER nestjs_app | head -n 12

echo ""
echo "=== 3. Kiểm tra dung lượng RAM chính xác (tính bằng Bytes) của 1 Key bằng MEMORY USAGE ==="
docker container exec redis-lab redis-cli MEMORY USAGE leaderboard:season_1

echo ""
echo "=== 4. Xem 5 câu lệnh chạy chậm nhất gần đây trong hệ thống bằng SLOWLOG GET ==="
docker container exec redis-lab redis-cli SLOWLOG GET 5

echo ""
echo "=== 5. Quét toàn bộ Redis để tìm ra các Key nặng nhất (Big Keys) một cách an toàn ==="
docker container exec redis-lab redis-cli --bigkeys
```

---

# 📘 MODULE 12: HIGH AVAILABILITY (MASTER-REPLICA, SENTINEL, CLUSTER) & TÍCH HỢP NESTJS

> 🎯 **Mục tiêu:** Hiểu kiến trúc **Master-Replica + Redis Sentinel** (tự động bầu chọn Master mới khi Master cũ chết), giải mã bài toán **`CROSSSLOT` và `{Hash Tag}` trong Redis Cluster (16384 Hash Slots)**, và chạy một ứng dụng Node.js/NestJS kết nối thực tế.

## 1. Lý thuyết Chuyên sâu: Làm sao để Redis không bao giờ chết (Zero Downtime)?

```
                 +-----------------------------------------------+
                 |      NHÓM GIÁM SÁT: REDIS SENTINEL (Số lẻ)    |
                 |   [Sentinel 1]   [Sentinel 2]   [Sentinel 3]  |
                 |  (Liên tục PING kiểm tra sức khỏe của Master) |
                 +-----------------------+-----------------------+
                                         | Nếu Master chết -> Bầu chọn (Quorum)
                                         v Replica 1 lên làm Master mới!
                           +---------------------------+
         Ghi (Write) ----> |       REDIS MASTER        |
                           +-------------+-------------+
                                         | Sao chép bất đồng bộ (Async Replication)
                        +----------------+----------------+
                        v                                 v
          +---------------------------+     +---------------------------+
          |      REDIS REPLICA 1      |     |      REDIS REPLICA 2      |
          +---------------------------+     +---------------------------+
                        ^                                 ^
                        +----------------+----------------+
                                         |
                                 Đọc (Read Scaling)
```

### 1.1. Phân biệt `Redis Sentinel` và `Redis Cluster`
1. **Master-Replica + Redis Sentinel (Khi dữ liệu của bạn vừa đủ trong RAM của 1 máy chủ, VD < 32GB):**
   * **Master** nhận mọi lệnh Ghi (`SET`, `HSET`), các **Replica** nhận bản sao dữ liệu để phục vụ lệnh Đọc (`GET`).
   * Dàn **Sentinel** (luôn triển khai số lẻ: 3 hoặc 5 node) đứng canh gác. Nếu Master bị sập, các Sentinel bỏ phiếu bầu (**Quorum**) và tự động thăng cấp 1 Replica lên làm Master mới trong vài giây!
2. **Redis Cluster (Khi dữ liệu quá lớn > 64GB hoặc cần chia tải Ghi ra nhiều máy chủ):**
   * Redis Cluster chia không gian dữ liệu thành **16.384 Hash Slots** (từ `0` đến `16383`).
   * Mỗi khi bạn gửi một `key`, Redis tính công thức:
     $$\text{Hash\_Slot} = \text{CRC16}(\text{key}) \pmod{16384}$$
   * **Node Master 1** giữ slot `0 -> 5460`, **Node Master 2** giữ slot `5461 -> 10922`, **Node Master 3** giữ slot `10923 -> 16383`.

> ⚠️ **Cạm bẫy kinh điển trên Redis Cluster (`CROSSSLOT Keys in request don't hash to the same slot`):**
> Trên Redis Cluster, nếu bạn chạy lệnh thao tác trên nhiều key cùng lúc (như `MGET`, `SINTER`, hoặc **Lua Script** truyền 2 key `cart:user:101` và `order:user:101`), lệnh sẽ **BÁO LỖI NGAY LẬP TỨC** vì 2 key này rơi vào 2 Hash Slot trên 2 máy chủ khác nhau!
> 🛡️ **Cách giải quyết bằng `{Hash Tag}`:** Chỉ cần bọc phần định danh chung vào trong cặp ngoặc nhọn `{...}`, ví dụ:
> * `cart:{user:101}` và `order:{user:101}`
> * Khi thấy cặp `{...}`, Redis Cluster **chỉ lấy chuỗi bên trong ngoặc nhọn (`user:101`) để băm `CRC16`**, đảm bảo cả 2 key luôn nằm chung trên đúng 1 máy chủ!

---

## 2. Thực hành Tương tác

### Bước 1: Kiểm tra quy tắc `{Hash Tag}` định tuyến vào cùng 1 Hash Slot (`CLUSTER KEYSLOT`)
Dù đang chạy 1 node, bạn vẫn có thể dùng lệnh `CLUSTER KEYSLOT` để tận mắt chứng kiến cách `{Hash Tag}` gom các key liên quan về chung 1 Slot:

```bash
echo "=== 1. Khi KHÔNG dùng {Hash Tag}: 2 key của cùng User 101 bị văng ra 2 Slot khác nhau! ==="
echo -n "Slot của 'cart:user:101':  "
docker container exec redis-lab redis-cli CLUSTER KEYSLOT "cart:user:101"
echo -n "Slot của 'order:user:101': "
docker container exec redis-lab redis-cli CLUSTER KEYSLOT "order:user:101"

echo ""
echo "=== 2. Khi DÙNG {Hash Tag}: Cả 2 key luôn rơi vào CÙNG MỘT HASH SLOT tuyệt đối! ==="
echo -n "Slot của 'cart:{user:101}':  "
docker container exec redis-lab redis-cli CLUSTER KEYSLOT "cart:{user:101}"
echo -n "Slot của 'order:{user:101}': "
docker container exec redis-lab redis-cli CLUSTER KEYSLOT "order:{user:101}"
```

### Bước 2: Chạy ứng dụng Node.js/TypeScript thực chiến kết nối với Redis (Cache-Aside + Pipelining)
Ô lệnh dưới đây sẽ tạo và chạy một kịch bản Node.js kết nối trực tiếp vào `redis-lab`, minh họa chuẩn **Cache-Aside Pattern (kèm TTL Jitter chống Cache Avalanche)** để bạn áp dụng ngay vào dự án NestJS của mình:

```bash
cat << 'EOF' > redis-mastery-lab/redis-client-demo.mjs
import net from 'net';

// Hàm gửi lệnh RESP đơn giản tới Redis Lab để không cần cài npm package ngoài
function sendRedisCommand(cmdArray) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host: '127.0.0.1', port: 6379 }, () => {
      let resp = `*${cmdArray.length}\r\n`;
      for (const arg of cmdArray) {
        const str = String(arg);
        resp += `$${Buffer.byteLength(str)}\r\n${str}\r\n`;
      }
      client.write(resp);
    });
    client.on('data', (data) => {
      client.end();
      resolve(data.toString().trim());
    });
    client.on('error', reject);
  });
}

async function getProductWithCacheAside(productId) {
  const cacheKey = `ecommerce:products:${productId}`;
  console.log(`\n🔍 [Request] Đang tìm sản phẩm ${productId}...`);

  // Bước 1: Kiểm tra trong Redis trước
  const cached = await sendRedisCommand(['GET', cacheKey]);
  if (!cached.startsWith('$-1')) {
    console.log(`⚡ [CACHE HIT] Lấy ngay từ Redis trong 0.5ms:`, cached.split('\r\n')[1]);
    return;
  }

  // Bước 2: Cache Miss -> Giả lập truy vấn Database mất 300ms
  console.log(`🐢 [CACHE MISS] Không có trong Redis, đang truy vấn PostgreSQL (300ms)...`);
  await new Promise((r) => setTimeout(r, 300));
  const dbData = JSON.stringify({ id: productId, name: 'iPhone 16 Pro Max', price: 1199 });

  // Bước 3: Lưu vào Redis với TTL Jitter (300s + ngẫu nhiên 0..60s để chống Cache Avalanche!)
  const ttlWithJitter = 300 + Math.floor(Math.random() * 60);
  await sendRedisCommand(['SET', cacheKey, dbData, 'EX', ttlWithJitter]);
  console.log(`💾 Đã nạp vào Redis với TTL Jitter = ${ttlWithJitter} giây.`);
}

await sendRedisCommand(['DEL', 'ecommerce:products:999']);
await getProductWithCacheAside(999); // Lần 1: Cache Miss
await getProductWithCacheAside(999); // Lần 2: Cache Hit cực nhanh!
EOF

node redis-mastery-lab/redis-client-demo.mjs
```

---

# 🧹 TRẠM DỌN DẸP PHÒNG LAB (AN TOÀN 100% CHO MÁY CHÍNH)

Khi bạn đã học xong hoặc muốn trả lại trạng thái sạch bong cho máy tính (xóa container `redis-lab` và thư mục nháp `redis-mastery-lab`), chỉ cần bấm **`▶ Run`** ở ô dưới đây:

```bash
docker container rm -f redis-lab 2>/dev/null || true
rm -rf redis-mastery-lab
echo "✨ Đã tắt container Redis và dọn dẹp sạch sẽ 100% phòng Lab!"
```