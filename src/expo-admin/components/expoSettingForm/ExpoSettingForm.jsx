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
  updateMyExpoDescription,
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
  const [successMessage, setSuccessMessage] = useState('');
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
      thumbnailUrl: '로딩중', // ✅ 기본은 로딩중
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
        thumbnailUrl: data.thumbnailUrl || '로딩중', // ✅ fallback도 로딩중
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
      .map((id) => {
        const category = categories.find((cat) => cat.id === id);
        return category ? { id: category.id, name: category.name } : { id, name: `ID: ${id}` };
      })
      .filter(Boolean);
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

  const triggerToast = (message) => {
    setSuccessMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const canShowEditButton = () => {
    return perm?.isExpoDetailUpdate && expoStatus === 'PENDING_PUBLISH';
  };

  const canEditOnlyDescription = () => expoStatus === 'PENDING_PUBLISH';

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    try {
      // PENDING_PUBLISH 상태에서만 설명 수정 가능
      const dataToSend = {
        description: form.description,
      };
      await updateMyExpoDescription(expoId, dataToSend);

      setIsEditing(false);
      triggerToast('박람회 설명란이 수정되었습니다.');
      fetchExpoInfo();
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      setErrorMessage(message);
      setShowFailToast(true);
      setTimeout(() => setShowFailToast(false), 2000);
      console.error('Failed to update expo info:', error);
    }
  };

  const handleCancel = () => {
    fetchExpoInfo();
    setIsEditing(false);
  };

  const premiumToggleDisabled = !isEditing || canEditOnlyDescription();

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess message={successMessage} />}
      {showFailToast && <ToastFail message={errorMessage} />}

      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          {isEditing && !canEditOnlyDescription() ? (
            <ImageUpload
              initialImageUrl={form.thumbnailUrl === '로딩중' ? '' : form.thumbnailUrl}
              onUploadSuccess={handleImageUploadSuccess}
              onUploadError={handleImageUploadError}
            />
          ) : form.thumbnailUrl === '로딩중' ? (
            <span className={styles.loadingText}>로딩중</span>
          ) : (
            <img src={form.thumbnailUrl} alt="포스터" className={styles.profileImage} />
          )}
        </div>

        <div className={styles.formGrid}>
          {/* 카테고리 */}
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

          {/* 프리미엄 부스 */}
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 부스 상위 노출</label>
            <div className={styles.premiumRow}>
              <ToggleSwitch
                checked={!!form.isPremium}
                onChange={(v) => setForm((prev) => ({ ...prev, isPremium: v }))}
                disabled={premiumToggleDisabled}
              />
              {premiumToggleDisabled && (
                <span className={styles.hintText}>현재 단계에서는 변경할 수 없습니다.</span>
              )}
            </div>
          </div>

          {/* 기본 입력들 */}
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
            <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleSubmit}>
              <FaCheckCircle className={styles.iconBtn} /> 저장
            </button>
            <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
              <FaTimesCircle className={styles.iconBtn} /> 취소
            </button>
          </>
        ) : (
          canShowEditButton() && (
            <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={handleEditClick}>
              <FaEdit className={styles.iconBtn} /> 수정
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ExpoSettingForm;
