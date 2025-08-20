import React from 'react';
import { useTranslation } from 'react-i18next';
import BasicTable from '../../../common/components/basicTable/BasicTable';

export default function CancelFeeTable() {
  const { t } = useTranslation();
  
  // 테이블 헤더 정의
  const columns = [
    { header: t('components.cancelFeeTable.headers.date'), key: 'date' },
    { header: t('components.cancelFeeTable.headers.fee'), key: 'fee' },
  ];

  // 표 데이터 정의
  const data = [
    { date: t('components.cancelFeeTable.data.within7days'), fee: t('components.cancelFeeTable.data.noFee') },
    { date: t('components.cancelFeeTable.data.days8to5'), fee: t('components.cancelFeeTable.data.fee10percent') },
    { date: t('components.cancelFeeTable.data.days5to3'), fee: t('components.cancelFeeTable.data.fee20percent') },
    { date: t('components.cancelFeeTable.data.days2to1'), fee: t('components.cancelFeeTable.data.fee30percent') },
    { date: t('components.cancelFeeTable.data.eventDay'), fee: t('components.cancelFeeTable.data.fee95percent') },
  ];

  return (
    <div>
      <BasicTable columns={columns} data={data} />
    </div>
  );
}
