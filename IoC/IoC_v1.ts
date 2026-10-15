// IoC in NestJS

class TeamCarVF8 {
  //
  produceCar() {
    console.log("Start Car: --> VF8");
  }
}

class TeamCarVF9 {
  //
  produceCar() {
    console.log("Start Car: --> VF9");
  }
}

class TeamLead {
  //

  // private teamCarVF8: TeamCarVF8 = new TeamCarVF8();
  private teamCarVF9: TeamCarVF9 = new TeamCarVF9();

  task() {
    // this.teamCarVF8.produceCar();
    this.teamCarVF9.produceCar();
  }
}

class TeamCompany {
  // start
  start() {
    const teamLead = new TeamLead();
    teamLead.task(); //
  }
}

const teamCompany = new TeamCompany();
teamCompany.start();

/**
 * ============================================================================
 * NHƯỢC ĐIỂM & VI PHẠM NGUYÊN LÝ THIẾT KẾ (VERSION V1 - CHƯA CÓ IoC / DI):
 * ============================================================================
 * 
 * 1. Tight Coupling (Gắn kết quá chặt):
 *    - TeamLead tự tạo instance của phụ thuộc bằng toán tử `new` (new TeamCarVF9()).
 *    - Bất kỳ thay đổi nào từ phía đối tượng phụ thuộc đều ảnh hưởng trực tiếp đến TeamLead.
 * 
 * 2. Vi phạm OCP (Open/Closed Principle - SOLID):
 *    - Nguyên lý: "Mở cho mở rộng, đóng cho sửa đổi".
 *    - Khi bổ sung dòng xe mới (VF3, VF5, VF7...), ta buộc phải sửa trực tiếp source code
 *      bên trong TeamLead (comment dòng cũ, tạo biến mới, sửa hàm task()).
 * 
 * 3. Vi phạm DIP (Dependency Inversion Principle - SOLID):
 *    - Module cấp cao (TeamLead) phụ thuộc trực tiếp vào module cấp thấp (TeamCarVF8/VF9).
 *    - Chuẩn thiết kế yêu cầu cả hai phải phụ thuộc vào một Abstraction (Interface chung).
 * 
 * 4. Khó viết Unit Test (Hard to Test):
 *    - Không thể truyền mock/stub đối tượng xe vào TeamLead vì dependency bị khởi tạo cứng bên trong.
 * 
 * 5. Khả năng tái sử dụng kém (Low Reusability):
 *    - TeamLead không thể dùng lại linh hoạt cho các loại xe hoặc nghiệp vụ khác.
 * ============================================================================
 */
