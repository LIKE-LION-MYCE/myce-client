import React from 'react';
import BasicTable from '../../../common/components/basicTable/BasicTable';

export default function CancelFeeTable() {
  // 테이블 헤더 정의
  const columns = [
    { header: '취소일', key: 'date' },
    { header: '취소수수료', key: 'fee' },
  ];

  // 표 데이터 정의
  const data = [
    { date: '예약 후 7일 이내', fee: '없음' },
    { date: '예약 후 8일 ~ 행사 5일 이내', fee: '티켓금액의 10%' },
    { date: '행사 5일 ~ 3일 전', fee: '티켓금액의 20%' },
    { date: '행사 2일 전 ~ 하루 전', fee: '티켓금액의 30%' },
    { date: '행사 당일', fee: '티켓금액의 95%' },
  ];

  return (
    <div>
      <BasicTable columns={columns} data={data} />
    </div>
  );
}
