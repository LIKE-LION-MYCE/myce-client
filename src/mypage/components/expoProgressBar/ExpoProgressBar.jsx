import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import styles from './ExpoProgressBar.module.css';

const STEPS = [
    ['PENDING_APPROVAL', 'REJECTED'],
    ['PENDING_PAYMENT'],
    ['PENDING_PUBLISH', 'CANCELLED'],
    ['PUBLISHED'],
    ['PUBLISH_ENDED', 'SETTLEMENT_REQUESTED'],
    ['COMPLETED'],
];

const STATUS_LABELS = {
    'PENDING_APPROVAL': '승인 대기',
    'REJECTED': '거절됨',
    'PENDING_PAYMENT': '결제 대기',
    'PENDING_PUBLISH': '게시 대기',
    'CANCELLED': '취소됨',
    'PUBLISHED': '게시중',
    'PUBLISH_ENDED': '게시 종료',
    'SETTLEMENT_REQUESTED': '정산 요청',
    'COMPLETED': '종료됨',
};

// 상태 스타일에 따른 색상 매핑
const STATUS_COLORS = {
    'pending': '#e79d3c',
    'inProgress': '#2a9c68',
    'completed': '#555',
    'settled': '#5bc0de',
    'paymentPending': '#e79d3c',
    'rejected': '#e74c3c',
    'cancelled': '#e74c3c',
};

// 기존의 renderStatusTag 로직을 활용
const getStatusStyle = (status) => {
    const statusMapping = {
        'PENDING_APPROVAL': 'pending',
        'PENDING_PAYMENT': 'paymentPending',
        'PENDING_PUBLISH': 'pending',
        'PUBLISHED': 'inProgress',
        'PUBLISH_ENDED': 'inProgress',
        'SETTLEMENT_REQUESTED': 'settled',
        'COMPLETED': 'completed',
        'REJECTED': 'rejected',
        'CANCELLED': 'cancelled',
    };
    return statusMapping[status] || null;
};

const ExpoProgressBar = ({ currentStatus }) => {
    const currentStepIndex = STEPS.findIndex(step => step.includes(currentStatus));
    const currentStatusStyleKey = getStatusStyle(currentStatus);
    const currentColor = STATUS_COLORS[currentStatusStyleKey] || '#007bff'; // 기본 색상

    return (
        <div className={styles.progressBarContainer}>
            {STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <React.Fragment key={index}>
                        <div
                            className={styles.stepCircle}
                            style={{
                                backgroundColor: isCompleted ? currentColor : isCurrent ? currentColor : '',
                                color: isCurrent ? 'white' : isCompleted ? 'white' : styles.defaultColor,
                                transform: isCompleted || isCurrent ? 'scale(1.1)' : 'none'
                            }}
                        >
                            {isCurrent ? (
                                (currentStatus === 'CANCELLED' || currentStatus === 'REJECTED') ? <IoClose strokeWidth={30}/> : <FaCheck />
                            ) : index + 1}
                            {isCurrent && <span className={styles.statusLabel}>{STATUS_LABELS[currentStatus]}</span>}
                        </div>
                        {index < STEPS.length - 1 && (
                            <div
                                className={styles.stepLine}
                                style={{
                                    backgroundColor: isCompleted ? currentColor : ''
                                }}
                            ></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ExpoProgressBar;