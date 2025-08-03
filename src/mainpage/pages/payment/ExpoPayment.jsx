import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './ExpoPayment.module.css';

export default function ExpoPayment() {
    const [activeMethod, setActiveMethod] = useState('toss');
    return (
        <div className={styles.container}>
            {/* 왼쪽 개인 정보 입력 */}
            <section className={styles.leftSection}>
                <form className={styles.form}>
                    <h2>개인정보 입력</h2>
                    <div className={styles.formGroup}>

                        <div className={styles.inputGroup}>
                            <label>이름</label>
                            <input type="text" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>이메일 주소</label>
                            <input type="email" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>생년월일</label>
                            <input type="text" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>전화번호</label>
                            <input type="tel" />
                        </div>

                        <div className={styles.radioGroup}>
                            <label>성별</label>
                            <div className={styles.genderGroup}>
                                <label className={styles.radioItem}>
                                    <input type="radio" name="gender" value="male" />
                                    남자
                                </label>
                                <label className={styles.radioItem}>
                                    <input type="radio" name="gender" value="female" />
                                    여자
                                </label>
                            </div>
                        </div>
                        <label className={styles.checkbox}>
                            <span>회원 정보 기억하기</span>
                            <input type="checkbox" />
                        </label>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.mileageSection}>
                        <h2>마일리지 적용</h2>
                        <div className={styles.formGroup}>
                            <div className={styles.inputGroup}>
                                <label>현재 마일리지</label>
                                <input type="text" readOnly value="10000" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>사용 마일리지</label>
                                <input type="text"/>
                            </div>
                            <button className={styles.applyButton}>적용하기</button>
                            <div className={styles.inputGroup}>
                                <label>남은 마일리지</label>
                                <input type="text" readOnly value="3000" />
                            </div>
                        </div>
                    </div>
                </form>
            </section>


            {/* 오른쪽 결제 정보 영역 */}
            <section className={styles.rightSection}>
                <div className={styles.thumbnailBox}>
                    <div className={styles.details}>
                        <h3>행사 제목</h3>
                        <div className={styles.info}>
                            <p>📍 행사 장소</p>
                            <p>🗓 행사 일정</p>
                        </div>
                    </div>
                    <img src="https://flexible.img.hani.co.kr/flexible/normal/590/590/imgdb/resize/2007/1227/68227042_20071227.jpg" alt="행사 제목" className={styles.thumbnail} />
                </div>

                <div className={styles.summary}>
                    <h3>결제 요약</h3>
                    <div className= {styles.reciept}>
                        <div className={styles.row}><span>티켓 매수</span><span>2 x 입장권</span></div>
                        <div className={styles.row}><span>티켓 가격</span><span>2 x 20,000원</span></div>
                        <div className={styles.row}><span>행사 가격</span><span>-</span></div>
                        <div className={styles.row}><span>서비스 수수료</span><span>-</span></div>
                        <div className={styles.row}><span>마일리지</span><span>7,000</span></div>
                        <div className={`${styles.row} ${styles.total}`}><span>총계</span><span>33,000원</span></div>
                    </div>
                </div>

                <div className={styles.payment}>
                    <h3>결제 방법 선택</h3>

                    <div className={styles.methodGroup}>
                        <label>신용카드</label>
                        <button
                            className={`${styles.cardButton} ${activeMethod === 'toss' ? styles.active : ''}`}
                            onClick={() => setActiveMethod('toss')}
                        >
                            <img src="https://i.namu.wiki/i/jL9Lqnp602cit034mt0ujqwaJChigNoIenR1vuFxK6eoov67MvOsWgMIIbbspQfdpRMOL1X5se-P5bHX4mweoA.webp" alt="토스페이" />
                            토스페이로 결제
                        </button>
                    </div>

                    <div className={styles.methodGroup}>
                        <label>기타 결제수단</label>
                        <button
                            className={`${styles.cardButton} ${activeMethod === 'account' ? styles.active : ''}`}
                            onClick={() => setActiveMethod('account')}>
                            계좌이체
                        </button>
                        <button
                            className={`${styles.cardButton} ${activeMethod === 'bank' ? styles.active : ''}`}
                            onClick={() => setActiveMethod('bank')}>
                            무통장입금
                        </button>
                        <button
                            className={`${styles.cardButton} ${activeMethod === 'simple' ? styles.active : ''}`}
                            onClick={() => setActiveMethod('simple')}>
                            간편 결제
                        </button>
                    </div>
                    <Link to="/reservation-success">
                        <button className={styles.confirmButton}>결제 계속하기</button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
