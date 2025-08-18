import { useState, useEffect } from 'react';
import styles from './ImageUpload.module.css';
import instance from '../../../api/lib/axios';

const ImageUpload = ({ onUploadSuccess, onUploadError, accept = "image/*", maxSize = 10 * 1024 * 1024, initialImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initialImageUrl);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;

    // 파일 크기 검증
    if (file.size > maxSize) {
      onUploadError && onUploadError("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      onUploadError && onUploadError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // 업로드 시작
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);

    try {
      // 1. Presigned URL 요청
      const response = await instance.get('/images/presign', {
        params: { filename: file.name }
      });

      const { uploadUrl, cdnUrl } = response.data;

      // 2. S3에 직접 업로드
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. 성공 콜백 호출
      onUploadSuccess && onUploadSuccess(cdnUrl);
    } catch (error) {
      console.error("업로드 실패:", error);
      onUploadError && onUploadError("이미지 업로드에 실패했습니다.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removeImage = () => {
    setPreview(null);
    onUploadSuccess && onUploadSuccess(null);
  };

  return (
    <div className={styles.imageUpload}>
      <div
        className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ""} ${
          uploading ? styles.uploading : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() =>
          !uploading && document.getElementById("fileInput").click()
        }
      >
        <input
          id="fileInput"
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          disabled={uploading}
        />

        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="미리보기" className={styles.preview} />
            <button
              type="button"
              className={styles.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              disabled={uploading}
            >
              ×
            </button>
          </div>
        ) : (
          <div className={styles.uploadPlaceholder}>
            {uploading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>업로드 중...</p>
              </div>
            ) : (
              <>
                <div className={styles.uploadIcon}>📷</div>
                <p>이미지를 드래그하거나<br></br> 클릭하여 업로드</p>
                <small>최대 10MB, JPG, PNG, GIF 지원</small>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;