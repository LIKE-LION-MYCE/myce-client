import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import styles from './ExpoAdminDetailModal.module.css';
import { fetchExpoAdminInfo } from '../../../api/service/platform-admin/expo/ExpoService';

function ExpoAdminDetailModal({ isOpen, onClose }) {
    const { id } = useParams();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAdminData = async () => {
            if (isOpen && id) {
                setLoading(true);
                try {
                    // API에서 실제 데이터를 가져옵니다.
                    const data = await fetchExpoAdminInfo(id);
                    setAdminData(data);
                } catch (error) {
                    console.error('관리자 정보 조회 실패:', error);
                    alert('관리자 정보를 불러오는 데 실패했습니다.');
                    onClose();
                } finally {
                    setLoading(false);
                }
            }
        };
        loadAdminData();
    }, [isOpen, id, onClose]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h2 className={styles.title}>관리자 정보</h2>
                    <div className={styles.loadingBox}>
                        <span>로딩 중...</span>
                    </div>
                    <div className={styles.actionBox}>
                        <button className={styles.closeBtn} onClick={onClose}>닫기</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>관리자 정보</h2>

                {adminData ? (
                    <div className={styles.contentLayout}>
                        {/* 최고 관리자 정보 */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>최고 관리자</h3>
                            <div className={styles.infoBox}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>아이디</span>
                                    <span className={styles.value}>{adminData.superAdminUsername}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>이메일</span>
                                    <span className={styles.value}>{adminData.superAdminEmail}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>닉네임</span>
                                    <span className={styles.value}>{adminData.superAdminNickname}</span>
                                </div>
                            </div>
                        </div>

                        {/* 하위 관리자 코드 */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>하위 관리자 코드</h3>
                            <ul className={styles.codeList}>
                                {/* 받아온 데이터의 subAdmins 배열을 직접 렌더링합니다. */}
                                {adminData.subAdmins.map((adminCode, index) => (
                                    <li key={index} className={styles.codeItem}>
                                        <span className={styles.codeValue}>{adminCode}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className={styles.noData}>
                        <span>관리자 정보를 불러올 수 없습니다.</span>
                    </div>
                )}

                <div className={styles.actionBox}>
                    <button className={styles.closeBtn} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}

export default ExpoAdminDetailModal;