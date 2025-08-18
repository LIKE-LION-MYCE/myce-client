// src/pages/AmountSettingList.jsx
import { Link } from 'react-router-dom';
import styles from './AmountSettingList.module.css';

const cardData = [
  {
    title: '광고 이용료',
    name: 'advertisingFee',
    desc: '광고 서비스 이용에 대한 수수료를 설정합니다',
  },
  {
    title: '박람회 등록비',
    name: 'expoRegistrationFee',
    desc: '박람회 등록비 정산 금액을 설정합니다',
  },
  // {
  //   title: '박람회 환불 수수료',
  //   name: 'expoRefundFee',
  //   desc: '박람회 참가비 환불 시 적용되는 수수료입니다',
  // },
  {
    title: '사용자 환불 수수료',
    name: 'userRefundFee',
    desc: '일반 사용자 환불 시 적용되는 수수료입니다',
  },
];

const historyData = [
  { label: '광고 이용료 변경', date: '2024.01.15 14:30' },
  { label: '박람회 환불 수수료 변경', date: '2024.01.15 14:30' },
  { label: '박람회 등록비 변경', date: '2024.01.15 14:30' },
  { label: '사용자 환불 수수료 변경', date: '2024.01.15 14:30' },
];

export default function AmountSettingList() {
  return (
    <main className={styles.container}>
      <section className={styles.gridBox}>
        {cardData.map((card) => (
          <Link to={`/platform/admin/settingAmount/${card.name}`} key={card.name}>
            <div className={styles.card}>
              <div>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
              <div className={styles.arrow}>&#8250;</div>
            </div>
          </Link>
        ))}
      </section>

      <section className={styles.historySection}>
        <h2 className={styles.subTitle}>최근 설정 변경 내역</h2>
        <table className={styles.table}>
          <tbody>
            {historyData.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td className={styles.date}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}