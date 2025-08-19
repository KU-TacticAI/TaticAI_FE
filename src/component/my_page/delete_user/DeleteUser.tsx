import React, { useState } from 'react';
import './DeleteUser.css';
import { useDispatch, useSelector } from 'react-redux';
import {deleteUser, logoutApi} from "../../../api/Api";
import { useNavigate } from 'react-router-dom';
import {logout} from "../../../store/slices/authSlice";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      password: passwords.password,
    };

    try {
      const response = await deleteUser(data);
      console.log('회원 삭제 요청 성공', response);
      setError('');
      onClose();
      await logoutApi();
      dispatch(logout());
      navigate('/')
      alert('회원 탈퇴 성공되었습니다.')
    } catch (error) {
      console.error('회원 삭제 요청 실패', error);
    }
  };

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>회원 탈퇴</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">비밀번호 확인</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={passwords.password}
                  onChange={handleChange}
                  required
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
              <button type="submit" className="confirm-btn">확인</button>
              <button type="button" onClick={onClose} className="cancel-btn">취소</button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default DeleteUserModal;
