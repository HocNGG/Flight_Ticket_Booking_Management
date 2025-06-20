import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Kiểm tra nếu là admin
        if (data.data.position === 'admin') {
          // Lưu token và thông tin user vào localStorage
          localStorage.setItem('access_token', data.data.access_token);
          localStorage.setItem('refresh_token', data.data.refresh_token);
          localStorage.setItem('user', JSON.stringify({
            id: data.data.id,
            username: data.data.username,
            position: data.data.position
          }));
          // Chuyển hướng đến trang home cho admin
          navigate('/home');
        } else {
          // Nếu không phải admin, hiển thị thông báo và xóa form
          setError('Bạn không có quyền truy cập vào hệ thống');
          setFormData({ username: '', password: '' });
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <div className="login" style={{fontFamily: 'Inter, sans-serif'}}>  
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p>User Name</p>
        <input 
          className="pas-text" 
          type="text" 
          name="username" 
          placeholder="Enter UserName"
          value={formData.username}
          onChange={handleChange}
        />
        <p>Password</p>
        <input 
          className="pas-text" 
          type="password" 
          name="password" 
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input className="sub-text" type="submit" value="Login" />
      </form>
    </div>
  );
};

export default Login;
