import React, { useState } from 'react';
import { AxiosError } from 'axios';
import './Login.css';
import { loginApi } from '../../api/Api';
import Layout from '../layout/Layout';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginApi(form);
      const token = response.data.token;

      console.log('로그인 성공:', response.data);
      localStorage.setItem('Authorization', token);
      dispatch(login({
        token: token,
        user: {
          userId: response.data.id,
          nickname: response.data.nickname,
          profileLink: response.data.nickprofileLink,
        }
      }));
      window.location.href = '/';
    } catch (err) {
      const error = err as AxiosError;
      const message =
        (error.response?.data as { message?: string })?.message ??
        '로그인 중 오류가 발생했습니다.';
      setError(message);
      alert(message);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>로그인</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일 주소</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일 주소를 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            로그인
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
