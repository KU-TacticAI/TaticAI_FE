import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import './MyPage.css';
import { getUser, updateUser } from '../../api/Api'; // You'll need to create this API function
import Layout from "../layout/Layout";
import ChangePasswordModal from "./change_password/changePassword";
import DeleteUserModal from "./delete_user/DeleteUser";
import { useNavigate } from 'react-router-dom';

/**
 * 마이페이지 컴포넌트
 * @constructor
 */
const MyPage = () => {
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [form, setForm] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {

    /**
     * 최초 현재 토큰을 기반으로 유저 정보를 조회
     */
    const getData = async () => {
      try {
        const response = await getUser();
        setForm({
          username: response.data.username ?? '유저 이름',
          nickname: response.data.nickname ?? '기본 닉네임',
          email: response.data.email ?? '기본 이메일',
          password: '',
        });

        if(response.data?.profileLink){
          setImagePreviewUrl(response.data.profileLink);
        }
      }catch (error){
        console.error("사용자 데이터를 가져오는 데 실패했습니다:", error);
      }

    }

    getData();
  }, []);

  /**
   * 이메일주소 / 이름 / 닉네임의 문자 정보를 변경
   * @param e
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  /**
   * 프로필 사진의 사진데이터를 변경
   * @param e
   */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  /**
   * 프로필 업데이트 버튼 클릭시 실행되는 메서드
   * @param e
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData();
    const userData = {
        nickname: form.nickname,
        password: form.password
    };

    formData.append(
        'json',
        new Blob([JSON.stringify(userData)], { type: 'application/json' })
    );

    if (file) {
        formData.append('file', file);
    }

    try {
      const response = await updateUser(formData);
      console.log('프로필 업데이트 성공:', response.data);
      console.log('Form Data:', userData);
      console.log('File:', file?.name);
      setSuccess(true);
      setForm(prev => ({...prev, password: '', confirmPassword: ''}));
      alert("프로필 업데이트에 성공했습니다.");
      navigate('/');
    } catch (err) {
      const error = err as AxiosError;
      const message =
          (error.response?.data as { message?: string })?.message ??
          '프로필 업데이트 중 오류가 발생했습니다.';
      setError(message);
    }
  };

  return (
      <Layout>
        <form onSubmit={handleSubmit} className="mypage-form">
          <div className="form-container">
            <h1>마이 페이지</h1>

            <div className="text-data">

              <div className="form-group">
                <label htmlFor="email">이메일 주소</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="이메일 주소를 입력하세요"
                    disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">이름</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                    disabled
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
                <label htmlFor="password">비밀번호 확인</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                />
              </div>
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

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">프로필이 성공적으로 업데이트되었습니다!</div>}

          <div className="button-container">
            <button type="submit" className="submit-button">프로필 업데이트</button>
            <button type="button" className="submit-button"
                    onClick={() => setChangePasswordModalOpen(true)}>비밀번호 변경
            </button>
            <button type="button" className="submit-button"
                    onClick={() => setDeleteUserModalOpen(true)}>회원 탈퇴
            </button>
          </div>
        </form>
        <ChangePasswordModal
            isOpen={isChangePasswordModalOpen}
            onClose={() => setChangePasswordModalOpen(false)}
        />
        <DeleteUserModal
            isOpen={isDeleteUserModalOpen}
            onClose={() => setDeleteUserModalOpen(false)}
        />
      </Layout>
  );
};

export default MyPage;
