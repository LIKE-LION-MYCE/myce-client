import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Failure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    
    console.error('OAuth2 로그인 실패:', error);
    alert(`로그인에 실패했습니다. ${error || '알 수 없는 오류가 발생했습니다.'}`);
    
    // 로그인 페이지로 리다이렉트
    navigate('/login');
  }, [navigate, searchParams]);

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
    </div>
  );
};

export default OAuth2Failure;