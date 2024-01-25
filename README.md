THIẾT BỊ ĐO KHÍ GAS CẦM TAY

Mô tả

Dự án này được sử dụng làm đồ án tốt nghiệp cho tôi. Thiết bị có 2 tính năng chính:
- Đo đạc lượng khí gas(CH4, LPG), nhiệt độ và độ ẩm theo 1 chu trình cố định (dạng gắn tại chỗ)
- Đo đạc lượng khí gas(CH4, LPG), nhiệt độ và độ ẩm khi có yêu cầu (dạng cầm tay)

Trong dự án, tôi sử dụng các công nghệ sau:
- cảm biến MQ5
- STM32
- ESP01
- MongoDB
- NodeJS

STM32 được dùng với các nhiệm vụ sau:
- Đọc dữ liệu từ cảm biến khí gas MQ5
- Xử lý các nút nhấn để thực hiện các yêu cầu của User 
- Gửi dữ liệu tới ESP01 để xử lý truyền thông

ESP01 được dùng với các nhiệm vụ sau:

- Nhận dữ liệu từ STM32
- Gửi dữ liệu tới server chạy bằng NodeJs

MongoDB và NodeJs dùng với các nhiệm vụ sau:
- Node dùng để điều hướng dữ liệu được gửi tới, lưu vào MongoDB
- MongoDB dùng dể lưu trữ dữ liệu và hiển thị trên web
