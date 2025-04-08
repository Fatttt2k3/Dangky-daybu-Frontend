    import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../style/Login.css"
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/auth/login', { username, password });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);

                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                alert('Đăng nhập thất bại!');
            }
        } catch (error) {
            alert('Lỗi đăng nhập!');
        }
    };

    return (
        <div className="login-container">
        <div className='login-form'>
             <h2>Đăng Nhập</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
           
        </div>
    );
};

export default Login;
