// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
      // PricingInfo
      pricingInfo: {
        expo: {
          title: "박람회 요금제 안내",
          loading: "요금제 정보를 불러오는 중...",
          error: "요금제 정보를 불러오는데 실패했습니다.",
          categories: {
            basic: "박람회 기본 요금",
            default: "박람회 요금제",
          },
          items: {
            dailyUsage: "일 사용료",
            basicDeposit: "기본 등록금 (보증금)",
            premiumFee: "프리미엄 이용료",
            ticketCommission: "티켓 수수료",
            standard: "표준 박람회",
          },
          descriptions: {
            dailyUsage: "박람회 게시 1일당 사용료",
            basicDeposit: "박람회 등록 시 필요한 기본 보증금",
            premiumFee: "프리미엄 기능 이용 시 추가 요금",
            ticketCommission: "티켓 판매 시 발생하는 수수료율",
            standard: "기본 박람회 개최 서비스",
            adPosition: "위치에 광고 게시 시 일당 요금",
          },
          notice: {
            title: "💡 참고사항",
            items: [
              "모든 요금은 부가세(VAT) 포함 입니다.",
              "문의사항은 고객센터로 연락해주세요.",
            ],
          },
          units: {
            daily: "원/일",
            currency: "원",
            percent: "%",
            inquiry: "문의",
          },
        },
        ad: {
          title: "광고 요금제 안내",
          categories: {
            basic: "기본 요금제",
            default: "광고 기본 요금",
          },
          items: {
            basicAd: "기본 광고",
          },
          descriptions: {
            basicAd: "기본 광고 게시 서비스",
          },
        },
      },

      // UsageGuidelines
      usageGuidelines: {
        expo: {
          title: "박람회 신청 주의사항",
          sections: {
            eligibility: {
              title: "신청 자격",
              items: [
                "법인 사업자 또는 개인 사업자만 신청 가능합니다.",
                "박람회에 대한 상세 정보를 작성 하셔야 합니다.",
                "신청 시 사업자 관련 정보 제출이 필요합니다",
              ],
            },
            approval: {
              title: "승인 기준",
              items: [
                "박람회 내용이 건전하고 법적 문제가 없어야 합니다.",
                "제출된 서류가 완전하고 정확해야 합니다.",
                "플랫폼 정책에 부합하는 박람회여야 합니다.",
                "중복 신청이 아니어야 합니다.",
              ],
            },
            precautions: {
              title: "주의사항",
              items: [
                "승인 후 박람회 정보 변경 시 재승인이 필요할 수 있습니다.",
                "게시 기간은 박람회 개최 기간을 초과할 수 없습니다.",
                "부적절한 내용 발견 시 승인이 취소될 수 있습니다.",
                "결제 완료 후 취소 시 수수료가 발생할 수 있습니다.",
              ],
            },
            refund: {
              title: "환불 정책",
              items: [
                "게시 대기 중 취소: 이용료 + 일 사용료 100% 환불",
                "게시 중 취소: (일 사용료 * 남은 게시 기간) 환불",
                "박람회 개최 일주일 이내 취소: 환불 불가",
              ],
            },
          },
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
                "성인 콘텐츠, 도박, 불법 상품 광고는 불가합니다.",
              ],
            },
            imageSpecs: {
              title: "이미지 규격",
              items: [
                "파일 형식: JPG, PNG, GIF, WebP만 허용",
                "파일 크기: 10MB 이하",
                "권장 해상도: 1200x628px (가로:세로 = 1.91:1)",
                "텍스트가 포함된 경우 가독성을 고려해주세요.",
              ],
            },
            policy: {
              title: "게시 정책",
              items: [
                "광고 심사는 영업일 기준 1-3일 소요됩니다.",
                "부적절한 광고로 판단 시 승인이 거절될 수 있습니다.",
                "게시 중 정책 위반 발견 시 즉시 게시가 중단됩니다.",
                "동일 광고 위치에 중복 예약은 불가능합니다.",
              ],
            },
            refund: {
              title: "환불 정책",
              items: [
                "게시 대기 중 취소: 일 사용료 100% 환불",
                "게시 중 취소: (일 사용료 * 남은 게시 기간) 환불",
                "광고 게시 시작 일주일 이내 취소: 환불 불가",
              ],
            },
          },
        },
      },

      // CongestionModal
      congestionModal: {
        title: "실시간 혼잡도",
        loading: "혼잡도 정보를 불러오는 중...",
        errors: {
          notFound: "박람회 정보를 찾을 수 없습니다.",
          loadFailed: "혼잡도 정보를 불러오는데 실패했습니다.",
        },
        stats: {
          hourlyCapacity: "적정 1시간 입장자 수",
          hourlyVisitors: "최근 1시간 현장 입장자 수",
          congestionRate: "혼잡도",
          people: "명",
        },
        lastUpdate: "마지막 업데이트:",
        buttons: {
          refresh: "새로고침",
          retry: "다시 시도",
          close: "닫기",
        },
      },

      // TrafficLight 레벨 정보는 백엔드에서 오므로 여기서는 정의하지 않음
      trafficLight: {
        levels: {
          LOW: "여유",
          MODERATE: "보통",
          HIGH: "혼잡",
          VERY_HIGH: "매우혼잡",
        },
      },

      // Review Components & NotificationModal
      components: {
        review: {
          form: {
            title: {
              create: "리뷰 작성",
              edit: "리뷰 수정",
              label: "제목",
              placeholder: "리뷰 제목을 입력하세요",
            },
            content: {
              label: "내용",
              placeholder: "리뷰 내용을 입력하세요",
            },
            rating: {
              label: "평점",
              points: "점",
            },
            required: "*",
            buttons: {
              create: "작성하기",
              edit: "수정하기",
              cancel: "취소",
            },
            alerts: {
              titleRequired: "제목을 입력해주세요.",
              contentRequired: "내용을 입력해주세요.",
            },
          },
        },
        notification: {
          modal: {
            title: "알림",
            markAllRead: "모두 읽음",
            close: "닫기",
            loading: "알림을 불러오는 중...",
            empty: {
              general: "새로운 알림이 없습니다.",
              admin: "상태 변경 알림이 없습니다.",
            },
            tabs: {
              general: "일반",
              admin: "상태 변경",
            },
            time: {
              justNow: "방금 전",
              minutesAgo: "분 전",
              hoursAgo: "시간 전",
              daysAgo: "일 전",
            },
            types: {
              expo: "박람회",
              event: "이벤트",
              qrIssued: "QR 발급",
              paymentComplete: "결제 완료",
              reservationConfirm: "예약 확정",
              ad: "광고",
              notification: "알림",
            },
            statusKeywords: [
              "변경",
              "결제 대기",
              "게시 대기",
              "게시 중",
              "승인 대기",
              "취소 대기",
              "취소 완료",
            ],
            confirmModal: {
              title: "모두 읽음 처리",
              message: "정말로 모든 알림을 읽음 처리하시겠습니까?",
              cancel: "취소",
              confirm: "확인",
            },
            processing: "처리 중...",
            errors: {
              fetchFailed: "알림을 불러오는데 실패했습니다.",
              markReadFailed: "알림을 읽음 처리하는데 실패했습니다.",
              markAllReadFailed: "모든 알림을 읽음 처리하는데 실패했습니다.",
              unknownType: "알 수 없는 알림 타입입니다.",
            },
          },
        },
      },

      // ChangePasswordModal
      changePasswordModal: {
        title: "비밀번호 변경",
        labels: {
          currentPassword: "현재 비밀번호",
          newPassword: "새 비밀번호",
          confirmPassword: "새 비밀번호 확인",
        },
        placeholders: {
          currentPassword: "현재 비밀번호를 입력하세요",
          newPassword: "새 비밀번호를 입력하세요",
          confirmPassword: "새 비밀번호를 다시 입력하세요",
        },
        helper: "비밀번호는 8자 이상이어야 합니다.",
        buttons: {
          confirm: "비밀번호 변경",
          cancel: "취소",
        },
        messages: {
          success: "비밀번호가 변경되었습니다.",
          failure: "비밀번호 변경에 실패했습니다.",
        },
      },
    },
  },
  en: {
    translation: {
      // PricingInfo
      pricingInfo: {
        expo: {
          title: "Exhibition Pricing Guide",
          loading: "Loading pricing information...",
          error: "Failed to load pricing information.",
          categories: {
            basic: "Basic Exhibition Fee",
            default: "Exhibition Pricing Plan",
          },
          items: {
            dailyUsage: "Daily Usage Fee",
            basicDeposit: "Basic Registration Fee (Deposit)",
            premiumFee: "Premium Service Fee",
            ticketCommission: "Ticket Commission",
            standard: "Standard Exhibition",
          },
          descriptions: {
            dailyUsage: "Daily fee for exhibition posting",
            basicDeposit: "Basic deposit required for exhibition registration",
            premiumFee: "Additional fee for premium features",
            ticketCommission: "Commission rate for ticket sales",
            standard: "Basic exhibition hosting service",
            adPosition: "Daily fee for ad placement at this position",
          },
          notice: {
            title: "💡 Notice",
            items: [
              "All fees include VAT.",
              "For inquiries, please contact customer service.",
            ],
          },
          units: {
            daily: "KRW/day",
            currency: "KRW",
            percent: "%",
            inquiry: "Inquiry",
          },
        },
        ad: {
          title: "Advertisement Pricing Guide",
          categories: {
            basic: "Basic Plan",
            default: "Basic Advertisement Fee",
          },
          items: {
            basicAd: "Basic Advertisement",
          },
          descriptions: {
            basicAd: "Basic advertisement posting service",
          },
        },
      },

      // UsageGuidelines
      usageGuidelines: {
        expo: {
          title: "Exhibition Application Guidelines",
          sections: {
            eligibility: {
              title: "Eligibility",
              items: [
                "Only corporate or individual business owners can apply.",
                "Detailed information about the exhibition must be provided.",
                "Business-related information must be submitted upon application.",
              ],
            },
            approval: {
              title: "Approval Criteria",
              items: [
                "Exhibition content must be wholesome and legally compliant.",
                "Submitted documents must be complete and accurate.",
                "Exhibition must comply with platform policies.",
                "No duplicate applications allowed.",
              ],
            },
            precautions: {
              title: "Precautions",
              items: [
                "Changes to exhibition information after approval may require re-approval.",
                "Posting period cannot exceed the exhibition hosting period.",
                "Approval may be cancelled if inappropriate content is found.",
                "Fees may apply for cancellation after payment completion.",
              ],
            },
            refund: {
              title: "Refund Policy",
              items: [
                "Cancellation while pending: 100% refund of usage fee + daily usage fee",
                "Cancellation during posting: Refund of (daily usage fee * remaining posting days)",
                "Cancellation within one week of exhibition date: No refund",
              ],
            },
          },
        },
        ad: {
          title: "Advertisement Application Guidelines",
          sections: {
            regulations: {
              title: "Advertisement Regulations",
              items: [
                "Advertisement content must be legally compliant and wholesome.",
                "Images must not infringe on others' copyrights.",
                "False or exaggerated advertisements are prohibited.",
                "Adult content, gambling, and illegal product advertisements are not allowed.",
              ],
            },
            imageSpecs: {
              title: "Image Specifications",
              items: [
                "File formats: Only JPG, PNG, GIF, WebP allowed",
                "File size: 10MB or less",
                "Recommended resolution: 1200x628px (aspect ratio 1.91:1)",
                "Please consider readability if text is included.",
              ],
            },
            policy: {
              title: "Posting Policy",
              items: [
                "Advertisement review takes 1-3 business days.",
                "Approval may be denied if deemed inappropriate.",
                "Posting will be immediately suspended if policy violations are found.",
                "Duplicate reservations for the same ad position are not allowed.",
              ],
            },
            refund: {
              title: "Refund Policy",
              items: [
                "Cancellation while pending: 100% refund of daily usage fee",
                "Cancellation during posting: Refund of (daily usage fee * remaining posting days)",
                "Cancellation within one week of ad start date: No refund",
              ],
            },
          },
        },
      },

      // CongestionModal
      congestionModal: {
        title: "Real-time Congestion",
        loading: "Loading congestion information...",
        errors: {
          notFound: "Exhibition information not found.",
          loadFailed: "Failed to load congestion information.",
        },
        stats: {
          hourlyCapacity: "Recommended hourly entry capacity",
          hourlyVisitors: "Recent 1-hour on-site visitors",
          congestionRate: "Congestion Rate",
          people: "people",
        },
        lastUpdate: "Last updated:",
        buttons: {
          refresh: "Refresh",
          retry: "Retry",
          close: "Close",
        },
      },

      // TrafficLight
      trafficLight: {
        levels: {
          LOW: "Low",
          MODERATE: "Moderate",
          HIGH: "High",
          VERY_HIGH: "Very High",
        },
      },

      // Review Components
      components: {
        review: {
          form: {
            title: {
              create: "Write Review",
              edit: "Edit Review",
              label: "Title",
              placeholder: "Enter review title",
            },
            content: {
              label: "Content",
              placeholder: "Enter review content",
            },
            rating: {
              label: "Rating",
              points: " stars",
            },
            required: "*",
            buttons: {
              create: "Submit",
              edit: "Update",
              cancel: "Cancel",
            },
            alerts: {
              titleRequired: "Please enter a title.",
              contentRequired: "Please enter content.",
            },
          },
        },
      },

      // NotificationModal
      notification: {
        modal: {
          title: "Notifications",
          markAllRead: "Mark all as read",
          close: "Close",
          loading: "Loading notifications...",
          empty: {
            general: "No new notifications.",
            admin: "No status change notifications.",
          },
          tabs: {
            general: "General",
            admin: "Status Changes",
          },
          time: {
            justNow: "Just now",
            minutesAgo: "m ago",
            hoursAgo: "h ago",
            daysAgo: "d ago",
          },
          types: {
            expo: "Exhibition",
            event: "Event",
            qrIssued: "QR Issued",
            paymentComplete: "Payment Complete",
            reservationConfirm: "Reservation Confirmed",
            ad: "Advertisement",
            notification: "Notification",
          },
          statusKeywords: ["Approved", "Rejected", "Pending", "Changed"],
          confirmModal: {
            title: "Mark all as read",
            message: "Are you sure you want to mark all notifications as read?",
            cancel: "Cancel",
            confirm: "Confirm",
          },
          processing: "Processing...",
          errors: {
            fetchFailed: "Failed to fetch notifications.",
            markReadFailed: "Failed to mark notification as read.",
            markAllReadFailed: "Failed to mark all notifications as read.",
            unknownType: "Unknown notification type.",
          },
        },
      },

      // ChangePasswordModal
      changePasswordModal: {
        title: "Change Password",
        labels: {
          currentPassword: "Current Password",
          newPassword: "New Password",
          confirmPassword: "Confirm New Password",
        },
        placeholders: {
          currentPassword: "Enter your current password",
          newPassword: "Enter your new password",
          confirmPassword: "Re-enter your new password",
        },
        helper: "Password must be at least 8 characters long.",
        buttons: {
          confirm: "Change Password",
          cancel: "Cancel",
        },
        messages: {
          success: "Password has been changed successfully.",
          failure: "Failed to change password.",
        },
      },
    },
  },
  ja: {
    translation: {
      // PricingInfo
      pricingInfo: {
        expo: {
          title: "博覧会料金案内",
          loading: "料金情報を読み込み中...",
          error: "料金情報の読み込みに失敗しました。",
          categories: {
            basic: "博覧会基本料金",
            default: "博覧会料金プラン",
          },
          items: {
            dailyUsage: "日使用料",
            basicDeposit: "基本登録金（保証金）",
            premiumFee: "プレミアム利用料",
            ticketCommission: "チケット手数料",
            standard: "標準博覧会",
          },
          descriptions: {
            dailyUsage: "博覧会掲載1日当たりの使用料",
            basicDeposit: "博覧会登録時に必要な基本保証金",
            premiumFee: "プレミアム機能利用時の追加料金",
            ticketCommission: "チケット販売時に発生する手数料率",
            standard: "基本博覧会開催サービス",
            adPosition: "この位置への広告掲載時の日当料金",
          },
          notice: {
            title: "💡 ご案内",
            items: [
              "すべての料金は付加価値税（VAT）込みです。",
              "お問い合わせはカスタマーサービスまでご連絡ください。",
            ],
          },
          units: {
            daily: "円/日",
            currency: "円",
            percent: "%",
            inquiry: "お問い合わせ",
          },
        },
        ad: {
          title: "広告料金案内",
          categories: {
            basic: "基本プラン",
            default: "広告基本料金",
          },
          items: {
            basicAd: "基本広告",
          },
          descriptions: {
            basicAd: "基本広告掲載サービス",
          },
        },
      },

      // UsageGuidelines
      usageGuidelines: {
        expo: {
          title: "博覧会申請注意事項",
          sections: {
            eligibility: {
              title: "申請資格",
              items: [
                "法人事業者または個人事業者のみ申請可能です。",
                "博覧会に関する詳細情報を記入していただく必要があります。",
                "申請時に事業者関連情報の提出が必要です。",
              ],
            },
            approval: {
              title: "承認基準",
              items: [
                "博覧会内容が健全で法的問題がないことが必要です。",
                "提出された書類が完全で正確である必要があります。",
                "プラットフォームポリシーに適合する博覧会である必要があります。",
                "重複申請でないことが必要です。",
              ],
            },
            precautions: {
              title: "注意事項",
              items: [
                "承認後の博覧会情報変更時は再承認が必要な場合があります。",
                "掲載期間は博覧会開催期間を超過することはできません。",
                "不適切な内容が発見された場合、承認が取り消される可能性があります。",
                "決済完了後のキャンセル時は手数料が発生する場合があります。",
              ],
            },
            refund: {
              title: "返金ポリシー",
              items: [
                "掲載待ち中のキャンセル：利用料＋日使用料100％返金",
                "掲載中のキャンセル：（日使用料×残り掲載期間）返金",
                "博覧会開催一週間以内のキャンセル：返金不可",
              ],
            },
          },
        },
        ad: {
          title: "広告申請注意事項",
          sections: {
            regulations: {
              title: "広告規定",
              items: [
                "法的に問題のない健全な広告内容である必要があります。",
                "他人の著作権を侵害しない画像を使用する必要があります。",
                "虚偽または誇大広告は禁止されています。",
                "成人コンテンツ、ギャンブル、違法商品の広告は不可です。",
              ],
            },
            imageSpecs: {
              title: "画像規格",
              items: [
                "ファイル形式：JPG、PNG、GIF、WebPのみ許可",
                "ファイルサイズ：10MB以下",
                "推奨解像度：1200x628px（横：縦 = 1.91:1）",
                "テキストが含まれる場合は可読性を考慮してください。",
              ],
            },
            policy: {
              title: "掲載ポリシー",
              items: [
                "広告審査は営業日基準で1-3日かかります。",
                "不適切な広告と判断された場合、承認が拒否される可能性があります。",
                "掲載中にポリシー違反が発見された場合、即座に掲載が中断されます。",
                "同じ広告位置での重複予約は不可能です。",
              ],
            },
            refund: {
              title: "返金ポリシー",
              items: [
                "掲載待ち中のキャンセル：日使用料100％返金",
                "掲載中のキャンセル：（日使用料×残り掲載期間）返金",
                "広告掲載開始一週間以内のキャンセル：返金不可",
              ],
            },
          },
        },
      },

      // CongestionModal
      congestionModal: {
        title: "リアルタイム混雑度",
        loading: "混雑度情報を読み込み中...",
        errors: {
          notFound: "博覧会情報が見つかりません。",
          loadFailed: "混雑度情報の読み込みに失敗しました。",
        },
        stats: {
          hourlyCapacity: "適正1時間入場者数",
          hourlyVisitors: "最近1時間現場入場者数",
          congestionRate: "混雑度",
          people: "名",
        },
        lastUpdate: "最終更新:",
        buttons: {
          refresh: "更新",
          retry: "再試行",
          close: "閉じる",
        },
      },

      // TrafficLight
      trafficLight: {
        levels: {
          LOW: "余裕",
          MODERATE: "普通",
          HIGH: "混雑",
          VERY_HIGH: "非常に混雑",
        },
      },

      // Review Components
      components: {
        review: {
          form: {
            title: {
              create: "レビューを書く",
              edit: "レビューを編集",
              label: "タイトル",
              placeholder: "レビュータイトルを入力してください",
            },
            content: {
              label: "内容",
              placeholder: "レビュー内容を入力してください",
            },
            rating: {
              label: "評価",
              points: "つ星",
            },
            required: "*",
            buttons: {
              create: "投稿する",
              edit: "更新する",
              cancel: "キャンセル",
            },
            alerts: {
              titleRequired: "タイトルを入力してください。",
              contentRequired: "内容を入力してください。",
            },
          },
        },
      },

      // NotificationModal
      notification: {
        modal: {
          title: "通知",
          markAllRead: "すべて既読にする",
          close: "閉じる",
          loading: "通知を読み込み中...",
          empty: {
            general: "新しい通知はありません。",
            admin: "ステータス変更の通知はありません。",
          },
          tabs: {
            general: "一般",
            admin: "ステータス変更",
          },
          time: {
            justNow: "たった今",
            minutesAgo: "分前",
            hoursAgo: "時間前",
            daysAgo: "日前",
          },
          types: {
            expo: "博覧会",
            event: "イベント",
            qrIssued: "QR発行",
            paymentComplete: "支払い完了",
            reservationConfirm: "予約確定",
            ad: "広告",
            notification: "通知",
          },
          statusKeywords: ["承認", "拒否", "保留", "変更"],
          confirmModal: {
            title: "すべて既読にする",
            message: "本当にすべての通知を既読にしますか？",
            cancel: "キャンセル",
            confirm: "確認",
          },
          processing: "処理中...",
          errors: {
            fetchFailed: "通知の読み込みに失敗しました。",
            markReadFailed: "通知を既読にするのに失敗しました。",
            markAllReadFailed: "すべての通知を既読にするのに失敗しました。",
            unknownType: "不明な通知タイプです。",
          },
        },
      },

      // ChangePasswordModal
      changePasswordModal: {
        title: "パスワード変更",
        labels: {
          currentPassword: "現在のパスワード",
          newPassword: "新しいパスワード",
          confirmPassword: "新しいパスワード確認",
        },
        placeholders: {
          currentPassword: "現在のパスワードを入力してください",
          newPassword: "新しいパスワードを入力してください",
          confirmPassword: "新しいパスワードを再入力してください",
        },
        helper: "パスワードは8文字以上である必要があります。",
        buttons: {
          confirm: "パスワード変更",
          cancel: "キャンセル",
        },
        messages: {
          success: "パスワードが変更されました。",
          failure: "パスワードの変更に失敗しました。",
        },
      },
    },
  },
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;
