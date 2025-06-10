D. Vé chuyến bay

1. Thêm vé chuyến bay 
# http://localhost:5000/api/vechuyenbay/add
methods = POST
body = {
        "Ma_chuyen_bay": 1,
        "Ma_hang_ve": 1,
        "vitri": "B4.1",
        "Ho_ten": "nguyen van a",
        "cmnd": "116468466314",
        "sdt": "24544346",
        "gioi_tinh": "Nam"
    }
 

dữ liệu trả về:

- {
    "message": "Đặt vé thành công",
    "ve": {
        "Ma_chuyen_bay": 7,
        "Ma_hanh_khach": 4,
        "Ma_ve": 2,
        "Tien_ve": 525000.0,
        "hang_ve": 1,
        "vi_tri": "B4.12"
    },
    "status": "success"
}

- {
    "message": "{Lỗi}",
    "status": "fail"
}


2. Xem chuyến bay theo id chuyến bay
# http://localhost:5000/api/vechuyenbay/get/<int:id>
methods = GET
ví dụ:

# http://localhost:5000/api/vechuyenbay/get/1

dữ liệu trả về:
- {
    "data": {
        "Ma_chuyen_bay": 7,
        "Ma_hang_ve": 1,
        "Ma_hanh_khach": 1,
        "vi_tri": "B4.1"
    },
    "message": "Lấy dữ liệu thành công",
    "status": "success"
}, 200

- {
    "message": "Không tìm thấy vé"
}

- {
    "message": "{Lỗi}",
    "status": "fail"
}



3. Xem tất cả chuyến bay mà hành khách đã đặt

# link api: http://localhost:5000/api/hanhkhach/get/<int:id>
methods = GET

ví dụ


Dữ liệu trả về

- {
    "data": [
        {
            "Ma_chuyen_bay": 7,
            "Ma_hang_ve": 1,
            "Ma_ve": 1,
            "Tien_ve": 525000.0,
            "vi_tri": "B4.1"
        },
        {
            "Ma_chuyen_bay": 15,
            "Ma_hang_ve": 1,
            "Ma_ve": 9,
            "Tien_ve": 1100000.0,
            "vi_tri": "B4.1"
        }
    ],
    "message": "Lấy vé thành công",
    "status": "success"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}


4. Xem tất cả chuyến bay mà hành khách đã đặt qua cmnd

# link api: http://localhost:5000/api/vechuyenbay/get_by_hanhkhach/cmnd/<string:hk_cccd>
methods = GET


ví dụ:

http://localhost:8000/api/vechuyenbay/get_by_hanhkhach/cmnd/11646846614


dữ liệu trả về :

- {
    "data": [
        {
            "Ma_chuyen_bay": 7,
            "Ma_hang_ve": 1,
            "Ma_ve": 2,
            "Tien_ve": 525000.0,
            "vi_tri": "B4.12"
        },
       
        {
            "Ma_chuyen_bay": 9,
            "Ma_hang_ve": 1,
            "Ma_ve": 7,
            "Tien_ve": 550000.0,
            "vi_tri": "B4.1"
        },
        {
            "Ma_chuyen_bay": 9,
            "Ma_hang_ve": 1,
            "Ma_ve": 8,
            "Tien_ve": 550000.0,
            "vi_tri": "B4.15"
        }
    ],
    "id_hanhkhach": 4,
    "message": "Lấy vé thành công",
    "status": "success"
}

- {
    "message": "{Lỗi}",
    "status": "fail"
}


5. Cập nhật vị trí ghế của vé chuyến bay
# link api: http://localhost:5000/api/vechuyenbay/update/vitriGhe/<int:id>
methods = PUT

ví dụ: 

http://localhost:5000/api/vechuyenbay/update/vitriGhe/4
body = {
    "vitri": "B4.12"
}

Dữ liệu trả về:
- {
    "message": "Cập nhật vị trí ghế thành công",
    "status": "success"
}
- {
    "message": "Lỗi cập nhật vị trí ghế: Ghế đã được đặt",
    "status": "fail"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}

6. Danh sách các vé đã đặt hôm nay
# link api: http://localhost:5000/api/vechuyenbay/get/DatHomNay
methods = GET

Dữ liệu trả về


- {
    "data": [
        {
            "Ma_chuyen_bay": 27,
            "Ma_hang_ve": 1,
            "Ma_ve": 21,
            "Tien_ve": 550000.0,
            "vi_tri": "B4.1"
        }
    ],
    "message": "Lấy vé thành công",
    "status": "success"
}

- {
    "message": "{Lỗi}",
    "status": "fail"
}