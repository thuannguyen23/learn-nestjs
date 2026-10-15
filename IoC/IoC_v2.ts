/**
 * ============================================================================
 * VERSION V2: ÁP DỤNG INVERSION OF CONTROL (IoC) & DEPENDENCY INJECTION (DI)
 * ============================================================================
 * 
 * Mục tiêu khắc phục các nhược điểm ở bản v1:
 * - Khử bỏ Tight Coupling (Gắn kết chặt).
 * - Tuân thủ nguyên lý OCP (Open/Closed Principle) & DIP (Dependency Inversion Principle).
 * - Dễ dàng mở rộng loại xe mới và hỗ trợ viết Unit Test.
 */

// ============================================================================
// 1. ABSTRACTION (HỢP ĐỒNG CHUNG - GIẢI QUYẾT NGUYÊN LÝ DIP)
// ============================================================================
// Thay vì phụ thuộc vào một class xe cụ thể, tất cả các module cấp cao và cấp thấp
// đều phải phụ thuộc vào Abstraction này.
export interface ICar {
  produceCar(): void;
}

// ============================================================================
// 2. LOW-LEVEL MODULES (CÁC TRIỂN KHAI CỤ THỂ)
// ============================================================================
export class TeamCarVF8 implements ICar {
  produceCar(): void {
    console.log("Start Car: --> VF8");
  }
}

export class TeamCarVF9 implements ICar {
  produceCar(): void {
    console.log("Start Car: --> VF9");
  }
}

// Khi mở rộng thêm xe mới (ví dụ: VF3), chỉ cần tạo class mới và implements ICar.
// KHÔNG CẦN chỉnh sửa bất kỳ dòng code nào trong TeamLead hay TeamCompany (Thỏa mãn OCP).
export class TeamCarVF3 implements ICar {
  produceCar(): void {
    console.log("Start Car: --> VF3");
  }
}

// ============================================================================
// 3. HIGH-LEVEL MODULES (ÁP DỤNG DEPENDENCY INJECTION QUA CONSTRUCTOR)
// ============================================================================
export class TeamLead {
  /**
   * INVERSION OF CONTROL (IoC) & DEPENDENCY INJECTION (DI):
   * - TeamLead bị tước quyền tự khởi tạo đối tượng phụ thuộc (`new TeamCar...`).
   * - Quyền kiểm soát việc đưa xe nào vào được chuyển giao cho bên ngoài (Inversion of Control).
   * - Xe được "tiêm" vào qua Constructor (Constructor Injection).
   * - TeamLead chỉ quan tâm đối tượng nhận vào tuân thủ interface `ICar`.
   */
  constructor(private car: ICar) {}

  task(): void {
    this.car.produceCar();
  }
}

export class TeamCompany {
  /**
   * Tương tự, TeamCompany nhận TeamLead từ bên ngoài thay vì tự khởi tạo bên trong.
   */
  constructor(private teamLead: TeamLead) {}

  start(): void {
    this.teamLead.task();
  }
}

// ============================================================================
// 4. COMPOSITION ROOT (ĐIỂM RÁP NỐI & KHỞI CHẠY CHƯƠNG TRÌNH)
// ============================================================================
// Tại đây, ta tự do quyết định xe nào sẽ được cấp phát cho TeamLead:
const currentCar: ICar = new TeamCarVF3(); // Thay đổi giữa VF8, VF9, VF3 chỉ sửa duy nhất tại đây

const teamLead = new TeamLead(currentCar);
const teamCompany = new TeamCompany(teamLead);

teamCompany.start();

/**
 * ============================================================================
 * TỔNG KẾT NHỮNG ĐIỂM CẢI TIẾN TRONG BẢN V2:
 * ============================================================================
 * 
 * 1. Loose Coupling (Gắn kết lỏng):
 *    - TeamLead hoàn toàn tách biệt khỏi các class cụ thể (TeamCarVF8/VF9/VF3).
 * 
 * 2. Thỏa mãn OCP (Open/Closed Principle):
 *    - TeamLead "đóng" với việc sửa đổi nhưng "mở" cho việc mở rộng (thêm VF3, VF5, VF7...).
 * 
 * 3. Thỏa mãn DIP (Dependency Inversion Principle):
 *    - TeamLead (cấp cao) và TeamCar (cấp thấp) đều phụ thuộc vào ICar (Abstraction).
 * 
 * 4. Dễ dàng viết Unit Test (Testability):
 *    - Có thể truyền một Fake/Mock object vào TeamLead:
 *      const mockCar: ICar = { produceCar: () => console.log('Mocked Car') };
 *      const testLead = new TeamLead(mockCar);
 * 
 * 5. Giới hạn còn lại (Bước đệm sang NestJS):
 *    - Đây là Manual Dependency Injection (DI thủ công). Ta vẫn phải tự tay gõ lệnh `new`
 *      ở Composition Root. 
 *    - Trong NestJS, công việc ráp nối này sẽ được tự động hóa hoàn toàn bởi IoC Container.
 * ============================================================================
 */
