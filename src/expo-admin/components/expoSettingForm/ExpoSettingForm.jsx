import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ExpoSettingForm.module.css';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import ToggleSwitch from '../../../common/components/toggleSwitch/ToggleSwitch';
import ToastSuccess from '../../../common/components/toastSuccess/ToastSuccess';
import {
  getMyExpoInfo,
  updateMyExpoInfo,
} from '../../../api/service/expo-admin/setting/expoInfoService';

function ExpoSettingForm() {
  const { expoId } = useParams();
  const [form, setForm] = useState(initForm());
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    } catch (error) {
      console.error('Failed to fetch expo info:', error);
    }
  };

  useEffect(() => {
    fetchExpoInfo();
  }, [expoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    try {
      await updateMyExpoInfo(expoId, form);
      setIsEditing(false);
      triggerToast();
    } catch (error) {
      console.error('Failed to update expo info:', error);
      // You might want to show an error toast here
    }
  };

  const handleCancel = () => {
    fetchExpoInfo(); // Re-fetch original data
    setIsEditing(false);
    triggerToast();
  };

  return (
    <div className={styles.container}>
      {showToast && <ToastSuccess />}

      <div className={styles.topRow}>
        <div className={styles.profileWrapper}>
          <img
            src={form.thumbnailUrl}
            alt="포스터"
            className={styles.profileImage}
          />
        </div>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>박람회 이름</label>
            <input
              className={styles.inputField}
              placeholder="박람회 이름 입력"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
                disabled={!isEditing}
              />
              <input
                type="date"
                className={styles.inputField}
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
              <input
                type="time"
                className={styles.inputField}
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
              <input
                type="date"
                className={styles.inputField}
                name="displayEndDate"
                value={form.displayEndDate}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>프리미엄 상위 노출 신청 여부</label>
            <div className={styles.toggleWrapper}>
              <ToggleSwitch checked={form.isPremium} disabled />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.full}`}>
            <label className={styles.label}>상태 및 카테고리</label>
            <div className={styles.badgeRow}>
              <div className={`${styles.badge} ${styles.red}`}>
                {form.status || '상태 없음'}
              </div>
              <div className={styles.badge}>
                {form.categoryIds.join(', ') || '카테고리 없음'}
              </div>
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
          <button
            className={`${styles.actionBtn} ${styles.submitBtn}`}
            onClick={handleEditClick}
          >
            <FaEdit className={styles.iconBtn} /> 수정
          </button>
        )}
      </div>
    </div>
  );
}

export default ExpoSettingForm;