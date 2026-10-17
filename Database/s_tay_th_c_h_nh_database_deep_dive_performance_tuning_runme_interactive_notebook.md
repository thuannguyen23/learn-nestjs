# 🐘 DATABASE DEEP DIVE & PERFORMANCE TUNING: TỪ BEGINNER ĐẾN MASTER (RUNME NOTEBOOK)

> **Cuốn sách thực hành chuyên sâu dành cho Backend Developer & System Architect (Cập nhật chuẩn PostgreSQL 17 & 18).**
> Đa số lập trình viên chỉ dừng ở việc gọi hàm ORM như `prisma.orders.findMany()` hay `repo.save()`. Nhưng khi bảng dữ liệu cán mốc **vài triệu bản ghi** hoặc có **hàng trăm giao dịch tài chính cùng lúc**, mọi nút cổ chai làm sập hệ thống đều nằm ở tầng Database.
>
> Mở file này bằng extension **Runme** trên VS Code và bấm **`▶ Run`** ở từng khối lệnh. Bạn sẽ trực tiếp khởi tạo **1.000.000 bản ghi thực tế**, đọc bệnh án `EXPLAIN (ANALYZE, BUFFERS)`, phá giải các bẫy đánh Index, tái hiện lỗi mất tiền do Race Condition, thực hành khóa `FOR UPDATE SKIP LOCKED`, chia bảng (Partitioning) và cấu hình `PgBouncer` mà **không làm bẩn 1% nào máy tính cá nhân của bạn**.

---

## 🗺️ BẢN ĐỒ LỘ TRÌNH 10 MODULES CHUYÊN SÂU (BEGINNER $\rightarrow$ DATABASE ARCHITECT)

| Module | Chủ đề cốt lõi | Case Study & Thực nghiệm Thực tế |
| :--- | :--- | :--- |
| **Module 00** | **Lab Setup & Bơm 1.000.000 Bản ghi** | Dựng PostgreSQL 17 + `pg_stat_statements` + Adminer GUI & sinh 1 triệu đơn hàng trong 3 giây |
| **Module 01** | **Kiến trúc Lưu trữ, MVCC & VACUUM** | Giải phẫu 8KB Page, Heap, tại sao `UPDATE` là `DELETE + INSERT`, Dead Tuples & `HOT Update` |
| **Module 02** | **Đọc hiểu `EXPLAIN (ANALYZE, BUFFERS)`** | Mổ xẻ `Seq Scan` vs `Bitmap Heap Scan` vs `Index Scan` vs `Index Only Scan` (Từ `250ms` xuống `0.05ms`) |
| **Module 03** | **Bẫy Đánh Index & Quy tắc Leftmost Prefix** | Tại sao đánh Index `(status, created_at)` mà query vẫn chậm? Thứ tự cột `=` vs `>`, `UUIDv4` vs `UUIDv7` |
| **Module 04** | **Các Loại Index Vũ Khí Hạng Nặng** | `Covering Index (INCLUDE)`, `Partial Index (WHERE)`, `GIN Index (JSONB)` & `BRIN Index` (Giảm 99% RAM) |
| **Module 05** | **Giải thuật JOIN & Tối ưu ORM (Prisma/TypeORM)** | `Nested Loop` vs `Hash Join` vs `Merge Join`, Bẫy phân trang `OFFSET 500000` & **Keyset Pagination** |
| **Module 06** | **Transactions, Isolation Levels & Race Conditions** | Tái hiện lỗi **Lost Update** (Rút tiền âm ví) & **Write Skew**; so sánh `Read Committed` vs `Repeatable Read` |
| **Module 07** | **Locking Thực Chiến: Pessimistic vs Optimistic** | Chống trừ tiền đúp với `FOR UPDATE`, Đặt vé/Chia việc siêu tốc với `SKIP LOCKED`, `version` & chống **Deadlock** |
| **Module 08** | **Database Partitioning (Chia Để Trị)** | Chia nhỏ bảng Lịch sử Giao dịch hàng chục triệu dòng theo tháng (`RANGE`), kiểm chứng **Partition Pruning** |
| **Module 09** | **Connection Pooling (`PgBouncer`) & DBA Tuning** | Giải cứu lỗi *"Too many connections"*, tinh chỉnh `shared_buffers`, `work_mem` & bắt bệnh bằng `pg_stat_statements` |

---

# 🚀 MODULE 00: KHỞI TẠO PHÒNG LAB & BƠM 1.000.000 DÒNG DỮ LIỆU THẬT

> 🎯 **Mục tiêu:** Khởi chạy một container PostgreSQL được bật sẵn bộ theo dõi truy vấn chậm (`pg_stat_statements`), tạo cấu trúc bảng Thương mại điện tử / Ví điện tử và bơm sẵn **1.000.000 đơn hàng** để mọi bài đo hiệu năng phía sau đều phản ánh đúng thực tế Production.

### Tại sao học Database Tuning bắt buộc phải thử trên hàng triệu dòng?
Nếu bảng của bạn chỉ có $100$ dòng, PostgreSQL sẽ **luôn luôn chọn quét toàn bộ bảng (`Sequential Scan`)** kể cả khi bạn đã tạo Index! Lý do là vì cả 100 dòng đó nằm gọn trong đúng 1 trang bộ nhớ ($8\text{ KB}$), đọc 1 phát hết luôn còn nhanh hơn phải mở cây Index ra tra cứu. Chỉ khi bảng có từ hàng trăm nghìn đến hàng triệu dòng, bạn mới thấy rõ sự chênh lệch một trời một vực giữa câu lệnh tối ưu ($0.05\text{ ms}$) và câu lệnh tồi ($300\text{ ms} - 3.500\text{ ms}$).

👉 **Bấm `▶ Run` bên dưới để dựng Phòng Lab và nạp 1.000.000 bản ghi (chỉ mất khoảng 5–8 giây):**

```bash
set -e
mkdir -p postgres-mastery-lab

# Dọn dẹp container cũ nếu đã tồn tại
docker container rm -f pg-mastery-lab 2>/dev/null || true

# Khởi chạy PostgreSQL 17 kèm cấu hình bật sẵn pg_stat_statements để bắt lệnh chậm
docker container run -d \
  --name pg-mastery-lab \
  -e POSTGRES_USER=master \
  -e POSTGRES_PASSWORD=secret123 \
  -e POSTGRES_DB=ecommerce_prod \
  -p 5433:5432 \
  postgres:17-alpine \
  postgres -c shared_preload_libraries=pg_stat_statements \
           -c pg_stat_statements.track=all \
           -c max_connections=200

echo "⏳ Đang chờ PostgreSQL khởi động hoàn tất..."
until docker container exec pg-mastery-lab pg_isready -U master -d ecommerce_prod > /dev/null 2>&1; do
  sleep 1
done

echo "🏗️ Đang khởi tạo Schema và bơm 1.000.000 đơn hàng mẫu..."
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 1. Bảng Ví tiền (Dùng cho bài thực hành Transaction & Locking ở Module 06, 07)
DROP TABLE IF EXISTS wallets CASCADE;
CREATE TABLE wallets (
    id INT PRIMARY KEY,
    owner_name VARCHAR(100) NOT NULL,
    balance BIGINT NOT NULL CHECK (balance >= 0),
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO wallets (id, owner_name, balance, version) VALUES
(1, 'Nguyen Van A', 1000000, 1),
(2, 'Tran Thi B',   1000000, 1);

-- 2. Bảng Ghế Rạp Phim / Hàng đợi việc làm (Dùng cho bài FOR UPDATE SKIP LOCKED)
DROP TABLE IF EXISTS cinema_seats CASCADE;
CREATE TABLE cinema_seats (
    seat_number VARCHAR(10) PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, BOOKED
    booked_by VARCHAR(50)
);

INSERT INTO cinema_seats (seat_number, status)
SELECT 'A-' || i, 'AVAILABLE' FROM generate_series(1, 20) AS i;

-- 3. Bảng Đơn hàng 1.000.000 dòng (Dùng cho bài EXPLAIN ANALYZE & Indexing)
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    metadata JSONB NOT NULL
);

-- Bơm 1.000.000 dòng dữ liệu giả lập sát thực tế:
-- 90% đơn là COMPLETED, 9% là CANCELLED, chỉ có 1% là PENDING
INSERT INTO orders (user_id, status, total_amount, created_at, metadata)
SELECT
    (random() * 50000 + 1)::INT AS user_id,
    CASE
        WHEN i % 100 = 0 THEN 'PENDING'
        WHEN i % 10 = 0  THEN 'CANCELLED'
        ELSE 'COMPLETED'
    END AS status,
    (random() * 5000 + 100)::INT * 1000 AS total_amount,
    TIMESTAMPTZ '2026-01-01 00:00:00+07' + (i || ' seconds')::INTERVAL AS created_at,
    jsonb_build_object(
        'brand', (ARRAY['Apple', 'Samsung', 'Sony', 'Dell', 'Xiaomi'])[1 + (i % 5)],
        'payment_method', (ARRAY['VNPAY', 'MOMO', 'COD', 'CREDIT_CARD'])[1 + (i % 4)],
        'flash_sale', (i % 500 = 0)
    ) AS metadata
FROM generate_series(1, 1000000) AS i;

-- Cập nhật thống kê cho Query Planner
ANALYZE orders;
EOF

echo "✅ Phòng Lab đã sẵn sàng! Kiểm tra dung lượng bảng 'orders' (1.000.000 dòng):"
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
SELECT
    relname AS table_name,
    reltuples::BIGINT AS estimated_rows,
    pg_size_pretty(pg_total_relation_size(oid)) AS total_size,
    pg_size_pretty(pg_relation_size(oid)) AS heap_table_size
FROM pg_class WHERE relname = 'orders';
"
```

---

# 📘 MODULE 01: GIẢI PHẪU KIẾN TRÚC LƯU TRỮ (8KB PAGES, HEAP, MVCC & VACUUM)

> 🎯 **Mục tiêu:** Hiểu dữ liệu thực sự nằm trên ổ cứng và RAM như thế nào. Tại sao trong PostgreSQL, lệnh `UPDATE` thực chất là tạo ra một dòng mới tinh trên ổ cứng chứ không sửa đè lên chỗ cũ?

## 1. Lý thuyết Chuyên sâu: Bên dưới mặt đất của một bảng dữ liệu

### 1.1. Heap File và Đơn vị trang nhớ $8\text{ KB}$ (8KB Page / Block)
Khi bạn tạo bảng `orders`, PostgreSQL lưu dữ liệu của bảng vào các file vật lý gọi là **Heap**. Mỗi file Heap này được chia thành các ô vuông bằng nhau, mỗi ô nặng đúng **$8\text{ KB}$ ($8192\text{ Bytes}$)** gọi là một **Page** (hay **Block**).

