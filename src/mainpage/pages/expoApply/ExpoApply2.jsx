import React, { useState, useEffect } from 'react';
import styles from './ExpoApply2.module.css';

const ExpoApply2 = () => {
  const [formData, setFormData] = useState({
    maxCapacity: '',
    description: '',
    categories: [],
    companyName: '',
    businessNumber: '',
    companyAddress: '',
    representativeName: '',
    representativeContact: '',
    representativeEmail: '',
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPremiumChecked, setIsPremiumChecked] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('expoFormData');
    if (storedData) {
      const prevData = JSON.parse(storedData);
      console.log('이전 페이지 폼 데이터:', prevData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedCategories.includes(selectedValue)) {
      setSelectedCategories([...selectedCategories, selectedValue]);
    }
  };
  
  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(category => category !== categoryToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('최종 폼 제출 데이터:', { ...formData, categories: selectedCategories, isPremiumChecked });
  };

  return (
    <div className={styles['form-container']}>
      <form onSubmit={handleSubmit}>
        {/* 최대 수용 인원 */}
        <div className={styles['form-group']}>
          <label htmlFor="maxCapacity">최대 수용 인원</label>
          <input
            type="text"
            id="maxCapacity"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            className={styles['input-field']}
            placeholder="예: 1000"
          />
        </div>

        {/* 박람회 상세 소개 */}
        <div className={styles['form-group']}>
          <label htmlFor="description">박람회 상세 소개</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles['textarea-field']}
          ></textarea>
        </div>

        {/* 카테고리 */}
        <div className={styles['form-group']}>
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            className={styles['select-field']}
            onChange={handleCategoryChange}
            value=""
          >
            <option value="" disabled>카테고리를 선택해주세요</option>
            <option value="IT">IT</option>
            <option value="창업">창업</option>
            <option value="디자인">디자인</option>
          </select>
          <div className={styles['selected-categories']}>
            {selectedCategories.map(category => (
              <span key={category} className={styles['category-tag']}>
                {category} <span onClick={() => handleRemoveCategory(category)}>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* 프리미엄 상위 노출 서비스 신청 - 수정된 토글 스위치 적용 */}
        <div className={styles['form-group']}>
          <div className={styles['wrapper']}>
            <label htmlFor="premium-toggle" className={styles['textLabel']}>프리미엄 상위 노출 서비스 신청</label>
            <label className={styles['toggleSwitch']}>
              <input
                type="checkbox"
                id="premium-toggle"
                checked={isPremiumChecked}
                onChange={() => setIsPremiumChecked(!isPremiumChecked)}
                className={styles['toggleInput']}
              />
              <span className={styles['toggleSlider']}></span>
            </label>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className={styles['form-group']}>
          <label className={styles['company-title']}>회사 정보</label>
          <div className={styles['inline-input-group']}>
            <div className={styles['inline-input-item']}>
              <label htmlFor="companyName">회사명</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={styles['input-field']}
              />
            </div>
            <div className={styles['inline-input-item']}>
              <label htmlFor="businessNumber">사업자 번호</label>
              <input
                type="text"
                id="businessNumber"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleChange}
                className={styles['input-field']}
              />
            </div>
          </div>
        </div>

        {/* 회사 주소 */}
        <div className={styles['form-group']}>
          <label htmlFor="companyAddress">회사 주소</label>
          <input
            type="text"
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className={styles['input-field']}
          />
        </div>

        {/* 대표자 정보 */}
        <div className={styles['form-group']}>
          <div className={styles['inline-input-group']}>
            <div className={styles['inline-input-item']}>
              <label htmlFor="representativeName">대표자명</label>
              <input
                type="text"
                id="representativeName"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                className={styles['input-field']}
              />
            </div>
            <div className={styles['inline-input-item']}>
              <label htmlFor="representativeContact">대표자 연락처</label>
              <input
                type="text"
                id="representativeContact"
                name="representativeContact"
                value={formData.representativeContact}
                onChange={handleChange}
                className={styles['input-field']}
              />
            </div>
          </div>
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="representativeEmail">대표자 이메일</label>
          <input
            type="email"
            id="representativeEmail"
            name="representativeEmail"
            value={formData.representativeEmail}
            onChange={handleChange}
            className={styles['input-field']}
          />
        </div>

        {/* 첨부 자료 */}
        <div className={styles['form-group']}>
          <label>첨부 자료</label>
          <p className={styles['sub-text']}>기획서, 사진 등 추가 자료를 첨부해주세요.</p>
          <div className={styles['upload-file-area']}>
            <label htmlFor="fileUpload" className={styles['upload-file-button']}>
              파일 업로드
            </label>
            <input type="file" id="fileUpload" style={{ display: 'none' }} />
          </div>
        </div>
        
        <div className={styles['button-group']}>
          <button type="button" className={styles['cancel-button']}>취소</button>
          <button type="submit" className={styles['submit-button']}>등록</button>
        </div>
      </form>
    </div>
  );
};

export default ExpoApply2;