import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button  } from "react-bootstrap"
import "../style/Login.css"
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://dangky-daybu-backend.onrender.com/auth/login', { username, password });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);

                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                alert('Đăng nhập thất bại! Vui lòng thử lại.');
            }
        } catch (error) {
            alert('Sai thông tin đăng nhập!Vui lòng thử lại.');
        }
    };

    return (
        <div className='login-body'>
        <div className="login-container">
        <div >
            <form onSubmit={handleLogin} >
            <h2>Đăng Nhập</h2>
                <input className='login-input' type="text" placeholder="Tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input className='login-input'  type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button  type="submit">Đăng nhập</Button>
           
       
            </form>
             <div style={{display:"flex",justifyContent:"center"}}>
         <p className='login-sp'>Tư vấn & hỗ trợ: </p>
            <p className='login-sdt'>&nbsp;0915393154</p>
         </div>
            
        </div>
        </div>
        </div>
    );
};

export default Login;
