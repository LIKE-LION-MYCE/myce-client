import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AmountSettingDetail.module.css';
import AmountSettingDetailTable from '../../components/amountSettingDetailTable/AmountSettingDetailTable';
import Pagination from '../../../common/components/pagination/Pagination';
import AdFeeSettingTable from '../../components/adFeeSettingTable/AdFeeSettingTable';
import ExpoFeeSettingTable from '../../components/expoFeeSettingTable/ExpoFeeSettingTable';
import RefundFeeSettingTable from '../../components/refundFeeSettingTable/RefundFeeSettingTable';

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
  {
    title: '사용자 환불 수수료',
    name: 'userRefundFee',
    desc: '일반 사용자 환불 시 적용되는 수수료입니다',
  },
];

export default function AmountSettingDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState([
    { id: 1, label: '배너 광고 A', amount: '50,000', updatedBy: '2025.07.01', status: true, apply: false },
    { id: 2, label: '배너 광고 B', amount: '50,000', updatedBy: '2025.07.01', status: false, apply: false },
    { id: 3, label: '배너 광고 C', amount: '50,000', updatedBy: '2025.07.01', status: true, apply: false },
    { id: 4, label: '배너 광고 D', amount: '50,000', updatedBy: '2025.07.01', status: false, apply: false },
  ]);

  const card = cardData.find((c) => c.name === name);
  if (!card) return <div className={styles.container}>존재하지 않는 수수료 항목입니다.</div>;

  const handlePageChange = (page) => setCurrentPage(page);

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

  const pageSize = 10;
  const pageInfo = {
    content: tableData,
    totalPages: 1,
    number: currentPage,
    size: pageSize,
    totalElements: tableData.length,
  };

  return (
    name === cardData[0].name ?
    <AdFeeSettingTable card={cardData[0]} navigate={navigate}/>
    :
    name === cardData[1].name ?
    <ExpoFeeSettingTable card={cardData[1]} navigate={navigate}/>
    :
    name === cardData[2].name ?
    <RefundFeeSettingTable card={cardData[2]} navigate={navigate}/>
    :
    <main className={styles.container}>
      <div className={styles.headerBox}>
        <div className={styles.titleWithBack}>
          <button className={styles.backArrow} onClick={() => navigate(-1)}>
            ←
          </button>
          <h2 className={styles.templateTitle}>{card.title}</h2>
        </div>
        <p className={styles.pageDesc}>{card.desc}</p>
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
          <p>{card.title}는 시스템 사용자가 서비스를 이용할 때 적용되는 기본 수수료입니다. 상황에 따라 적절히 조정해주세요.</p>
        </div>
      </section>

      <section className={styles.addSection}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>요금제명</label>
          <input className={styles.input} placeholder="요금제 이름을 입력하세요" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>금액(원)</label>
          <input className={styles.input} placeholder="금액을 입력하세요" />
        </div>
        <button className={styles.saveButton}>요금제 추가</button>
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