```
+-----------------------------------------------------------------------+
|                     MỘT TRANG NHỚ (8KB PAGE / BLOCK)                  |
+-----------------------------------------------------------------------+
| PAGE HEADER (24 Bytes): Thông tin kiểm tra lỗi (Checksum), LSN, ...   |
+-----------------------------------------------------------------------+
| LINE POINTERS (Mảng con trỏ): [lp_1] -> [lp_2] -> [lp_3] ...          |
| (Mọc từ TRÊN XUỐNG DƯỚI -> Chỉ vào vị trí chính xác của từng dòng)    |
+-----------------------------------------------------------------------+
|                                  |                                    |
|                                  v                                    |
|                         KHOẢNG TRỐNG (FREE SPACE)                     |
|                                  ^                                    |
|                                  |                                    |
| (Mọc từ DƯỚI LÊN TRÊN)                                                |
| ... [Tuple 3 (Dòng 3)]  [Tuple 2 (Dòng 2)]  [Tuple 1 (Dòng 1)]        |
+-----------------------------------------------------------------------+
```

* **Tại sao con số $8\text{ KB}$ này cực kỳ quan trọng khi đọc `EXPLAIN (BUFFERS)`?**
  Vì PostgreSQL **không bao giờ đọc lẻ 1 dòng** từ ổ cứng! Dù bạn chỉ `SELECT` 1 dòng nặng $100\text{ Bytes}$, PostgreSQL vẫn phải kéo **cả trang $8\text{ KB}$** chứa dòng đó từ ổ đĩa lên vùng nhớ đệm RAM (**Shared Buffers**).
* Do đó, nếu câu lệnh của bạn báo `Buffers: shared read=1000`, bạn lấy ngay $1000 \times 8\text{ KB} = 8.000\text{ KB}$ ($\approx 8\text{ MB}$) dữ liệu vừa bị kéo từ ổ đĩa!

### 1.2. Cơ chế MVCC (Multi-Version Concurrency Control): Tại sao đọc không bao giờ chặn ghi?
Trong các hệ quản trị cơ sở dữ liệu cổ điển, khi Người A đang `UPDATE` một dòng, Người B vào `SELECT` dòng đó sẽ bị treo (phải đứng chờ Người A xong).
PostgreSQL giải quyết bài toán này bằng **MVCC (Kiểm soát đồng thời đa phiên bản)**:
* Mỗi dòng dữ liệu (gọi là **Tuple**) có 3 cột ẩn mà bình thường `SELECT *` không hiện ra:
  1. **`ctid`:** Tọa độ vật lý của dòng đó theo định dạng `(Số_thứ_tự_Page, Vị_trí_trong_Page)`. Ví dụ `(0, 1)` là dòng thứ 1 nằm ở trang số 0.
  2. **`xmin`:** Mã giao dịch (Transaction ID) đã **tạo ra (`INSERT`)** phiên bản dòng này.
  3. **`xmax`:** Mã giao dịch đã **xóa hoặc cập nhật (`DELETE`/`UPDATE`)** dòng này. Nếu dòng đang sống khỏe mạnh, `xmax = 0`.
* **Sự thật gây sốc về lệnh `UPDATE` trong PostgreSQL:**
  Khi bạn chạy `UPDATE wallets SET balance = 500 WHERE id = 1`:
  * PostgreSQL **KHÔNG sửa đè** số `500` lên dòng cũ!
  * Thay vào đó, nó đánh dấu dòng cũ là đã hết hạn bằng cách điền mã giao dịch hiện tại vào cột `xmax` của dòng cũ (biến dòng cũ thành **Dead Tuple** — xác dòng chết), đồng thời **chèn (`INSERT`) một dòng mới tinh** chứa `balance = 500` vào vị trí mới!

```
TRƯỚC KHI UPDATE:
  Tuple 1 tại ctid=(0,1): [id=1, balance=1000000] | xmin=700 | xmax=0 (Đang sống)

SAU KHI CHẠY LỆNH UPDATE (Ở Transaction ID = 705):
  Tuple 1 tại ctid=(0,1): [id=1, balance=1000000] | xmin=700 | xmax=705 (DEAD TUPLE - Xác dòng cũ)
  Tuple 2 tại ctid=(0,3): [id=1, balance=500000 ] | xmin=705 | xmax=0   (LIVE TUPLE - Dòng mới đang sống)
```

### 1.3. Hệ quả: Hiện tượng Phình Bảng (Table Bloat), `VACUUM` và `HOT Update`
* **Tại sao giữ lại dòng cũ (`Tuple 1`)?** Để nếu có một giao dịch khác bắt đầu từ lúc `txid = 701` đang chạy báo cáo dở dang, nó vẫn nhìn thấy giá trị cũ (`1000000`) một cách nhất quán mà không bị lệnh `UPDATE` của bạn làm sai lệch!
* **Nhưng khi mọi giao dịch cũ đã kết thúc thì sao?** Lúc này `Tuple 1` trở thành rác (**Dead Tuple**). Nếu bạn `UPDATE` 1 dòng $100.000$ lần mà không dọn rác, bảng có đúng 1 dòng nhưng lại phình to hàng trăm MB vì chứa $99.999$ xác dòng chết!
* **Tiến trình `VACUUM` (và `Autovacuum`):** Định kỳ đi quét các **Dead Tuples** và đánh dấu vùng nhớ đó là "Trống — Có thể ghi đè dòng mới vào". *(Lưu ý: `VACUUM` thông thường không trả lại dung lượng ổ cứng cho hệ điều hành mà giữ lại bên trong Page để tái sử dụng cho các lần `INSERT`/`UPDATE` tiếp theo, tránh phân mảnh đĩa).*

---

## 2. Thực hành Tương tác: Tận mắt nhìn thấy `ctid`, `xmin`, `xmax` và Dead Tuples

👉 **Bấm `▶ Run` để soi các cột ẩn vật lý của bảng `wallets` trước và sau khi `UPDATE`:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off

SELECT '=== 1. TRƯỚC KHI UPDATE: Xem tọa độ vật lý (ctid) và xmin/xmax ===' AS step;
SELECT ctid, xmin, xmax, id, owner_name, balance FROM wallets WHERE id = 1;

-- Thực hiện UPDATE 3 lần liên tiếp trên cùng dòng id = 1
UPDATE wallets SET balance = balance - 10000 WHERE id = 1;
UPDATE wallets SET balance = balance - 10000 WHERE id = 1;
UPDATE wallets SET balance = balance - 10000 WHERE id = 1;

SELECT '=== 2. SAU 3 LẦN UPDATE: Quan sát ctid đã nhảy sang vị trí mới! ===' AS step;
SELECT ctid, xmin, xmax, id, owner_name, balance FROM wallets WHERE id = 1;

SELECT '=== 3. KIỂM TRA SỐ LƯỢNG XÁC DÒNG CHẾT (n_dead_tup) TRONG BẢNG WALLETS ===' AS step;
SELECT relname, n_live_tup AS so_dong_song, n_dead_tup AS so_xac_dong_chet
FROM pg_stat_user_tables WHERE relname = 'wallets';

-- Chạy VACUUM ANALYZE để dọn dẹp Dead Tuples
VACUUM ANALYZE wallets;

SELECT '=== 4. SAU KHI CHẠY VACUUM: Xác dòng chết (n_dead_tup) đã về 0! ===' AS step;
SELECT relname, n_live_tup AS so_dong_song, n_dead_tup AS so_xac_dong_chet
FROM pg_stat_user_tables WHERE relname = 'wallets';
EOF
```

**Giải thích kết quả bạn vừa thấy:**
1. Ban đầu dòng `id = 1` nằm ở tọa độ `ctid = (0,1)`.
2. Sau 3 lần `UPDATE`, dòng `id = 1` đã nhảy sang tọa độ `ctid = (0,5)` và sinh ra `n_dead_tup = 3` (3 xác dòng cũ nằm lại trên trang nhớ!).
3. Ngay khi chạy `VACUUM ANALYZE wallets`, `n_dead_tup` lập tức được dọn sạch về `0`!

---

# 📘 MODULE 02: ĐỌC HIỂU `EXPLAIN (ANALYZE, BUFFERS)` — PHẪU THUẬT KẾ HOẠCH THỰC THI

> 🎯 **Mục tiêu:** Nhìn vào kết quả `EXPLAIN (ANALYZE, BUFFERS)` là đọc vị được ngay tại sao câu lệnh SQL chạy chậm và biến nó từ **`Sequential Scan` (\~200ms)** thành **`Index Only Scan` (\~0.05ms — nhanh hơn gấp 4.000 lần!)**.

## 1. Lý thuyết Chuyên sâu: Cách đọc bản chụp X-Quang của SQL

### 1.1. Sự khác biệt giữa `EXPLAIN` và `EXPLAIN (ANALYZE, BUFFERS)`
* **`EXPLAIN <câu_lệnh>`:** Chỉ **ước tính trên lý thuyết** dựa vào bảng thống kê, **KHÔNG thực sự chạy câu lệnh**.
* **`EXPLAIN (ANALYZE, BUFFERS) <câu_lệnh>`:** **Thực sự chạy câu lệnh đó**, đo thời gian thật từng mili-giây (`actual time`) và đếm chính xác bao nhiêu trang nhớ $8\text{ KB}$ đã được đọc từ RAM (`shared hit`) hay từ ổ đĩa (`shared read`).
  > ⚠️ **Cảnh báo:** Vì `EXPLAIN ANALYZE` thực sự chạy câu lệnh, nếu bạn dùng nó với câu lệnh `DELETE` hoặc `UPDATE` trên Production mà sợ mất dữ liệu, hãy luôn bọc trong `BEGIN; EXPLAIN (ANALYZE, BUFFERS) DELETE ...; ROLLBACK;`!

### 1.2. Cách giải mã từng con số trên 1 dòng `EXPLAIN (ANALYZE, BUFFERS)`

Giả sử bạn thấy một dòng kết quả như sau:
```text
Seq Scan on orders (cost=0.00..25401.00 rows=10000 width=65) (actual time=0.042..145.820 rows=10000 loops=1)
  Filter: ((status)::text = 'PENDING'::text)
  Rows Removed by Filter: 990000
  Buffers: shared hit=4120 read=11281
```
Hãy giải nghĩa từng thông số:
1. **`cost=0.00..25401.00` (Chi phí ước tính):**
   * Số đầu tiên (`0.00`): **Startup Cost** — chi phí khởi động trước khi trả về được dòng đầu tiên (với `Seq Scan` là `0.00` vì đọc được ngay, nhưng với lệnh `Sort` thì số này rất lớn vì phải sắp xếp xong toàn bộ mới trả về được dòng đầu!).
   * Số thứ hai (`25401.00`): **Total Cost** — tổng điểm chi phí ước tính nếu chạy hết.
2. **`rows=10000` (bên trái) vs `rows=10000` (bên phải trong `actual`):**
   * Bên trái là số dòng **PostgreSQL đoán**, bên phải là số dòng **thực tế trả về**. Nếu 2 con số này lệch nhau gấp hàng chục lần (VD: đoán `rows=1` nhưng thực tế `rows=500000`), nghĩa là thống kê của bảng đã lỗi thời $\rightarrow$ Query Planner sẽ chọn sai thuật toán JOIN/Index! Cách chữa: chạy `ANALYZE <tên_bảng>`.
3. **`actual time=0.042..145.820` (Đơn vị: mili-giây `ms`):**
   * Mất `0.042 ms` để tìm thấy dòng đầu tiên, và mất tổng cộng `145.820 ms` để lấy xong toàn bộ kết quả.
4. **`Rows Removed by Filter: 990000` (Dấu hiệu báo động đỏ!):**
   * Để lấy được $10.000$ đơn hàng `PENDING`, PostgreSQL đã phải **lôi cổ cả $1.000.000$ dòng lên kiểm tra rồi vứt đi $990.000$ dòng không khớp**!
5. **`Buffers: shared hit=4120 read=11281` (Chỉ số vàng của Senior):**
   * Tổng cộng câu lệnh này đã ngốn $4120 + 11281 = 15.401$ trang nhớ ($15.401 \times 8\text{ KB} \approx \mathbf{120\text{ MB}}$ dữ liệu!) chỉ để thực hiện 1 câu truy vấn!

---

### 1.3. Bốn Kiểu Quét Dữ Liệu (Scan Types) trong PostgreSQL

```
1. SEQUENTIAL SCAN (Quét tuần tự toàn bảng)
   [Page 0] ---> [Page 1] ---> [Page 2] ---> ... ---> [Page 15400]
   (Đọc sạch từ đầu đến cuối bảng. Tốt khi cần lấy > 15-20% bảng, THẢM HỌA khi chỉ cần lấy vài dòng!)

2. INDEX SCAN (Quét qua cây B-Tree rồi nhảy về Heap lấy từng dòng)
   [Cây B-Tree Index] --(Tìm thấy ctid)--> Nhảy ngẫu nhiên (Random I/O) vào [Heap Page] lấy các cột còn lại.
   (Rất nhanh khi lấy ít dòng: 1 - 1.000 dòng).

3. BITMAP INDEX SCAN + BITMAP HEAP SCAN (Khi lấy số lượng dòng vừa phải: vài nghìn - chục nghìn dòng)
   Bước 1 (Bitmap Index Scan): Quét Index để lập danh sách các Page có chứa dữ liệu cần tìm, SẮP XẾP theo thứ tự Page tăng dần.
   Bước 2 (Bitmap Heap Scan): Đọc các Page trên Heap theo đúng thứ tự từ thấp đến cao (Biến Random I/O thành Sequential I/O!)

4. INDEX ONLY SCAN (Đỉnh cao tối ưu - Không thèm chạm vào bảng Heap!)
   [Cây B-Tree Index chứa sẵn đủ mọi cột trong câu SELECT] ---> Trả kết quả ngay lập tức!
   (Điều kiện: Trang nhớ đã được đánh dấu sạch trong Visibility Map -> Heap Fetches = 0).
```

---

## 2. Thực hành Tương tác: Tiến hóa từ `Seq Scan` $\rightarrow$ `Index Scan` $\rightarrow$ `Index Only Scan`

**Bài toán thực tế:** Trang quản trị đơn hàng của User có `user_id = 12345` cần lấy ra danh sách `id, status, total_amount, created_at` của người dùng này.

### Bước 1: Khi CHƯA CÓ INDEX — Chứng kiến sự chậm chạp của `Sequential Scan`
👉 **Bấm `▶ Run` để xem PostgreSQL phải đọc bao nhiêu MB dữ liệu khi chưa có Index:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
-- Đảm bảo chưa có index phụ nào trên bảng orders
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_user_covering;

SELECT '=== Kịch bản 1: CHƯA CÓ INDEX (Sequential Scan quét 1.000.000 dòng) ===' AS scenario;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, total_amount, created_at
FROM orders
WHERE user_id = 12345;
EOF
```

**Phân tích bệnh án:**
* Bạn sẽ thấy `Seq Scan on orders` (hoặc `Parallel Seq Scan on orders`).
* `Rows Removed by Filter`: Khoảng **999.980 dòng** bị đọc lên vô ích rồi vứt bỏ chỉ để giữ lại khoảng 20 dòng của `user_id = 12345`!
* `Buffers`: Đọc hơn **14.000 trang nhớ ($\approx 112\text{ MB}$)** và tốn hàng chục đến hàng trăm mili-giây!

---

### Bước 2: Đánh Index cơ bản trên `user_id` — Chuyển sang `Index Scan` / `Bitmap Heap Scan`
👉 **Bấm `▶ Run` để tạo B-Tree Index trên cột `user_id` và đo lại:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
CREATE INDEX idx_orders_user_id ON orders (user_id);

SELECT '=== Kịch bản 2: ĐÃ CÓ INDEX TRÊN user_id (Index Scan / Bitmap Heap Scan) ===' AS scenario;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, total_amount, created_at
FROM orders
WHERE user_id = 12345;
EOF
```

**Phân tích sự lột xác:**
* Thời gian thực thi (`Execution Time`) giảm thẳng từ hàng chục/trăm mili-giây xuống chỉ còn **dưới `0.5 ms`**!
* Số lượng trang nhớ phải chạm vào (`Buffers: shared hit`) giảm từ hơn **14.000 trang** xuống chỉ còn khoảng **20–25 trang**!
* **Nhưng tại sao vẫn phải đọc 25 trang?** Vì cây `idx_orders_user_id` chỉ biết mỗi `user_id` và tọa độ `ctid`. Để lấy được `status, total_amount, created_at`, PostgreSQL vẫn phải nhảy từ cây Index về bảng gốc (**Heap**) 20 lần tại 20 trang khác nhau!

---

### Bước 3: Tuyệt kỹ `Covering Index (INCLUDE)` — Đạt cảnh giới `Index Only Scan` (`Heap Fetches: 0`)
Nếu truy vấn này được gọi $5.000$ lần/giây trên trang chủ, làm sao để PostgreSQL **không cần chạm vào bảng gốc (Heap) dù chỉ 1 lần**?
Chúng ta dùng từ khóa **`INCLUDE (...)`** để đính kèm các cột cần `SELECT` vào thẳng lá (leaf nodes) của cây B-Tree!

👉 **Bấm `▶ Run` để trải nghiệm sức mạnh của `Index Only Scan`:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
DROP INDEX IF EXISTS idx_orders_user_id;

-- Tạo Covering Index: Tìm kiếm theo (user_id), nhưng đính kèm sẵn (id, status, total_amount, created_at) ở nút lá
CREATE INDEX idx_orders_user_covering
ON orders (user_id)
INCLUDE (id, status, total_amount, created_at);

-- Chạy VACUUM để cập nhật Visibility Map (giúp Heap Fetches về đúng 0)
VACUUM ANALYZE orders;

SELECT '=== Kịch bản 3: COVERING INDEX VỚI INCLUDE -> ĐẠT INDEX ONLY SCAN ===' AS scenario;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, total_amount, created_at
FROM orders
WHERE user_id = 12345;
EOF
```

**Quan sát kỳ tích trong kết quả:**
* Kế hoạch thực thi hiện rõ: **`Index Only Scan using idx_orders_user_covering`**.
* **`Heap Fetches: 0`**: Không phải nhảy về bảng gốc lần nào!
* **`Buffers: shared hit=3` (hoặc `4`)**: Từ hơn **14.000 trang nhớ ($112\text{ MB}$)** ở Bước 1, nay PostgreSQL chỉ cần đọc đúng **3 trang nhớ ($24\text{ KB}$)** trên cây Index! Thời gian thực thi chỉ còn khoảng **`0.04 ms - 0.08 ms`**!

---

# 📘 MODULE 03: BẪY ĐÁNH INDEX KINH ĐIỂN (COMPOSITE INDEX, LEFTMOST PREFIX & THỨ TỰ CỘT)

> 🎯 **Mục tiêu:** Giải quyết câu hỏi khiến 90% lập trình viên đau đầu: *"Tại sao tôi đã tạo Index trên cột đó rồi mà PostgreSQL vẫn phớt lờ không thèm dùng?"*

## 1. Lý thuyết Chuyên sâu: 4 Cạm Bẫy Đánh Index Phổ Biến Nhất

### Bẫy 1: Quy tắc Tiền tố Trái cùng (Leftmost Prefix Rule) trong Composite Index
Khi bạn tạo một Index kết hợp nhiều cột (Composite Index), ví dụ:
$$\texttt{CREATE INDEX idx\_status\_created ON orders (status, created\_at);}$$
Hãy tưởng tượng cuốn danh bạ điện thoại được sắp xếp ưu tiên theo **`Họ (status)` trước**, và chỉ những người **cùng Họ** thì mới được xếp tiếp theo **`Tên (created_at)`**:

```
CẤU TRÚC SẮP XẾP CỦA INDEX (status, created_at):
  +-------------+---------------------+
  | status      | created_at          |
  +-------------+---------------------+
  | 'CANCELLED' | 2026-01-01 00:01:00 | \
  | 'CANCELLED' | 2026-01-05 12:00:00 |  |-- Nhóm CANCELLED: created_at tăng dần
  | 'CANCELLED' | 2026-01-10 08:30:00 | /
  +-------------+---------------------+
  | 'COMPLETED' | 2026-01-01 00:00:01 | \  <-- Chú ý: Ngày 2026-01-01 lại xuất hiện lại ở đây!
  | 'COMPLETED' | 2026-01-03 09:15:00 |  |-- Nhóm COMPLETED: created_at tăng dần
  +-------------+---------------------+
  | 'PENDING'   | 2026-01-01 00:01:40 | \
  | 'PENDING'   | 2026-01-02 10:00:00 | /
  +-------------+---------------------+
```

* Nhìn vào bảng trên, bạn thấy ngay: Cột `created_at` **KHÔNG HỀ được sắp xếp tăng dần trên toàn bộ Index**, mà nó chỉ được sắp xếp bên trong từng nhóm `status` riêng lẻ!
* Do đó:
  * ✅ Truy vấn `WHERE status = 'PENDING'` $\rightarrow$ **Dùng được Index!**
  * ✅ Truy vấn `WHERE status = 'PENDING' AND created_at >= '2026-01-10'` $\rightarrow$ **Dùng được Index tối đa!**
  * ❌ Truy vấn `WHERE created_at >= '2026-01-10'` (Bỏ quên cột đầu tiên là `status`!) $\rightarrow$ Trong PostgreSQL $\le 17$ (và hầu hết các trường hợp cột đầu có nhiều giá trị), cây Index hoàn toàn vô dụng hoặc phải quét toàn bộ Index!
  > 💡 **Cập nhật kiến thức mới nhất từ PostgreSQL 18 (B-Tree Skip Scan):**
  > Từ phiên bản **PostgreSQL 18**, nếu cột đứng đầu (`status`) có **rất ít giá trị phân biệt (Low Cardinality)** — ví dụ chỉ có 3 trạng thái `'CANCELLED'`, `'COMPLETED'`, `'PENDING'` — bộ tối ưu hóa của PostgreSQL 18 có thể tự động thực hiện kỹ thuật **Skip Scan** (nhảy cóc 3 lần vào 3 nhánh `'CANCELLED'`, `'COMPLETED'`, `'PENDING'` để tìm `created_at`). **TUY NHIÊN**, nếu cột đứng đầu có hàng vạn giá trị (như `user_id` trong Index `(user_id, created_at)`), thì ngay cả PostgreSQL 18 cũng **bó tay** không thể Skip Scan được và buộc phải quét toàn bảng (`Seq Scan`)!

