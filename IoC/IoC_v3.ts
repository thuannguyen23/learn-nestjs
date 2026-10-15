import "reflect-metadata"; // BẮT BUỘC: Cho phép NestJS đọc metadata của class và constructor
import { Injectable, Inject, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

/**
 * ============================================================================
 * 1. ABSTRACTION (INTERFACE)
 * ============================================================================
 * Lưu ý quan trọng cho Beginner:
 * Interface trong TypeScript chỉ tồn tại khi viết code, khi compile ra JS
 * nó sẽ biến mất. Vì vậy, NestJS không thể dùng Interface làm token để tự tiêm,
 * mà ta cần đặt cho nó một "Tên định danh" (String Token).
 */
export interface ICar {
  produceCar(): void;
}

export const CAR_TOKEN = "CAR_TOKEN"; // Chuỗi định danh để NestJS nhận diện

// ============================================================================
// 2. PROVIDERS (CÁC DỊCH VỤ - ĐƯỢC ĐÁNH DẤU BẰNG @Injectable())
// ============================================================================

// @Injectable() báo cho NestJS biết: "Class này thuộc quyền quản lý của IoC Container"
@Injectable()
export class TeamCarVF8Service implements ICar {
  produceCar() {
    console.log("Start Car: --> [NestJS IoC] VF8");
  }
}

@Injectable()
export class TeamCarVF9Service implements ICar {
  produceCar() {
    console.log("Start Car: --> [NestJS IoC] VF9");
  }
}

@Injectable()
export class TeamLeadService {
  /**
   * ĐIỂM SÁNG GIÁ CỦA NESTJS:
   * - Bạn không gõ `new TeamCar...` ở bất kỳ đâu.
   * - @Inject(CAR_TOKEN) nói với NestJS: "Khi tạo tôi, hãy tìm xem trong Container
   *   cái gì được đăng ký với tên CAR_TOKEN rồi tiêm vào biến `car` này giúp tôi!"
   */
  constructor(@Inject(CAR_TOKEN) private readonly car: ICar) {}

  task() {
    this.car.produceCar();
  }
}

@Injectable()
export class TeamCompanyService {
  /**
   * Nếu tiêm một Class trực tiếp (không qua Interface), bạn thậm chí KHÔNG CẦN dùng @Inject()!
   * NestJS tự nhìn thấy kiểu `TeamLeadService` và tự động tìm instance để tiêm vào.
   */
  constructor(private readonly teamLead: TeamLeadService) {}

  start() {
    this.teamLead.task();
  }
}

// ============================================================================
// 3. MODULE (NƠI KHAI BÁO & CẤU HÌNH CHO IoC CONTAINER)
// ============================================================================
@Module({
  providers: [
    TeamCompanyService,
    TeamLeadService,
    // Cấu hình linh hoạt: Muốn đổi xe chỉ cần đổi useClass tại đây!
    {
      provide: CAR_TOKEN,
      useClass: TeamCarVF9Service, // Đang chọn sản xuất VF9
    },
  ],
})
export class AppModule {}

// ============================================================================
// 4. BOOTSTRAP (KHỞI ĐỘNG IoC CONTAINER)
// ============================================================================
async function bootstrap() {
  console.log("=== Đang khởi động NestJS IoC Container ===");

  // createApplicationContext: Khởi chạy NestJS ở chế độ Console/Standalone (không cần mở cổng web)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // Tắt log mặc định của NestJS cho output sạch đẹp
  });

  // Lấy đối tượng TeamCompanyService ra từ IoC Container
  // Bạn KHÔNG CẦN `new TeamLead` hay `new TeamCar` gì cả, NestJS đã tự ráp nối 100%!
  const company = app.get(TeamCompanyService);
  company.start();

  await app.close();
}

bootstrap();

/**
 * ============================================================================
 * GIẢI ĐÁP CỐT LÕI: TẠI SAO LÚC CẦN DÙNG @Inject(), LÚC LẠI KHÔNG?
 * ============================================================================
 * 
 * 1. NGUYÊN NHÂN TỪ TYPESCRIPT (TYPE ERASURE):
 *    - Trong TypeScript:
 *      + Class (VD: TeamLeadService): Vừa là Type, vừa là Object thật trong JavaScript.
 *        Khi compile sang .js, Class VẪN TỒN TẠI nguyên vẹn.
 *      + Interface (VD: ICar): Chỉ là bản thiết kế lúc gõ code.
 *        Khi compile sang .js, Interface BỊ XÓA HOÀN TOÀN (Type Erasure), không để lại dấu vết.
 * 
 * 2. CÁCH NESTJS "SOI" (REFLECTION) VÀO CONSTRUCTOR KHI CHẠY (RUNTIME):
 * 
 *    Trường hợp A: KHÔNG CẦN @Inject() (Khi tiêm Class cụ thể)
 *    --------------------------------------------------------------------------
 *    constructor(private readonly teamLead: TeamLeadService) {}
 * 
 *    -> Khi chạy, NestJS soi metadata thấy kiểu là Class `TeamLeadService`.
 *    -> NestJS: "Tôi biết rõ class này là ai trong JS rồi, tôi tự tạo và tiêm vào luôn!"
 * 
 *    Trường hợp B: BẮT BUỘC DÙNG @Inject() (Khi tiêm Interface hoặc Giá trị)
 *    --------------------------------------------------------------------------
 *    constructor(@Inject(CAR_TOKEN) private readonly car: ICar) {}
 * 
 *    -> Nếu không có @Inject(CAR_TOKEN), NestJS chỉ thấy kiểu dữ liệu là `Object` chung chung
 *       (do ICar đã bị xóa khi compile sang JS).
 *    -> NestJS sẽ bị "mù": "Trong hệ thống có hàng ngàn object, tôi biết lấy xe nào đưa cho bạn?"
 *    -> @Inject(CAR_TOKEN) đóng vai trò như chiếc "thẻ tên / biển số xe" để chỉ đường:
 *       "Hãy tìm thứ được đăng ký với tên CAR_TOKEN trong Module đưa cho tôi!"
 * 
 * 3. BẢNG TỔNG KẾT QUY TẮC VÀNG:
 *    ┌──────────────────────────────────┬─────────────────┬──────────────────────────────┐
 *    │ Kiểu phụ thuộc muốn tiêm         │ Cần @Inject()? │ Ví dụ cú pháp                │
 *    ├──────────────────────────────────┼─────────────────┼──────────────────────────────┤
 *    │ Class Service trực tiếp          │ ❌ KHÔNG CẦN    │ (private lead: TeamLead)     │
 *    │ Interface (ICar, IRepository...) │ ✅ BẮT BUỘC     │ (@Inject('TOKEN') car: ICar) │
 *    │ Chuỗi String, Config, API Key... │ ✅ BẮT BUỘC     │ (@Inject('API_KEY') key: str)│
 *    │ Database Connection, Object raw  │ ✅ BẮT BUỘC     │ (@Inject('DB_CONN') conn: any│
 *    └──────────────────────────────────┴─────────────────┴──────────────────────────────┘
 * ============================================================================
 */
