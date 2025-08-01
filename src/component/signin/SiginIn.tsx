import React, {useState} from 'react';
import {AxiosError} from 'axios';
import './SiginIn.css';
import axiosInstance from '../../api/Api';
import Header from "../header/Header";
import NavBar from "../nav/NavBar";
import Layout from "../layout/Layout";

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [error, setError] = useState(String);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setImagePreviewUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // "null" 대신 null 또는 ''
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const formData = new FormData();
    formData.append(
        'json',
        new Blob([JSON.stringify(form)], {type: 'application/json'})
    );
    if (file) formData.append('file', file);

    try {
      const response = await axiosInstance.post('users/sign-in', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('회원가입 성공:', response.data);
      setSuccess(true);
      setForm({name: '', username: '', email: '', password: '', confirmPassword: ''});
      setFile(null);
      setImagePreviewUrl(''); // 빈 문자열로 초기화

      window.location.href = '/';
    } catch (err) {
      const error = err as AxiosError;
      const message =
          (error.response?.data as { message?: string })?.message ??
          '회원가입 중 오류가 발생했습니다.';
      setError(message);
    }
  };

  return (
      <Layout>
        <div className="tacticai-signup">

          <div className="content">
            <h1>계정 만들기</h1>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-container">
                <div className="text-data">
                  <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                        required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">닉네임</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="닉네임을 입력하세요"
                        required
                    />
                  </div>

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

                  <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력하세요"
                        required
                    />
                  </div>

                  <div className="image-group">
                    <label htmlFor="profileImage">프로필 사진</label>
                    <input
                        id="profileImage"
                        type="file"
                        onChange={onFileChange}
                        accept="image/*"
                    />
                    <div className="image-preview-group">
                      {imagePreviewUrl && (
                          <div className="image-preview">
                            <img src={imagePreviewUrl} alt="프로필 사진 미리보기"/>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">회원가입이 성공적으로 완료되었습니다!</div>}

              <button type="submit" className="submit-button">회원가입</button>
            </form>
          </div>
        </div>
      </Layout>
  );
};

export default Signup;