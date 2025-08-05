import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from './Booths.module.css';
import BoothTable from '../../components/boothTable/BoothTable';
import BoothSettingForm from '../../components/boothSettingForm/BoothSettingForm';
import Pagination from '../../../common/commponents/pagination/Pagination';

function Booths() {
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [boothList, setBoothList] = useState([
    {
      no: 1,
      companyName: '슬로우잇',
      boothLocation: 'A-01',
      priority: 1,
      phone: '010-1234-5678',
      email: 'slow@eat.com',
      ceo: '홍길동',
      address: '서울특별시 강남구 논현로 123',
      website: 'https://sloweat.com',
      description: '저속노화를 위한 식단 솔루션을 제공합니다.',
      imageUrl: 'https://i0.wp.com/data.infowos.com/wp-content/uploads/2023/10/image-173.png?resize=379%2C280&ssl=1',
    },
    {
      no: 2,
      companyName: '넥스트비전',
      boothLocation: 'B-12',
      priority: 2,
      phone: '010-2233-4455',
      email: 'contact@nextvision.kr',
      ceo: '이서준',
      address: '부산광역시 해운대구 센텀서로 45',
      website: 'https://nextvision.kr',
      description: '미래형 영상 처리 솔루션을 개발하는 회사입니다.',
      imageUrl: 'https://i0.wp.com/data.infowos.com/wp-content/uploads/2023/10/image-173.png?resize=379%2C280&ssl=1',
    },
    {
      no: 3,
      companyName: '헬로파밍',
      boothLocation: 'C-03',
      priority: 5,
      phone: '010-9876-5432',
      email: 'hello@farming.com',
      ceo: '김하늘',
      address: '경기도 고양시 덕양구 화정동 22',
      website: 'https://hellofarming.com',
      description: '스마트팜 기술로 농업의 미래를 이끕니다.',
      imageUrl: 'https://i0.wp.com/data.infowos.com/wp-content/uploads/2023/10/image-173.png?resize=379%2C280&ssl=1',
    },
    {
      no: 4,
      companyName: '그린이노베이션',
      boothLocation: 'D-07',
      priority: 3,
      phone: '010-7654-3210',
      email: 'green@innovation.org',
      ceo: '정다은',
      address: '대전광역시 유성구 대덕대로 155',
      website: 'https://greeninnovation.org',
      description: '친환경 에너지 혁신 기술을 선도합니다.',
      imageUrl: 'https://i0.wp.com/data.infowos.com/wp-content/uploads/2023/10/image-173.png?resize=379%2C280&ssl=1',
    },
    {
      no: 5,
      companyName: '테크스튜디오',
      boothLocation: 'E-21',
      priority: 4,
      phone: '010-1111-2222',
      email: 'tech@studio.io',
      ceo: '박지성',
      address: '광주광역시 북구 첨단과기로 77',
      website: 'https://techstudio.io',
      description: '개발자를 위한 최고의 툴을 만듭니다.',
      imageUrl: 'https://i0.wp.com/data.infowos.com/wp-content/uploads/2023/10/image-173.png?resize=379%2C280&ssl=1',
    },
  ]);

  const [page, setPage] = useState(0);
  const size = 4;

  const filtered = boothList
    .filter((b) =>
      b.companyName.includes(searchText) ||
      b.description.includes(searchText)
    )
    .sort((a, b) =>
      sortOrder === 'asc' ? a.priority - b.priority : b.priority - a.priority
    );

  const pagedData = filtered.slice(page * size, (page + 1) * size);
  const pageInfo = {
    totalPages: Math.ceil(filtered.length / size),
    number: page,
  };

  const handleAdd = (booth) => {
    const newNo = boothList.length ? Math.max(...boothList.map((b) => b.no)) + 1 : 1;
    setBoothList((prev) => [...prev, { ...booth, no: newNo }]);
  };

  const handleUpdate = (updatedBooth) => {
    setBoothList((prev) =>
      prev.map((b) => (b.no === updatedBooth.no ? updatedBooth : b))
    );
  };

  const handleDelete = (no) => {
    setBoothList((prev) => prev.filter((b) => b.no !== no));
  };

  return (
    <div className={styles.boothsContainer}>
      {/* 참가 부스 목록 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>참가 부스 목록</h4>

        <div className={styles.topControls}>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="부스명 또는 설명 검색"
                className={styles.input}
              />
              <FiSearch className={styles.searchIcon} />
            </div>

            <div className={styles.filterGroup}>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={styles.select}
              >
                <option value="desc">우선순위 높은순</option>
                <option value="asc">우선순위 낮은순</option>
              </select>
            </div>
          </div>
        </div>

        <BoothTable
          data={pagedData}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <Pagination pageInfo={pageInfo} onPageChange={setPage} />
      </div>

      {/* 부스 등록 폼 */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>부스 등록</h4>
        <BoothSettingForm onSubmit={handleAdd} />
      </div>
    </div>
  );
}

export default Booths;