A. Hạng vé

1. Tạo hạng vé
# link api: http://localhost:5000/api/hangve/add 
body={
        "Ten_hang_ve": "Hang 1",
        "Ti_le_don_gia": 1.05
    }

method = POST

dữ liệu trả về:
- {
    "message": "Thêm hạng vé thành công!",
    "status": "success"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}



2. Xem tất cả hạng vé
# link api: http://localhost:5000/api/hangve/get
method = GET

dữ liệu trả về:
- {
    "message": [
        {
            "Ten_hang_ve": "Hang 1",
            "Ti_le_don_gia": 1.1,
            "id": 1
        },
        {
            "Ten_hang_ve": "Hang 2",
            "Ti_le_don_gia": 1.0,
            "id": 2
        },
        {
            "Ten_hang_ve": "Hang 3",
            "Ti_le_don_gia": 1.05,
            "id": 3
        }
    ],
    "status": "success"
}

- {
    "message": "{Lỗi}",
    "status": "fail"
}

3. Cập nhật hạng vé

# link api: http://localhost:5000/api/hangve/update/<id>
method = PUT

ví dụ: 
# http://localhost:5000/api/hangve/update/1

body = {
        "Ten_hang_ve": "Hang 1",
        "Ti_le_don_gia": 1.1
    }

NOTE:  dữ liệu nào thay đổi thì gửi lên server. Có thể gửi thế này :

    body = {
        "Ten_hang_ve": "Hang 1"
    }
    
    hoặc

    body = {
        "Ti_le_don_gia": 1.1
    }



dữ liệu trả về:

- {
    "message": "Cập nhật hạng vé thành công",
    "status": "success"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}


4. Xóa hạng vé
# link api: http://localhost:5000/api/hangve/delete/<id>
methods = DELETE

vi dụ: http://localhost:5000/api/hangve/delete/2

dữ liệu trả về:
- {
    "message": "Xóa hạng vé thành công",
    "status": "success"
}
- {
    "message": "Không tìm thấy hạng vé",
    "status": "fail"
}