---

### Bẫy 2: Thứ tự giữa cột So sánh bằng (`=`) và cột Khoảng (`>`, `<`, `BETWEEN`)
Giả sử API của bạn luôn tìm đơn hàng theo cả 2 điều kiện:
```sql
SELECT * FROM orders
WHERE status = 'PENDING'
  AND created_at >= '2026-01-10 00:00:00+07'
  AND created_at <  '2026-01-11 00:00:00+07';
```
Bạn nên đặt thứ tự cột trong Composite Index là **`(created_at, status)`** hay **`(status, created_at)`**?
* ❌ **Nếu đặt `(created_at, status)` (Cột khoảng đứng trước, cột `=` đứng sau):**
  Ngay khi gặp điều kiện khoảng (`created_at >= ... AND created_at < ...`), mọi cột đứng phía sau nó trong Index (`status`) **không còn nằm liền kề nhau nữa**! PostgreSQL phải quét qua toàn bộ các đơn hàng trong ngày 10/01 (bao gồm cả 99% đơn `COMPLETED` và `CANCELLED`) rồi mới lọc lấy `PENDING`!
* ✅ **Nếu đặt `(status, created_at)` (Cột `=` đứng trước, cột khoảng đứng sau):**
  PostgreSQL nhảy thẳng một phát vào đúng nhánh `status = 'PENDING'`, và tại nhánh đó các dòng đã được xếp sẵn theo `created_at` nên nó chỉ lấy đúng lát cắt ngày 10/01 mà không chạm vào bất kỳ đơn `COMPLETED` nào!
* 📌 **Khẩu quyết Vàng khi thiết kế Composite Index (Quy tắc ESR):**
  1. **E (Equality):** Đặt các cột so sánh bằng (`=`) lên **ĐẦU TIÊN**.
  2. **S (Sort) / R (Range):** Đặt cột sắp xếp (`ORDER BY`) hoặc cột lọc theo khoảng (`>`, `<`, `BETWEEN`) ở **PHÍA SAU**.

---

### Bẫy 3: Câu lệnh không SARGable (Bọc cột có Index vào bên trong Hàm hoặc Phép toán)
Index B-Tree lưu giá trị gốc của cột `created_at`. Nếu bạn viết:
* ❌ `WHERE EXTRACT(YEAR FROM created_at) = 2026` hoặc `WHERE DATE(created_at) = '2026-01-10'`
* ❌ `WHERE total_amount / 1000 > 500`
* ❌ `WHERE LOWER(owner_name) = 'nguyen van a'`
PostgreSQL **mất khả năng tra cứu trên cây B-Tree** của cột gốc vì nó không biết kết quả của hàm `EXTRACT(...)` hay `LOWER(...)` trước khi tính toán trên từng dòng!
* ✅ **Cách sửa chuẩn:**
  * Đổi sang so sánh khoảng trên cột gốc: `WHERE created_at >= '2026-01-10 00:00:00' AND created_at < '2026-01-11 00:00:00'`.
  * Chuyển phép toán sang vế bên phải: `WHERE total_amount > 500 * 1000`.
  * Nếu bắt buộc phải tìm theo hàm (như `LOWER(email)`), phải tạo **Expression Index**: `CREATE INDEX ON users (LOWER(email));`.

---

### Bẫy 4: Dùng `UUIDv4` ngẫu nhiên làm Khóa chính (Primary Key) trên bảng lớn
* `UUIDv4` (sinh bởi `gen_random_uuid()`) tạo ra chuỗi ngẫu nhiên hoàn toàn ở mọi vị trí (ví dụ `f47ac10b-...` rồi đến `12a9c001-...`).
* Khi bảng có 20 triệu dòng, mỗi lần `INSERT` một `UUIDv4` mới, PostgreSQL phải chèn vào **một trang $8\text{ KB}$ ngẫu nhiên ở giữa cây B-Tree**, gây ra hiện tượng **Tách trang (Page Split)** liên tục, làm cây Index phình to gấp rưỡi và gây tràn bộ nhớ đệm (Cache Thrashing).
* ✅ **Giải pháp hiện đại (Chuẩn mực trong PostgreSQL 18):** Dùng **`UUIDv7`** (hoặc `BIGINT` / `ULID`). Trong PostgreSQL 18 đã tích hợp sẵn hàm gốc **`uuidv7()`** — 48 bit đầu tiên của `UUIDv7` là **Timestamp tính bằng mili-giây**, giúp mọi dòng mới `INSERT` luôn được xếp nối đuôi nhau tuần tự ở tận cùng bên phải của cây B-Tree giống hệt như `BIGSERIAL`, trong khi vẫn đảm bảo tính duy nhất toàn cầu!

---

## 2. Thực hành Tương tác: Kiểm chứng Bẫy Leftmost Prefix & Quy tắc ESR (`=` trước, `>` sau)

👉 **Bấm `▶ Run` để so sánh trực tiếp số lượng trang nhớ (`Buffers`) bị tiêu tốn giữa thứ tự cột sai và thứ tự cột đúng:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
DROP INDEX IF EXISTS idx_orders_user_covering;
DROP INDEX IF EXISTS idx_wrong_order;
DROP INDEX IF EXISTS idx_correct_order;

-- 1. Tạo Index theo thứ tự SAI: Đặt cột khoảng (created_at) đứng trước cột bằng (status)
CREATE INDEX idx_wrong_order ON orders (created_at, status);

SELECT '=== 1. KHI ĐẶT THỨ TỰ CỘT SAI (created_at, status): Quan sát số Buffers phải đọc ===' AS test;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, created_at FROM orders
WHERE status = 'PENDING'
  AND created_at >= TIMESTAMPTZ '2026-01-02 00:00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-01-05 00:00:00+07';

DROP INDEX idx_wrong_order;

-- 2. Tạo Index theo thứ tự ĐÚNG (Quy tắc ESR): Đặt cột bằng (status) đứng trước cột khoảng (created_at)
CREATE INDEX idx_correct_order ON orders (status, created_at);

SELECT '=== 2. KHI ĐẶT THỨ TỰ CỘT ĐÚNG (status, created_at): Nhảy thẳng vào đúng lát cắt! ===' AS test;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, created_at FROM orders
WHERE status = 'PENDING'
  AND created_at >= TIMESTAMPTZ '2026-01-02 00:00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-01-05 00:00:00+07';

SELECT '=== 3. BẪY LEFTMOST PREFIX: Có Index (status, created_at) nhưng chỉ tìm theo created_at ===' AS test;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, created_at FROM orders
WHERE created_at >= TIMESTAMPTZ '2026-01-02 00:00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-01-02 00:10:00+07';
EOF
```

**Giải thích kết quả cực kỳ rõ ràng:**
1. Khi dùng `idx_wrong_order (created_at, status)`, Index phải quét qua toàn bộ hàng trăm nghìn đơn hàng của cả 3 ngày rồi mới lọc ra `status = 'PENDING'`.
2. Khi đổi sang `idx_correct_order (status, created_at)`, số lượng trang Index cần đọc giảm đi hàng chục lần vì nó đi thẳng vào phân vùng `'PENDING'`!
3. Ở mục số 3, khi câu truy vấn bỏ qua cột đứng đầu `status` và chỉ hỏi `WHERE created_at ...`, PostgreSQL đành phải quay về **quét toàn bộ bảng (`Seq Scan`)** vì vi phạm quy tắc Leftmost Prefix!

---

# 📘 MODULE 04: CÁC LOẠI INDEX CHUYÊN BIỆT — PARTIAL, GIN (`JSONB`) & BRIN INDEX

> 🎯 **Mục tiêu:** Vượt ra khỏi cái bóng của B-Tree truyền thống. Biết cách giảm **95% dung lượng Index** bằng **Partial Index**, tìm kiếm siêu tốc bên trong cột **`JSONB`** bằng **GIN Index**, và đánh Index cho bảng Log hàng tỷ dòng chỉ tốn **vài chục KB** bằng **BRIN Index**.

## 1. Lý thuyết Chuyên sâu: Chọn đúng vũ khí cho từng bài toán

| Loại Index | Cấu trúc bên dưới | Dung lượng | Bài toán thực tế phù hợp nhất |
| :--- | :--- | :--- | :--- |
| **B-Tree** *(Mặc định)* | Cây cân bằng đa nhánh | Trung bình – Lớn ($\approx 20\text{–}30\text{ MB} / 10^6$ dòng) | So sánh `=`, `>`, `<`, `BETWEEN`, `ORDER BY`, `LIKE 'abc%'` (tiền tố). |
| **Partial B-Tree** (`WHERE ...`) | Cây B-Tree nhưng chỉ lưu các dòng thỏa điều kiện `WHERE` | **Siêu nhỏ** (Chỉ bằng $1\%\text{–}5\%$ B-Tree thường) | Tìm các đơn hàng đang xử lý (`WHERE status = 'PENDING'`), tìm user chưa xóa (`WHERE deleted_at IS NULL`). |
| **GIN** (*Generalized Inverted Index*) | Chỉ mục đảo ngược (Từ khóa $\rightarrow$ Danh sách các `ctid`) | Khá lớn | Truy vấn bên trong cột **`JSONB`** (`@>`, `?`), mảng (`ARRAY`), và Tìm kiếm toàn văn (**Full-Text Search**). |
| **BRIN** (*Block Range Index*) | Chỉ lưu giá trị `Min` và `Max` của mỗi cụm $128$ trang nhớ ($1\text{ MB}$) | **Nhỏ không tưởng** (Chỉ vài chục **Kilobytes** cho hàng triệu dòng!) | Các bảng chỉ thêm mới theo thứ tự thời gian (**Time-Series, Audit Logs, IoT Sensors, Lịch sử giao dịch**). |

---

## 2. Thực hành Tương tác (3 Case Thực Chiến)

### Case 1: Dùng `Partial Index` giảm dung lượng Index từ `30 MB` xuống còn `300 KB`!
**Bài toán:** Trong bảng `orders` có 1 triệu dòng, nhưng **99% đơn hàng đã kết thúc (`COMPLETED` hoặc `CANCELLED`)** và không bao giờ cần quét lại bởi Worker xử lý đơn. Worker của bạn chỉ liên tục chạy câu lệnh tìm **1% đơn hàng đang chờ xử lý (`WHERE status = 'PENDING'`)**.
Tại sao lại phải tốn `30 MB` RAM để đánh Index cho cả 99% đơn hàng đã xong?

👉 **Bấm `▶ Run` để so sánh dung lượng giữa Full Index và Partial Index:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
DROP INDEX IF EXISTS idx_correct_order;
DROP INDEX IF EXISTS idx_full_status_created;
DROP INDEX IF EXISTS idx_partial_pending_only;

-- 1. Tạo Full B-Tree Index trên toàn bộ 1.000.000 dòng
CREATE INDEX idx_full_status_created ON orders (created_at, status);

-- 2. Tạo Partial Index: CHỈ đánh index cho những dòng có status = 'PENDING' (1% bảng)
CREATE INDEX idx_partial_pending_only ON orders (created_at)
WHERE status = 'PENDING';

SELECT '=== SO SÁNH DUNG LƯỢNG BỘ NHỚ GIỮA FULL INDEX VÀ PARTIAL INDEX ===' AS comparison;
SELECT
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE relname = 'orders' AND indexrelname IN ('idx_full_status_created', 'idx_partial_pending_only');

SELECT '=== KIỂM TRA KẾ HOẠCH THỰC THI KHI TÌM ĐƠN HÀNG PENDING ===' AS plan;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total_amount, created_at FROM orders
WHERE status = 'PENDING'
  AND created_at >= TIMESTAMPTZ '2026-01-05 00:00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-01-06 00:00:00+07';

DROP INDEX idx_full_status_created;
DROP INDEX idx_partial_pending_only;
EOF
```

