// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
      mypage: {
        // PaymentSelection
        paymentSelection: {
          title: "결제하기",
          sections: {
            paymentInfo: "결제 정보",
            paymentMethod: "결제 수단"
          },
          summary: {
            totalAmount: "총 결제 금액",
            currency: "원"
          },
          errors: {
            noExpoId: "결제 정보를 불러올 수 없습니다: 유효한 박람회 ID가 없습니다.",
            loadFailed: "결제 정보를 불러오는데 실패했습니다.",
            noAdId: "결제 정보를 불러올 수 없습니다: 유효한 광고 ID가 없습니다."
          }
        },

        // QRModal
        qrModal: {
          ticketInfo: {
            ticketName: "티켓명",
            ticketType: "티켓 타입",
            usageStartDate: "사용 시작일",
            usageEndDate: "사용 종료일"
          },
          participantInfo: {
            participant: "참여자",
            reservationNumber: "예매번호",
            reservationDate: "예매일",
            qrStatus: "QR 상태",
            usageDateTime: "사용일시"
          },
          ticketTypes: {
            general: "일반",
            earlyBird: "얼리버드"
          },
          qrStatus: {
            active: "사용 가능",
            used: "사용됨",
            expired: "만료됨",
            approved: "활성화 대기"
          },
          qr: {
            altText: "QR 코드",
            description: "입장 시 QR코드를 제시해주세요"
          },
          buttons: {
            congestionCheck: "실시간 혼잡도 조회",
            saveQr: "QR코드 저장"
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
      mypage: {
        // PaymentSelection
        paymentSelection: {
          title: "Payment",
          sections: {
            paymentInfo: "Payment Information",
            paymentMethod: "Payment Method"
          },
          summary: {
            totalAmount: "Total Amount",
            currency: "KRW"
          },
          errors: {
            noExpoId: "Unable to load payment information: No valid expo ID.",
            loadFailed: "Failed to load payment information.",
            noAdId: "Unable to load payment information: No valid ad ID."
          }
        },

        // QRModal
        qrModal: {
          ticketInfo: {
            ticketName: "Ticket Name",
            ticketType: "Ticket Type",
            usageStartDate: "Usage Start Date",
            usageEndDate: "Usage End Date"
          },
          participantInfo: {
            participant: "Participant",
            reservationNumber: "Reservation Number",
            reservationDate: "Reservation Date",
            qrStatus: "QR Status",
            usageDateTime: "Usage Date/Time"
          },
          ticketTypes: {
            general: "General",
            earlyBird: "Early Bird"
          },
          qrStatus: {
            active: "Available",
            used: "Used",
            expired: "Expired",
            approved: "Pending Activation"
          },
          qr: {
            altText: "QR Code",
            description: "Please present your QR code upon entry"
          },
          buttons: {
            congestionCheck: "Check Real-time Congestion",
            saveQr: "Save QR Code"
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
      mypage: {
        // PaymentSelection
        paymentSelection: {
          title: "決済",
          sections: {
            paymentInfo: "決済情報",
            paymentMethod: "決済方法"
          },
          summary: {
            totalAmount: "総決済金額",
            currency: "円"
          },
          errors: {
            noExpoId: "決済情報を読み込めません：有効な展示会IDがありません。",
            loadFailed: "決済情報の読み込みに失敗しました。",
            noAdId: "決済情報を読み込めません：有効な広告IDがありません。"
          }
        },

        // QRModal
        qrModal: {
          ticketInfo: {
            ticketName: "チケット名",
            ticketType: "チケットタイプ",
            usageStartDate: "使用開始日",
            usageEndDate: "使用終了日"
          },
          participantInfo: {
            participant: "参加者",
            reservationNumber: "予約番号",
            reservationDate: "予約日",
            qrStatus: "QRステータス",
            usageDateTime: "使用日時"
          },
          ticketTypes: {
            general: "一般",
            earlyBird: "早期割引"
          },
          qrStatus: {
            active: "使用可能",
            used: "使用済み",
            expired: "期限切れ",
            approved: "有効化待ち"
          },
          qr: {
            altText: "QRコード",
            description: "入場時にQRコードを提示してください"
          },
          buttons: {
            congestionCheck: "リアルタイム混雑度確認",
            saveQr: "QRコード保存"
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