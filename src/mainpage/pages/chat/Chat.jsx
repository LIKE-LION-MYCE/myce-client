import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home page with a signal to open chat modal
        // This preserves the user's experience for bookmarked chat URLs
        navigate('/', { replace: true, state: { openChat: true } });
    }, [navigate]);

    // Show loading while redirecting
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            fontSize: '1.1rem',
            color: '#666'
        }}>
            💬 채팅 로딩 중...
        </div>
    );
}