// SiginIn.tsx
import React, {useState} from 'react';
import {AxiosError} from 'axios';
import './SiginIn.css';
import { signIn } from '../../api/Api';
import Layout from "../layout/Layout";

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    nickname: '',
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
    setError('');
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
      const response = await signIn(formData);

      console.log('회원가입 성공:', response.data);
      setSuccess(true);
      setForm({username: '', nickname: '', email: '', password: '', confirmPassword: ''});
      setFile(null);
      setImagePreviewUrl('');

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
        <div className="form-container">
          <h1>계정 만들기</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-columns">
              {/* 수정된 부분: Column 1 - 텍스트 입력 필드 */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="username">이름</label>
                  <input
                      id="username"
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="이름을 입력하세요"
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nickname">닉네임</label>
                  <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      value={form.nickname}
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
              </div>

              {/* 수정된 부분: Column 2 - 이미지 업로드 및 유의사항 */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="profileImage">프로필 사진</label>
                  <div className="image-preview-container">
                    <label htmlFor="profileImage" className="file-input-label">
                      {imagePreviewUrl ? (
                          <img src={imagePreviewUrl} alt="프로필 사진 미리보기" className="image-preview"/>
                      ) : (
                          <div className="image-placeholder">
                            <span style={{ fontSize: '2rem' }}>⬆️</span>
                            <p>파일을 선택하거나 드래그하여 업로드하세요</p>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>지원 형식: .jpg, .png 등</p>
                          </div>
                      )}
                    </label>
                    <input
                        id="profileImage"
                        type="file"
                        onChange={onFileChange}
                        accept="image/*"
                        className="file-input"
                    />
                  </div>
                </div>
                
                {/* 추가된 부분: 유의사항 박스 */}
                <div className="notes-box">
                    <h4>계정 생성 유의사항</h4>
                    <ul>
                        <li>사용 가능한 이메일 주소를 입력해주세요.</li>
                        <li>비밀번호는 8자 이상으로 설정해주세요.</li>
                        <li>프로필 사진은 필수가 아니며, 추후에 변경 가능합니다.</li>
                    </ul>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">회원가입이 성공적으로 완료되었습니다!</div>}

            <button type="submit" className="submit-button">계정 만들기</button>
          </form>
        </div>
      </Layout>
  );
};

export default Signup;