**Quan sát kết quả:**
* `idx_full_status_created` nặng khoảng **`30 MB`**, trong khi `idx_partial_pending_only` chỉ nặng khoảng **`240 KB`** (nhẹ hơn **hơn 100 lần**, nằm gọn lỏn trong CPU Cache!), mà tốc độ truy vấn đơn `PENDING` lại nhanh hơn và không làm chậm các lệnh `UPDATE` sang trạng thái `COMPLETED`!

---

### Case 2: Đánh `GIN Index` cho cột `JSONB` để tìm kiếm thuộc tính động trong `0.2 ms`
**Bài toán:** Trong thương mại điện tử, mỗi ngành hàng có thuộc tính khác nhau được lưu trong cột `metadata` kiểu `JSONB`. Bạn muốn tìm tất cả các đơn hàng mua đồ hãng `"Apple"`, thanh toán qua `"VNPAY"` và thuộc chương trình `"flash_sale": true`.
* Nếu dùng toán tử chứa đựng `@>` (`WHERE metadata @> '{"brand": "Apple", "payment_method": "VNPAY", "flash_sale": true}'`) mà không có **GIN Index**, PostgreSQL phải giải nén JSON của cả 1 triệu dòng!
* Với **`USING GIN (metadata jsonb_path_ops)`**, PostgreSQL băm từng đường dẫn JSON và trả kết quả trong tích tắc.

👉 **Bấm `▶ Run` để đo tốc độ truy vấn `JSONB` trước và sau khi có GIN Index:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
DROP INDEX IF EXISTS idx_orders_metadata_gin;

SELECT '=== 1. TRƯỚC KHI CÓ GIN INDEX: Quét 1.000.000 JSONB (Rất chậm!) ===' AS step;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, user_id, total_amount, metadata
FROM orders
WHERE metadata @> '{"brand": "Apple", "payment_method": "VNPAY", "flash_sale": true}';

-- Tạo GIN Index với toán tử tối ưu jsonb_path_ops (nhỏ hơn và nhanh hơn jsonb_ops mặc định)
CREATE INDEX idx_orders_metadata_gin ON orders USING GIN (metadata jsonb_path_ops);

SELECT '=== 2. SAU KHI CÓ GIN INDEX: Tìm trong 1.000.000 JSONB chỉ mất ~1ms! ===' AS step;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, user_id, total_amount, metadata
FROM orders
WHERE metadata @> '{"brand": "Apple", "payment_method": "VNPAY", "flash_sale": true}';

DROP INDEX idx_orders_metadata_gin;
EOF
```

---

### Case 3: Đánh `BRIN Index` cho dữ liệu chuỗi thời gian (`created_at`) — Chỉ tốn `48 KB`!
**Bài toán:** Cột `created_at` của bảng `orders` (hoặc bảng `audit_logs`) luôn tăng dần theo thời gian khi dữ liệu mới được chèn vào.
* Nếu tạo **B-Tree Index** trên `created_at` cho 1 triệu dòng $\rightarrow$ Tốn **`21 MB`**.
* Nếu tạo **BRIN Index** (`USING BRIN (created_at)`) $\rightarrow$ Chỉ tốn đúng **`48 KB`** (nhỏ hơn **450 lần**!), vì BRIN chỉ ghi chú kiểu: *"Từ Page 0 đến Page 127 chứa các đơn hàng từ ngày 01/01 đến ngày 02/01"*.

👉 **Bấm `▶ Run` để kiểm chứng kích thước siêu nhỏ của BRIN Index:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
DROP INDEX IF EXISTS idx_orders_created_btree;
DROP INDEX IF EXISTS idx_orders_created_brin;

CREATE INDEX idx_orders_created_btree ON orders USING BTREE (created_at);
CREATE INDEX idx_orders_created_brin  ON orders USING BRIN (created_at);

SELECT '=== SO SÁNH KÍCH THƯỚC: B-TREE (21 MB) VS BRIN (CHỈ 48 KB!) ===' AS comparison;
SELECT
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE relname = 'orders' AND indexrelname IN ('idx_orders_created_btree', 'idx_orders_created_brin');

DROP INDEX idx_orders_created_btree;
SELECT '=== DÙNG BRIN INDEX (48 KB) ĐỂ LỌC ĐƠN HÀNG TRONG 10 PHÚT ===' AS test;
EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*) FROM orders
WHERE created_at >= TIMESTAMPTZ '2026-01-05 00:00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-01-05 00:10:00+07';

DROP INDEX idx_orders_created_brin;
EOF
```

---

# 📘 MODULE 05: GIẢI THUẬT JOIN & TỐI ƯU HÓA ORM (BẪY `OFFSET` PAGINATION vs KEYSET PAGINATION)

> 🎯 **Mục tiêu:** Hiểu 3 thuật toán JOIN cốt lõi (`Nested Loop`, `Hash Join`, `Merge Join`) và đập tan thói quen dùng `.skip(500000).take(20)` (`OFFSET / LIMIT`) làm treo cứng Database khi phân trang sâu!

## 1. Lý thuyết Chuyên sâu

### 1.1. Ba thuật toán JOIN bên trong PostgreSQL
Khi bạn viết `SELECT * FROM users u JOIN orders o ON u.id = o.user_id`, PostgreSQL sẽ tự động chọn 1 trong 3 thuật toán sau dựa vào kích thước bảng và Index:
1. **`Nested Loop Join` (Vòng lặp lồng nhau — Độ phức tạp $O(N \times M)$ hoặc $O(N \log M)$ nếu có Index):**
   * Với mỗi dòng ở bảng ngoài (`users`), nó cầm `u.id` chạy vào Index của bảng trong (`orders`) để tìm các đơn hàng khớp.
   * **Khi nào tốt nhất?** Khi bảng ngoài sau khi lọc chỉ có **rất ít dòng** (VD: lấy đơn hàng của 5 VIP users) và cột `orders.user_id` **đã có Index**.
2. **`Hash Join` (Băm vào bộ nhớ `work_mem` — Độ phức tạp $O(N + M)$):**
   * Quét bảng nhỏ hơn để xây dựng một Bảng Băm (Hash Table) ngay trong RAM (`work_mem`), sau đó quét bảng lớn hơn và tra vào Bảng Băm đó.
   * **Khi nào tốt nhất?** Khi cần JOIN 2 tập dữ liệu lớn mà không được sắp xếp sẵn. *(Lưu ý: Nếu bảng băm vượt quá `work_mem`, nó sẽ bị tràn ra ổ đĩa cứng — hiện thông số `Batches: 4` hoặc `temp written` trong `EXPLAIN` làm giảm tốc độ!).*
3. **`Merge Join` (Trộn hai danh sách đã sắp xếp — Độ phức tạp $O(N + M)$):**
   * Khi cả 2 bảng đều đã được sắp xếp sẵn theo cột JOIN (nhờ B-Tree Index), PostgreSQL chỉ cần cho 2 con trỏ chạy song song từ trên xuống dưới để ghép cặp, không tốn RAM như Hash Join!

---

### 1.2. Cạm bẫy kinh điển của ORM: Tại sao `OFFSET 500000 LIMIT 10` lại là thuốc độc?
Trong Prisma (`skip: 500000, take: 10`) hoặc TypeORM (`.skip(500000).take(10)`), ORM sẽ sinh ra câu lệnh SQL:
```sql
SELECT id, user_id, total_amount, created_at
FROM orders
ORDER BY id DESC
OFFSET 500000 LIMIT 10;
```
**Tại sao câu lệnh này lại cực kỳ nguy hiểm?**
* Để biết dòng thứ `500.001` là dòng nào, PostgreSQL **BẮT BUỘC phải đọc, sắp xếp và đếm qua toàn bộ `500.010` dòng đầu tiên**, sau đó **vứt sọt rác `500.000` dòng** và chỉ trả về cho bạn `10` dòng cuối!
* Người dùng càng bấm sang trang sau (hoặc hacker viết tool cào dữ liệu ở trang `50.000`), server của bạn càng chậm theo cấp số nhân!

🛡️ **Giải pháp chuẩn Production: Phân trang bằng Con trỏ (`Keyset / Cursor Pagination`)**
Thay vì đếm số thứ tự dòng cần bỏ qua (`OFFSET`), bạn lấy **`id` (hoặc cặp `(created_at, id)`) của dòng cuối cùng ở trang trước** làm mốc để nhảy thẳng vào cây B-Tree:
```sql
-- Biết dòng cuối cùng của trang trước có id = 500001:
SELECT id, user_id, total_amount, created_at
FROM orders
WHERE id < 500001
ORDER BY id DESC
LIMIT 10;
```
Với câu lệnh này, dù bạn đang ở Trang 1 hay Trang 90.000, PostgreSQL luôn nhảy thẳng vào đúng vị trí `id < 500001` trên cây B-Tree và nhặt ra 10 dòng kế tiếp trong **`0.04 ms`**!

---

## 2. Thực hành Tương tác: Đua tốc độ `OFFSET 500000` vs `Keyset Pagination`

👉 **Bấm `▶ Run` để chứng kiến sự chênh lệch gấp hàng nghìn lần giữa 2 cách phân trang:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off

SELECT '=== 1. CÁCH CŨ (OFFSET 500000 LIMIT 10): Phải đọc và vứt bỏ 500.000 dòng! ===' AS test;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, user_id, total_amount, created_at
FROM orders
ORDER BY id DESC
OFFSET 500000 LIMIT 10;

