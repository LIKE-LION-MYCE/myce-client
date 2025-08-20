// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
      nonmember: {
        // NonMemberReservationCheckPage
        reservationCheck: {
          title: "비회원 예매 확인",
          guide: "예매 시 사용한 이메일 주소로 인증을 진행한 후 예매번호를 입력해주세요.",
          email: {
            label: "이메일 주소",
            placeholder: "이메일을 입력하세요",
            sendCode: "인증번호 발송",
            sending: "발송 중...",
            sent: "발송완료",
            verified: "인증완료"
          },
          code: {
            label: "인증번호",
            placeholder: "인증번호 6자리를 입력하세요",
            verify: "인증확인",
            verifying: "확인 중...",
            verified: "✓ 인증 완료",
            validTime: "유효시간",
            expired: "인증시간이 만료되었습니다",
            defaultTime: "유효시간: 3분"
          },
          reservation: {
            label: "예매 번호",
            placeholder: "예매 번호를 입력하세요"
          },
          buttons: {
            cancel: "취소",
            confirm: "확인"
          },
          alerts: {
            enterEmail: "이메일을 입력해주세요.",
            codeSent: "인증번호가 발송되었습니다.",
            codeSendFailed: "인증번호 발송에 실패했습니다. 다시 시도해주세요.",
            enterEmailAndCode: "이메일과 인증번호를 모두 입력해주세요.",
            emailVerified: "이메일 인증이 완료되었습니다.",
            invalidCode: "인증번호가 올바르지 않습니다. 다시 확인해주세요.",
            verifyEmailFirst: "이메일 인증을 먼저 완료해주세요.",
            enterReservationNumber: "예매번호를 입력해주세요.",
            reservationNotFound: "입력하신 이메일과 예매번호에 해당하는 예매 정보를 찾을 수 없습니다.",
            reservationError: "예매 조회 중 오류가 발생했습니다. 다시 시도해주세요."
          }
        },

        // NonMemberPurchaseModal
        purchaseModal: {
          title: "비회원 구매",
          notice: "비회원은 한 번에 1매만 구매 가능합니다.",
          email: {
            label: "이메일",
            placeholder: "예약 확인용 이메일",
            sendCode: "인증번호 발송",
            sending: "발송 중...",
            resend: "재전송"
          },
          code: {
            label: "인증 코드",
            placeholder: "인증 코드를 입력하세요",
            verify: "확인",
            verifying: "확인 중...",
            verified: "인증 완료"
          },
          summary: {
            total: "총 결제 금액",
            currency: "원"
          },
          buttons: {
            cancel: "취소",
            purchase: "구매하기",
            processing: "처리 중..."
          },
          alerts: {
            invalidEmail: "유효한 이메일 주소를 입력해주세요.",
            codeSent: "인증 코드가 발송되었습니다.",
            codeSendFailed: "인증 코드 발송에 실패했습니다.",
            enterCode: "인증 코드를 입력해주세요.",
            emailVerified: "이메일이 성공적으로 인증되었습니다.",
            invalidCode: "인증 코드가 올바르지 않습니다.",
            verifyFirst: "이메일 인증을 먼저 완료해주세요.",
            purchaseFailed: "티켓 구매 준비에 실패했습니다. 다시 시도해주세요."
          }
        },

        // NonMemberReservationDetailPage
        reservationDetail: {
          title: "예매 정보 확인",
          loading: "로딩 중...",
          sections: {
            expoInfo: "박람회 정보",
            ticketGuide: "티켓 사용 안내",
            participants: "참여 인원",
            reservationInfo: "예매 정보",
            paymentInfo: "결제 정보"
          },
          expoInfo: {
            thumbnailAlt: "박람회 썸네일",
            location: "장소",
            schedule: "일정",
            time: "시간"
          },
          ticketGuide: {
            usagePeriod: "사용 가능 기간",
            qrCodeInfo: "입장 시 QR코드를 제시해주세요.",
            checkPeriod: "티켓 사용 기간을 확인해주세요.",
            lossWarning: "분실 시 재발급이 어려우니 주의하세요."
          },
          participants: {
            name: "이름",
            reservationNumber: "예매번호",
            gender: "성별",
            phone: "전화번호",
            email: "이메일",
            qrCode: "QR코드"
          },
          genders: {
            male: "남자",
            female: "여자"
          },
          qr: {
            viewDetails: "상세보기",
            outOfPeriod: "기간 외"
          },
          reservationInfo: {
            reservationDate: "예매일",
            ticketName: "티켓 이름",
            ticketType: "티켓 타입",
            quantity: "티켓 장수",
            ticketUnit: "매",
            unitPrice: "단가",
            currency: "원",
            serviceFee: "서비스 수수료",
            totalAmount: "총 결제금액"
          },
          paymentInfo: {
            paymentMethod: "결제방법",
            paymentDetail: "결제수단",
            totalAmount: "총 결제금액",
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
          alerts: {
            notExpoActive: "박람회 기간이 아닙니다.",
            qrNotGenerated: "QR 코드가 아직 생성되지 않았습니다."
          },
          errors: {
            notFound: "예매 정보를 찾을 수 없습니다."
          },
          common: {
            notAvailable: "N/A"
          }
        }
      }
    }
  },
  en: {
    translation: {
      nonmember: {
        // NonMemberReservationCheckPage
        reservationCheck: {
          title: "Non-member Reservation Check",
          guide: "Please verify with the email address used for booking and then enter your reservation number.",
          email: {
            label: "Email Address",
            placeholder: "Enter your email",
            sendCode: "Send Verification Code",
            sending: "Sending...",
            sent: "Code Sent",
            verified: "Email Verified"
          },
          code: {
            label: "Verification Code",
            placeholder: "Enter 6-digit verification code",
            verify: "Verify Code",
            verifying: "Verifying...",
            verified: "✓ Verification Complete",
            validTime: "Valid Time",
            expired: "Verification time has expired",
            defaultTime: "Valid Time: 3 minutes"
          },
          reservation: {
            label: "Reservation Number",
            placeholder: "Enter your reservation number"
          },
          buttons: {
            cancel: "Cancel",
            confirm: "Confirm"
          },
          alerts: {
            enterEmail: "Please enter your email address.",
            codeSent: "Verification code has been sent.",
            codeSendFailed: "Failed to send verification code. Please try again.",
            enterEmailAndCode: "Please enter both email and verification code.",
            emailVerified: "Email verification completed.",
            invalidCode: "Invalid verification code. Please check again.",
            verifyEmailFirst: "Please complete email verification first.",
            enterReservationNumber: "Please enter your reservation number.",
            reservationNotFound: "No reservation found for the entered email and reservation number.",
            reservationError: "An error occurred while checking the reservation. Please try again."
          }
        },

        // NonMemberPurchaseModal
        purchaseModal: {
          title: "Non-member Purchase",
          notice: "Non-members can only purchase 1 ticket at a time.",
          email: {
            label: "Email",
            placeholder: "Email for reservation confirmation",
            sendCode: "Send Verification Code",
            sending: "Sending...",
            resend: "Resend"
          },
          code: {
            label: "Verification Code",
            placeholder: "Enter verification code",
            verify: "Verify",
            verifying: "Verifying...",
            verified: "Verified"
          },
          summary: {
            total: "Total Payment Amount",
            currency: "KRW"
          },
          buttons: {
            cancel: "Cancel",
            purchase: "Purchase",
            processing: "Processing..."
          },
          alerts: {
            invalidEmail: "Please enter a valid email address.",
            codeSent: "Verification code has been sent.",
            codeSendFailed: "Failed to send verification code.",
            enterCode: "Please enter the verification code.",
            emailVerified: "Email has been successfully verified.",
            invalidCode: "The verification code is incorrect.",
            verifyFirst: "Please complete email verification first.",
            purchaseFailed: "Failed to prepare ticket purchase. Please try again."
          }
        },

        // NonMemberReservationDetailPage
        reservationDetail: {
          title: "Reservation Information",
          loading: "Loading...",
          sections: {
            expoInfo: "Exhibition Information",
            ticketGuide: "Ticket Usage Guide",
            participants: "Participants",
            reservationInfo: "Reservation Information",
            paymentInfo: "Payment Information"
          },
          expoInfo: {
            thumbnailAlt: "Exhibition Thumbnail",
            location: "Location",
            schedule: "Schedule",
            time: "Time"
          },
          ticketGuide: {
            usagePeriod: "Usage Period",
            qrCodeInfo: "Please present your QR code when entering.",
            checkPeriod: "Please check the ticket usage period.",
            lossWarning: "Please be careful as reissuing lost tickets is difficult."
          },
          participants: {
            name: "Name",
            reservationNumber: "Reservation Number",
            gender: "Gender",
            phone: "Phone Number",
            email: "Email",
            qrCode: "QR Code"
          },
          genders: {
            male: "Male",
            female: "Female"
          },
          qr: {
            viewDetails: "View Details",
            outOfPeriod: "Out of Period"
          },
          reservationInfo: {
            reservationDate: "Reservation Date",
            ticketName: "Ticket Name",
            ticketType: "Ticket Type",
            quantity: "Ticket Quantity",
            ticketUnit: "tickets",
            unitPrice: "Unit Price",
            currency: "KRW",
            serviceFee: "Service Fee",
            totalAmount: "Total Amount"
          },
          paymentInfo: {
            paymentMethod: "Payment Method",
            paymentDetail: "Payment Detail",
            totalAmount: "Total Amount",
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
          alerts: {
            notExpoActive: "Not within exhibition period.",
            qrNotGenerated: "QR code has not been generated yet."
          },
          errors: {
            notFound: "Reservation information not found."
          },
          common: {
            notAvailable: "N/A"
          }
        }
      }
    }
  },
  ja: {
    translation: {
      nonmember: {
        // NonMemberReservationCheckPage
        reservationCheck: {
          title: "非会員予約確認",
          guide: "予約時に使用したメールアドレスで認証を行った後、予約番号を入力してください。",
          email: {
            label: "メールアドレス",
            placeholder: "メールアドレスを入力してください",
            sendCode: "認証番号送信",
            sending: "送信中...",
            sent: "送信完了",
            verified: "認証完了"
          },
          code: {
            label: "認証番号",
            placeholder: "6桁の認証番号を入力してください",
            verify: "認証確認",
            verifying: "確認中...",
            verified: "✓ 認証完了",
            validTime: "有効時間",
            expired: "認証時間が期限切れです",
            defaultTime: "有効時間: 3分"
          },
          reservation: {
            label: "予約番号",
            placeholder: "予約番号を入力してください"
          },
          buttons: {
            cancel: "キャンセル",
            confirm: "確認"
          },
          alerts: {
            enterEmail: "メールアドレスを入力してください。",
            codeSent: "認証番号が送信されました。",
            codeSendFailed: "認証番号の送信に失敗しました。もう一度お試しください。",
            enterEmailAndCode: "メールアドレスと認証番号の両方を入力してください。",
            emailVerified: "メール認証が完了しました。",
            invalidCode: "認証番号が正しくありません。もう一度確認してください。",
            verifyEmailFirst: "メール認証を先に完了してください。",
            enterReservationNumber: "予約番号を入力してください。",
            reservationNotFound: "入力されたメールアドレスと予約番号に該当する予約情報が見つかりません。",
            reservationError: "予約照会中にエラーが発生しました。もう一度お試しください。"
          }
        },

        // NonMemberPurchaseModal
        purchaseModal: {
          title: "非会員購入",
          notice: "非会員は一度に1枚のみ購入可能です。",
          email: {
            label: "メールアドレス",
            placeholder: "予約確認用メールアドレス",
            sendCode: "認証番号送信",
            sending: "送信中...",
            resend: "再送信"
          },
          code: {
            label: "認証コード",
            placeholder: "認証コードを入力してください",
            verify: "確認",
            verifying: "確認中...",
            verified: "認証完了"
          },
          summary: {
            total: "総決済金額",
            currency: "円"
          },
          buttons: {
            cancel: "キャンセル",
            purchase: "購入する",
            processing: "処理中..."
          },
          alerts: {
            invalidEmail: "有効なメールアドレスを入力してください。",
            codeSent: "認証コードが送信されました。",
            codeSendFailed: "認証コードの送信に失敗しました。",
            enterCode: "認証コードを入力してください。",
            emailVerified: "メールアドレスの認証が正常に完了しました。",
            invalidCode: "認証コードが正しくありません。",
            verifyFirst: "メール認証を先に完了してください。",
            purchaseFailed: "チケット購入の準備に失敗しました。もう一度お試しください。"
          }
        },

        // NonMemberReservationDetailPage
        reservationDetail: {
          title: "予約情報確認",
          loading: "読み込み中...",
          sections: {
            expoInfo: "展示会情報",
            ticketGuide: "チケット使用案内",
            participants: "参加者",
            reservationInfo: "予約情報",
            paymentInfo: "決済情報"
          },
          expoInfo: {
            thumbnailAlt: "展示会サムネイル",
            location: "場所",
            schedule: "日程",
            time: "時間"
          },
          ticketGuide: {
            usagePeriod: "使用可能期間",
            qrCodeInfo: "入場時にQRコードを提示してください。",
            checkPeriod: "チケット使用期間をご確認ください。",
            lossWarning: "紛失時の再発行は困難ですのでご注意ください。"
          },
          participants: {
            name: "氏名",
            reservationNumber: "予約番号",
            gender: "性別",
            phone: "電話番号",
            email: "メールアドレス",
            qrCode: "QRコード"
          },
          genders: {
            male: "男性",
            female: "女性"
          },
          qr: {
            viewDetails: "詳細表示",
            outOfPeriod: "期間外"
          },
          reservationInfo: {
            reservationDate: "予約日",
            ticketName: "チケット名",
            ticketType: "チケットタイプ",
            quantity: "チケット枚数",
            ticketUnit: "枚",
            unitPrice: "単価",
            currency: "円",
            serviceFee: "サービス手数料",
            totalAmount: "総決済金額"
          },
          paymentInfo: {
            paymentMethod: "決済方法",
            paymentDetail: "決済手段",
            totalAmount: "総決済金額",
            paidAt: "決済日時"
          },
          ticketTypes: {
            general: "一般",
            earlyBird: "早期割引"
          },
          paymentMethods: {
            card: "カード",
            bankTransfer: "口座振替",
            virtualAccount: "バーチャルアカウント",
            simplePay: "簡単決済"
          },
          alerts: {
            notExpoActive: "展示会期間ではありません。",
            qrNotGenerated: "QRコードがまだ生成されていません。"
          },
          errors: {
            notFound: "予約情報が見つかりません。"
          },
          common: {
            notAvailable: "N/A"
          }
        }
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;