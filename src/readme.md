B. Sân bay


1. Thêm sân bay mới
# http://localhost:5000/api/sanbay/add
method = POST
 
body = {
        "Ma_san_bay": "HNOI",
        "Ten_san_bay": "Ha noi"
    }

dữ liệu trả về:

- {
    "message": "Sân bay đã được thêm thành công!",
    "status": "success"
}


- {
    "message": "{Lỗi}",
    "status": "fail"
}


2. Xem tất cả các sân bay
# link api: http://localhost:5000/api/sanbay/get
method = GET

dữ liệu trả về:

- {
    "message": [
        {
            "Ma_san_bay": "DNANG",
            "Ten_san_bay": "Da Nang"
        },
        {
            "Ma_san_bay": "HNOI",
            "Ten_san_bay": "Ha noi"
        },
        {
            "Ma_san_bay": "VINH",
            "Ten_san_bay": "Nghe An"
        },
        {
            "Ma_san_bay": "SGON",
            "Ten_san_bay": "Sai Gon"
        }
    ],
    "status": "success"
}


- {
    "message": "{Lỗi}",
    "status": "fail"
}


3. Cập nhật tên sân bay
# link api: http://localhost:5000/api/sanbay/update/<id>
methods = PUT

ví dụ: http://localhost:5000/api/sanbay/update/UK

Dữ liệu trả về: 
- {
    "message": "Sân bay đã được cập nhật thành công!",
    "status": "success"
}
-{
    "message": "Sân bay không tồn tại",
    "status": "fail"
}


4. Xóa sân bay
# link api: http://localhost:5000/api/sanbay/delete/<id>
methods = DELETE

ví dụ: http://localhost:5000/api/sanbay/delete/UK

Dữ liệu trả về: 
- {
    "message": "Sân bay đã ngừng hoạt động!",
    "status": "success"
}
- {
    "message": "Sân bay không tồn tại",
    "status": "fail"
}