SELECT '=== 2. CÁCH CHUẨN SENIOR (KEYSET PAGINATION: WHERE id <= 500000): Chỉ chạm 3 trang nhớ! ===' AS test;
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, user_id, total_amount, created_at
FROM orders
WHERE id <= 500000
ORDER BY id DESC
LIMIT 10;
EOF
```

**So sánh kết quả thực tế vừa chạy:**
* **`OFFSET 500000 LIMIT 10`:** Phải đọc hàng nghìn trang nhớ (`Buffers: shared hit=...`) và tốn khoảng **`60 ms – 150 ms`**.
* **`WHERE id <= 500000 ORDER BY id DESC LIMIT 10`:** Chỉ đọc đúng **`Buffers: shared hit=4`** (4 trang nhớ = $32\text{ KB}$!) và mất vỏn vẹn **`0.04 ms`** (nhanh hơn gấp **2.000+ lần**)!

---

# 📘 MODULE 06: TRANSACTIONS, ISOLATION LEVELS & HIỆN TƯỢNG MẤT CẬP NHẬT (LOST UPDATE)

> 🎯 **Mục tiêu:** Hiểu sâu 4 tính chất **ACID**, các mức cô lập giao dịch (**Isolation Levels**: `Read Committed`, `Repeatable Read`, `Serializable`), và **tận mắt tái hiện lỗi rút tiền âm ví (Lost Update)** khi 2 tiến trình cùng đọc và trừ số dư!

## 1. Lý thuyết Chuyên sâu: Tại sao mặc định của PostgreSQL (`Read Committed`) vẫn bị lệch tiền?

### 1.1. Bảng tổng hợp các mức Cô lập Giao dịch (Isolation Levels) trong PostgreSQL

| Mức độ cô lập (Isolation Level) | Dirty Read *(Đọc dữ liệu chưa Commit)* | Non-Repeatable Read *(2 lần SELECT ra kết quả khác nhau)* | Lost Update *(Đè mất dữ liệu của nhau)* | Write Skew *(Lệch điều kiện chéo)* | Hành vi khi phát hiện xung đột ghi cùng 1 dòng |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`Read Committed`** *(Mặc định của Postgres)* | ❌ Không bị | ⚠️ **Bị** | ⚠️ **BỊ (Nguy hiểm!)** | ⚠️ **Bị** | Chờ giao dịch kia Commit xong rồi **ghi đè tiếp lên kết quả mới** mà không báo lỗi! |
| **`Repeatable Read`** | ❌ Không bị | ❌ Không bị | 🛡️ **Tự động chặn!** | ⚠️ **Bị** | Tự động hủy giao dịch thứ 2 và ném lỗi `ERROR: could not serialize access due to concurrent update`! |
| **`Serializable`** | ❌ Không bị | ❌ Không bị | 🛡️ **Tự động chặn!** | 🛡️ **Tự động chặn!** | Kiểm tra phụ thuộc tuần tự (SSI) và ném lỗi yêu cầu ứng dụng thử lại (Retry). |

---

### 1.2. Giải phẫu vụ tai nạn tài chính kinh điển: Lỗi **Lost Update (Mất cập nhật)**
Giả sử trong ví của Nguyễn Văn A (`id = 1`) đang có **`1.000.000 đ`**.
Trong code Backend (TypeORM / Prisma), lập trình viên viết hàm rút tiền theo kiểu "Đọc số dư ra biến JavaScript $\rightarrow$ Trừ trong JavaScript $\rightarrow$ Lưu con số mới xuống DB":

```
THỜI GIAN   GIAO DỊCH A (Rút 800.000đ tại cây ATM 1)          GIAO DỊCH B (Rút 800.000đ qua App Mobile)
---------   ---------------------------------------------     ---------------------------------------------
00:00.000   BEGIN; (Mặc định: Read Committed)                 BEGIN; (Mặc định: Read Committed)
00:00.010   SELECT balance FROM wallets WHERE id = 1;         SELECT balance FROM wallets WHERE id = 1;
            --> Nhận về: balance = 1.000.000đ                 --> Cũng nhận về: balance = 1.000.000đ!
00:00.020   (Code JS kiểm tra: 1.000.000 >= 800.000 -> OK!    (Code JS kiểm tra: 1.000.000 >= 800.000 -> OK!
             Tính số dư mới: 1.000.000 - 800.000 = 200.000)    Tính số dư mới: 1.000.000 - 800.000 = 200.000)
00:00.030   UPDATE wallets SET balance = 200000 WHERE id = 1;
00:00.040   COMMIT; (Nhả tiền 800.000đ lần 1)
00:00.050                                                     UPDATE wallets SET balance = 200000 WHERE id = 1;
                                                              COMMIT; (Nhả tiếp 800.000đ lần 2!)
-----------------------------------------------------------------------------------------------------------
💥 HẬU QUẢ: Khách rút tổng cộng 1.600.000đ nhưng trong ví vẫn còn 200.000đ (Ngân hàng mất trắng 800.000đ!)
```

---

## 2. Thực hành Tương tác: Tái hiện trực tiếp vụ hack "Rút tiền 2 lần" & Cách chặn bằng `Repeatable Read`

👉 **Bấm `▶ Run` bên dưới để chạy 2 kết nối song song tái hiện lỗi Lost Update ở mức `Read Committed`, sau đó xem `Repeatable Read` chặn đứng nó như thế nào:**

```bash
# Đặt lại số dư ví id=1 về đúng 1.000.000đ
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "UPDATE wallets SET balance = 1000000, version = 1 WHERE id = 1;" > /dev/null

echo "================================================================================"
echo "💥 THÍ NGHIỆM 1: MỨC MẶC ĐỊNH (READ COMMITTED) -> BỊ LỖI LOST UPDATE!"
echo "================================================================================"

# Giao dịch 1: Đọc 1.000.000 -> Ngủ 1 giây -> Ghi đè thành 200.000 (Rút 800k)
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT 'Tx1 đọc số dư ban đầu: ' || balance FROM wallets WHERE id = 1;
SELECT pg_sleep(1.0);
UPDATE wallets SET balance = 200000 WHERE id = 1;
COMMIT;
SELECT '✅ Tx1: Đã rút 800.000đ thành công!';
" &
PID_TX1=$!

# Giao dịch 2 chạy song song sau 0.2s: Cũng đọc thấy 1.000.000 -> Ngủ 1.2 giây -> Ghi đè thành 200.000!
sleep 0.2
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT 'Tx2 cũng đọc thấy số dư ban đầu: ' || balance FROM wallets WHERE id = 1;
SELECT pg_sleep(1.2);
UPDATE wallets SET balance = 200000 WHERE id = 1;
COMMIT;
SELECT '✅ Tx2: Cũng rút tiếp 800.000đ thành công (Toang!)';
" &
PID_TX2=$!

wait $PID_TX1 $PID_TX2
echo "👉 Số dư cuối cùng trong ví sau khi bị rút 2 lần 800.000đ (Tổng rút 1.6M trên ví 1M):"
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "SELECT id, owner_name, balance FROM wallets WHERE id = 1;"

echo ""
echo "================================================================================"
echo "🛡️ THÍ NGHIỆM 2: BẬT MỨC REPEATABLE READ -> POSTGRES TỰ ĐỘNG BẮT LỖI VÀ CHẶN TX2!"
echo "================================================================================"
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "UPDATE wallets SET balance = 1000000, version = 1 WHERE id = 1;" > /dev/null

docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM wallets WHERE id = 1;
SELECT pg_sleep(1.0);
UPDATE wallets SET balance = 200000 WHERE id = 1;
COMMIT;
" > /dev/null &
PID_TX1=$!

sleep 0.2
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM wallets WHERE id = 1;
SELECT pg_sleep(1.2);
UPDATE wallets SET balance = 200000 WHERE id = 1;
COMMIT;
" 2>&1 || true

wait $PID_TX1
echo "👉 Số dư cuối cùng được bảo vệ an toàn (Chỉ 1 giao dịch thành công):"
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "SELECT id, owner_name, balance FROM wallets WHERE id = 1;"
```

**Quan sát kết quả:**
* Ở **Thí nghiệm 1 (`Read Committed`)**: Cả 2 giao dịch đều báo thành công và khách rút được $1.600.000\text{ đ}$ từ chiếc ví chỉ có $1.000.000\text{ đ}$!
* Ở **Thí nghiệm 2 (`Repeatable Read`)**: Giao dịch thứ 2 bị PostgreSQL tuýt còi ngay lập tức với thông báo lỗi nổi tiếng:
  **`ERROR: could not serialize access due to concurrent update`**!

---

# 📘 MODULE 07: LOCKING THỰC CHIẾN — PESSIMISTIC (`FOR UPDATE`, `SKIP LOCKED`) VS OPTIMISTIC (`version`) & DEADLOCK

> 🎯 **Mục tiêu:** Làm chủ 3 kỹ thuật khóa dữ liệu quan trọng nhất trong các hệ thống Ngân hàng, Ví điện tử, Đặt vé máy bay/rạp phim và Xử lý đơn hàng: **Pessimistic Locking**, **`SKIP LOCKED`**, **Optimistic Locking** và cách phòng chống **Deadlock**.

## 1. Lý thuyết Chuyên sâu: Khi nào dùng Khóa Bi Quan, khi nào dùng Khóa Lạc Quan?

| Phương pháp | Câu lệnh SQL cốt lõi | Cơ chế hoạt động | Khi nào nên dùng? |
| :--- | :--- | :--- | :--- |
| **1. Atomic Update** *(Đơn giản & Nhanh nhất)* | `UPDATE wallets SET balance = balance - 800000 WHERE id = 1 AND balance >= 800000 RETURNING balance;` | Cộng/trừ trực tiếp và kiểm tra điều kiện ngay trong 1 câu lệnh `UPDATE` duy nhất. | Khi chỉ cần cộng/trừ số dư hoặc tồn kho trên 1 bảng mà không cần gọi API bên thứ 3 ở giữa. |
| **2. Pessimistic Locking** *(Khóa Bi Quan)* | `SELECT * FROM wallets WHERE id = 1 FOR UPDATE;` | **Khóa chặt dòng đó ngay từ lúc `SELECT`!** Ai vào đọc `FOR UPDATE` cùng dòng này phải xếp hàng chờ đến khi bạn `COMMIT`. | Hệ thống **Tài chính, Ví tiền, Thanh toán** (Đọc số dư $\rightarrow$ Kiểm tra nhiều bảng/Logic phức tạp $\rightarrow$ Ghi lịch sử giao dịch $\rightarrow$ Trừ tiền). |
| **3. Queue / Booking Lock** *(Khóa Nhảy Cóc)* | `SELECT * FROM cinema_seats WHERE status = 'AVAILABLE' LIMIT 1 FOR UPDATE SKIP LOCKED;` | Nếu thấy dòng đầu tiên đang bị người khác khóa, **KHÔNG đứng chờ mà nhảy cóc ngay sang dòng trống tiếp theo!** | **Đặt vé tự động chọn ghế trống**, hoặc **nhiều Worker cùng bốc việc từ bảng `jobs`** mà không bao giờ dẫm chân lên nhau! |
| **4. Optimistic Locking** *(Khóa Lạc Quan)* | `UPDATE wallets SET balance = ..., version = version + 1 WHERE id = 1 AND version = 5;` | Không khóa dòng khi đọc. Khi lưu, kiểm tra xem cột `version` có còn nguyên như lúc đọc không. Nếu `rowCount == 0` nghĩa là có người vừa sửa mất rồi! | Form chỉnh sửa thông tin sản phẩm, Duyệt hồ sơ/hợp đồng (nơi ít khi 2 người sửa cùng lúc, hoặc người dùng mở màn hình ngắm 5 phút mới bấm Lưu). |

---

## 2. Thực hành Tương tác (3 Case Thực Chiến Đắt Giá)

### Case 1: Dùng `SELECT ... FOR UPDATE` chống rút tiền đúp
Khiทั้ง 2 giao dịch cùng dùng `SELECT ... FOR UPDATE`, Giao dịch 2 sẽ bị bắt đứng đợi cho đến khi Giao dịch 1 trừ tiền và `COMMIT` xong. Khi Giao dịch 2 được đọc, nó sẽ thấy số dư thật chỉ còn `200.000đ` (không đủ rút `800.000đ`)!

```bash
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "UPDATE wallets SET balance = 1000000, version = 1 WHERE id = 1;" > /dev/null

