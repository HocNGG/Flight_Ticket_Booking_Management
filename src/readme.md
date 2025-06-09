C. Chuyến Bay


1. Thêm chuyến bay mới

# http://localhost:5000/api/chuyenbay/add
body = {
    "Ma_chuyen_bay": 6,
    "Ma_san_bay_di": "HNOI",
    "Ma_san_bay_den": "SGON",
    "gia_ve": 500000,
    "ngay_khoi_hanh": "2025-04-25",
    "gio_khoi_hanh": "00:00:00",
    "thoi_gian_bay": 30,
    "chitiet":[
        {
            "Ma_san_bay_trung_gian": "DNANG",
            "thoigian_dung": 15,
            "ghichu": "Trung gian 1"
        },
        {
            "Ma_san_bay_trung_gian": "Vinh",
            "thoigian_dung": 15,
            "ghichu": "Trung gian 2"
        }
    ],
    "hangve": [
        {
            "Ma_hang_ve": 1,
            "So_ghe_trong_hang": 50
        },
        {
            "Ma_hang_ve": 2,
            "So_ghe_trong_hang": 50
        }
    ]
}    

method = POST
  
dữ liệu trả về:
- {
    "message": "Chuyến bay đã được thêm thành công!",
    "status": "success"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}


2. Xem chuyến bay theo id chuyến bay
# http://localhost:5000/api/chuyenbay/get/<id>
method = POST

ví dụ:
# http://localhost:5000/api/chuyenbay/get/6

Dữ liệu trả về:
- {
    "data": {
        "Ma_chuyen_bay": 6,
        "Ma_san_bay_den": "SGON",
        "Ma_san_bay_di": "HNOI",
        "So_ghe_dat": 0,
        "So_ghe_trong": 100,
        "Thoi_gian_bay": 40,
        "chitiet_hangve": [
            {
                "Gia_ve": 1100000.0,
                "Ma_chuyen_bay": 6,
                "Ma_hang_ve": 1,
                "So_ve_da_dat": 0,
                "So_ve_trong": 50
            },
            {
                "Gia_ve": 1050000.0,
                "Ma_chuyen_bay": 6,
                "Ma_hang_ve": 2,
                "So_ve_da_dat": 0,
                "So_ve_trong": 50
            }
        ],
        "chitiet_sanbay_trung_gian": [],
        "gia_ve": 1000000.0,
        "gio_khoi_hanh": "00:00:00",
        "gio_toi": "00:40:00",
        "ngay_khoi_hanh": "2025-04-25",
        "ngay_toi": "2025-04-25"
    },
    "message": "Lấy dữ liệu thành công",
    "status": "success"
}

- {
    "message": "{Lỗi}",
    "status": "fail"
}


3. Xem chuyến bay trong khoảng thời gian, từ sân bay đi đến sân bay đến
# http://localhost:5000/api/chuyenbay/search?start_time={datetime}&end_time={datetime}&sanbay_di={from}&sanbay_den={to}

method = GET

time ở dạng ISO 8601 
ví dụ: 2026-04-25T23:59:59

# http://localhost:5000/api/chuyenbay/search?start_time=2025-04-20T00:00:00&end_time=2026-04-25T23:59:59&sanbay_di=HAIPHONG&sanbay_den=SGON

