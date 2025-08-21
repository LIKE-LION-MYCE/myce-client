import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 별도 i18n 리소스 파일들 import
import homepageI18n from './i18n_homepage.js';
import expoDetailI18n from './i18n_expodetail.js';
import nonmemberI18n from './i18n_nonmember.js';
import mypageI18n from './i18n_mypaged.js';
import commonOptionsI18n from './i18n_commonoptions.js';
import componentsI18n from './i18n_components.js';
import receiptI18n from './i18n_receipt.js';
import authI18n from './i18n_auth.js';

// 리소스 병합 함수
const mergeResources = (mainResources, ...additionalResources) => {
  const merged = JSON.parse(JSON.stringify(mainResources)); // Deep copy
  
  additionalResources.forEach(resource => {
    Object.keys(resource).forEach(lang => {
      if (merged[lang]) {
        merged[lang].translation = {
          ...merged[lang].translation,
          ...resource[lang].translation
        };
      } else {
        merged[lang] = resource[lang];
      }
    });
  });
  
  return merged;
};

// 메인 번역 리소스
const mainResources = {
  ko: {
    translation: {
      // 공통
      common: {
        save: "저장",
        cancel: "취소",
        confirm: "확인",
        close: "닫기",
        loading: "로딩 중...",
        error: "오류",
        success: "성공",
        warning: "경고",
        selectLanguage: "언어 선택"
      },
      // 네비게이션
      nav: {
        home: "홈",
        expo: "박람회",
        mypage: "마이페이지",
        admin: "관리자",
        expoList: "박람회 목록",
        expoApply: "박람회 신청",
        adApply: "광고 신청",
        platformAdmin: "플랫폼 관리",
        logout: "로그아웃",
        login: "로그인",
        join: "회원가입",
        reservationCheck: "예매 확인",
        searchPlaceholder: "박람회를 검색해보세요"
      },
      // 공통 컴포넌트
      components: {
        // 취소 수수료 테이블
        cancelFeeTable: {
          headers: {
            date: "취소일",
            fee: "취소수수료"
          },
          data: {
            within7days: "예약 후 7일 이내",
            days8to5: "예약 후 8일 ~ 행사 5일 이내",
            days5to3: "행사 5일 ~ 3일 전",
            days2to1: "행사 2일 전 ~ 하루 전",
            eventDay: "행사 당일",
            noFee: "없음",
            fee10percent: "티켓금액의 10%",
            fee20percent: "티켓금액의 20%",
            fee30percent: "티켓금액의 30%",
            fee95percent: "티켓금액의 95%"
          }
        },
        // 알림 관련
        notification: {
          button: {
            errorFetch: "읽지 않은 알림 개수 조회 실패:"
          },
          modal: {
            title: "알림",
            markAllRead: "모두 읽음",
            processing: "처리중...",
            close: "✕",
            tabs: {
              general: "일반 알림",
              admin: "관리자 알림"
            },
            loading: "알림을 불러오는 중...",
            empty: {
              general: "일반 알림이 없습니다.",
              admin: "관리자 알림이 없습니다."
            },
            types: {
              expo: "박람회",
              event: "행사",
              qrIssued: "QR발급",
              paymentComplete: "결제완료",
              reservationConfirm: "예매확정",
              ad: "광고",
              notification: "알림"
            },
            time: {
              justNow: "방금",
              minutesAgo: "분 전",
              hoursAgo: "시간 전",
              daysAgo: "일 전"
            },
            statusKeywords: [
              "승인 대기", "승인 완료", "결제 대기", "게시 대기", "게시 중",
              "게시 종료", "정산 요청", "종료됨", "승인 거절", "취소 완료",
              "취소 대기", "승인됨", "거절됨", "완료됨"
            ],
            confirmModal: {
              title: "모든 알림 읽음 처리",
              message: "읽지 않은 모든 알림을 읽음 처리하시겠습니까?",
              cancel: "취소",
              confirm: "확인"
            },
            errors: {
              fetchFailed: "알림 조회 실패:",
              markReadFailed: "알림 처리 실패:",
              markAllReadFailed: "모든 알림 읽음 처리 실패:",
              unknownType: "알 수 없는 알림 타입:"
            }
          }
        },
        // 리뷰 시스템
        review: {
          // ReviewForm
          form: {
            pageTitle: {
              create: "리뷰 작성",
              edit: "리뷰 수정"
            },
            rating: {
              label: "평점",
              points: "점"
            },
            reviewTitle: {
              label: "제목",
              placeholder: "리뷰 제목을 입력해주세요"
            },
            content: {
              label: "리뷰 내용",
              placeholder: "박람회에 대한 솔직한 리뷰를 작성해주세요"
            },
            required: "*",
            buttons: {
              cancel: "취소",
              create: "작성",
              edit: "수정"
            },
            alerts: {
              titleRequired: "제목을 입력해주세요.",
              contentRequired: "리뷰 내용을 입력해주세요."
            }
          },
          // ReviewItem
          item: {
            time: {
              today: "오늘",
              yesterday: "어제",
              daysAgo: "일 전",
              edited: "(수정됨)"
            },
            buttons: {
              edit: "수정",
              delete: "삭제"
            }
          },
          // ReviewList
          list: {
            title: "리뷰",
            sort: {
              latest: "최신순",
              rating: "평점순"
            },
            buttons: {
              write: "리뷰 작성"
            },
            messages: {
              noPermission: "박람회에 참석한 후 리뷰를 작성할 수 있습니다.",
              loading: "리뷰를 불러오는 중...",
              noReviews: "아직 작성된 리뷰가 없습니다."
            },
            alerts: {
              created: "리뷰가 작성되었습니다.",
              updated: "리뷰가 수정되었습니다.",
              deleted: "리뷰가 삭제되었습니다.",
              deleteConfirm: "정말로 이 리뷰를 삭제하시겠습니까?",
              error: "리뷰 처리 중 오류가 발생했습니다."
            },
            errors: {
              fetchFailed: "리뷰 조회 실패:",
              permissionCheckFailed: "리뷰 권한 확인 실패:",
              processFailed: "리뷰 처리 실패:",
              deleteFailed: "리뷰 삭제 실패:"
            }
          }
        }
      },
      // 푸터
      footer: {
        company: {
          name: "(주)MYCE",
          address: "주소: 서울특별시 강남구 테크노로 123 (삼성동, 마이스타워)",
          businessNumber: "사업자등록번호: 123-45-67890｜대표이사: 김찍찍",
          ecommerce: "통신판매업신고: 2025-서울강남-0123",
          tourism: "관광사업증 등록번호: 제2025-000045호",
          hosting: "호스팅서비스제공자: (주)MYCE"
        },
        customerService: {
          title: "고객센터",
          fax: "팩스: 02-6000-2025",
          email: "이메일: support@myce.live",
          chatService: "좌측 하단의 상담 서비스 버튼을 통해 전문 상담원 또는 AI 챗봇 상담을 이용하실 수 있습니다."
        },
        privacy: {
          title: "개인정보 보호책임자",
          department: "담당부서: 개발팀",
          contact: "연락처: privacy@myce.co.kr",
          hours: "처리시간: 평일 09:00~18:00 (주말, 공휴일 제외)"
        },
        legal: {
          disclaimer: "(주)MYCE는 일부 상품의 통신판매중개자로서 통신판매의 당사자가 아니므로, 상품의 예약, 이용 및 환불 등 거래와 관련된 의무와 책임은 판매자에게 있으며 (주)MYCE는 일체 책임을 지지 않습니다.",
          terms: "이용약관",
          privacy: "개인정보 처리방침",
          copyright: "ⓒ MYCE Co., Ltd. All rights reserved."
        }
      },
      // 메인페이지
      mainpage:{
        adForm: {
          title: "광고 신청",
          subtitle: "광고 정보를 입력해주세요.",
          fields: {
            adTitle: "광고명",
            adTitlePlaceholder: "광고명을 입력해주세요",
            adPosition: "광고 배너 위치",
            adPositionPlaceholder: "광고 배너 위치를 선택해주세요",
            adPeriod: "광고 기간",
            adImage: "광고 배너 이미지",
            adImageAlt: "광고 미리보기",
            linkUrl: "광고 배너 클릭 시 이동할 페이지 URL",
            linkUrlPlaceholder: "예: https://www.myce.link",
            adDescription: "광고 소개",
            companyInfo: "회사 정보",
            companyName: "회사명",
            businessNumber: "사업자 번호",
            companyAddress: "회사 주소",
            companyAddressPlaceholder: "주소 검색 버튼을 눌러주세요",
            addressSearch: "주소 검색",
            addressSearchClose: "닫기",
            ceoName: "대표자명",
            ceoContact: "대표자 연락처",
            ceoEmail: "대표자 이메일",
            ceoEmailPlaceholder: "예: hello@myce.com"
          },
          buttons: {
            estimatedCost: "💰 예상 이용료 확인",
            cancel: "취소",
            submit: "등록"
          },
          messages: {
            imageUploadFailed: "이미지 업로드에 실패했습니다.",
            selectPositionFirst: "광고 위치를 먼저 선택해주세요.",
            enterPeriodFirst: "광고 기간을 먼저 입력해주세요.",
            startDateAfterEndDate: "시작일은 종료일보다 이전이어야 합니다.",
            startDateAfterToday: "시작일은 오늘 이후여야 합니다.",
            endDateAfterToday: "종료일은 오늘 이후여야 합니다.",
            invalidDate: "유효하지 않은 날짜입니다.",
            enterRequiredFields: "필수 정보를 모두 올바르게 입력해주세요.",
            adRegistered: "광고가 성공적으로 등록되었습니다.",
            adRegistrationFailed: "광고 등록에 실패했습니다. 입력값을 확인해 주세요.",
            selectPositionAndPeriod: "광고 위치와 기간을 먼저 선택해주세요.",
            estimatedCostDescription: "선택하신 위치와 기간을 바탕으로 예상 이용료를 확인할 수 있습니다."
          },
        },
        expoForm: {
           title: "박람회 신청",
           subtitle: "박람회 기본정보를 입력해주세요.",
           fields: {
             poster: "박람회 포스터",
             posterAlt: "포스터 미리보기",
             expoName: "박람회 이름",
             expoNamePlaceholder: "박람회 이름을 입력해주세요.",
             displayPeriod: "박람회 게시기간",
             eventPeriod: "박람회 개최기간",
             location: "박람회 장소",
             locationPlaceholder: "주소 검색 버튼을 클릭하세요.",
             addressSearch: "주소 검색",
             addressSearchClose: "검색창 닫기",
             locationDetail: "세부 장소",
             locationDetailPlaceholder: "예: 코엑스 A홀",
             operatingTime: "박람회 운영시간",
             startTime: "시작 시간",
             endTime: "종료 시간"
           },
           buttons: {
             nextPage: "다음 페이지"
           },
           messages: {
             imageUploadFailed: "이미지 업로드에 실패했습니다. 다시 시도해 주세요.",
             posterRequired: "포스터 이미지를 업로드해주세요.",
             expoNameRequired: "박람회 이름을 입력해주세요.",
             startDateRequired: "개최 시작일을 입력해주세요.",
             endDateRequired: "개최 종료일을 입력해주세요.",
             displayStartDateRequired: "게시 시작일을 입력해주세요.",
             displayEndDateRequired: "게시 종료일을 입력해주세요.",
             locationRequired: "박람회 장소를 입력해주세요.",
             locationDetailRequired: "박람회 세부장소를 입력해주세요.",
             startTimeRequired: "운영 시작시간을 선택해주세요.",
             endTimeRequired: "운영 종료시간을 선택해주세요.",
             startDateAfterEndDate: "시작일은 종료일보다 이전이어야 합니다.",
             endDateAfterStartDate: "종료일은 시작일보다 이후여야 합니다.",
             displayStartDateAfterToday: "게시 시작일은 오늘 이후여야 합니다.",
             displayStartDateAfterEndDate: "게시 시작일은 게시 종료일보다 이전이어야 합니다.",
             displayEndDateAfterStartDate: "게시 종료일은 게시 시작일보다 이후여야 합니다.",
             eventStartDateAfterDisplayStart: "개최 시작일은 게시 시작일과 같거나 이후여야 합니다.",
             eventStartDateBeforeDisplayEnd: "개최 시작일은 게시 종료일보다 이전이어야 합니다.",
             eventEndDateAfterStartDate: "개최 종료일은 시작일보다 최소 하루 이후여야 합니다.",
             eventEndDateBeforeDisplayEnd: "개최 종료일은 게시 종료일과 같거나 이전이어야 합니다.",
             startTimeBeforeEndTime: "운영 시작 시간은 종료 시간보다 이전이어야 합니다.",
             endTimeAfterStartTime: "운영 종료 시간은 시작 시간보다 이후여야 합니다.",
             enterRequiredFields: "필수 정보를 모두 올바르게 입력해주세요.",
             uploadInfo: "JPG, PNG, GIF, WebP (10MB 이하)"
           }
         },
         // 공통 컴포넌트 번역
         common: {
           usageGuidelines: {
             expo: {
               title: "박람회 신청 주의사항",
               sections: {
                 eligibility: {
                   title: "신청 자격",
                   items: [
                     "법인 사업자 또는 개인 사업자만 신청 가능합니다.",
                     "박람회에 대한 상세 정보를 작성 하셔야 합니다.",
                     "신청 시 사업자 관련 정보 제출이 필요합니다"
                   ]
                 },
                 approvalCriteria: {
                   title: "승인 기준",
                   items: [
                     "박람회 내용이 건전하고 법적 문제가 없어야 합니다.",
                     "제출된 서류가 완전하고 정확해야 합니다.",
                     "플랫폼 정책에 부합하는 박람회여야 합니다.",
                     "중복 신청이 아니어야 합니다."
                   ]
                 },
                 precautions: {
                   title: "주의사항",
                   items: [
                     "승인 후 박람회 정보 변경 시 재승인이 필요할 수 있습니다.",
                     "게시 기간은 박람회 개최 기간을 초과할 수 없습니다.",
                     "부적절한 내용 발견 시 승인이 취소될 수 있습니다.",
                     "결제 완료 후 취소 시 수수료가 발생할 수 있습니다."
                   ]
                 },
                 refundPolicy: {
                   title: "환불 정책",
                   items: [
                     "게시 대기 중 취소: 이용료 + 일 사용료 100% 환불",
                     "게시 중 취소: (일 사용료 * 남은 게시 기간) 환불",
                     "박람회 개최 일주일 이내 취소: 환불 불가"
                   ]
                 }
               }
             },
             ad: {
               title: "광고 신청 주의사항",
               sections: {
                 regulations: {
                   title: "광고 규정",
                   items: [
                     "법적으로 문제없는 건전한 광고 내용이어야 합니다.",
                     "타인의 저작권을 침해하지 않는 이미지를 사용해야 합니다.",
                     "허위 또는 과장 광고는 금지됩니다.",
                     "성인 콘텐츠, 도박, 불법 상품 광고는 불가합니다."
                   ]
                 },
                 imageSpecs: {
                   title: "이미지 규격",
                   items: [
                     "파일 형식: JPG, PNG, GIF, WebP만 허용",
                     "파일 크기: 10MB 이하",
                     "권장 해상도: 1200x628px (가로:세로 = 1.91:1)",
                     "텍스트가 포함된 경우 가독성을 고려해주세요."
                   ]
                 },
                 publishingPolicy: {
                   title: "게시 정책",
                   items: [
                     "광고 심사는 영업일 기준 1-3일 소요됩니다.",
                     "부적절한 광고로 판단 시 승인이 거절될 수 있습니다.",
                     "게시 중 정책 위반 발견 시 즉시 게시가 중단됩니다.",
                     "동일 광고 위치에 중복 예약은 불가능합니다."
                   ]
                 },
                 refundPolicy: {
                   title: "환불 정책",
                   items: [
                     "게시 대기 중 취소: 일 사용료 100% 환불",
                     "게시 중 취소: (일 사용료 * 남은 게시 기간) 환불",
                     "광고 게시 시작 일주일 이내 취소: 환불 불가"
                   ]
                 }
               }
             }
                       }
         }
       },
       // 마이페이지
      mypageGeneral: {
        title: "마이페이지",
        userInfo: "회원 정보",
        reservation: "예매 내역",
        savedExpo: "찜한 박람회",
        systemSettings: "시스템 설정",
        languageSettings: "언어 설정",
        advertiserMenu: "광고주 메뉴",
        adStatusMenu: "광고 신청 현황",
        expoAdminMenu: "박람회 관리자 메뉴",
        expoStatusMenu: "박람회 신청 현황",
        // 박람회 신청 현황 상세
        expoStatus: {
          title: "박람회 신청 현황",
          loading: "로딩 중...",
          loadError: "신청 박람회를 불러오는데 실패했습니다.",
          noData: "신청한 박람회가 없습니다.",
          table: {
            no: "No.",
            expoName: "박람회명",
            appliedAt: "신청일",
            postPeriod: "게시 기간",
            location: "개최 장소",
            status: "상태",
            premium: "프리미엄"
          },
          pagination: {
            prev: "이전",
            next: "다음"
          },
          modal: {
            confirm: "확인"
          },
          status: {
            PENDING_APPROVAL: "승인 대기",
            PENDING_PAYMENT: "결제 대기",
            PENDING_PUBLISH: "게시 대기",
            PENDING_CANCEL: "취소 대기",
            PUBLISHED: "게시 중",
            PUBLISH_ENDED: "게시 종료",
            SETTLEMENT_REQUESTED: "정산 요청",
            COMPLETED: "종료됨",
            REJECTED: "승인 거절",
            CANCELLED: "취소 완료"
          },
          detail: {
            loading: "로딩 중...",
            error: "박람회 정보를 불러오는데 실패했습니다.",
            notFound: "데이터를 찾을 수 없습니다.",
            messages: {
              paymentCompleted: "결제가 완료되었습니다. 박람회 상태가 게시대기로 변경되었습니다.",
              paymentFailed: "결제 처리에 실패했습니다.",
              paymentInfoError: "결제 정보를 불러오는데 실패했습니다.",
              adminInfoError: "관리자 정보를 불러오는데 실패했습니다.",
              expoCancelled: "박람회 신청이 취소되었습니다.",
              expoCancelFailed: "박람회 취소에 실패했습니다.",
              refundInfoError: "환불 정보를 불러오는데 실패했습니다.",
              refundCompleted: "환불 신청이 완료되었습니다.",
              refundFailed: "환불 신청에 실패했습니다.",
              settlementInfoError: "정산 내역을 불러오는데 실패했습니다.",
              settlementCompleted: "정산 요청이 완료되었습니다.",
              settlementFailed: "정산 요청에 실패했습니다."
            },
            defaultValues: {
              noTitle: "박람회 제목 없음",
              noLocation: "장소 미정",
              noCategory: "카테고리 미정",
              noDescription: "상세 설명이 없습니다.",
              noCompanyName: "회사명 미정",
              noAddress: "주소 미정",
              noBusinessNumber: "사업자번호 미정",
              noCeoName: "대표자명 미정",
              noContact: "연락처 미정",
              noEmail: "이메일 미정",
              noApplicant: "신청자명 미정",
              noLoginId: "로그인 ID 없음",
              noTicketName: "티켓명 미정",
              noInfo: "정보 없음",
              noTickets: "등록된 티켓이 없습니다.",
              noPaymentRefundInfo: "결제/환불 정보가 존재하지 않습니다."
            },
            buttons: {
              paymentRequest: "결제 신청",
              refundRequest: "환불 신청",
              refundInfo: "환불 정보",
              settlementRequest: "정산 신청",
              settlementInfo: "정산 정보 조회",
              settlementCompleted: "정산 완료 정보 조회",
              paymentInfo: "결제 정보",
              cancelRequest: "취소 신청",
              adminInfo: "관리자 정보",
              adminPage: "관리자 페이지"
            },
            fields: {
              expoName: "박람회 이름",
              location: "박람회 위치",
              capacity: "최대 수용 인원",
              period: "개최 기간",
              operatingTime: "운영 시간",
              postPeriod: "게시 기간",
              premium: "프리미엄 노출",
              category: "카테고리",
              companyInfo: "회사 정보",
              companyName: "회사명",
              companyAddress: "회사 주소",
              businessNumber: "사업자 번호",
              ceoInfo: "대표자 정보",
              ceoName: "대표명",
              ceoContact: "대표자 연락처",
              ceoEmail: "대표자 이메일",
              description: "상세 설명",
              ticketInfo: "티켓 정보",
              ticketName: "티켓명",
              ticketPrice: "가격",
              ticketQuantity: "판매개수",
              ticketType: "종류"
            },
            ticketTypes: {
              general: "일반",
              earlyBird: "얼리버드"
            },
            altText: {
              poster: "박람회 포스터"
            },
            pageTitle: "신청 상세"
          }
        },
        mileage: "마일리지",
        basicInfo: "기본 정보",
        accountManagement: "계정 관리",
        name: "이름",
        birthDate: "생년월일",
        userId: "아이디",
        phoneNumber: "전화번호",
        email: "이메일",
        gender: "성별",
        female: "여자",
        male: "남자",
        modifyInfo: "정보 수정",
        changePassword: "비밀번호 변경",
        save: "저장",
        cancel: "취소",
        withdraw: "회원 탈퇴",
        withdrawWarning: "계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.",
        withdrawConfirm: "정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.",
        infoUpdated: "회원 정보가 수정되었습니다.",
        infoUpdateFailed: "회원 정보 수정에 실패했습니다.",
        withdrawSuccess: "회원 탈퇴가 완료되었습니다.",
        withdrawFailed: "회원 탈퇴에 실패했습니다.",
        adsStatus: {
          title: "광고 신청 현황",
          totalAds: "총 {{count}}개의 광고",
          noAds: "등록된 광고가 없습니다.",
          loadError: "광고 목록을 불러오는데 실패했습니다.",
          table: {
            title: "제목",
            location: "광고 위치",
            period: "게시 기간",
            status: "상태"
          },
          status: {
            PENDING_APPROVAL: "승인 대기",
            PENDING_PAYMENT: "결제 대기",
            PENDING_PUBLISH: "게시 대기",
            PENDING_CANCEL: "취소 대기",
            PUBLISHED: "게시 중",
            REJECTED: "승인 거절",
            CANCELLED: "취소 완료",
            COMPLETED: "종료됨"
          },
          pagination: {
            prev: "이전",
            next: "다음"
          },
          aria: {
            goToDetail: "{{title}} 상세로 이동"
          },
          detail: {
            title: "배너 상세",
            loading: "로딩 중...",
            error: "광고 상세 정보를 불러오는데 실패했습니다.",
            notFound: "광고 정보를 찾을 수 없습니다.",
            adTitle: "광고 제목",
            adPosition: "광고 위치",
            displayPeriod: "게시 기간",
            linkUrl: "링크 URL",
            applicantName: "신청자명 (대표자)",
            applicantPhone: "신청자 연락처",
            companyName: "회사명",
            businessNumber: "사업자등록번호",
            adDescription: "광고 소개",
            bannerImage: "배너 이미지",
            buttons: {
              payment: "결제하기",
              paymentInfo: "결제 정보",
              viewPaymentInfo: "결제 정보",
              refundRequest: "환불 신청",
              refundInfo: "환불 정보",
              refundHistory: "환불 정보",
              cancelRequest: "광고 취소",
              viewRejectInfo: "거절사유보기"
            },
            messages: {
              noButtonsAvailable: "사용 가능한 작업이 없습니다.",
              noPaymentRefundInfo: "결제/환불 정보가 존재하지 않습니다.",
              paymentSuccess: "결제가 성공적으로 완료되었습니다.",
              paymentError: "결제 완료 중 오류가 발생했습니다",
              refundSuccess: "환불 신청이 성공적으로 접수되었습니다.",
              refundError: "환불 신청 중 오류가 발생했습니다",
              cancelSuccess: "광고가 성공적으로 취소되었습니다.",
              cancelError: "취소 중 오류가 발생했습니다.",
              cancelConfirm: "광고를 취소하시겠습니까?",
              pendingApprovalCancelConfirm: "승인대기 중인 광고를 취소하시겠습니까?",
              pendingPaymentCancelConfirm: "결제대기 중인 광고를 취소하시겠습니까?"
            }
          }
        }
      },
      // 예매 내역
      reservation: {
        title: "예매 내역",
        reservationNumber: "예매번호",
        ticketName: "티켓 이름",
        ticketCount: "티켓수",
        ticketUnit: "매",
        reservationDate: "예매일",
        reservationDetail: "예매 상세",
        status: {
          cancelled: "취소됨",
          pending: "결제 대기",
          confirmed: "결제 완료"
        },
        noData: "예매 내역이 없습니다.",
        loadError: "예매 내역을 불러오는데 실패했습니다.",
        previous: "이전",
        next: "다음"
      },
      // 예매 상세
      reservationDetail: {
        title: "예약 확인",
        eventInfo: "참여 행사 정보",
        participants: "참여 인원",
        reservationInfo: "예매 정보",
        paymentInfo: "결제 정보",
        edit: "편집",
        save: "저장",
        cancel: "취소",
        loadError: "예약 정보를 불러오는데 실패했습니다.",
        notFound: "예약 정보를 찾을 수 없습니다.",
        updateSuccess: "참여 인원 정보가 성공적으로 업데이트되었습니다.",
        updateError: "참여 인원 정보 업데이트에 실패했습니다.",
        updateFailAlert: "업데이트에 실패했습니다. 다시 시도해주세요.",
        expoNotActive: "박람회 기간이 아닙니다.",
        table: {
          name: "이름",
          reservationNumber: "예매번호",
          gender: "성별",
          phone: "전화번호",
          email: "이메일",
          qrCheck: "QR 확인",
          select: "선택",
          male: "남자",
          female: "여자",
          cancelled: "취소됨",
          detail: "상세보기",
          outOfPeriod: "기간 외"
        },
        reservationFields: {
          reservationDate: "예매일",
          ticketName: "티켓 이름",
          ticketType: "티켓 타입",
          ticketCount: "티켓 장수",
          unitPrice: "단가",
          serviceFee: "서비스 수수료",
          expectedPayment: "예상 결제금액"
        },
        paymentFields: {
          paymentMethod: "결제방법",
          paymentDetail: "결제수단",
          totalAmount: "총 결제금액",
          usedMileage: "사용 마일리지",
          savedMileage: "적립 마일리지",
          memberGrade: "회원등급",
          mileageRate: "적립률",
          paidAt: "결제일시"
        },
        ticketTypes: {
          general: "일반",
          earlyBird: "얼리버드"
        },
        paymentMethods: {
          card: "카드",
          bankTransfer: "계좌이체",
          virtualAccount: "가상계좌",
          simplePay: "간편결제"
        },
        statusLabels: {
          confirmed: "예약 확정",
          cancelled: "예약 취소",
          pending: "결제 대기"
        },
        cancelButton: "예약 취소",
        cancelCompleted: "취소 완료"
      },
      // 찜한 박람회
      savedExpo: {
        title: "찜한 박람회",
        eventPeriod: "행사 기간",
        eventLocation: "행사 위치",
        noData: "찜한 박람회가 없습니다.",
        loadError: "찜한 박람회를 불러오는데 실패했습니다.",
        detailView: "상세보기",
        loading: "로딩 중..."
      },
      // 언어 설정
      language: {
        korean: "한국어",
        english: "English",
        japanese: "日本語",
        selectLanguage: "언어를 선택하세요",
        changeLanguage: "언어 변경",
        languageChanged: "언어가 변경되었습니다"
      },
      // 박람회
      expo: {
        title: "박람회",
        name: "박람회 이름",
        location: "위치",
        capacity: "최대 수용 인원",
        period: "개최 기간",
        operatingTime: "운영 시간",
        postPeriod: "게시 기간",
        premium: "프리미엄 노출",
        category: "카테고리",
        description: "상세 설명",
        companyInfo: "회사 정보",
        ticketInfo: "티켓 정보"
      },
      // 박람회 신청 현황
      expoStatus: {
        title: "박람회 신청 현황",
        loading: "로딩 중...",
        loadError: "신청 박람회를 불러오는데 실패했습니다.",
        noData: "신청한 박람회가 없습니다.",
        table: {
          no: "No.",
          expoName: "박람회명",
          appliedAt: "신청일",
          postPeriod: "게시 기간",
          location: "개최 장소",
          status: "상태",
          premium: "프리미엄"
        },
        pagination: {
          prev: "이전",
          next: "다음"
        },
        modal: {
          confirm: "확인"
        },
        status: {
          PENDING_APPROVAL: "승인 대기",
          PENDING_PAYMENT: "결제 대기",
          PENDING_PUBLISH: "게시 대기",
          PENDING_CANCEL: "취소 대기",
          PUBLISHED: "게시 중",
          PUBLISH_ENDED: "게시 종료",
          SETTLEMENT_REQUESTED: "정산 요청",
          COMPLETED: "종료됨",
          REJECTED: "승인 거절",
          CANCELLED: "취소 완료"
        },
        detail: {
          loading: "로딩 중...",
          error: "박람회 정보를 불러오는데 실패했습니다.",
          notFound: "데이터를 찾을 수 없습니다.",
          messages: {
            paymentCompleted: "결제가 완료되었습니다. 박람회 상태가 게시대기로 변경되었습니다.",
            paymentFailed: "결제 처리에 실패했습니다.",
            paymentInfoError: "결제 정보를 불러오는데 실패했습니다.",
            adminInfoError: "관리자 정보를 불러오는데 실패했습니다.",
            expoCancelled: "박람회 신청이 취소되었습니다.",
            expoCancelFailed: "박람회 취소에 실패했습니다.",
            refundInfoError: "환불 정보를 불러오는데 실패했습니다.",
            refundCompleted: "환불 신청이 완료되었습니다.",
            refundFailed: "환불 신청에 실패했습니다.",
            settlementInfoError: "정산 내역을 불러오는데 실패했습니다.",
            settlementCompleted: "정산 요청이 완료되었습니다.",
            settlementFailed: "정산 요청에 실패했습니다."
          },
          defaultValues: {
            noTitle: "박람회 제목 없음",
            noLocation: "장소 미정",
            noCategory: "카테고리 미정",
            noDescription: "상세 설명이 없습니다.",
            noCompanyName: "회사명 미정",
            noAddress: "주소 미정",
            noBusinessNumber: "사업자번호 미정",
            noCeoName: "대표자명 미정",
            noContact: "연락처 미정",
            noEmail: "이메일 미정",
            noApplicant: "신청자명 미정",
            noLoginId: "로그인 ID 없음",
            noTicketName: "티켓명 미정",
            noInfo: "정보 없음",
            noTickets: "등록된 티켓이 없습니다.",
            noPaymentRefundInfo: "결제/환불 정보가 존재하지 않습니다."
          },
          buttons: {
            paymentRequest: "결제 신청",
            refundRequest: "환불 신청",
            refundInfo: "환불 정보",
            settlementRequest: "정산 신청",
            settlementInfo: "정산 정보 조회",
            settlementCompleted: "정산 완료 정보 조회",
            paymentInfo: "결제 정보",
            cancelRequest: "취소 신청",
            adminInfo: "관리자 정보",
            adminPage: "관리자 페이지"
          },
          fields: {
            expoName: "박람회 이름",
            location: "박람회 위치",
            capacity: "최대 수용 인원",
            period: "개최 기간",
            operatingTime: "운영 시간",
            postPeriod: "게시 기간",
            premium: "프리미엄 노출",
            category: "카테고리",
            companyInfo: "회사 정보",
            companyName: "회사명",
            companyAddress: "회사 주소",
            businessNumber: "사업자 번호",
            ceoInfo: "대표자 정보",
            ceoName: "대표명",
            ceoContact: "대표자 연락처",
            ceoEmail: "대표자 이메일",
            description: "상세 설명",
            ticketInfo: "티켓 정보",
            ticketName: "티켓명",
            ticketPrice: "가격",
            ticketQuantity: "판매개수",
            ticketType: "종류"
          },
          ticketTypes: {
            general: "일반",
            earlyBird: "얼리버드"
          },
          altText: {
            poster: "박람회 포스터"
          },
          pageTitle: "신청 상세"
        }
      }
    }
  },
  en: {
    translation: {
      // Common
      common: {
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        close: "Close",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        warning: "Warning",
        selectLanguage: "Select Language"
      },
      // Navigation
      nav: {
        home: "Home",
        expo: "Expo",
        mypage: "My Page",
        admin: "Admin",
        expoList: "Expo List",
        expoApply: "Apply for Expo",
        adApply: "Apply for Ad",
        platformAdmin: "Platform Admin",
        logout: "Logout",
        login: "Login",
        join: "Sign Up",
        reservationCheck: "Check Reservation",
        searchPlaceholder: "Search for exhibitions"
      },
      // Common Components
      components: {
        // Cancel Fee Table
        cancelFeeTable: {
          headers: {
            date: "Cancellation Date",
            fee: "Cancellation Fee"
          },
          data: {
            within7days: "Within 7 days after booking",
            days8to5: "8 days after booking ~ 5 days before event",
            days5to3: "5 days ~ 3 days before event",
            days2to1: "2 days ~ 1 day before event",
            eventDay: "Event day",
            noFee: "None",
            fee10percent: "10% of ticket price",
            fee20percent: "20% of ticket price",
            fee30percent: "30% of ticket price",
            fee95percent: "95% of ticket price"
          }
        },
        // Notification Related
        notification: {
          button: {
            errorFetch: "Failed to fetch unread notification count:"
          },
          modal: {
            title: "Notifications",
            markAllRead: "Mark All as Read",
            processing: "Processing...",
            close: "✕",
            tabs: {
              general: "General Notifications",
              admin: "Admin Notifications"
            },
            loading: "Loading notifications...",
            empty: {
              general: "No general notifications.",
              admin: "No admin notifications."
            },
            types: {
              expo: "Expo",
              event: "Event",
              qrIssued: "QR Issued",
              paymentComplete: "Payment Complete",
              reservationConfirm: "Reservation Confirmed",
              ad: "Advertisement",
              notification: "Notification"
            },
            time: {
              justNow: "Just now",
              minutesAgo: "minutes ago",
              hoursAgo: "hours ago",
              daysAgo: "days ago"
            },
            statusKeywords: [
              "Pending Approval", "Approved", "Pending Payment", "Pending Publication", "Published",
              "Publication Ended", "Settlement Requested", "Completed", "Rejected", "Cancelled",
              "Pending Cancellation", "Approved", "Rejected", "Completed"
            ],
            confirmModal: {
              title: "Mark All Notifications as Read",
              message: "Do you want to mark all unread notifications as read?",
              cancel: "Cancel",
              confirm: "Confirm"
            },
            errors: {
              fetchFailed: "Failed to fetch notifications:",
              markReadFailed: "Failed to process notification:",
              markAllReadFailed: "Failed to mark all notifications as read:",
              unknownType: "Unknown notification type:"
            }
          }
        },
        // Review System
        review: {
          // ReviewForm
          form: {
            pageTitle: {
              create: "Write Review",
              edit: "Edit Review"
            },
            rating: {
              label: "Rating",
              points: "points"
            },
            reviewTitle: {
              label: "Title",
              placeholder: "Please enter review title"
            },
            content: {
              label: "Review Content",
              placeholder: "Please write an honest review about the exhibition"
            },
            required: "*",
            buttons: {
              cancel: "Cancel",
              create: "Submit",
              edit: "Update"
            },
            alerts: {
              titleRequired: "Please enter a title.",
              contentRequired: "Please enter review content."
            }
          },
          // ReviewItem
          item: {
            time: {
              today: "Today",
              yesterday: "Yesterday",
              daysAgo: "days ago",
              edited: "(edited)"
            },
            buttons: {
              edit: "Edit",
              delete: "Delete"
            }
          },
          // ReviewList
          list: {
            title: "Reviews",
            sort: {
              latest: "Latest",
              rating: "Rating"
            },
            buttons: {
              write: "Write Review"
            },
            messages: {
              noPermission: "You can write a review after attending the exhibition.",
              loading: "Loading reviews...",
              noReviews: "No reviews have been written yet."
            },
            alerts: {
              created: "Review has been created.",
              updated: "Review has been updated.",
              deleted: "Review has been deleted.",
              deleteConfirm: "Are you sure you want to delete this review?",
              error: "An error occurred while processing the review."
            },
            errors: {
              fetchFailed: "Failed to fetch reviews:",
              permissionCheckFailed: "Failed to check review permission:",
              processFailed: "Failed to process review:",
              deleteFailed: "Failed to delete review:"
            }
          }
        }
      },
      // Footer
      footer: {
        company: {
          name: "MYCE Co., Ltd.",
          address: "Address: 123 Techno-ro, Gangnam-gu, Seoul (Samseong-dong, MYCE Tower)",
          businessNumber: "Business Registration Number: 123-45-67890｜CEO: Kim ZZick",
          ecommerce: "E-commerce Registration: 2025-Seoul Gangnam-0123",
          tourism: "Tourism Business License: No. 2025-000045",
          hosting: "Hosting Service Provider: MYCE Co., Ltd."
        },
        customerService: {
          title: "Customer Service",
          fax: "Fax: 02-6000-2025",
          email: "Email: support@myce.live",
          chatService: "You can use professional consultant or AI chatbot consultation through the consultation service button at the bottom left."
        },
        privacy: {
          title: "Privacy Protection Officer",
          department: "Department: Development Team",
          contact: "Contact: privacy@myce.co.kr",
          hours: "Business Hours: Weekdays 09:00~18:00 (Excluding weekends and holidays)"
        },
        legal: {
          disclaimer: "MYCE Co., Ltd. is a telecommunications sales intermediary for some products and is not a party to telecommunications sales, so the obligations and responsibilities related to transactions such as product reservations, use, and refunds belong to the seller, and MYCE Co., Ltd. assumes no responsibility.",
          terms: "Terms of Service",
          privacy: "Privacy Policy",
          copyright: "ⓒ MYCE Co., Ltd. All rights reserved."
        }
      },
      // Main Page
      mainpage: {
        adForm: {
          title: "Ad Application",
          subtitle: "Please enter advertisement information.",
          fields: {
            adTitle: "Ad Title",
            adTitlePlaceholder: "Please enter the ad title",
            adPosition: "Ad Banner Position",
            adPositionPlaceholder: "Please select an ad banner position",
            adPeriod: "Ad Period",
            adImage: "Ad Banner Image",
            adImageAlt: "Ad Preview",
            linkUrl: "URL to redirect when ad banner is clicked",
            linkUrlPlaceholder: "e.g., https://www.myce.link",
            adDescription: "Ad Description",
            companyInfo: "Company Information",
            companyName: "Company Name",
            businessNumber: "Business Number",
            companyAddress: "Company Address",
            companyAddressPlaceholder: "Please click the address search button",
            addressSearch: "Search Address",
            addressSearchClose: "Close",
            ceoName: "CEO Name",
            ceoContact: "CEO Contact",
            ceoEmail: "CEO Email",
            ceoEmailPlaceholder: "e.g., hello@myce.com"
          },
          buttons: {
            estimatedCost: "💰 Check Estimated Cost",
            cancel: "Cancel",
            submit: "Register"
          },
          messages: {
            imageUploadFailed: "Image upload failed.",
            selectPositionFirst: "Please select the ad position first.",
            enterPeriodFirst: "Please enter the ad period first.",
            startDateAfterEndDate: "Start date must be before end date.",
            startDateAfterToday: "Start date must be after today.",
            endDateAfterToday: "End date must be after today.",
            invalidDate: "Invalid date.",
            enterRequiredFields: "Please enter all required information correctly.",
            adRegistered: "Advertisement registered successfully.",
            adRegistrationFailed: "Advertisement registration failed. Please check your input.",
            selectPositionAndPeriod: "Please select ad position and period first.",
                         estimatedCostDescription: "You can check the estimated cost based on your selected position and period."
           }
         },
           expoForm: {
             title: "Expo Application",
             subtitle: "Please enter basic expo information.",
             fields: {
               poster: "Expo Poster",
               posterAlt: "Poster Preview",
               expoName: "Expo Name",
               expoNamePlaceholder: "Please enter the expo name.",
               displayPeriod: "Expo Display Period",
               eventPeriod: "Expo Event Period",
               location: "Expo Location",
               locationPlaceholder: "Please click the address search button.",
               addressSearch: "Search Address",
               addressSearchClose: "Close Search",
               locationDetail: "Detailed Location",
               locationDetailPlaceholder: "e.g., COEX A Hall",
               operatingTime: "Expo Operating Hours",
               startTime: "Start Time",
               endTime: "End Time"
             },
             buttons: {
               nextPage: "Next Page"
             },
             messages: {
               imageUploadFailed: "Image upload failed. Please try again.",
               posterRequired: "Please upload a poster image.",
               expoNameRequired: "Please enter the expo name.",
               startDateRequired: "Please enter the event start date.",
               endDateRequired: "Please enter the event end date.",
               displayStartDateRequired: "Please enter the display start date.",
               displayEndDateRequired: "Please enter the display end date.",
               locationRequired: "Please enter the expo location.",
               locationDetailRequired: "Please enter the detailed location.",
               startTimeRequired: "Please select the operating start time.",
               endTimeRequired: "Please select the operating end time.",
               startDateAfterEndDate: "Start date must be before end date.",
               endDateAfterStartDate: "End date must be after start date.",
               displayStartDateAfterToday: "Display start date must be after today.",
               displayStartDateAfterEndDate: "Display start date must be before display end date.",
               displayEndDateAfterStartDate: "Display end date must be after display start date.",
               eventStartDateAfterDisplayStart: "Event start date must be the same as or after display start date.",
               eventStartDateBeforeDisplayEnd: "Event start date must be before display end date.",
               eventEndDateAfterStartDate: "Event end date must be at least one day after start date.",
               eventEndDateBeforeDisplayEnd: "Event end date must be the same as or before display end date.",
               startTimeBeforeEndTime: "Operating start time must be before end time.",
               endTimeAfterStartTime: "Operating end time must be after start time.",
               enterRequiredFields: "Please enter all required information correctly.",
               uploadInfo: "JPG, PNG, GIF, WebP (10MB or less)"
             }
           },
           // Common components translation
           common: {
             usageGuidelines: {
               expo: {
                 title: "Expo Application Guidelines",
                 sections: {
                   eligibility: {
                     title: "Eligibility Requirements",
                     items: [
                       "Only corporate or individual business owners can apply.",
                       "You must provide detailed information about the expo.",
                       "Business-related information must be submitted during application."
                     ]
                   },
                   approvalCriteria: {
                     title: "Approval Criteria",
                     items: [
                       "Expo content must be wholesome and legally compliant.",
                       "Submitted documents must be complete and accurate.",
                       "Expo must comply with platform policies.",
                       "No duplicate applications allowed."
                     ]
                   },
                   precautions: {
                     title: "Precautions",
                     items: [
                       "Re-approval may be required for post-approval changes.",
                       "Display period cannot exceed expo duration.",
                       "Approval may be revoked if inappropriate content is found.",
                       "Cancellation fees may apply after payment completion."
                     ]
                   },
                   refundPolicy: {
                     title: "Refund Policy",
                     items: [
                       "Cancellation during display waiting: 100% refund of usage fee + daily fee",
                       "Cancellation during display: refund of (daily fee × remaining display period)",
                       "No refund for cancellation within one week of expo start date."
                     ]
                   }
                 }
               },
               ad: {
                 title: "Ad Application Guidelines",
                 sections: {
                   regulations: {
                     title: "Ad Regulations",
                     items: [
                       "Ad content must be legally compliant and wholesome.",
                       "Images must not infringe on others' copyrights.",
                       "False or exaggerated advertising is prohibited.",
                       "Adult content, gambling, and illegal product ads are not allowed."
                     ]
                   },
                   imageSpecs: {
                     title: "Image Specifications",
                     items: [
                       "File format: Only JPG, PNG, GIF, WebP allowed",
                       "File size: 10MB or less",
                       "Recommended resolution: 1200x628px (width:height = 1.91:1)",
                       "Consider readability when including text."
                     ]
                   },
                   publishingPolicy: {
                     title: "Publishing Policy",
                     items: [
                       "Ad review takes 1-3 business days.",
                       "Approval may be rejected if deemed inappropriate.",
                       "Publishing will be immediately suspended if policy violations are found.",
                       "Duplicate reservations for the same ad position are not allowed."
                     ]
                   },
                   refundPolicy: {
                     title: "Refund Policy",
                     items: [
                       "Cancellation during display waiting: 100% refund of daily fee",
                       "Cancellation during display: refund of (daily fee × remaining display period)",
                       "No refund for cancellation within one week of ad display start."
                     ]
                   }
                 }
               }
                           }
           }
         },
       // My Page
       mypageGeneral: {
        title: "My Page",
        userInfo: "User Information",
        reservation: "Reservation History",
        savedExpo: "Saved Expos",
        systemSettings: "System Settings",
        languageSettings: "Language Settings",
        advertiserMenu: "Advertiser Menu",
        adStatusMenu: "Ad Status",
        expoAdminMenu: "Expo Admin Menu",
        expoStatusMenu: "Expo Application Status",
        // Expo Application Status Detail
        expoStatus: {
          title: "My Expo Applications",
          loading: "Loading...",
          loadError: "Failed to load applied expos.",
          noData: "No applied expos.",
          table: {
            no: "No.",
            expoName: "Expo Name",
            appliedAt: "Applied On",
            postPeriod: "Posting Period",
            location: "Location",
            status: "Status",
            premium: "Premium"
          },
          pagination: {
            prev: "Prev",
            next: "Next"
          },
          modal: {
            confirm: "Confirm"
          },
          status: {
            PENDING_APPROVAL: "Pending Approval",
            PENDING_PAYMENT: "Pending Payment",
            PENDING_PUBLISH: "Pending Publication",
            PENDING_CANCEL: "Pending Cancellation",
            PUBLISHED: "Published",
            PUBLISH_ENDED: "Publication Ended",
            SETTLEMENT_REQUESTED: "Settlement Requested",
            COMPLETED: "Completed",
            REJECTED: "Rejected",
            CANCELLED: "Cancelled"
          },
          detail: {
            loading: "Loading...",
            error: "Failed to load expo information.",
            notFound: "Data not found.",
            messages: {
              paymentCompleted: "Payment completed. Expo status changed to pending publication.",
              paymentFailed: "Payment processing failed.",
              paymentInfoError: "Failed to load payment information.",
              adminInfoError: "Failed to load admin information.",
              expoCancelled: "Expo application has been cancelled.",
              expoCancelFailed: "Failed to cancel expo.",
              refundInfoError: "Failed to load refund information.",
              refundCompleted: "Refund request completed.",
              refundFailed: "Refund request failed.",
              settlementInfoError: "Failed to load settlement information.",
              settlementCompleted: "Settlement request completed.",
              settlementFailed: "Settlement request failed."
            },
            defaultValues: {
              noTitle: "No expo title",
              noLocation: "Location TBD",
              noCategory: "Category TBD",
              noDescription: "No detailed description available.",
              noCompanyName: "Company name TBD",
              noAddress: "Address TBD",
              noBusinessNumber: "Business number TBD",
              noCeoName: "CEO name TBD",
              noContact: "Contact TBD",
              noEmail: "Email TBD",
              noApplicant: "Applicant name TBD",
              noLoginId: "No login ID",
              noTicketName: "Ticket name TBD",
              noInfo: "No Information",
              noTickets: "No registered tickets.",
              noPaymentRefundInfo: "No payment/refund information available."
            },
            buttons: {
              paymentRequest: "Payment Request",
              refundRequest: "Refund Request",
              refundInfo: "Refund Information",
              settlementRequest: "Settlement Request",
              settlementInfo: "Settlement Information",
              settlementCompleted: "Settlement Completed Information",
              paymentInfo: "Payment Information",
              cancelRequest: "Cancel Request",
              adminInfo: "Admin Information",
              adminPage: "Admin Page"
            },
            fields: {
              expoName: "Expo Name",
              location: "Expo Location",
              capacity: "Maximum Capacity",
              period: "Event Period",
              operatingTime: "Operating Hours",
              postPeriod: "Posting Period",
              premium: "Premium Exposure",
              category: "Category",
              companyInfo: "Company Information",
              companyName: "Company Name",
              companyAddress: "Company Address",
              businessNumber: "Business Number",
              ceoInfo: "CEO Information",
              ceoName: "CEO Name",
              ceoContact: "CEO Contact",
              ceoEmail: "CEO Email",
              description: "Description",
              ticketInfo: "Ticket Information",
              ticketName: "Ticket Name",
              ticketPrice: "Price",
              ticketQuantity: "Sales Quantity",
              ticketType: "Type"
            },
            ticketTypes: {
              general: "General",
              earlyBird: "Early Bird"
            },
            altText: {
              poster: "Expo Poster"
            },
            pageTitle: "Application Details"
          }
        },
        mileage: "Mileage",
        basicInfo: "Basic Information",
        accountManagement: "Account Management",
        name: "Name",
        birthDate: "Date of Birth",
        userId: "User ID",
        phoneNumber: "Phone Number",
        email: "Email",
        gender: "Gender",
        female: "Female",
        male: "Male",
        modifyInfo: "Edit Information",
        changePassword: "Change Password",
        save: "Save",
        cancel: "Cancel",
        withdraw: "Withdraw Membership",
        withdrawWarning: "Deleting your account will permanently delete all data.",
        withdrawConfirm: "Are you sure you want to withdraw? All data will be deleted.",
        infoUpdated: "Member information has been updated.",
        infoUpdateFailed: "Failed to update member information.",
        withdrawSuccess: "Membership withdrawal completed.",
        withdrawFailed: "Failed to withdraw membership.",
        adsStatus: {
          title: "My Ad Status",
          totalAds: "Total {{count}} ads",
          noAds: "No registered ads.",
          loadError: "Failed to load ad list.",
          table: {
            title: "Title",
            location: "Ad Location",
            period: "Display Period",
            status: "Status"
          },
          status: {
            PENDING_APPROVAL: "Pending Approval",
            PENDING_PAYMENT: "Pending Payment",
            PENDING_PUBLISH: "Pending Publication",
            PENDING_CANCEL: "Pending Cancellation",
            PUBLISHED: "Published",
            REJECTED: "Rejected",
            CANCELLED: "Cancelled",
            COMPLETED: "Completed"
          },
          pagination: {
            prev: "Prev",
            next: "Next"
          },
          aria: {
            goToDetail: "Go to {{title}} details"
          },
          detail: {
            title: "Banner Details",
            loading: "Loading...",
            error: "Failed to load advertisement details.",
            notFound: "Advertisement information not found.",
            adTitle: "Advertisement Title",
            adPosition: "Advertisement Position",
            displayPeriod: "Display Period",
            linkUrl: "Link URL",
            applicantName: "Applicant Name (Representative)",
            applicantPhone: "Applicant Contact",
            companyName: "Company Name",
            businessNumber: "Business Registration Number",
            adDescription: "Advertisement Description",
            bannerImage: "Banner Image",
            buttons: {
              payment: "Make Payment",
              paymentInfo: "Payment Information",
              viewPaymentInfo: "Payment Information",
              refundRequest: "Request Refund",
              refundInfo: "Refund Information",
              refundHistory: "Refund Information",
              cancelRequest: "Cancel Advertisement",
              viewRejectInfo: "View Rejection Reason"
            },
            messages: {
              noButtonsAvailable: "No available actions.",
              noPaymentRefundInfo: "No payment/refund information available.",
              paymentSuccess: "Payment completed successfully.",
              paymentError: "An error occurred while completing payment",
              refundSuccess: "Refund request submitted successfully.",
              refundError: "An error occurred while requesting refund",
              cancelSuccess: "Advertisement cancelled successfully.",
              cancelError: "An error occurred while cancelling.",
              cancelConfirm: "Are you sure you want to cancel the advertisement?",
              pendingApprovalCancelConfirm: "Are you sure you want to cancel the pending approval advertisement?",
              pendingPaymentCancelConfirm: "Are you sure you want to cancel the pending payment advertisement?"
            }
          }
        }
      },
      // Reservation History
      reservation: {
        title: "Reservation History",
        reservationNumber: "Reservation Number",
        ticketName: "Ticket Name",
        ticketCount: "Ticket Count",
        ticketUnit: "tickets",
        reservationDate: "Reservation Date",
        reservationDetail: "Reservation Details",
        status: {
          cancelled: "Cancelled",
          pending: "Payment Pending",
          confirmed: "Payment Confirmed"
        },
        noData: "No reservation history found.",
        loadError: "Failed to load reservation history.",
        previous: "Previous",
        next: "Next"
      },
      // Reservation Detail
      reservationDetail: {
        title: "Reservation Confirmation",
        eventInfo: "Event Information",
        participants: "Participants",
        reservationInfo: "Reservation Information",
        paymentInfo: "Payment Information",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        loadError: "Failed to load reservation information.",
        notFound: "Reservation information not found.",
        updateSuccess: "Participant information has been successfully updated.",
        updateError: "Failed to update participant information.",
        updateFailAlert: "Update failed. Please try again.",
        expoNotActive: "Not during expo period.",
        table: {
          name: "Name",
          reservationNumber: "Reservation Number",
          gender: "Gender",
          phone: "Phone",
          email: "Email",
          qrCheck: "QR Check",
          select: "Select",
          male: "Male",
          female: "Female",
          cancelled: "Cancelled",
          detail: "Details",
          outOfPeriod: "Out of Period"
        },
        reservationFields: {
          reservationDate: "Reservation Date",
          ticketName: "Ticket Name",
          ticketType: "Ticket Type",
          ticketCount: "Ticket Count",
          unitPrice: "Unit Price",
          serviceFee: "Service Fee",
          expectedPayment: "Expected Payment"
        },
        paymentFields: {
          paymentMethod: "Payment Method",
          paymentDetail: "Payment Details",
          totalAmount: "Total Amount",
          usedMileage: "Used Mileage",
          savedMileage: "Earned Mileage",
          memberGrade: "Member Grade",
          mileageRate: "Mileage Rate",
          paidAt: "Payment Date"
        },
        ticketTypes: {
          general: "General",
          earlyBird: "Early Bird"
        },
        paymentMethods: {
          card: "Card",
          bankTransfer: "Bank Transfer",
          virtualAccount: "Virtual Account",
          simplePay: "Simple Pay"
        },
        statusLabels: {
          confirmed: "Reservation Confirmed",
          cancelled: "Reservation Cancelled",
          pending: "Payment Pending"
        },
        cancelButton: "Cancel Reservation",
        cancelCompleted: "Cancellation Completed"
      },
      // Saved Expos
      savedExpo: {
        title: "Saved Expos",
        eventPeriod: "Event Period",
        eventLocation: "Event Location",
        noData: "No saved expos found.",
        loadError: "Failed to load saved expos.",
        detailView: "View Details",
        loading: "Loading..."
      },
      // Language Settings
      language: {
        korean: "한국어",
        english: "English",
        japanese: "日本語",
        selectLanguage: "Select Language",
        changeLanguage: "Change Language",
        languageChanged: "Language has been changed"
      },
      // Expo
      expo: {
        title: "Expo",
        name: "Expo Name",
        location: "Location",
        capacity: "Maximum Capacity",
        period: "Event Period",
        operatingTime: "Operating Hours",
        postPeriod: "Posting Period",
        premium: "Premium Exposure",
        category: "Category",
        description: "Description",
        companyInfo: "Company Information",
        ticketInfo: "Ticket Information"
      },
      // Expo Status
      expoStatus: {
        title: "My Expo Applications",
        loading: "Loading...",
        loadError: "Failed to load applied expos.",
        noData: "No applied expos.",
        table: {
          no: "No.",
          expoName: "Expo Name",
          appliedAt: "Applied On",
          postPeriod: "Posting Period",
          location: "Location",
          status: "Status",
          premium: "Premium"
        },
        pagination: { 
          prev: "Prev", 
          next: "Next" 
        },
        modal: { 
          confirm: "Confirm" 
        },
        status: {
          PENDING_APPROVAL: "Pending Approval",
          PENDING_PAYMENT: "Pending Payment",
          PENDING_PUBLISH: "Pending Publication",
          PENDING_CANCEL: "Pending Cancellation",
          PUBLISHED: "Published",
          PUBLISH_ENDED: "Publication Ended",
          SETTLEMENT_REQUESTED: "Settlement Requested",
          COMPLETED: "Completed",
          REJECTED: "Rejected",
          CANCELLED: "Cancelled"
        },
        detail: {
          loading: "Loading...",
          error: "Failed to load expo information.",
          notFound: "Data not found.",
          messages: {
            paymentCompleted: "Payment completed. Expo status changed to pending publication.",
            paymentFailed: "Payment processing failed.",
            paymentInfoError: "Failed to load payment information.",
            adminInfoError: "Failed to load admin information.",
            expoCancelled: "Expo application has been cancelled.",
            expoCancelFailed: "Failed to cancel expo.",
            refundInfoError: "Failed to load refund information.",
            refundCompleted: "Refund request completed.",
            refundFailed: "Refund request failed.",
            settlementInfoError: "Failed to load settlement information.",
            settlementCompleted: "Settlement request completed.",
            settlementFailed: "Settlement request failed."
          },
          defaultValues: {
            noTitle: "No expo title",
            noLocation: "Location TBD",
            noCategory: "Category TBD",
            noDescription: "No detailed description available.",
            noCompanyName: "Company name TBD",
            noAddress: "Address TBD",
            noBusinessNumber: "Business number TBD",
            noCeoName: "CEO name TBD",
            noContact: "Contact TBD",
            noEmail: "Email TBD",
            noApplicant: "Applicant name TBD",
            noLoginId: "No login ID",
            noTicketName: "Ticket name TBD",
            noInfo: "No Information",
            noTickets: "No registered tickets.",
            noPaymentRefundInfo: "No payment/refund information available."
          },
          buttons: {
            paymentRequest: "Payment Request",
            refundRequest: "Refund Request",
            refundInfo: "Refund Information",
            settlementRequest: "Settlement Request",
            settlementInfo: "Settlement Information",
            settlementCompleted: "Settlement Completed Information",
            paymentInfo: "Payment Information",
            cancelRequest: "Cancel Request",
            adminInfo: "Admin Information",
            adminPage: "Admin Page"
          },
          fields: {
            expoName: "Expo Name",
            location: "Expo Location",
            capacity: "Maximum Capacity",
            period: "Event Period",
            operatingTime: "Operating Hours",
            postPeriod: "Posting Period",
            premium: "Premium Exposure",
            category: "Category",
            companyInfo: "Company Information",
            companyName: "Company Name",
            companyAddress: "Company Address",
            businessNumber: "Business Number",
            ceoInfo: "CEO Information",
            ceoName: "CEO Name",
            ceoContact: "CEO Contact",
            ceoEmail: "CEO Email",
            description: "Description",
            ticketInfo: "Ticket Information",
            ticketName: "Ticket Name",
            ticketPrice: "Price",
            ticketQuantity: "Sales Quantity",
            ticketType: "Type"
          },
          ticketTypes: {
            general: "General",
            earlyBird: "Early Bird"
          },
          altText: {
            poster: "Expo Poster"
          },
          pageTitle: "Application Details"
        }
      }
    }
  },
  ja: {
    translation: {
      // 共通
      common: {
        save: "保存",
        cancel: "キャンセル",
        confirm: "確認",
        close: "閉じる",
        loading: "読み込み中...",
        error: "エラー",
        success: "成功",
        warning: "警告",
        selectLanguage: "言語選択"
      },
      // ナビゲーション
      nav: {
        home: "ホーム",
        expo: "博覧会",
        mypage: "マイページ",
        admin: "管理者",
        expoList: "博覧会一覧",
        expoApply: "博覧会申請",
        adApply: "広告申請",
        platformAdmin: "プラットフォーム管理",
        logout: "ログアウト",
        login: "ログイン",
        join: "会員登録",
        reservationCheck: "予約確認",
        searchPlaceholder: "博覧会を検索してください"
      },
      // 共通コンポーネント
      components: {
        // キャンセル手数料テーブル
        cancelFeeTable: {
          headers: {
            date: "キャンセル日",
            fee: "キャンセル手数料"
          },
          data: {
            within7days: "予約後7日以内",
            days8to5: "予約後8日〜イベント5日以内",
            days5to3: "イベント5日〜3日前",
            days2to1: "イベント2日前〜1日前",
            eventDay: "イベント当日",
            noFee: "なし",
            fee10percent: "チケット料金の10%",
            fee20percent: "チケット料金の20%",
            fee30percent: "チケット料金の30%",
            fee95percent: "チケット料金の95%"
          }
        },
        // 通知関連
        notification: {
          button: {
            errorFetch: "未読通知数の取得に失敗しました:"
          },
          modal: {
            title: "通知",
            markAllRead: "すべて既読",
            processing: "処理中...",
            close: "✕",
            tabs: {
              general: "一般通知",
              admin: "管理者通知"
            },
            loading: "通知を読み込み中...",
            empty: {
              general: "一般通知はありません。",
              admin: "管理者通知はありません。"
            },
            types: {
              expo: "展示会",
              event: "イベント",
              qrIssued: "QR発行",
              paymentComplete: "決済完了",
              reservationConfirm: "予約確定",
              ad: "広告",
              notification: "通知"
            },
            time: {
              justNow: "たった今",
              minutesAgo: "分前",
              hoursAgo: "時間前",
              daysAgo: "日前"
            },
            statusKeywords: [
              "承認待ち", "承認完了", "決済待ち", "公開待ち", "公開中",
              "公開終了", "精算依頼", "終了", "承認拒否", "キャンセル完了",
              "キャンセル待ち", "承認済み", "拒否", "完了"
            ],
            confirmModal: {
              title: "すべての通知を既読処理",
              message: "未読のすべての通知を既読処理しますか？",
              cancel: "キャンセル",
              confirm: "確認"
            },
            errors: {
              fetchFailed: "通知の取得に失敗しました:",
              markReadFailed: "通知処理に失敗しました:",
              markAllReadFailed: "すべての通知の既読処理に失敗しました:",
              unknownType: "不明な通知タイプ:"
            }
          }
        },
        // レビューシステム
        review: {
          // ReviewForm
          form: {
            pageTitle: {
              create: "レビュー作成",
              edit: "レビュー編集"
            },
            rating: {
              label: "評価",
              points: "点"
            },
            reviewTitle: {
              label: "タイトル",
              placeholder: "レビューのタイトルを入力してください"
            },
            content: {
              label: "レビュー内容",
              placeholder: "展示会についての正直なレビューを書いてください"
            },
            required: "*",
            buttons: {
              cancel: "キャンセル",
              create: "作成",
              edit: "編集"
            },
            alerts: {
              titleRequired: "タイトルを入力してください。",
              contentRequired: "レビュー内容を入力してください。"
            }
          },
          // ReviewItem
          item: {
            time: {
              today: "今日",
              yesterday: "昨日",
              daysAgo: "日前",
              edited: "(編集済み)"
            },
            buttons: {
              edit: "編集",
              delete: "削除"
            }
          },
          // ReviewList
          list: {
            title: "レビュー",
            sort: {
              latest: "最新順",
              rating: "評価順"
            },
            buttons: {
              write: "レビュー作成"
            },
            messages: {
              noPermission: "展示会に参加後、レビューを作成できます。",
              loading: "レビューを読み込み中...",
              noReviews: "まだレビューが作成されていません。"
            },
            alerts: {
              created: "レビューが作成されました。",
              updated: "レビューが更新されました。",
              deleted: "レビューが削除されました。",
              deleteConfirm: "本当にこのレビューを削除しますか？",
              error: "レビュー処理中にエラーが発生しました。"
            },
            errors: {
              fetchFailed: "レビューの取得に失敗しました:",
              permissionCheckFailed: "レビュー権限の確認に失敗しました:",
              processFailed: "レビュー処理に失敗しました:",
              deleteFailed: "レビューの削除に失敗しました:"
            }
          }
        }
      },
      // フッター
      footer: {
        company: {
          name: "株式会社MYCE",
          address: "住所: ソウル特別市江南区テクノロ123 (三成洞、MYCEタワー)",
          businessNumber: "事業者登録番号: 123-45-67890｜代表取締役: キム・ジクジク",
          ecommerce: "通信販売業申告: 2025-ソウル江南-0123",
          tourism: "観光事業証登録番号: 第2025-000045号",
          hosting: "ホスティングサービス提供者: 株式会社MYCE"
        },
        customerService: {
          title: "カスタマーサービス",
          fax: "ファックス: 02-6000-2025",
          email: "メール: support@myce.live",
          chatService: "左下の相談サービスボタンから専門相談員またはAIチャットボット相談をご利用いただけます。"
        },
        privacy: {
          title: "個人情報保護責任者",
          department: "担当部署: 開発チーム",
          contact: "連絡先: privacy@myce.co.kr",
          hours: "処理時間: 平日 09:00~18:00 (週末、祝日除く)"
        },
        legal: {
          disclaimer: "株式会社MYCEは一部商品の通信販売仲介者として通信販売の当事者ではないため、商品の予約、利用および払い戻しなど取引に関連する義務と責任は販売者にあり、株式会社MYCEは一切の責任を負いません。",
          terms: "利用規約",
          privacy: "個人情報処理方針",
          copyright: "ⓒ MYCE Co., Ltd. All rights reserved."
        }
      },
      // メインページ
      mainpage: {
        adForm: {
          title: "広告申請",
          subtitle: "広告情報を入力してください。",
          fields: {
            adTitle: "広告名",
            adTitlePlaceholder: "広告名を入力してください",
            adPosition: "広告バナー位置",
            adPositionPlaceholder: "広告バナー位置を選択してください",
            adPeriod: "広告期間",
            adImage: "広告バナー画像",
            adImageAlt: "広告プレビュー",
            linkUrl: "広告バナークリック時の移動ページURL",
            linkUrlPlaceholder: "例: https://www.myce.link",
            adDescription: "広告紹介",
            companyInfo: "会社情報",
            companyName: "会社名",
            businessNumber: "事業者番号",
            companyAddress: "会社住所",
            companyAddressPlaceholder: "住所検索ボタンを押してください",
            addressSearch: "住所検索",
            addressSearchClose: "閉じる",
            ceoName: "代表者名",
            ceoContact: "代表者連絡先",
            ceoEmail: "代表者メール",
            ceoEmailPlaceholder: "例: hello@myce.com"
          },
          buttons: {
            estimatedCost: "💰 予想利用料確認",
            cancel: "キャンセル",
            submit: "登録"
          },
          messages: {
            imageUploadFailed: "画像アップロードに失敗しました。",
            selectPositionFirst: "広告位置を先に選択してください。",
            enterPeriodFirst: "広告期間を先に入力してください。",
            startDateAfterEndDate: "開始日は終了日より前である必要があります。",
            startDateAfterToday: "開始日は今日以降である必要があります。",
            endDateAfterToday: "終了日は今日以降である必要があります。",
            invalidDate: "無効な日付です。",
            enterRequiredFields: "必須情報をすべて正しく入力してください。",
            adRegistered: "広告が正常に登録されました。",
            adRegistrationFailed: "広告登録に失敗しました。入力値を確認してください。",
            selectPositionAndPeriod: "広告位置と期間を先に選択してください。",
                         estimatedCostDescription: "選択された位置と期間に基づいて予想利用料を確認できます。"
           }
          },
           expoForm: {
             title: "博覧会申請",
             subtitle: "博覧会の基本情報を入力してください。",
             fields: {
               poster: "博覧会ポスター",
               posterAlt: "ポスタープレビュー",
               expoName: "博覧会名",
               expoNamePlaceholder: "博覧会名を入力してください。",
               displayPeriod: "博覧会掲載期間",
               eventPeriod: "博覧会開催期間",
               location: "博覧会場所",
               locationPlaceholder: "住所検索ボタンをクリックしてください。",
               addressSearch: "住所検索",
               addressSearchClose: "検索を閉じる",
               locationDetail: "詳細場所",
               locationDetailPlaceholder: "例: COEX Aホール",
               operatingTime: "博覧会運営時間",
               startTime: "開始時間",
               endTime: "終了時間"
             },
             buttons: {
               nextPage: "次のページ"
             },
             messages: {
               imageUploadFailed: "画像アップロードに失敗しました。もう一度お試しください。",
               posterRequired: "ポスター画像をアップロードしてください。",
               expoNameRequired: "博覧会名を入力してください。",
               startDateRequired: "開催開始日を入力してください。",
               endDateRequired: "開催終了日を入力してください。",
               displayStartDateRequired: "掲載開始日を入力してください。",
               displayEndDateRequired: "掲載終了日を入力してください。",
               locationRequired: "博覧会場所を入力してください。",
               locationDetailRequired: "博覧会の詳細場所を入力してください。",
               startTimeRequired: "運営開始時間を選択してください。",
               endTimeRequired: "運営終了時間を選択してください。",
               startDateAfterEndDate: "開始日は終了日より前である必要があります。",
               endDateAfterStartDate: "終了日は開始日より後である必要があります。",
               displayStartDateAfterToday: "掲載開始日は今日以降である必要があります。",
               displayStartDateAfterEndDate: "掲載開始日は掲載終了日より前である必要があります。",
               displayEndDateAfterStartDate: "掲載終了日は掲載開始日より後である必要があります。",
               eventStartDateAfterDisplayStart: "開催開始日は掲載開始日と同じかそれ以降である必要があります。",
               eventStartDateBeforeDisplayEnd: "開催開始日は掲載終了日より前である必要があります。",
               eventEndDateAfterStartDate: "開催終了日は開始日より最低1日後である必要があります。",
               eventEndDateBeforeDisplayEnd: "開催終了日は掲載終了日と同じかそれ以前である必要があります。",
               startTimeBeforeEndTime: "運営開始時間は終了時間より前である必要があります。",
               endTimeAfterStartTime: "運営終了時間は開始時間より後である必要があります。",
               enterRequiredFields: "必須情報をすべて正しく入力してください。",
               uploadInfo: "JPG, PNG, GIF, WebP (10MB以下)"
             }
           },
           // 共通コンポーネント翻訳
           common: {
             usageGuidelines: {
               expo: {
                 title: "博覧会申請注意事項",
                 sections: {
                   eligibility: {
                     title: "申請資格",
                     items: [
                       "法人事業者または個人事業者のみ申請可能です。",
                       "博覧会に関する詳細情報を記入する必要があります。",
                       "申請時に事業者関連情報の提出が必要です。"
                     ]
                   },
                   approvalCriteria: {
                     title: "承認基準",
                     items: [
                       "博覧会の内容が健全で法的問題がないこと。",
                       "提出された書類が完全で正確であること。",
                       "プラットフォームポリシーに適合する博覧会であること。",
                       "重複申請でないこと。"
                     ]
                   },
                   precautions: {
                     title: "注意事項",
                     items: [
                       "承認後の博覧会情報変更時は再承認が必要な場合があります。",
                       "掲載期間は博覧会開催期間を超えることはできません。",
                       "不適切な内容発見時は承認が取り消される場合があります。",
                       "決済完了後のキャンセル時は手数料が発生する場合があります。"
                     ]
                   },
                   refundPolicy: {
                     title: "返金ポリシー",
                     items: [
                       "掲載待機中のキャンセル: 利用料 + 日額利用料100%返金",
                       "掲載中のキャンセル: (日額利用料 × 残り掲載期間)返金",
                       "博覧会開催1週間以内のキャンセル: 返金不可"
                     ]
                   }
                 }
               },
               ad: {
                 title: "広告申請注意事項",
                 sections: {
                   regulations: {
                     title: "広告規定",
                     items: [
                       "法的に問題のない健全な広告内容であること。",
                       "他人の著作権を侵害しない画像を使用すること。",
                       "虚偽または誇大広告は禁止されています。",
                       "成人向けコンテンツ、ギャンブル、違法商品の広告は不可です。"
                     ]
                   },
                   imageSpecs: {
                     title: "画像仕様",
                     items: [
                       "ファイル形式: JPG, PNG, GIF, WebPのみ許可",
                       "ファイルサイズ: 10MB以下",
                       "推奨解像度: 1200x628px (幅:高さ = 1.91:1)",
                       "テキストが含まれる場合は可読性を考慮してください。"
                     ]
                   },
                   publishingPolicy: {
                     title: "掲載ポリシー",
                     items: [
                       "広告審査は営業日基準1-3日かかります。",
                       "不適切な広告と判断された場合は承認が拒否される場合があります。",
                       "掲載中にポリシー違反が発見された場合は即座に掲載が中断されます。",
                       "同一広告位置への重複予約は不可能です。"
                     ]
                   },
                   refundPolicy: {
                     title: "返金ポリシー",
                     items: [
                       "掲載待機中のキャンセル: 日額利用料100%返金",
                       "掲載中のキャンセル: (日額利用料 × 残り掲載期間)返金",
                       "広告掲載開始1週間以内のキャンセル: 返金不可"
                     ]
                   }
                 }
               }
                           }
           }
         },
         // マイページ
      mypage: {
        title: "マイページ",
        userInfo: "会員情報",
        reservation: "予約履歴",
        savedExpo: "お気に入り博覧会",
        systemSettings: "システム設定",
        languageSettings: "言語設定",
        advertiserMenu: "広告主メニュー",
        adStatusMenu: "広告状況",
        expoAdminMenu: "博覧会管理者メニュー",
        expoStatusMenu: "博覧会申請状況",
        // 博覧会申請状況詳細
        expoStatus: {
          title: "申請博覧会の状況",
          loading: "読み込み中...",
          loadError: "申請した博覧会の読み込みに失敗しました。",
          noData: "申請した博覧会はありません。",
          table: {
            no: "No.",
            expoName: "博覧会名",
            appliedAt: "申請日",
            postPeriod: "掲載期間",
            location: "開催場所",
            status: "ステータス",
            premium: "プレミアム"
          },
          pagination: {
            prev: "前へ",
            next: "次へ"
          },
          modal: {
            confirm: "確認"
          },
          status: {
            PENDING_APPROVAL: "承認待ち",
            PENDING_PAYMENT: "支払い待ち",
            PENDING_PUBLISH: "公開待ち",
            PENDING_CANCEL: "キャンセル待ち",
            PUBLISHED: "公開中",
            PUBLISH_ENDED: "公開終了",
            SETTLEMENT_REQUESTED: "精算依頼",
            COMPLETED: "終了",
            REJECTED: "承認拒否",
            CANCELLED: "キャンセル済み"
          },
          detail: {
            loading: "読み込み中...",
            error: "博覧会情報の読み込みに失敗しました。",
            notFound: "データが見つかりません。",
            messages: {
              paymentCompleted: "決済が完了しました。博覧会状態が公開待ちに変更されました。",
              paymentFailed: "決済処理に失敗しました。",
              paymentInfoError: "決済情報の読み込みに失敗しました。",
              adminInfoError: "管理者情報の読み込みに失敗しました。",
              expoCancelled: "博覧会申請がキャンセルされました。",
              expoCancelFailed: "博覧会キャンセルに失敗しました。",
              refundInfoError: "返金情報の読み込みに失敗しました。",
              refundCompleted: "返金申請が完了しました。",
              refundFailed: "返金申請に失敗しました。",
              settlementInfoError: "精算情報の読み込みに失敗しました。",
              settlementCompleted: "精算依頼が完了しました。",
              settlementFailed: "精算依頼に失敗しました。"
            },
            defaultValues: {
              noTitle: "博覧会タイトルなし",
              noLocation: "会場未定",
              noCategory: "カテゴリー未定",
              noDescription: "詳細説明がありません。",
              noCompanyName: "会社名未定",
              noAddress: "住所未定",
              noBusinessNumber: "事業者番号未定",
              noCeoName: "代表者名未定",
              noContact: "連絡先未定",
              noEmail: "メール未定",
              noApplicant: "申請者名未定",
              noLoginId: "ログインIDなし",
              noTicketName: "チケット名未定",
              noInfo: "情報なし",
              noTickets: "登録されたチケットがありません。",
              noPaymentRefundInfo: "決済/返金情報が存在しません。"
            },
            buttons: {
              paymentRequest: "決済申請",
              refundRequest: "返金申請",
              refundInfo: "返金情報",
              settlementRequest: "精算申請",
              settlementInfo: "精算情報照会",
              settlementCompleted: "精算完了情報照会",
              paymentInfo: "決済情報",
              cancelRequest: "キャンセル申請",
              adminInfo: "管理者情報",
              adminPage: "管理者ページ"
            },
            fields: {
              expoName: "博覧会名",
              location: "博覧会位置",
              capacity: "最大収容人数",
              period: "開催期間",
              operatingTime: "運営時間",
              postPeriod: "掲載期間",
              premium: "プレミアム露出",
              category: "カテゴリー",
              companyInfo: "会社情報",
              companyName: "会社名",
              companyAddress: "会社住所",
              businessNumber: "事業者番号",
              ceoInfo: "代表者情報",
              ceoName: "代表名",
              ceoContact: "代表者連絡先",
              ceoEmail: "代表者メール",
              description: "詳細説明",
              ticketInfo: "チケット情報",
              ticketName: "チケット名",
              ticketPrice: "価格",
              ticketQuantity: "販売数",
              ticketType: "種類"
            },
            ticketTypes: {
              general: "一般",
              earlyBird: "アーリーバード"
            },
            altText: {
              poster: "博覧会ポスター"
            },
            pageTitle: "申請詳細"
          }
        },
        mileage: "マイレージ",
        basicInfo: "基本情報",
        accountManagement: "アカウント管理",
        name: "名前",
        birthDate: "生年月日",
        userId: "ユーザーID",
        phoneNumber: "電話番号",
        email: "メールアドレス",
        gender: "性別",
        female: "女性",
        male: "男性",
        modifyInfo: "情報修正",
        changePassword: "パスワード変更",
        save: "保存",
        cancel: "キャンセル",
        withdraw: "会員脱退",
        withdrawWarning: "アカウントを削除すると、すべてのデータが永続的に削除されます。",
        withdrawConfirm: "本当に脱退しますか？すべてのデータが削除されます。",
        infoUpdated: "会員情報が修正されました。",
        infoUpdateFailed: "会員情報の修正に失敗しました。",
        withdrawSuccess: "会員脱退が完了しました。",
        withdrawFailed: "会員脱退に失敗しました。",
        adsStatus: {
          title: "私の広告状況",
          totalAds: "総{{count}}件の広告",
          noAds: "登録された広告がありません。",
          loadError: "広告リストの読み込みに失敗しました。",
          table: {
            title: "タイトル",
            location: "広告の場所",
            period: "掲載期間",
            status: "ステータス"
          },
          status: {
            PENDING_APPROVAL: "承認待ち",
            PENDING_PAYMENT: "支払い待ち",
            PENDING_PUBLISH: "公開待ち",
            PENDING_CANCEL: "キャンセル待ち",
            PUBLISHED: "公開中",
            REJECTED: "承認拒否",
            CANCELLED: "キャンセル済み",
            COMPLETED: "終了"
          },
          pagination: {
            prev: "前へ",
            next: "次へ"
          },
          aria: {
            goToDetail: "{{title}} の詳細に移動"
          },
          detail: {
            title: "バナー詳細",
            loading: "読み込み中...",
            error: "広告詳細情報の読み込みに失敗しました。",
            notFound: "広告情報が見つかりません。",
            adTitle: "広告タイトル",
            adPosition: "広告位置",
            displayPeriod: "掲載期間",
            linkUrl: "リンクURL",
            applicantName: "申請者名（代表者）",
            applicantPhone: "申請者連絡先",
            companyName: "会社名",
            businessNumber: "事業者登録番号",
            adDescription: "広告紹介",
            bannerImage: "バナー画像",
            buttons: {
              payment: "決済する",
              paymentInfo: "決済情報",
              viewPaymentInfo: "決済情報",
              refundRequest: "返金申請",
              refundInfo: "返金情報",
              refundHistory: "返金情報",
              cancelRequest: "広告キャンセル",
              viewRejectInfo: "拒否理由を見る"
            },
            messages: {
              noButtonsAvailable: "利用可能な作業がありません。",
              noPaymentRefundInfo: "決済/返金情報が存在しません。",
              paymentSuccess: "決済が正常に完了しました。",
              paymentError: "決済完了中にエラーが発生しました",
              refundSuccess: "返金申請が正常に受け付けられました。",
              refundError: "返金申請中にエラーが発生しました",
              cancelSuccess: "広告が正常にキャンセルされました。",
              cancelError: "キャンセル中にエラーが発生しました。",
              cancelConfirm: "広告をキャンセルしますか？",
              pendingApprovalCancelConfirm: "承認待ちの広告をキャンセルしますか？",
              pendingPaymentCancelConfirm: "支払い待ちの広告をキャンセルしますか？"
            }
          }
        }
      },
      // 予約履歴
      reservation: {
        title: "予約履歴",
        reservationNumber: "予約番号",
        ticketName: "チケット名",
        ticketCount: "チケット枚数",
        ticketUnit: "枚",
        reservationDate: "予約日",
        reservationDetail: "予約詳細",
        status: {
          cancelled: "キャンセル済み",
          pending: "決済待ち",
          confirmed: "決済完了"
        },
        noData: "予約履歴がありません。",
        loadError: "予約履歴の読み込みに失敗しました。",
        previous: "前へ",
        next: "次へ"
      },
      // 予約詳細
      reservationDetail: {
        title: "予約確認",
        eventInfo: "参加イベント情報",
        participants: "参加者",
        reservationInfo: "予約情報",
        paymentInfo: "決済情報",
        edit: "編集",
        save: "保存",
        cancel: "キャンセル",
        loadError: "予約情報の読み込みに失敗しました。",
        notFound: "予約情報が見つかりません。",
        updateSuccess: "参加者情報が正常に更新されました。",
        updateError: "参加者情報の更新に失敗しました。",
        updateFailAlert: "更新に失敗しました。もう一度お試しください。",
        expoNotActive: "博覧会期間ではありません。",
        table: {
          name: "名前",
          reservationNumber: "予約番号",
          gender: "性別",
          phone: "電話番号",
          email: "メールアドレス",
          qrCheck: "QR確認",
          select: "選択",
          male: "男性",
          female: "女性",
          cancelled: "キャンセル済み",
          detail: "詳細",
          outOfPeriod: "期間外"
        },
        reservationFields: {
          reservationDate: "予約日",
          ticketName: "チケット名",
          ticketType: "チケットタイプ",
          ticketCount: "チケット枚数",
          unitPrice: "単価",
          serviceFee: "サービス手数料",
          expectedPayment: "予想決済金額"
        },
        paymentFields: {
          paymentMethod: "決済方法",
          paymentDetail: "決済手段",
          totalAmount: "総決済金額",
          usedMileage: "使用マイレージ",
          savedMileage: "獲得マイレージ",
          memberGrade: "会員等級",
          mileageRate: "積立率",
          paidAt: "決済日時"
        },
        ticketTypes: {
          general: "一般",
          earlyBird: "アーリーバード"
        },
        paymentMethods: {
          card: "カード",
          bankTransfer: "銀行振込",
          virtualAccount: "仮想口座",
          simplePay: "簡単決済"
        },
        statusLabels: {
          confirmed: "予約確定",
          cancelled: "予約キャンセル",
          pending: "決済待ち"
        },
        cancelButton: "予約キャンセル",
        cancelCompleted: "キャンセル完了"
      },
      // お気に入り博覧会
      savedExpo: {
        title: "お気に入り博覧会",
        eventPeriod: "イベント期間",
        eventLocation: "イベント場所",
        noData: "お気に入り博覧会がありません。",
        loadError: "お気に入り博覧会の読み込みに失敗しました。",
        detailView: "詳細を見る",
        loading: "読み込み中..."
      },
      // 言語設定
      language: {
        korean: "한국어",
        english: "English",
        japanese: "日本語",
        selectLanguage: "言語を選択してください",
        changeLanguage: "言語変更",
        languageChanged: "言語が変更されました"
      },
      // 博覧会
      expo: {
        title: "博覧会",
        name: "博覧会名",
        location: "場所",
        capacity: "最大収容人数",
        period: "開催期間",
        operatingTime: "運営時間",
        postPeriod: "掲載期間",
        premium: "プレミアム露出",
        category: "カテゴリー",
        description: "詳細説明",
        companyInfo: "会社情報",
        ticketInfo: "チケット情報"
      },
      // 博覧会申請状況
      expoStatus: {
        title: "申請博覧会の状況",
        loading: "読み込み中...",
        loadError: "申請した博覧会の読み込みに失敗しました。",
        noData: "申請した博覧会はありません。",
        table: {
          no: "No.",
          expoName: "博覧会名",
          appliedAt: "申請日",
          postPeriod: "掲載期間",
          location: "開催場所",
          status: "ステータス",
          premium: "プレミアム"
        },
        pagination: { 
          prev: "前へ", 
          next: "次へ" 
        },
        modal: { 
          confirm: "確認" 
        },
        status: {
          PENDING_APPROVAL: "承認待ち",
          PENDING_PAYMENT: "支払い待ち",
          PENDING_PUBLISH: "公開待ち",
          PENDING_CANCEL: "キャンセル待ち",
          PUBLISHED: "公開中",
          PUBLISH_ENDED: "公開終了",
          SETTLEMENT_REQUESTED: "精算依頼",
          COMPLETED: "終了",
          REJECTED: "承認拒否",
          CANCELLED: "キャンセル済み"
        },
        detail: {
          loading: "読み込み中...",
          error: "博覧会情報の読み込みに失敗しました。",
          notFound: "データが見つかりません。",
          messages: {
            paymentCompleted: "決済が完了しました。博覧会状態が公開待ちに変更されました。",
            paymentFailed: "決済処理に失敗しました。",
            paymentInfoError: "決済情報の読み込みに失敗しました。",
            adminInfoError: "管理者情報の読み込みに失敗しました。",
            expoCancelled: "博覧会申請がキャンセルされました。",
            expoCancelFailed: "博覧会キャンセルに失敗しました。",
            refundInfoError: "返金情報の読み込みに失敗しました。",
            refundCompleted: "返金申請が完了しました。",
            refundFailed: "返金申請に失敗しました。",
            settlementInfoError: "精算情報の読み込みに失敗しました。",
            settlementCompleted: "精算依頼が完了しました。",
            settlementFailed: "精算依頼に失敗しました。"
          },
          defaultValues: {
            noTitle: "博覧会タイトルなし",
            noLocation: "会場未定",
            noCategory: "カテゴリー未定",
            noDescription: "詳細説明がありません。",
            noCompanyName: "会社名未定",
            noAddress: "住所未定",
            noBusinessNumber: "事業者番号未定",
            noCeoName: "代表者名未定",
            noContact: "連絡先未定",
            noEmail: "メール未定",
            noApplicant: "申請者名未定",
            noLoginId: "ログインIDなし",
            noTicketName: "チケット名未定",
            noInfo: "情報なし",
            noTickets: "登録されたチケットがありません。",
            noPaymentRefundInfo: "決済/返金情報が存在しません。"
          },
          buttons: {
            paymentRequest: "決済申請",
            refundRequest: "返金申請",
            refundInfo: "返金情報",
            settlementRequest: "精算申請",
            settlementInfo: "精算情報照会",
            settlementCompleted: "精算完了情報照会",
            paymentInfo: "決済情報",
            cancelRequest: "キャンセル申請",
            adminInfo: "管理者情報",
            adminPage: "管理者ページ"
          },
          fields: {
            expoName: "博覧会名",
            location: "博覧会位置",
            capacity: "最大収容人数",
            period: "開催期間",
            operatingTime: "運営時間",
            postPeriod: "掲載期間",
            premium: "プレミアム露出",
            category: "カテゴリー",
            companyInfo: "会社情報",
            companyName: "会社名",
            companyAddress: "会社住所",
            businessNumber: "事業者番号",
            ceoInfo: "代表者情報",
            ceoName: "代表名",
            ceoContact: "代表者連絡先",
            ceoEmail: "代表者メール",
            description: "詳細説明",
            ticketInfo: "チケット情報",
            ticketName: "チケット名",
            ticketPrice: "価格",
            ticketQuantity: "販売数",
            ticketType: "種類"
          },
          ticketTypes: {
            general: "一般",

            earlyBird: "アーリーバード"
          },
          altText: {
            poster: "博覧会ポスター"
          },
          pageTitle: "申請詳細"
        }
      }
    }
  }
};

// 모든 리소스 병합
const resources = mergeResources(mainResources, homepageI18n, expoDetailI18n, nonmemberI18n, mypageI18n, commonOptionsI18n, componentsI18n, receiptI18n, authI18n);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    lng: localStorage.getItem('language') || 'ko',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;
