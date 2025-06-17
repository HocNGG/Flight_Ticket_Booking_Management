1. Tạo url thanh thanh toán
# Link: http://localhost:5000/api/vnpay/create_payment
methods = POST


ví dụ
# Link: http://localhost:5000/api/vnpay/create_payment

body = {
    "price": 100000,
    "order_id": "HocGay_06-11-2025"
}

NOTE: price: giá vé máy bay
    order_id: front end tự đặt 

Dữ liệu trả về là đường linh thanh toán, front end chỉ cần mở ra sẽ tới trang thanh toán. 
Chỉ có thể thanh toán qua thẻ ngân hàng.
tài khoản thẻ

Thẻ test:

Ngân hàng       	|    NCB
Số thẻ	            |    9704198526191432198
Tên chủ thẻ	        |    NGUYEN VAN A
Ngày phát hành	    |    07/15
Mật khẩu OTP	    |    123456




dữ liệu trả về:

- {
    "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000000&vnp_Command=pay&vnp_CreateDate=20250611145753&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Payment+for+order&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fpayment_return&vnp_TmnCode=OMDGFKPB&vnp_TxnRef=1234567890&vnp_Version=2.1.0&vnp_SecureHash=8bcd3b8596269014e738ef8faf75f6115d2fb14e1566f267445e4e9c8b3adbdb3ff4beba964e4980766e92adfd69d9577d239dfe116a7a0fecee40cd1cbbae31",
    "status": "success"
}

- {'error': str(e), 'status': 'fail'}


2. Trả về dữ liệu thanh toán
thanh toán xong sẽ có 1 api trả về và tự động in ra màn hình
# Link: http://localhost:5000/api/vnpay/payment_return
methods = GET


Ví  dụ: 
http://localhost:5000/api/payment_return?vnp_Amount=300000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP15012715&vnp_CardType=ATM&vnp_OrderInfo=Payment+for+order&vnp_PayDate=20250611144610&vnp_ResponseCode=00&vnp_TmnCode=OMDGFKPB&vnp_TransactionNo=15012715&vnp_TransactionStatus=00&vnp_TxnRef=02d9ee9c-7da5-4dba-8498-3eebbfbb5924&vnp_SecureHash=7afa58fdd51352af0b5d1303047672a0c63f1c5ec4ec983dc51b818b1769ab9bed320503ac6d86122afef1b25054fd712d80a49a9b02f7be1f9efd6572e37d0a

Dữ liệu trả về: 

-   {
    "amount": 3000000.0,
    "order_desc": "Payment for order",
    "order_id": "02d9ee9c-7da5-4dba-8498-3eebbfbb5924",
    "result": "Thành công",
    "status": "success",
    "title": "Kết quả thanh toán",
    "vnp_ResponseCode": "00",
    "vnp_TransactionNo": "15012715"
}

-  {
    "amount": 100000.0,
    "order_desc": "Payment for order",
    "order_id": "12345ss67890",
    "result": "Lỗi",
    "status": "fail",
    "title": "Kết quả thanh toán",
    "vnp_ResponseCode": "24",
    "vnp_TransactionNo": "0"
}