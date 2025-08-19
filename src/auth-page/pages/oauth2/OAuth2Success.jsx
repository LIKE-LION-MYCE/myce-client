import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const provider = searchParams.get('provider');
    const token = searchParams.get('token');
    
    console.log('OAuth2Success 페이지 도달');
    console.log('URL:', window.location.href);
    console.log('Provider:', provider);
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'null');
    
    if (provider && token) {
      // Bearer 토큰에서 실제 토큰 부분 추출 (공백으로 분리된 경우)
      const actualToken = token.includes(' ') ? token.split(" ")[1] : token;
      localStorage.setItem('access_token', actualToken);
      console.log('토큰 localStorage 저장 완료');
      
      const providerName = provider === 'google' ? '구글' : provider === 'kakao' ? '카카오' : provider;
      console.log(`${providerName} OAuth2 로그인 성공`);
      alert('로그인이 완료되었습니다.');
      
      // 메인 페이지로 리다이렉트
      navigate('/');
    } else {
      // provider나 token이 없는 경우
      console.error('OAuth2 로그인 정보가 불완전합니다.');
      console.error('Provider:', provider, 'Token:', token);
      alert('로그인 처리 중 오류가 발생했습니다.');
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>로그인 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default OAuth2Success;