dữ liệu trả về:
- {
    "data": [
        {
            "Ma_chuyen_bay": 6,
            "Ma_san_bay_den": "SGON",
            "Ma_san_bay_di": "HNOI",
            "So_ghe_dat": 0,
            "So_ghe_trong": 100,
            "Thoi_gian_bay": 40,
            "chitiet_hangve": [
                {
                    "Gia_ve": 1100000.0,
                    "Ma_chuyen_bay": 6,
                    "Ma_hang_ve": 1,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                },
                {
                    "Gia_ve": 1050000.0,
                    "Ma_chuyen_bay": 6,
                    "Ma_hang_ve": 2,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                }
            ],
            "chitiet_sanbay_trung_gian": [],
            "gia_ve": 1000000.0,
            "gio_khoi_hanh": "00:00:00",
            "gio_toi": "00:40:00",
            "ngay_khoi_hanh": "2025-04-25",
            "ngay_toi": "2025-04-25"
        },
        {
            "Ma_chuyen_bay": 20,
            "Ma_san_bay_den": "SGON",
            "Ma_san_bay_di": "HNOI",
            "So_ghe_dat": 0,
            "So_ghe_trong": 100,
            "Thoi_gian_bay": 30,
            "chitiet_hangve": [
                {
                    "Gia_ve": 550000.0,
                    "Ma_chuyen_bay": 20,
                    "Ma_hang_ve": 1,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                },
                {
                    "Gia_ve": 500000.0,
                    "Ma_chuyen_bay": 20,
                    "Ma_hang_ve": 2,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                }
            ],
            "chitiet_sanbay_trung_gian": [
                {
                    "ghi_chu": "Trung gian 1",
                    "ma_chuyen_bay": 20,
                    "ma_san_bay_trung_gian": "DNANG",
                    "thoi_gian_dung": 15
                },
                {
                    "ghi_chu": "Trung gian 2",
                    "ma_chuyen_bay": 20,
                    "ma_san_bay_trung_gian": "Vinh",
                    "thoi_gian_dung": 15
                }
            ],
            "gia_ve": 500000.0,
            "gio_khoi_hanh": "00:00:00",
            "gio_toi": "00:30:00",
            "ngay_khoi_hanh": "2025-04-25",
            "ngay_toi": "2025-04-25"
        },
        {
            "Ma_chuyen_bay": 27,
            "Ma_san_bay_den": "SGON",
            "Ma_san_bay_di": "HNOI",
            "So_ghe_dat": 0,
            "So_ghe_trong": 100,
            "Thoi_gian_bay": 30,
            "chitiet_hangve": [
                {
                    "Gia_ve": 550000.0,
                    "Ma_chuyen_bay": 27,
                    "Ma_hang_ve": 1,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                },
                {
                    "Gia_ve": 500000.0,
                    "Ma_chuyen_bay": 27,
                    "Ma_hang_ve": 2,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                }
            ],
            "chitiet_sanbay_trung_gian": [],
            "gia_ve": 500000.0,
            "gio_khoi_hanh": "00:00:00",
            "gio_toi": "00:30:00",
            "ngay_khoi_hanh": "2025-08-25",
            "ngay_toi": "2025-08-25"
        },
        {
            "Ma_chuyen_bay": 34,
            "Ma_san_bay_den": "SGON",
            "Ma_san_bay_di": "HNOI",
            "So_ghe_dat": 1,
            "So_ghe_trong": 99,
            "Thoi_gian_bay": 180,
            "chitiet_hangve": [
                {
                    "Gia_ve": 550000.0,
                    "Ma_chuyen_bay": 34,
                    "Ma_hang_ve": 1,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                },
                {
                    "Gia_ve": 500000.0,
                    "Ma_chuyen_bay": 34,
                    "Ma_hang_ve": 2,
                    "So_ve_da_dat": 1,
                    "So_ve_trong": 49
                }
            ],
            "chitiet_sanbay_trung_gian": [],
            "gia_ve": 500000.0,
            "gio_khoi_hanh": "08:00:00",
            "gio_toi": "11:00:00",
            "ngay_khoi_hanh": "2025-06-01",
            "ngay_toi": "2025-06-01"
        },
        {
            "Ma_chuyen_bay": 35,
            "Ma_san_bay_den": "SGON",
            "Ma_san_bay_di": "HNOI",
            "So_ghe_dat": 0,
            "So_ghe_trong": 100,
            "Thoi_gian_bay": 150,
            "chitiet_hangve": [
                {
                    "Gia_ve": 1705000.0,
                    "Ma_chuyen_bay": 35,
                    "Ma_hang_ve": 1,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                },
                {
                    "Gia_ve": 1550000.0,
                    "Ma_chuyen_bay": 35,
                    "Ma_hang_ve": 2,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                }
            ],
            "chitiet_sanbay_trung_gian": [],
            "gia_ve": 1550000.0,
            "gio_khoi_hanh": "14:30:00",
            "gio_toi": "17:00:00",
            "ngay_khoi_hanh": "2025-06-01",
            "ngay_toi": "2025-06-01"
        },
        {
            "Ma_chuyen_bay": 36,
            "Ma_san_bay_den": "SGON",
            "Ma_san_bay_di": "HNOI",
            "So_ghe_dat": 0,
            "So_ghe_trong": 100,
            "Thoi_gian_bay": 200,
            "chitiet_hangve": [
                {
                    "Gia_ve": 2805000.0,
                    "Ma_chuyen_bay": 36,
                    "Ma_hang_ve": 1,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                },
                {
                    "Gia_ve": 2550000.0,
                    "Ma_chuyen_bay": 36,
                    "Ma_hang_ve": 2,
                    "So_ve_da_dat": 0,
                    "So_ve_trong": 50
                }
            ],
            "chitiet_sanbay_trung_gian": [],
            "gia_ve": 2550000.0,
            "gio_khoi_hanh": "19:15:00",
            "gio_toi": "22:35:00",
            "ngay_khoi_hanh": "2025-06-01",
            "ngay_toi": "2025-06-01"
        }
    ],
    "message": "Lấy danh sách chuyến bay thành công",
    "status": "success"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}



4. Cập nhật chuyến bay

NOTE: chỉ có thể cập nhật ngày giờ bay, thời gian bay trên không và giá vé

# link api: http://localhost:5000/api/chuyenbay/update/<id>
methods = PUT

ví dụ:
# http://localhost:5000/api/chuyenbay/update/6

body = {
    "ngay_khoi_hanh": "2025-04-25",
    "gio_khoi_hanh": "00:00:00",
    "gia_ve": 1000000,
    "Thoi_gian_bay": 40
}

NOTE: dữ liệu nào thay đổi thì mới gửi lên server. Giả sử không cập nhật giá vé có thể gửi body như này: (
    body = {
    "ngay_khoi_hanh": "2025-04-25",
    "gio_khoi_hanh": "00:00:00",
    "Thoi_gian_bay": 40
    }
). Điều này giúp giảm mức xử lý ở server. Ngày giờ phải được định dạng đúng như ví dụ.


dữ liệu trả về: 

- {
    "message": "Chuyến bay đã được cập nhật thành công!",
    "status": "success"
}
- {
    "message": "{Lỗi}",
    "status": "fail"
}