echo "=== THỰC HÀNH PESSIMISTIC LOCKING (SELECT ... FOR UPDATE) ==="

# Giao dịch 1: Khóa dòng id=1 bằng FOR UPDATE -> Kiểm tra thấy >= 800k -> Trừ tiền
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN;
SELECT '🔒 Tx1 đã khóa dòng id=1. Số dư thấy được: ' || balance FROM wallets WHERE id = 1 FOR UPDATE;
SELECT pg_sleep(1.0);
UPDATE wallets SET balance = balance - 800000 WHERE id = 1 AND balance >= 800000;
COMMIT;
" &
PID1=$!

# Giao dịch 2 vào sau 0.2s: Cũng gọi FOR UPDATE -> Phải ĐỨNG CHỜ Tx1 COMMIT xong mới được đọc!
sleep 0.2
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN;
SELECT '⏳ Tx2 vừa được nhả khóa sau khi chờ Tx1! Số dư thật hiện tại chỉ còn: ' || balance FROM wallets WHERE id = 1 FOR UPDATE;
UPDATE wallets SET balance = balance - 800000 WHERE id = 1 AND balance >= 800000;
COMMIT;
" &
PID2=$!

wait $PID1 $PID2
echo "👉 Kết quả số dư cuối cùng (An toàn tuyệt đối):"
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "SELECT id, owner_name, balance FROM wallets WHERE id = 1;"
```

---

### Case 2: Tuyệt chiêu `FOR UPDATE SKIP LOCKED` — 3 Khách hàng cùng đặt ghế trống trong cùng 1 mili-giây!
Hãy tưởng tượng có 3 khách hàng (`Khach_A`, `Khach_B`, `Khach_C`) cùng bấm nút **"Tự động chọn 1 ghế trống trong rạp"** vào đúng một thời điểm.
* Nếu dùng `FOR UPDATE` thường: Cả 3 cùng nhắm vào ghế `A-1`, `Khach_B` và `Khach_C` bị treo chờ `Khach_A`, và khi `Khach_A` mua xong thì `Khach_B` lại thấy ghế `A-1` đã bán mất rồi!
* Với **`FOR UPDATE SKIP LOCKED`**: `Khach_A` khóa ghế `A-1`, `Khach_B` vào sau 0.1 giây thấy `A-1` đang khóa liền **bỏ qua ngay lập tức và lấy luôn ghế `A-2`**, `Khach_C` lấy luôn ghế `A-3` mà không ai phải chờ ai dù chỉ 1 mili-giây!

👉 **Bấm `▶ Run` để xem 3 giao dịch chạy song song tự động chia nhau 3 chiếc ghế `A-1`, `A-2`, `A-3`:**

```bash
# Đặt lại tất cả ghế về AVAILABLE
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "UPDATE cinema_seats SET status = 'AVAILABLE', booked_by = NULL;" > /dev/null

echo "=== 3 KHÁCH HÀNG CÙNG BẤM ĐẶT VÉ SONG SONG VỚI 'FOR UPDATE SKIP LOCKED' ==="

for customer in "Khach_Hang_1" "Khach_Hang_2" "Khach_Hang_3"; do
  docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
  BEGIN;
  WITH selected_seat AS (
      SELECT seat_number
      FROM cinema_seats
      WHERE status = 'AVAILABLE'
      ORDER BY seat_number
      LIMIT 1
      FOR UPDATE SKIP LOCKED
  )
  UPDATE cinema_seats s
  SET status = 'BOOKED', booked_by = '$customer'
  FROM selected_seat
  WHERE s.seat_number = selected_seat.seat_number
  RETURNING s.seat_number, s.booked_by;
  SELECT pg_sleep(0.8); -- Giả lập chờ thanh toán 0.8s trong khi vẫn giữ khóa
  COMMIT;
  " &
  sleep 0.1
done

wait
echo "=== DANH SÁCH GHẾ ĐÃ ĐƯỢC PHÂN BỔ (Không ai dẫm chân lên ai!) ==="
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
SELECT seat_number, status, booked_by FROM cinema_seats WHERE status = 'BOOKED' ORDER BY seat_number;
"
```

---

### Case 3: Tại sao xảy ra `DEADLOCK` khi chuyển tiền ngân hàng và Quy tắc vàng để trị dứt điểm
**Kịch bản gây Deadlock kinh điển:**
* **Giao dịch 1:** Chuyển tiền từ **Ví 1 $\rightarrow$ Ví 2** (Khóa `id = 1` trước, rồi xin khóa `id = 2`).
* **Giao dịch 2 (Chạy cùng lúc):** Chuyển tiền ngược lại từ **Ví 2 $\rightarrow$ Ví 1** (Khóa `id = 2` trước, rồi xin khóa `id = 1`).
* Cả hai ôm chặt khóa của mình và chờ người kia nhả ra $\rightarrow$ **Khóa chết (Deadlock)**! Sau `1 giây` (`deadlock_timeout`), PostgreSQL sẽ phát hiện vòng lặp và bắn chết 1 trong 2 giao dịch với lỗi: `ERROR: deadlock detected`!

🛡️ **Quy tắc Vàng chống Deadlock 100%:**
Khi một giao dịch cần khóa nhiều dòng trong cùng 1 bảng, **LUÔN LUÔN sắp xếp thứ tự ID tăng dần (`ORDER BY id ASC`) trước khi khóa** (Ví dụ: Dù chuyển từ Ví 2 sang Ví 1, bạn vẫn phải gọi `SELECT * FROM wallets WHERE id IN (1, 2) ORDER BY id ASC FOR UPDATE`)!

👉 **Bấm `▶ Run` để tận mắt nhìn thấy PostgreSQL phát hiện và cắt cổ một vụ `Deadlock`:**

```bash
echo "=== TÁI HIỆN LỖI DEADLOCK KHI 2 GIAO DỊCH KHÓA NGƯỢC THỨ TỰ (1->2 vs 2->1) ==="

# Giao dịch 1: Khóa Ví 1 trước -> Ngủ 0.5s -> Xin khóa Ví 2
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN;
UPDATE wallets SET balance = balance - 10000 WHERE id = 1;
SELECT pg_sleep(0.5);
UPDATE wallets SET balance = balance + 10000 WHERE id = 2;
COMMIT;
" 2>&1 &
PID_D1=$!

# Giao dịch 2: Khóa Ví 2 trước -> Ngủ 0.5s -> Xin khóa Ví 1 (Ngược chiều!)
sleep 0.1
docker container exec pg-mastery-lab psql -U master -d ecommerce_prod -c "
BEGIN;
UPDATE wallets SET balance = balance - 10000 WHERE id = 2;
SELECT pg_sleep(0.5);
UPDATE wallets SET balance = balance + 10000 WHERE id = 1;
COMMIT;
" 2>&1 || true

wait $PID_D1 || true
```

---

# 📘 MODULE 08: DATABASE PARTITIONING — CHIA NHỎ BẢNG HÀNG CHỤC TRIỆU DÒNG THEO THÁNG

> 🎯 **Mục tiêu:** Khi bảng `transaction_logs` hoặc `orders` phình lên **50 triệu – 200 triệu dòng**, đánh Index kiểu gì cũng chậm vì cây Index vượt quá dung lượng RAM và lệnh `DELETE` dữ liệu cũ gây treo bảng. Giải pháp chuẩn kiến trúc sư là **Declarative Table Partitioning**!

## 1. Lý thuyết Chuyên sâu: Tại sao Partitioning lại cứu sống Database lớn?

```
               +---------------------------------------------------+
               |      BẢNG MẸ (PARENT TABLE): transaction_logs     |
               |   (Ứng dụng NestJS vẫn chỉ gọi vào tên bảng này!) |
               +-------------------------+-------------------------+
                                         | Tự động định tuyến theo cột created_at
         +-------------------------------+-------------------------------+
         v                               v                               v
+-----------------------+     +-----------------------+     +-----------------------+
|  PARTITION 2026_01    |     |  PARTITION 2026_02    |     |  PARTITION 2026_03    |
| (01/01 -> 31/01/2026) |     | (01/02 -> 28/02/2026) |     | (01/03 -> 31/03/2026) |
| - B-Tree Index riêng  |     | - B-Tree Index riêng  |     | - B-Tree Index riêng  |
+-----------------------+     +-----------------------+     +-----------------------+
```

3 Lợi ích khổng lồ của **Range Partitioning theo tháng**:
1. **Partition Pruning (Tự động cắt tỉa phân vùng khi truy vấn):** Khi khách hàng xem sao kê tháng 03/2026 (`WHERE created_at >= '2026-03-01'`), PostgreSQL **bỏ qua hoàn toàn** các bảng tháng 01 và tháng 02, chỉ mở đúng bảng con `transaction_logs_2026_03` ra tìm!
2. **Cây Index nhỏ gọn nằm vừa trong RAM:** Thay vì 1 cây B-Tree khổng lồ nặng `50 GB` của cả năm, mỗi tháng có một cây B-Tree nhỏ riêng biệt chỉ nặng `4 GB`, giúp các giao dịch của tháng hiện tại luôn đạt `100% Cache Hit` trên RAM!
3. **Xóa dữ liệu cũ (Data Retention) trong `5 ms` không sinh ra Dead Tuples:**
   * Nếu bạn chạy `DELETE FROM transaction_logs WHERE created_at < '2025-01-01'` trên bảng 100 triệu dòng $\rightarrow$ Server treo cứng 30 phút và sinh ra 20 triệu Dead Tuples!
   * Nếu dùng Partitioning: Bạn chỉ cần chạy `DROP TABLE transaction_logs_2024_12;` (hoặc `ALTER TABLE transaction_logs DETACH PARTITION ... CONCURRENTLY`) $\rightarrow$ Giải phóng ngay lập tức hàng chục GB ổ cứng chỉ trong **`5 mili-giây`**!

---

## 2. Thực hành Tương tác: Tạo Bảng Phân Vùng Theo Tháng & Kiểm Chứng Partition Pruning

👉 **Bấm `▶ Run` để tạo bảng `transaction_logs` phân vùng theo 3 tháng đầu năm 2026 và xem PostgreSQL tự động bỏ qua các tháng không liên quan trong `EXPLAIN`:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off
DROP TABLE IF EXISTS transaction_logs CASCADE;

-- 1. Tạo Bảng Mẹ (Khai báo PARTITION BY RANGE trên cột created_at)
-- LƯU Ý QUAN TRỌNG: Mọi khóa PRIMARY KEY / UNIQUE trên bảng phân vùng BẮT BUỘC phải bao gồm cả cột phân vùng (created_at)!
CREATE TABLE transaction_logs (
    id BIGSERIAL,
    wallet_id INT NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- 2. Tạo 3 Bảng Con (Partitions) cho Tháng 1, Tháng 2 và Tháng 3 năm 2026
CREATE TABLE transaction_logs_2026_01 PARTITION OF transaction_logs
    FOR VALUES FROM ('2026-01-01 00:00:00+07') TO ('2026-02-01 00:00:00+07');

CREATE TABLE transaction_logs_2026_02 PARTITION OF transaction_logs
    FOR VALUES FROM ('2026-02-01 00:00:00+07') TO ('2026-03-01 00:00:00+07');

CREATE TABLE transaction_logs_2026_03 PARTITION OF transaction_logs
    FOR VALUES FROM ('2026-03-01 00:00:00+07') TO ('2026-04-01 00:00:00+07');

-- Tạo Index trên Bảng Mẹ -> PostgreSQL tự động tạo Index tương ứng cho cả 3 Bảng Con!
CREATE INDEX idx_tx_logs_wallet ON transaction_logs (wallet_id, created_at);

-- 3. Chèn dữ liệu vào Bảng Mẹ (PostgreSQL tự động phân loại vào đúng bảng con từng tháng)
INSERT INTO transaction_logs (wallet_id, amount, created_at) VALUES
(1, 50000,  '2026-01-15 10:00:00+07'),
(1, 120000, '2026-02-20 14:30:00+07'),
(1, 900000, '2026-03-10 09:00:00+07');

SELECT '=== 1. KIỂM TRA DỮ LIỆU ĐÃ TỰ ĐỘNG RƠI VÀO ĐÚNG BẢNG CON (tableoid::regclass) ===' AS step;
SELECT tableoid::regclass AS partition_table_name, id, wallet_id, amount, created_at
FROM transaction_logs;

SELECT '=== 2. KIỂM CHỨNG PARTITION PRUNING: Chỉ hỏi dữ liệu Tháng 02/2026 ===' AS step;
-- Quan sát kết quả EXPLAIN: Chỉ có bảng 'transaction_logs_2026_02' được quét, Tháng 01 và 03 bị bỏ qua hoàn toàn!
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM transaction_logs
WHERE wallet_id = 1
  AND created_at >= TIMESTAMPTZ '2026-02-01 00:00:00+07'
  AND created_at <  TIMESTAMPTZ '2026-03-01 00:00:00+07';
EOF
```

