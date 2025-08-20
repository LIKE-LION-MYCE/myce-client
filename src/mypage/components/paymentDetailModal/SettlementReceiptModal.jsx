import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SettlementReceiptModal.module.css';
import { requestExpoSettlement } from '../../../api/service/user/memberApi';

const bankOptions = ['토스뱅크', '카카오뱅크', '신한은행', '국민은행', '우리은행', '하나은행', '기업은행', 'NH농협은행'];

const SettlementReceiptModal = ({ receiptData, onClose, expoId, readOnly = false, bankInfo = null }) => {
  const { t } = useTranslation();
  
  if (!receiptData) return null;

  const [settlementForm, setSettlementForm] = useState({
    bankName: '',
    bankAccount: '',
    receiverName: '',
  });
  const [loading, setLoading] = useState(false);
  const [inputWarning, setInputWarning] = useState({ bankAccount: '', receiverName: '' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // 유효성 검사 및 경고 메시지 처리
    let filteredValue = value;
    let warningMessage = '';
    
    if (name === 'bankAccount') {
      // 숫자와 하이픈이 아닌 문자가 포함된 경우 경고
      if (/[^0-9-]/.test(value)) {
        warningMessage = t('settlementReceiptModal.messages.accountNumberWarning');
      }
      // 계좌번호: 숫자와 하이픈만 허용
      filteredValue = value.replace(/[^0-9-]/g, '');
    } else if (name === 'receiverName') {
      // 한글, 영어, 공백이 아닌 문자가 포함된 경우 경고
      if (/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z\s]/.test(value)) {
        warningMessage = t('settlementReceiptModal.messages.accountHolderWarning');
      }
      // 예금주: 한글, 영어, 공백만 허용 (자모 포함)
      filteredValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z\s]/g, '');
    }
    
    // 경고 메시지 업데이트
    setInputWarning(prev => ({ ...prev, [name]: warningMessage }));
    
    // 경고 메시지가 있으면 3초 후 자동 제거
    if (warningMessage) {
      setTimeout(() => {
        setInputWarning(prev => ({ ...prev, [name]: '' }));
      }, 3000);
    }
    
    setSettlementForm(prev => ({ ...prev, [name]: filteredValue }));
  };

  const handleSubmitSettlement = async () => {
    if (!settlementForm.bankName || !settlementForm.bankAccount || !settlementForm.receiverName) {
      alert(t('settlementReceiptModal.messages.allFieldsRequired'));
      return;
    }

    try {
      setLoading(true);
      await requestExpoSettlement(expoId, settlementForm);
      alert(t('settlementReceiptModal.messages.submitSuccess'));
      onClose();
    } catch (err) {
      console.error('정산 신청 실패:', err);
      const errorMessage = err.response?.data?.message || t('settlementReceiptModal.messages.submitError');
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{t('settlementReceiptModal.title')}</h2>
        <div className={styles.contentLayout}>
          {/* 왼쪽 섹션: 박람회 정보 + 티켓 판매 내역 */}
          <div className={styles.leftSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>{t('settlementReceiptModal.fields.expoName')}</span>
                <span className={styles.value}>{receiptData.expoTitle}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>{t('settlementReceiptModal.fields.settlementRequestDate')}</span>
                <span className={styles.value}>{new Date(receiptData.settlementRequestDate).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>

            {receiptData.ticketSales && receiptData.ticketSales.length > 0 && (
              <div className={styles.ticketSalesSection}>
                <h3>{t('settlementReceiptModal.ticketSales.title')}</h3>
                <div className={styles.ticketSalesHeader}>
                  <span>{t('settlementReceiptModal.ticketSales.headers.ticketName')}</span>
                  <span>{t('settlementReceiptModal.ticketSales.headers.soldCount')}</span>
                  <span>{t('settlementReceiptModal.ticketSales.headers.totalSales')}</span>
                </div>
                {receiptData.ticketSales.map((ticket, index) => (
                  <div key={index} className={styles.ticketSalesItem}>
                    <span>{ticket.ticketName}</span>
                    <span>{ticket.soldCount}{t('settlementReceiptModal.units.pieces')}</span>
                    <span>{ticket.totalSales.toLocaleString()}{t('settlementReceiptModal.units.currency')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽 섹션: 금액 정보 + 정산 신청 정보 */}
          <div className={styles.rightSection}>
            <div className={styles.summarySection}>
              <div className={styles.summaryItem}>
                <span className={styles.label}>{t('settlementReceiptModal.fields.totalRevenue')}</span>
                <span className={styles.value}>{receiptData.totalRevenue.toLocaleString()}{t('settlementReceiptModal.units.currency')}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.label}>{t('settlementReceiptModal.fields.platformFee')} ({receiptData.commissionRate}{t('settlementReceiptModal.units.percent')})</span>
                <span className={styles.value}>-{receiptData.fee.toLocaleString()}{t('settlementReceiptModal.units.currency')}</span>
              </div>
              <div className={styles.divider}></div>
              <div className={`${styles.summaryItem} ${styles.netProfit}`}>
                <span className={styles.label}>{t('settlementReceiptModal.fields.netProfit')}</span>
                <span className={styles.value}>{receiptData.finalSettlementAmount.toLocaleString()}{t('settlementReceiptModal.units.currency')}</span>
              </div>
            </div>

            {/* 은행계좌 입력/조회 섹션 */}
            <div className={styles.settlementFormSection}>
              <h3 className={styles.formTitle}>{t('settlementReceiptModal.settlementForm.title')}</h3>
              {readOnly && bankInfo ? (
                // 조회 모드: 은행정보 표시
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>{t('settlementReceiptModal.fields.bank')}</span>
                    <span className={styles.value}>{bankInfo.bankName || t('settlementReceiptModal.messages.noInfo')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>{t('settlementReceiptModal.fields.accountNumber')}</span>
                    <span className={styles.value}>{bankInfo.bankAccount || t('settlementReceiptModal.messages.noInfo')}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>{t('settlementReceiptModal.fields.accountHolder')}</span>
                    <span className={styles.value}>{bankInfo.receiverName || t('settlementReceiptModal.messages.noInfo')}</span>
                  </div>
                </div>
              ) : (
                // 입력 모드: 폼 표시
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('settlementReceiptModal.settlementForm.labels.bank')}</label>
                    <select
                      name="bankName"
                      className={styles.formSelect}
                      value={settlementForm.bankName}
                      onChange={handleFormChange}
                      disabled={loading}
                    >
                      <option value="">{t('settlementReceiptModal.settlementForm.placeholders.bankSelect')}</option>
                      {bankOptions.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('settlementReceiptModal.settlementForm.labels.accountNumber')}</label>
                    <input
                      type="text"
                      name="bankAccount"
                      className={styles.formInput}
                      value={settlementForm.bankAccount}
                      onChange={handleFormChange}
                      placeholder={t('settlementReceiptModal.settlementForm.placeholders.accountNumber')}
                      disabled={loading}
                    />
                    {inputWarning.bankAccount && (
                      <div style={{ color: '#ff4757', fontSize: '12px', marginTop: '4px' }}>
                        {inputWarning.bankAccount}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('settlementReceiptModal.settlementForm.labels.accountHolder')}</label>
                    <input
                      type="text"
                      name="receiverName"
                      className={styles.formInput}
                      value={settlementForm.receiverName}
                      onChange={handleFormChange}
                      placeholder={t('settlementReceiptModal.settlementForm.placeholders.accountHolder')}
                      disabled={loading}
                    />
                    {inputWarning.receiverName && (
                      <div style={{ color: '#ff4757', fontSize: '12px', marginTop: '4px' }}>
                        {inputWarning.receiverName}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.buttonArea}>
          <button className={styles.closeButton} onClick={onClose} disabled={loading}>
            {t('settlementReceiptModal.buttons.close')}
          </button>
          {!readOnly && (
            <button 
              className={styles.submitButton} 
              onClick={handleSubmitSettlement}
              disabled={loading}
            >
              {loading ? t('settlementReceiptModal.buttons.submitting') : t('settlementReceiptModal.buttons.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettlementReceiptModal;