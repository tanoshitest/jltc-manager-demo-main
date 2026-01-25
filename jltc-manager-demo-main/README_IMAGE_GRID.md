# Instructions for Testing 4-Image Grid

## Để thấy 4 vùng ảnh hiển thị:

### Cách nhanh nhất:
1. **Đặt ảnh của bạn** vào thư mục `public/images/jlpt/mondai1/`:
   - `lamp1.png` - Ảnh cho vùng 1
   - `lamp2.png` - Ảnh cho vùng 2
   - `lamp3.png` - Ảnh cho vùng 3
   - `lamp4.png` - Ảnh cho vùng 4

2. **Chạy dev server** (nếu chưa chạy):
   ```bash
   npm run dev
   ```

3. **Truy cập trang exam**: 
   - Vào phần Listening (Section 3)
   - Câu hỏi đầu tiên ("1ばん") sẽ hiển thị 4 vùng ảnh

### Nếu chưa có ảnh:
- Bạn có thể dùng ảnh bất kỳ từ internet hoặc máy tính
- Hoặc tạo ảnh placeholder bằng tool online
- Tên file phải khớp chính xác: `lamp1.png`, `lamp2.png`, `lamp3.png`, `lamp4.png`

### Đã cập nhật:
- ✅ `JLPTImageGrid` component với 4 vùng ảnh to hơn
- ✅ Interface `JLPTQuestion` với field `imageGridUrls`
- ✅ `JLPTQuestionView` tích hợp hiển thị grid
- ✅ Listening question 1 đã sử dụng `imageGridUrls`
- ✅ Layout đã căn chỉnh đúng vị trí với question text

## Kích thước ảnh đề xuất:
- Tỷ lệ 4:3 (ví dụ: 800x600px)
- Định dạng: PNG hoặc JPG