---

# 📘 MODULE 09: CONNECTION POOLING (`PgBouncer`), TUNING CẤU HÌNH & BỘ CÔNG CỤ CHẨN ĐOÁN PRODUCTION

> 🎯 **Mục tiêu:** Hiểu tại sao PostgreSQL sập ngay khi mở `500–1.000` kết nối trực tiếp từ nhiều container NestJS, cách dùng **`PgBouncer`** ở chế độ `transaction pooling`, cách tính 5 tham số `postgresql.conf` quan trọng nhất và viết bộ truy vấn **"Bác sĩ Đa khoa Database"** bằng `pg_stat_statements`.

## 1. Lý thuyết Chuyên sâu

### 1.1. Tại sao chạy nhiều Container NestJS lại gặp lỗi `FATAL: sorry, too many clients already`?
Khác với Node.js hay Redis (xử lý hàng vạn kết nối trên 1 tiến trình), kiến trúc của PostgreSQL là **Process-per-Connection (Mỗi kết nối là 1 tiến trình hệ điều hành riêng biệt)**:
* Mỗi khi ứng dụng của bạn mở 1 kết nối tới PostgreSQL, tiến trình mẹ `postmaster` phải gọi hàm `fork()` để đẻ ra 1 tiến trình hệ điều hành mới tốn từ **`5 MB – 10 MB RAM`**!
* Giả sử bạn dùng Kubernetes / Docker Swarm chạy **20 container NestJS**, cộng thêm **10 container Worker** chạy ngầm. Mỗi container cấu hình `connection_limit = 20`.
  $$\text{Tổng kết nối} = (20 + 10) \times 20 = 600 \text{ kết nối đồng thời!}$$
* Khi có 600 tiến trình hệ điều hành cùng tranh nhau 4 hoặc 8 nhân CPU trên VPS, hệ điều hành dành toàn bộ thời gian chỉ để chuyển ngữ cảnh (**CPU Context Switching**) làm Database đơ cứng!

```
KHÔNG DÙNG PGBOUNCER (Thảm họa khi Scale nhiều Container):
  [20 Containers NestJS] ===(600 Kết nối vật lý)===> [PostgreSQL: Phải đẻ ra 600 OS Processes! -> Nổ RAM/CPU]

CÓ PGBOUNCER Ở CHẾ ĐỘ TRANSACTION POOLING (Chuẩn Production):
  [20 Containers NestJS] ===(600 Kết nối nhẹ)===> [PgBouncer] ===(Chỉ giữ 25 Kết nối thật!)===> [PostgreSQL]
```

* **Cách hoạt động của `PgBouncer` (`pool_mode = transaction`):**
  * `PgBouncer` đứng trước PostgreSQL, có thể nhận **2.000 – 5.000 kết nối** từ các container NestJS (vì mỗi kết nối ở PgBouncer chỉ tốn đúng `2 KB RAM`).
  * Nhưng phía sau lưng, `PgBouncer` chỉ mở **đúng 20 – 30 kết nối vật lý thật** tới PostgreSQL!
  * Khi Container A bắt đầu một câu lệnh hoặc một `BEGIN ... COMMIT`, PgBouncer cho mượn 1 kết nối thật trong `2 ms`. Ngay khi `COMMIT` xong, PgBouncer thu hồi kết nối đó cho Container B mượn tiếp!

---

### 1.2. Bảng Công Thức Vàng Tinh Chỉnh `postgresql.conf` trên VPS Production

Đừng bao giờ chạy PostgreSQL trên VPS với cấu hình mặc định (vì cấu hình mặc định của Postgres được thiết kế để chạy vừa trên chiếc máy tính nhúng chỉ có `512 MB RAM`!). Giả sử VPS Database của bạn có **`16 GB RAM` và ổ cứng `SSD NVMe`**:

| Tham số trong `postgresql.conf` | Giá trị mặc định (Rất thấp) | Công thức chuẩn cho VPS `16 GB RAM` | Tác dụng thực tế |
| :--- | :--- | :--- | :--- |
| **`shared_buffers`** | `128 MB` | **$25\% \text{ RAM}$** (`4 GB`) | Bộ nhớ đệm RAM chính của riêng PostgreSQL để lưu các trang $8\text{ KB}$ hay đọc nhất. |
| **`effective_cache_size`** | `4 GB` | **$75\% \text{ RAM}$** (`12 GB`) | Báo cho Query Planner biết tổng lượng RAM khả dụng (gồm cả OS Page Cache) để nó tự tin ưu tiên chọn `Index Scan` thay vì `Seq Scan`. |
| **`work_mem`** | `4 MB` | `16 MB` – `64 MB` | Bộ nhớ cấp cho **mỗi phép `ORDER BY` hoặc `Hash Join`**. Nếu quá nhỏ, Postgres phải ghi file tạm ra đĩa (`temp written` trong `EXPLAIN`). |
| **`maintenance_work_mem`** | `64 MB` | `512 MB` – `1 GB` | Tăng tốc độ chạy `VACUUM`, `CREATE INDEX` và `ALTER TABLE` lên gấp nhiều lần. |
| **`random_page_cost`** | `4.0` *(Cho ổ HDD cơ cũ)* | **`1.1`** *(Bắt buộc trên SSD/NVMe!)* | Mặc định Postgres tưởng đọc ngẫu nhiên đắt gấp 4 lần đọc tuần tự nên hay ngại dùng Index. Hạ xuống `1.1` giúp Postgres tích cực dùng Index hơn hẳn! |

---

## 2. Thực hành Tương tác: Chạy Bộ Script "Bác Sĩ Chẩn Đoán Database" Trên Production

Khi hệ thống của bạn bị chậm bất thường, một DBA chuyên nghiệp sẽ chạy ngay **4 câu truy vấn chẩn đoán dưới đây** để tìm ra thủ phạm trong vòng 30 giây:
1. Kiểm tra **Tỷ lệ Đọc trúng RAM (Buffer Cache Hit Ratio)** — Chuẩn Production phải đạt **$\ge 99\%$**.
2. Truy tìm **Top 5 câu lệnh SQL ngốn tổng thời gian CPU/I/O nhiều nhất** toàn hệ thống qua `pg_stat_statements`.
3. Tìm các bảng lớn đang bị **thiếu Index trầm trọng** (số lần `Seq Scan` cao bất thường).
4. Tìm các **Index dư thừa không ai dùng** (`idx_scan = 0`) đang làm chậm tốc độ `INSERT`/`UPDATE` và tốn ổ cứng vô ích.

👉 **Bấm `▶ Run` để chạy Bộ Chẩn Đoán Sức Khỏe Toàn Diện trên Database của chúng ta:**

```bash
docker container exec -i pg-mastery-lab psql -U master -d ecommerce_prod << 'EOF'
\pset pager off

SELECT '=== 1. KIỂM TRA BUFFER CACHE HIT RATIO (Mục tiêu Production: > 99%) ===' AS report;
SELECT
    sum(heap_blks_read) AS blocks_read_from_disk,
    sum(heap_blks_hit)  AS blocks_hit_in_ram,
    ROUND(
        sum(heap_blks_hit) * 100.0 / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0),
        2
    ) || '%' AS cache_hit_ratio
FROM pg_statio_user_tables;

SELECT '=== 2. TOP 5 CÂU LỆNH SQL TỐN THỜI GIAN NHẤT HỆ THỐNG (pg_stat_statements) ===' AS report;
SELECT
    calls AS so_lan_goi,
    ROUND(total_exec_time::NUMERIC, 2) AS tong_thoi_gian_ms,
    ROUND(mean_exec_time::NUMERIC, 2) AS trung_binh_moi_lan_ms,
    rows AS tong_so_dong,
    LEFT(query, 85) AS cau_lenh_sql
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = 'ecommerce_prod')
ORDER BY total_exec_time DESC
LIMIT 5;

SELECT '=== 3. PHÁT HIỆN BẢNG ĐANG BỊ QUÉT TUẦN TỰ (SEQ SCAN) NHIỀU BẤT THƯỜNG ===' AS report;
SELECT
    relname AS table_name,
    seq_scan AS so_lan_quet_toan_bang,
    idx_scan AS so_lan_dung_index,
    n_live_tup AS so_dong_hien_tai
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
EOF
```

---

# 🧹 TRẠM DỌN DẸP PHÒNG LAB (AN TOÀN 100% CHO MÁY CHÍNH)

Sau khi đã hoàn thành trọn vẹn các bài thực hành và muốn xóa sạch container PostgreSQL cùng toàn bộ dữ liệu 1 triệu dòng để giải phóng RAM và ổ cứng, bạn chỉ cần bấm **`▶ Run`** ở ô dưới đây:

```bash
docker container rm -f pg-mastery-lab 2>/dev/null || true
rm -rf postgres-mastery-lab
echo "✨ Đã tắt container PostgreSQL và dọn dẹp sạch sẽ 100% phòng Lab!"
```