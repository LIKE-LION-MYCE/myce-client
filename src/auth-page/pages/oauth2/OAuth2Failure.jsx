import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ToastFail from '../../../common/components/toastFail/ToastFail';

const OAuth2Failure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFailToast, setShowFailToast] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    
    console.error('OAuth2 로그인 실패:', error);
    triggerToastFail(`로그인에 실패했습니다. ${error || '알 수 없는 오류가 발생했습니다.'}`);
    
    // 로그인 페이지로 리다이렉트
    setTimeout(() => navigate('/login'), 1000);
  }, [navigate, searchParams]);

  const triggerToastFail = (message) => {
    setFailMessage(message);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 3000);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>로그인 실패</h2>
      <p>로그인 페이지로 이동합니다...</p>
      {showFailToast && <ToastFail message={failMessage} />}
    </div>
  );
};

export default OAuth2Failure;