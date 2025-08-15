import React from 'react';
import styles from './SystemMessage.module.css';

/**
 * SystemMessage component for rendering state transition messages
 * These are not regular chat bubbles but special UI elements
 */
const SystemMessage = ({ type, payload, timestamp }) => {
  console.log('🎭 SystemMessage component CALLED with:', { type, payload, timestamp });
  console.log('🎭 SystemMessage - Payload content:', JSON.stringify(payload, null, 2));
  console.log('🎭 SystemMessage - Switching on type:', type);
  const renderAdminInterventionStart = () => (
    <div className={styles.systemMessage}>
      <div className={styles.demarcationLine}>
        <span className={styles.demarcationText}>
          ══════ 관리자 입장 ══════
        </span>
      </div>
      <div className={styles.systemContent}>
        <div className={styles.messageText}>
          <div className={styles.description}>{payload.message}</div>
        </div>
      </div>
      <div className={styles.timestamp}>
        {new Date(payload.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );

  const renderHandoffToOperator = () => (
    <div className={styles.systemMessage}>
      <div className={styles.demarcationLine}>
        <span className={styles.demarcationText}>
          ══════ 상담원 인계 ══════
        </span>
      </div>
      <div className={styles.systemContent}>
        <div className={styles.summaryBox}>
          <div className={styles.summaryTitle}>AI 상담 요약</div>
          <div className={styles.summaryText}>{payload.aiSummary}</div>
        </div>
        <div className={styles.handoffMessage}>
          <div className={styles.messageText}>
            <div className={styles.greeting}>상담원이 인계받았습니다</div>
            <div className={styles.description}>전문적인 도움을 드리겠습니다</div>
          </div>
        </div>
      </div>
      <div className={styles.timestamp}>
        {new Date(payload.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );

  const renderHandoffToAI = () => (
    <div className={styles.systemMessage}>
      <div className={styles.demarcationLine}>
        <span className={styles.demarcationText}>
          ══════ AI 상담 복귀 ══════
        </span>
      </div>
      <div className={styles.systemContent}>
        <div className={styles.messageText}>
          <div className={styles.greeting}>AI가 상담을 이어받습니다</div>
          <div className={styles.description}>{payload.message}</div>
        </div>
      </div>
      <div className={styles.timestamp}>
        {new Date(payload.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );

  switch (type) {
    case 'ADMIN_INTERVENTION_START':
      console.log('🎭 SystemMessage - Rendering ADMIN_INTERVENTION_START');
      return renderAdminInterventionStart();
    case 'HANDOFF_TO_OPERATOR':
      console.log('🎭 SystemMessage - Rendering HANDOFF_TO_OPERATOR');
      return renderHandoffToOperator();
    case 'HANDOFF_TO_AI':
      console.log('🎭 SystemMessage - Rendering HANDOFF_TO_AI');
      return renderHandoffToAI();
    default:
      console.log('🎭 SystemMessage - Rendering DEFAULT system message for type:', type);
      return (
        <div className={styles.systemMessage}>
          <div className={styles.demarcationLine}>
            <span className={styles.demarcationText}>
              ══════ 시스템 메시지 ══════
            </span>
          </div>
          <div className={styles.systemContent}>
            <div className={styles.messageText}>
              <div className={styles.description}>{payload?.message || 'System message'}</div>
            </div>
          </div>
        </div>
      );
  }
};

export default SystemMessage;