import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ExpoSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import ToastFail from '../../../common/components/toastFail/ToastFail';
import { usePermission } from '../../permission/PermissionContext';
import {
  getMyExpoInfo,
  updateMyExpoInfo,
} from '../../../api/service/expo-admin/setting/ExpoInfoService';
import { getCategories } from '../../../api/service/user/categoryApi';
import ImageUpload from '../../../common/components/imageUpload/ImageUpload';

function ExpoSettingForm() {
  const { expoId } = useParams();
  const { perm } = usePermission();
  const [form, setForm] = useState(initForm());
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [expoStatus, setExpoStatus] = useState('');

  function initForm() {
    return {
      title: '',
      location: '',
      locationDetail: '',
      maxReserverCount: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      displayStartDate: '',
      displayEndDate: '',
      status: '',
      categoryIds: [],
      description: '',
      isPremium: false,
      thumbnailUrl:
        'https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg',
    };
  }

  const fetchExpoInfo = async () => {
    if (!expoId) return;
    try {
      const data = await getMyExpoInfo(expoId);
      setForm({
        title: data.title || '',
        location: data.location || '',
        locationDetail: data.locationDetail || '',
        maxReserverCount: data.maxReserverCount || '',
        startDate: data.startDate?.split('T')[0] || '',
        endDate: data.endDate?.split('T')[0] || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        displayStartDate: data.displayStartDate?.split('T')[0] || '',
        displayEndDate: data.displayEndDate?.split('T')[0] || '',
        status: data.status || '',
        categoryIds: data.categoryIds || [],
        description: data.description || '',
        isPremium: data.isPremium || false,
        thumbnailUrl:
          data.thumbnailUrl ||
          'https://cdn.netongs.com/news/photo/202412/322861_127383_830.jpg',
      });
      setExpoStatus(data.status || '');
    } catch (error) {
      console.error('Failed to fetch expo info:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const getCategoryBadges = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) {
      return [{ id: 'empty', name: '카테고리 없음' }];
    }
    
    const categoryBadges = categoryIds
      .map(id => {
        const category = categories.find(cat => cat.id === id);
        return category ? { id: category.id, name: category.name } : { id: id, name: `ID: ${id}` };
      })
      .filter(badge => badge);
    
    return categoryBadges.length > 0 ? categoryBadges : [{ id: 'empty', name: '카테고리 없음' }];
  };

  useEffect(() => {
    fetchExpoInfo();
    fetchCategories();
  }, [expoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageUploadSuccess = (cdnUrl) => {
    setForm((prev) => ({ ...prev, thumbnailUrl: cdnUrl }));
  };

  const handleImageUploadError = (error) => {
    setErrorMessage(error);
    setShowFailToast(true);
    setTimeout(() => setShowFailToast(false), 2000);
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 수정 버튼 표시 여부 확인
  const canShowEditButton = () => {
    return perm?.isExpoDetailUpdate && expoStatus === 'PENDING_PUBLISH';
  };

  // 설명 필드만 수정 가능한지 확인
  const canEditOnlyDescription = () => {
    return expoStatus === 'PENDING_PUBLISH';
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    try {
      let dataToSend;
      
      if (canEditOnlyDescription()) {
        // 게시 대기 상태: 설명만 수정 가능
        dataToSend = {
          description: form.description,
        };
      } else {
        // 다른 상태: 전체 필드 수정 가능 (현재는 이 경우가 없음)
        dataToSend = {
          categoryIds: form.categoryIds.map(id => Number(id)),
          title: form.title,
          thumbnailUrl: form.thumbnailUrl,
          description: form.description,
          location: form.location,
          locationDetail: form.locationDetail,
          maxReserverCount: parseInt(form.maxReserverCount, 10) || 0,
          startDate: form.startDate,
          endDate: form.endDate,
          displayStartDate: form.displayStartDate,
          displayEndDate: form.displayEndDate,
          startTime: form.startTime,
          endTime: form.endTime,
        };
      }

      await updateMyExpoInfo(expoId, dataToSend);
      setIsEditing(false);
      triggerToast();
      fetchExpoInfo(); // Re-fetch data after successful update
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message);
      setShowFailToast(true);
      setTimeout(() => setShowFailToast(false), 2000);
      console.error('Failed to update expo info:', error);
    }
  };

  const handleCancel = () => {
    fetchExpoInfo(); // Re-fetch original data
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess />}
      {showFailToast && <ToastFail message={errorMessage} />}

      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          {isEditing ? (
            <ImageUpload
              initialImageUrl={form.thumbnailUrl}
              onUploadSuccess={handleImageUploadSuccess}
              onUploadError={handleImageUploadError}
            />
          ) : (
            <img
              src={form.thumbnailUrl}
              alt="포스터"
              className={styles.profileImage}
            />
          )}
        </div>

        <div className={styles.formGrid}>
          {/* 카테고리 선택 영역 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>카테고리</label>
            <div className={styles.badgeRow}>
              {getCategoryBadges(form.categoryIds).map((category) => (
                <div key={category.id} className={styles.badge}>
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          {form.isPremium && (
            <div className={`${styles.formGroup} ${styles.full}`}>
              <label className={styles.label}>프리미엄 부스 상위 노출 서비스</label>
              <div className={styles.premiumBadge}>
                신청됨
              </div>
            </div>
          )}

          {/* Input fields... */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <input
              className={styles.inputField}
              placeholder="박람회 이름 입력"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={!isEditing || (isEditing && canEditOnlyDescription())}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 위치</label>
            <input
              className={styles.inputField}
              placeholder="박람회 위치 입력"
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={!isEditing || (isEditing && canEditOnlyDescription())}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>상세 위치</label>
            <input
              className={styles.inputField}
              placeholder="상세 위치 입력"
              name="locationDetail"
              value={form.locationDetail}
              onChange={handleChange}
              disabled={!isEditing || (isEditing && canEditOnlyDescription())}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>최대 수용 인원</label>
            <input
              className={styles.inputField}
              type="number"
              placeholder="최대 인원 입력"
              name="maxReserverCount"
              value={form.maxReserverCount}
              onChange={handleChange}
              disabled={!isEditing || (isEditing && canEditOnlyDescription())}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>개최 기간</label>
            <div className={styles.dateGroup}>
              <input
                type="date"
                className={styles.inputField}
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                disabled={!isEditing || (isEditing && canEditOnlyDescription())}
              />
              <input
                type="date"
                className={styles.inputField}
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                disabled={!isEditing || (isEditing && canEditOnlyDescription())}
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>운영 시간</label>
            <div className={styles.dateGroup}>
              <input
                type="time"
                className={styles.inputField}
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                disabled={!isEditing || (isEditing && canEditOnlyDescription())}
              />
              <input
                type="time"
                className={styles.inputField}
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                disabled={!isEditing || (isEditing && canEditOnlyDescription())}
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>게시 기간</label>
            <div className={styles.dateGroup}>
              <input
                type="date"
                className={styles.inputField}
                name="displayStartDate"
                value={form.displayStartDate}
                onChange={handleChange}
                disabled={!isEditing || (isEditing && canEditOnlyDescription())}
              />
              <input
                type="date"
                className={styles.inputField}
                name="displayEndDate"
                value={form.displayEndDate}
                onChange={handleChange}
                disabled={!isEditing || (isEditing && canEditOnlyDescription())}
              />
            </div>
          </div>

        </div>
      </div>

      <div className={`${styles.formGroup} ${styles.full}`}>
        <label className={styles.label}>설명</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="박람회 설명 입력"
          disabled={!isEditing}
        />
      </div>

      <div className={styles.buttonGroup}>
        {isEditing ? (
          <>
            <button
              className={`${styles.actionBtn} ${styles.submitBtn}`}
              onClick={handleSubmit}
            >
              <FaCheckCircle className={styles.iconBtn} /> 저장
            </button>
            <button
              className={`${styles.actionBtn} ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              <FaTimesCircle className={styles.iconBtn} /> 취소
            </button>
          </>
        ) : (
          canShowEditButton() && (
            <button
              className={`${styles.actionBtn} ${styles.submitBtn}`}
              onClick={handleEditClick}
            >
              <FaEdit className={styles.iconBtn} /> 수정
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ExpoSettingForm;
