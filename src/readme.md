1. Đăng nhập
# http://localhost:5000/api/auth/login
methods = POST 
 
body = {
    "username": "john.doe",
    "password": "password123"
}

Dữ liệu trả về :
- {
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0OTI2MzEzNiwianRpIjoiYmNlZWM0YzEtZTE2OC00MjU5LTg1M2UtMjkzMDExN2VhMzdkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIiLCJuYmYiOjE3NDkyNjMxMzYsImNzcmYiOiI4NDg5ZjUwYi05ZDk5LTQ3M2ItYjA1Zi0wMzMxOTljZjRhMmUiLCJleHAiOjE3NDk2MjMxMzYsInVzZXJuYW1lIjoiam9obi5kb2UiLCJpZCI6MiwicG9zaXRpb24iOiJhZG1pbiJ9.oIWN2Qs7Lp5-e9pj92O4JLLlihHzwDJ5CLytyyC6rac",
        "id": 2,
        "position": "admin",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0OTI2MzEzNiwianRpIjoiYzk3MWU0MTktMjQ2Yy00OTM3LTg2ZGEtOTUxYTFiODhkZTE4IiwidHlwZSI6InJlZnJlc2giLCJzdWIiOiIyIiwibmJmIjoxNzQ5MjYzMTM2LCJjc3JmIjoiZDI5YzNiZmItMjlmMS00OTdkLThmMDktOWMyNmEwYWNjYzFkIiwiZXhwIjoxNzUyODYzMTM2LCJ1c2VybmFtZSI6ImpvaG4uZG9lIiwiaWQiOjIsInBvc2l0aW9uIjoiYWRtaW4ifQ.VB-_eIOH6Kb7Wftrsljah774fmVGUgaDxrmTJVh0qlc",
        "username": "john.doe"
    },
    "status": "success"
}
- {
    "message": "Tên tài khoản không tồn tại",
    "status": "fail"
}


-{
    "message": "Mật khẩu không chính xác",
    "status": "fail"
}