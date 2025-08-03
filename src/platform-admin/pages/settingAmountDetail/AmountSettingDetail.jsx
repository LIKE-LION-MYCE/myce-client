// src/pages/FeeDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './AmountSettingDetail.module.css';
import AmountSettingDetailTable from '../../components/amountSettingDetailTable/AmountSettingDetailTable';
import Pagination from '../../../common/commponents/pagination/Pagination';

const cardData = [
  {
    color: 'purple',
    title: '광고 이용료',
    name: 'advertisingFee',
    desc: '광고 서비스 이용에 대한 수수료를 설정합니다',
  },
  {
    color: 'green',
    title: '박람회 등록비',
    name: 'expoRegistrationFee',
    desc: '박람회 등록비 정산 금액을 설정합니다',
  },
  {
    color: 'red',
    title: '박람회 환불 수수료',
    name: 'expoRefundFee',
    desc: '박람회 참가비 환불 시 적용되는 수수료입니다',
  },
  {
    color: 'orange',
    title: '사용자 환불 수수료',
    name: 'userRefundFee',
    desc: '일반 사용자 환불 시 적용되는 수수료입니다',
  },
];

export default function AmountSettingDetail() {
  const { name } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const card = cardData.find((c) => c.name === name);

  const handlePageChange = (page) => {
      setCurrentPage(page);
  };


  const [tableData, setTableData] = useState([
    { id: 1, label: '배너 광고 A', amount: '50,000', updatedBy: '2025.07.01', status: true, apply: false },
    { id: 2, label: '배너 광고 B', amount: '50,000', updatedBy: '2025.07.01', status: false, apply: false },
    { id: 3, label: '배너 광고 C', amount: '50,000', updatedBy: '2025.07.01', status: true, apply: false },
    { id: 4, label: '배너 광고 D', amount: '50,000', updatedBy: '2025.07.01', status: false, apply: false },
  ]);

  const pageSize = 10;
  const pageInfo = {
    content: tableData,
    totalPages: 1,
    number: currentPage,
    size: pageSize,
    totalElements: 0,
  };

  const handleToggle = (index) => {
    const newData = [...tableData];
    newData[index].status = !newData[index].status;
    setTableData(newData);
  };

  const handleCheckbox = (index) => {
    const newData = [...tableData];
    newData[index].apply = !newData[index].apply;
    setTableData(newData);
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'label', header: '요금제명' },
    { key: 'amount', header: '금액' },
    { key: 'updatedBy', header: '수정일자' },
    {
      key: 'status',
      header: '상태',
      render: (row, index) => (
        <label className={styles.toggleWrapper}>
          <input
            type="checkbox"
            checked={row.status}
            onChange={() => handleToggle(index)}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider}></span>
        </label>
      ),
    },
    {
      key: 'apply',
      header: '적용',
      render: (row, index) => (
        <input
          type="checkbox"
          checked={row.apply}
          onChange={() => handleCheckbox(index)}
        />
      ),
    },
  ];

  if (!card) return <div>존재하지 않는 수수료 항목입니다.</div>;

  return (
    <main className={styles.container}>
      <Link to="/platform/admin/settingAmount">
        <button className={styles.backButton}>돌아가기</button>
      </Link>

      <div className={styles.headerBox}>
        <div className={`${styles.cardHeader} ${styles[card.color]}`}></div>
        <div>
          <h1 className={styles.pageTitle}>{card.title}</h1>
          <p className={styles.pageDesc}>{card.desc}</p>
        </div>
      </div>

      <section className={styles.noticeWrapper}>
        <div className={styles.warningBox}>
          <strong>⚠ 주의사항</strong>
          <ul>
            <li>설정 변경 시 즉시 적용됩니다</li>
            <li>기존 진행 중인 금액에는 영향을 주지 않습니다</li>
            <li>변경 내역은 시스템에 자동으로 기록됩니다</li>
          </ul>
        </div>
        <div className={styles.infoBox}>
          <strong>ⓘ 안내</strong>
          <p>
            {card.title}는 시스템 사용자가 서비스를 이용할 때 적용되는 기본 수수료입니다. 상황에 따라 적절히 조정해주세요.
          </p>
        </div>
      </section>

      <section className={styles.addSection}>
        <div className={styles.inputGroup}>
          <label>요금제명</label>
          <input className={styles.input} placeholder="요금제 이름을 입력하세요" />
        </div>
        <div className={styles.inputGroup}>
          <label>금액(원)</label>
          <input className={styles.input} placeholder="금액을 입력하세요" />
        </div>
        <button className={styles.addButton}>요금제 추가</button>
      </section>

      <AmountSettingDetailTable
        columns={columns}
        data={tableData.map((row, index) => ({
          ...row,
          status: columns[4].render(row, index),
          apply: columns[5].render(row, index),
        }))}
      />
      <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />

      <div className={styles.actionBox}>
        <button className={styles.applyButton}>선택 요금 적용</button>
      </div>
    </main>
  );
}