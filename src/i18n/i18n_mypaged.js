// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
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
        },

        // AdCancelModal
        adCancelModal: {
          title: "광고 취소 확인",
          confirmMessage: "정말로 광고를 취소하시겠습니까?",
          status: {
            PENDING_APPROVAL: {
              type: "승인대기 취소",
              description: "승인 대기 중인 광고를 취소합니다. 결제가 진행되지 않았으므로 별도 환부 절차가 없습니다."
            },
            PENDING_PAYMENT: {
              type: "결제대기 취소",
              description: "결제 대기 중인 광고를 취소합니다. 결제가 완료되지 않았으므로 별도 환부 절차가 없습니다."
            },
            PENDING_PUBLISH: {
              type: "게시예정 취소",
              description: "게시 예정인 광고를 취소합니다. 결제된 금액은 전액 환불됩니다."
            },
            PUBLISHED: {
              type: "게시중 취소",
              description: "현재 게시 중인 광고를 중단합니다. 남은 게시 기간에 대해서는 부분 환불됩니다."
            },
            PENDING_CANCEL: {
              type: "취소 처리중",
              description: "이미 취소 처리가 진행 중입니다."
            },
            DEFAULT: {
              type: "광고 취소",
              description: "광고를 취소합니다."
            }
          },
          fields: {
            advertisementTitle: "광고명",
            applicantName: "신청자",
            displayPeriod: "게시 기간",
            currentStatus: "현재 상태"
          },
          buttons: {
            cancel: "취소하기",
            close: "닫기"
          },
          statusLabels: {
            PENDING_APPROVAL: "승인대기",
            PENDING_PAYMENT: "결제대기",
            PENDING_PUBLISH: "게시예정",
            PUBLISHED: "게시중",
            COMPLETED: "게시완료",
            REJECTED: "거절됨",
            PENDING_CANCEL: "환불대기",
            CANCELLED: "취소됨"
          }
        },

        // ReservationPending & ReservationSuccess
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
          next: "다음",
          pending: {
            title: "가상계좌가 발급되었습니다",
            subtitle: "예약을 완료하려면 아래 계좌 정보로 입금해주세요.",
            fields: {
              bank: "은행",
              accountNumber: "계좌번호",
              amount: "입금금액",
              dueDate: "입금기한"
            },
            buttons: {
              copy: "복사",
              contactSupport: "담당자 문의",
              backToHome: "메인 페이지로 돌아가기",
              resendEmail: "이메일 재전송"
            },
            messages: {
              copied: "{{type}}가 복사되었습니다.",
              copyFailed: "클립보드 복사에 실패했습니다.",
              loadFailed: "예약 정보를 불러오는 데 실패했습니다.",
              notice: "* 입금기한이 지나면 예약은 자동으로 취소됩니다.",
              helpText: "문제가 있으신가요?"
            },
            loading: "로딩 중…",
            error: "정보 조회 실패"
          },
          success: {
            title: "박람회 예약 완료!",
            subtitle: "티켓 정보가 이메일로 전송되었습니다",
            fields: {
              reservationNumber: "예매 번호"
            },
            buttons: {
              copy: "복사",
              copied: "복사됨!",
              resendEmail: "이메일 재전송",
              contactSupport: "담당자 문의",
              backToHome: "메인 페이지"
            },
            messages: {
              copyFailed: "클립보드 복사에 실패했습니다.",
              loadFailed: "예약 정보 조회 실패",
              helpText: "문제가 있으신가요?",
              resendApiPending: "이메일 재전송 API 연결 예정"
            },
            loading: "로딩 중…"
          }
        },

        // AdminInfoModal
        adminInfoModal: {
          title: "관리자 정보",
          fields: {
            adminId: "관리자 아이디",
            subordinateCodes: "하위 관리자 코드"
          },
          buttons: {
            copy: "복사",
            close: "닫기",
            navigateToAdmin: "관리자 페이지 이동"
          },
          messages: {
            noAdminId: "관리자 ID 없음",
            noCodes: "하위 관리자 코드가 없습니다.",
            codeCopied: "코드가 복사되었습니다.",
            copyFailed: "복사에 실패했습니다."
          }
        },

        // SevenDayRuleModal
        sevenDayRuleModal: {
          title: "환불 신청 불가",
          messageTitle: "개최 7일 전에는 환불이 불가능합니다",
          messageDescription: "게시 중인 박람회는 개최일로부터 7일 전까지만 환불 신청이 가능합니다.",
          messageSubDescription: "이는 이미 예약한 관람객들의 피해를 최소화하기 위한 정책입니다.",
          refundablePeroid: "환불 가능 기간:",
          refundablePeriodValue: "개최일 7일 전까지",
          nonRefundablePeriod: "환불 불가 기간:",
          nonRefundablePeriodValue: "개최일 7일 이내",
          confirmButton: "확인"
        },

        // AdRejectInfoModal
        adRejectInfoModal: {
          title: "광고 거절 사유",
          rejectedAt: "거절 일시",
          rejectionReason: "거절 사유",
          noReason: "거절 사유가 제공되지 않았습니다.",
          noDate: "-",
          confirmButton: "확인"
        },

        // AdPaymentRefundModal
        adPaymentRefundModal: {
          title: {
            completed: "광고 환불 완료 내역",
            pending: "광고 환불 신청 내역"
          },
          refundTypes: {
            PENDING_PUBLISH: {
              type: "전액 환불",
              description: "게시 전이므로 전액 환불됩니다."
            },
            PUBLISHED: {
              type: "부분 환불", 
              description: "남은 게시 기간만큼 환불됩니다."
            },
            PENDING_CANCEL: {
              type: "환불 처리중",
              description: "환불이 처리 중입니다."
            },
            DEFAULT: {
              type: "환불 신청",
              description: "상태에 따라 환불 금액이 결정됩니다."
            }
          },
          fields: {
            totalDays: "총 게시 일수",
            dailyFee: "일일 광고비", 
            totalAmount: "총 결제 금액",
            usedDays: "사용 일수",
            usedAmount: "사용 금액",
            remainingDays: "남은 일수",
            refundFormula: "환불 계산식",
            refundAmountCompleted: "환불 완료 금액",
            refundAmountPending: "환불 예정 금액",
            advertisementTitle: "광고명",
            applicant: "신청자",
            displayPeriod: "게시 기간",
            refundRequestDate: "환불 신청일",
            refundReason: "환불 사유"
          },
          placeholders: {
            refundReason: "환불 사유를 입력해주세요"
          },
          buttons: {
            confirm: "확인",
            close: "닫기",
            refund: "환불 신청"
          },
          messages: {
            reasonRequired: "환불 사유를 입력해주세요."
          },
          units: {
            days: "일",
            currency: "원"
          }
        },

        // PaymentDetailModal
        paymentDetailModal: {
          title: "결제 내역",
          fields: {
            expoName: "박람회명",
            applicant: "신청자", 
            period: "게시 기간",
            totalDays: "총 게시 일수",
            dailyUsageFee: "일일 사용료",
            usageFeeAmount: "사용료 총액",
            basicDeposit: "기본 등록금",
            premiumFee: "프리미엄 이용료",
            totalAmount: "총 결제 금액"
          },
          units: {
            days: "일",
            currency: "원"
          }
        },

        // PaymentWaitingModal
        paymentWaitingModal: {
          buttons: {
            cancel: "취소",
            pay: "결제하기"
          }
        },

        // SettlementReceiptModal
        settlementReceiptModal: {
          title: "정산 내역 확인",
          fields: {
            expoName: "박람회명",
            settlementRequestDate: "정산 요청일",
            totalRevenue: "총 판매 금액",
            platformFee: "플랫폼 수수료",
            netProfit: "순수익",
            bank: "은행",
            accountNumber: "계좌번호", 
            accountHolder: "예금주명"
          },
          ticketSales: {
            title: "티켓 판매 내역",
            headers: {
              ticketName: "티켓명",
              soldCount: "판매 개수",
              totalSales: "총 판매 금액"
            }
          },
          settlementForm: {
            title: "정산 신청 정보",
            labels: {
              bank: "은행",
              accountNumber: "계좌번호",
              accountHolder: "예금주명"
            },
            placeholders: {
              bankSelect: "은행을 선택해주세요",
              accountNumber: "계좌번호를 입력해주세요 (숫자와 하이픈만)",
              accountHolder: "예금주명을 입력해주세요 (한글, 영어만)"
            }
          },
          buttons: {
            close: "닫기",
            submit: "정산 신청",
            submitting: "신청 중..."
          },
          messages: {
            allFieldsRequired: "모든 은행 정보를 입력해주세요.",
            submitSuccess: "정산 신청이 완료되었습니다.",
            submitError: "정산 신청에 실패했습니다.",
            accountNumberWarning: "계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.",
            accountHolderWarning: "예금주는 한글, 영어, 공백만 입력 가능합니다.",
            noInfo: "정보 없음"
          },
          units: {
            pieces: "개",
            currency: "원",
            percent: "%"
          }
        },

        // PaymentRefundModal
        paymentRefundModal: {
          titles: {
            refundCompleted: "환불 완료 내역",
            refundPending: "환불 신청 내역",
            refundDetails: "환불 내역", 
            refundRequest: "환불 신청서",
            fullRefundSuffix: " (전액 환불)"
          },
          fields: {
            totalDays: "총 게시 일수",
            dailyUsageFee: "일일 이용료", 
            totalDeposit: "총 등록금",
            totalUsageFee: "총 이용료",
            totalAmount: "총 결제 금액",
            publishedDays: "게시 일수",
            usedAmount: "사용 금액",
            remainingDays: "남은 일수",
            refundFormula: "환불 계산식",
            depositRefund: "등록금 환불",
            usageFeeRefund: "이용료 환불",
            refundCompletedAmount: "환불 완료 금액",
            refundPendingAmount: "환불 예정 금액",
            expoName: "박람회명",
            applicant: "신청자",
            period: "게시 기간",
            refundRequestDate: "환불 신청일",
            refundReason: "환불 사유",
            requiredMark: "*"
          },
          placeholders: {
            refundReason: "환불 사유를 입력해주세요."
          },
          messages: {
            noRefundReason: "환불 사유가 없습니다.",
            reasonRequired: "환불 사유를 입력해주세요.",
            charCount: "/500"
          },
          buttons: {
            confirm: "확인",
            cancel: "취소",
            refund: "환불 신청"
          },
          units: {
            days: "일",
            currency: "원"
          }
        },

        // PaymentFinishedModal
        paymentFinishedModal: {
          buttons: {
            close: "닫기"
          }
        }
    }
  },
  en: {
    translation: {
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
        },

        // AdCancelModal
        adCancelModal: {
          title: "Cancel Advertisement Confirmation",
          confirmMessage: "Are you sure you want to cancel this advertisement?",
          status: {
            PENDING_APPROVAL: {
              type: "Pending Approval Cancellation",
              description: "Cancel the advertisement pending approval. No refund process is required as payment has not been processed."
            },
            PENDING_PAYMENT: {
              type: "Pending Payment Cancellation",
              description: "Cancel the advertisement pending payment. No refund process is required as payment has not been completed."
            },
            PENDING_PUBLISH: {
              type: "Scheduled Publication Cancellation",
              description: "Cancel the advertisement scheduled for publication. The paid amount will be fully refunded."
            },
            PUBLISHED: {
              type: "Active Publication Cancellation",
              description: "Stop the currently published advertisement. Partial refund will be provided for the remaining publication period."
            },
            PENDING_CANCEL: {
              type: "Cancellation in Progress",
              description: "Cancellation process is already in progress."
            },
            DEFAULT: {
              type: "Advertisement Cancellation",
              description: "Cancel the advertisement."
            }
          },
          fields: {
            advertisementTitle: "Advertisement Title",
            applicantName: "Applicant",
            displayPeriod: "Display Period",
            currentStatus: "Current Status"
          },
          buttons: {
            cancel: "Cancel",
            close: "Close"
          },
          statusLabels: {
            PENDING_APPROVAL: "Pending Approval",
            PENDING_PAYMENT: "Pending Payment",
            PENDING_PUBLISH: "Scheduled",
            PUBLISHED: "Published",
            COMPLETED: "Completed",
            REJECTED: "Rejected",
            PENDING_CANCEL: "Pending Refund",
            CANCELLED: "Cancelled"
          }
        },

        // ReservationPending & ReservationSuccess
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
            confirmed: "Payment Completed"
          },
          noData: "No reservation history.",
          loadError: "Failed to load reservation history.",
          previous: "Previous",
          next: "Next",
          pending: {
            title: "Virtual Account Issued",
            subtitle: "Please deposit to the account information below to complete your reservation.",
            fields: {
              bank: "Bank",
              accountNumber: "Account Number",
              amount: "Deposit Amount",
              dueDate: "Due Date"
            },
            buttons: {
              copy: "Copy",
              contactSupport: "Contact Support",
              backToHome: "Back to Home",
              resendEmail: "Resend Email"
            },
            messages: {
              copied: "{{type}} copied.",
              copyFailed: "Failed to copy to clipboard.",
              loadFailed: "Failed to load reservation information.",
              notice: "* Reservation will be automatically cancelled if payment is not made by the due date.",
              helpText: "Having problems?"
            },
            loading: "Loading...",
            error: "Failed to retrieve information"
          },
          success: {
            title: "Exhibition Reservation Complete!",
            subtitle: "Ticket information has been sent to your email",
            fields: {
              reservationNumber: "Reservation Number"
            },
            buttons: {
              copy: "Copy",
              copied: "Copied!",
              resendEmail: "Resend Email",
              contactSupport: "Contact Support",
              backToHome: "Home"
            },
            messages: {
              copyFailed: "Failed to copy to clipboard.",
              loadFailed: "Failed to retrieve reservation information",
              helpText: "Having problems?",
              resendApiPending: "Email resend API connection pending"
            },
            loading: "Loading..."
          }
        },

        // AdminInfoModal
        adminInfoModal: {
          title: "Administrator Information",
          fields: {
            adminId: "Administrator ID",
            subordinateCodes: "Subordinate Administrator Codes"
          },
          buttons: {
            copy: "Copy",
            close: "Close",
            navigateToAdmin: "Go to Admin Page"
          },
          messages: {
            noAdminId: "No Admin ID",
            noCodes: "No subordinate administrator codes.",
            codeCopied: "Code copied.",
            copyFailed: "Failed to copy."
          }
        },

        // SevenDayRuleModal
        sevenDayRuleModal: {
          title: "Refund Not Available",
          messageTitle: "Refunds are not allowed within 7 days of the event",
          messageDescription: "Refunds are only available until 7 days before the event date for published exhibitions.",
          messageSubDescription: "This policy is to minimize inconvenience to visitors who have already made reservations.",
          refundablePeroid: "Refundable Period:",
          refundablePeriodValue: "Until 7 days before event date",
          nonRefundablePeriod: "Non-refundable Period:",
          nonRefundablePeriodValue: "Within 7 days of event date",
          confirmButton: "Confirm"
        },

        // AdRejectInfoModal
        adRejectInfoModal: {
          title: "Advertisement Rejection Reason",
          rejectedAt: "Rejection Date",
          rejectionReason: "Rejection Reason",
          noReason: "No rejection reason was provided.",
          noDate: "-",
          confirmButton: "Confirm"
        },

        // AdPaymentRefundModal
        adPaymentRefundModal: {
          title: {
            completed: "Advertisement Refund Completed",
            pending: "Advertisement Refund Request"
          },
          refundTypes: {
            PENDING_PUBLISH: {
              type: "Full Refund",
              description: "Full refund available as advertisement has not been published yet."
            },
            PUBLISHED: {
              type: "Partial Refund",
              description: "Partial refund for remaining publication period."
            },
            PENDING_CANCEL: {
              type: "Refund Processing",
              description: "Refund is currently being processed."
            },
            DEFAULT: {
              type: "Refund Request",
              description: "Refund amount will be determined based on status."
            }
          },
          fields: {
            totalDays: "Total Publication Days",
            dailyFee: "Daily Advertisement Fee",
            totalAmount: "Total Payment Amount",
            usedDays: "Used Days",
            usedAmount: "Used Amount",
            remainingDays: "Remaining Days",
            refundFormula: "Refund Calculation",
            refundAmountCompleted: "Refunded Amount",
            refundAmountPending: "Expected Refund Amount",
            advertisementTitle: "Advertisement Title",
            applicant: "Applicant",
            displayPeriod: "Display Period",
            refundRequestDate: "Refund Request Date",
            refundReason: "Refund Reason"
          },
          placeholders: {
            refundReason: "Please enter the refund reason"
          },
          buttons: {
            confirm: "Confirm",
            close: "Close",
            refund: "Request Refund"
          },
          messages: {
            reasonRequired: "Please enter a refund reason."
          },
          units: {
            days: "days",
            currency: "KRW"
          }
        },

        // PaymentDetailModal
        paymentDetailModal: {
          title: "Payment Details",
          fields: {
            expoName: "Exhibition Name",
            applicant: "Applicant",
            period: "Display Period",
            totalDays: "Total Display Days",
            dailyUsageFee: "Daily Usage Fee",
            usageFeeAmount: "Total Usage Fee",
            basicDeposit: "Basic Registration Fee",
            premiumFee: "Premium Service Fee",
            totalAmount: "Total Payment Amount"
          },
          units: {
            days: "days",
            currency: "KRW"
          }
        },

        // PaymentWaitingModal
        paymentWaitingModal: {
          buttons: {
            cancel: "Cancel",
            pay: "Make Payment"
          }
        },

        // SettlementReceiptModal
        settlementReceiptModal: {
          title: "Settlement Details",
          fields: {
            expoName: "Exhibition Name",
            settlementRequestDate: "Settlement Request Date",
            totalRevenue: "Total Sales Revenue",
            platformFee: "Platform Fee",
            netProfit: "Net Profit",
            bank: "Bank",
            accountNumber: "Account Number",
            accountHolder: "Account Holder"
          },
          ticketSales: {
            title: "Ticket Sales Details",
            headers: {
              ticketName: "Ticket Name",
              soldCount: "Sold Count",
              totalSales: "Total Sales"
            }
          },
          settlementForm: {
            title: "Settlement Request Information",
            labels: {
              bank: "Bank",
              accountNumber: "Account Number",
              accountHolder: "Account Holder"
            },
            placeholders: {
              bankSelect: "Please select a bank",
              accountNumber: "Please enter account number (numbers and hyphens only)",
              accountHolder: "Please enter account holder name (Korean and English only)"
            }
          },
          buttons: {
            close: "Close",
            submit: "Request Settlement",
            submitting: "Submitting..."
          },
          messages: {
            allFieldsRequired: "Please enter all bank information.",
            submitSuccess: "Settlement request has been completed.",
            submitError: "Settlement request failed.",
            accountNumberWarning: "Account numbers can only contain numbers and hyphens (-).",
            accountHolderWarning: "Account holder names can only contain Korean, English, and spaces.",
            noInfo: "No information"
          },
          units: {
            pieces: "pieces",
            currency: "KRW",
            percent: "%"
          }
        },

        // PaymentRefundModal
        paymentRefundModal: {
          titles: {
            refundCompleted: "Refund Completed",
            refundPending: "Refund Request Details",
            refundDetails: "Refund Details",
            refundRequest: "Refund Request Form",
            fullRefundSuffix: " (Full Refund)"
          },
          fields: {
            totalDays: "Total Display Days",
            dailyUsageFee: "Daily Usage Fee",
            totalDeposit: "Total Deposit",
            totalUsageFee: "Total Usage Fee",
            totalAmount: "Total Payment Amount",
            publishedDays: "Published Days",
            usedAmount: "Used Amount",
            remainingDays: "Remaining Days",
            refundFormula: "Refund Calculation",
            depositRefund: "Deposit Refund",
            usageFeeRefund: "Usage Fee Refund",
            refundCompletedAmount: "Refunded Amount",
            refundPendingAmount: "Expected Refund Amount",
            expoName: "Exhibition Name",
            applicant: "Applicant",
            period: "Display Period",
            refundRequestDate: "Refund Request Date",
            refundReason: "Refund Reason",
            requiredMark: "*"
          },
          placeholders: {
            refundReason: "Please enter the refund reason."
          },
          messages: {
            noRefundReason: "No refund reason provided.",
            reasonRequired: "Please enter a refund reason.",
            charCount: "/500"
          },
          buttons: {
            confirm: "Confirm",
            cancel: "Cancel",
            refund: "Request Refund"
          },
          units: {
            days: "days",
            currency: "KRW"
          }
        },

        // PaymentFinishedModal
        paymentFinishedModal: {
          buttons: {
            close: "Close"
          }
        }
    }
  },
  ja: {
    translation: {
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
        },

        // AdCancelModal
        adCancelModal: {
          title: "広告キャンセル確認",
          confirmMessage: "本当に広告をキャンセルしますか？",
          status: {
            PENDING_APPROVAL: {
              type: "承認待ちキャンセル",
              description: "承認待ちの広告をキャンセルします。決済が進行されていないため、別途返金手続きはありません。"
            },
            PENDING_PAYMENT: {
              type: "決済待ちキャンセル",
              description: "決済待ちの広告をキャンセルします。決済が完了していないため、別途返金手続きはありません。"
            },
            PENDING_PUBLISH: {
              type: "公開予定キャンセル",
              description: "公開予定の広告をキャンセルします。決済された金額は全額返金されます。"
            },
            PUBLISHED: {
              type: "公開中キャンセル",
              description: "現在公開中の広告を停止します。残りの公開期間については部分返金されます。"
            },
            PENDING_CANCEL: {
              type: "キャンセル処理中",
              description: "既にキャンセル処理が進行中です。"
            },
            DEFAULT: {
              type: "広告キャンセル",
              description: "広告をキャンセルします。"
            }
          },
          fields: {
            advertisementTitle: "広告名",
            applicantName: "申請者",
            displayPeriod: "表示期間",
            currentStatus: "現在のステータス"
          },
          buttons: {
            cancel: "キャンセル",
            close: "閉じる"
          },
          statusLabels: {
            PENDING_APPROVAL: "承認待ち",
            PENDING_PAYMENT: "決済待ち",
            PENDING_PUBLISH: "公開予定",
            PUBLISHED: "公開中",
            COMPLETED: "公開完了",
            REJECTED: "拒否されました",
            PENDING_CANCEL: "返金待ち",
            CANCELLED: "キャンセル済み"
          }
        },

        // ReservationPending & ReservationSuccess
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
          next: "次へ",
          pending: {
            title: "仮想口座が発行されました",
            subtitle: "予約を完了するには、以下の口座情報に入金してください。",
            fields: {
              bank: "銀行",
              accountNumber: "口座番号",
              amount: "入金金額",
              dueDate: "入金期限"
            },
            buttons: {
              copy: "コピー",
              contactSupport: "担当者問い合わせ",
              backToHome: "メインページに戻る",
              resendEmail: "メール再送信"
            },
            messages: {
              copied: "{{type}}がコピーされました。",
              copyFailed: "クリップボードコピーに失敗しました。",
              loadFailed: "予約情報の読み込みに失敗しました。",
              notice: "* 入金期限を過ぎると予約は自動的にキャンセルされます。",
              helpText: "問題がありますか？"
            },
            loading: "読み込み中…",
            error: "情報取得失敗"
          },
          success: {
            title: "博覧会予約完了！",
            subtitle: "チケット情報がメールで送信されました",
            fields: {
              reservationNumber: "予約番号"
            },
            buttons: {
              copy: "コピー",
              copied: "コピー済み！",
              resendEmail: "メール再送信",
              contactSupport: "担当者問い合わせ",
              backToHome: "メインページ"
            },
            messages: {
              copyFailed: "クリップボードコピーに失敗しました。",
              loadFailed: "予約情報取得失敗",
              helpText: "問題がありますか？",
              resendApiPending: "メール再送信API接続予定"
            },
            loading: "読み込み中…"
          }
        },

        // AdminInfoModal
        adminInfoModal: {
          title: "管理者情報",
          fields: {
            adminId: "管理者ID",
            subordinateCodes: "下位管理者コード"
          },
          buttons: {
            copy: "コピー",
            close: "閉じる",
            navigateToAdmin: "管理者ページへ移動"
          },
          messages: {
            noAdminId: "管理者IDがありません",
            noCodes: "下位管理者コードがありません。",
            codeCopied: "コードがコピーされました。",
            copyFailed: "コピーに失敗しました。"
          }
        },

        // SevenDayRuleModal
        sevenDayRuleModal: {
          title: "返金申請不可",
          messageTitle: "開催7日前は返金できません",
          messageDescription: "公開中の博覧会は開催日から7日前まで返金申請が可能です。",
          messageSubDescription: "これは既に予約した観覧客の被害を最小化するための方針です。",
          refundablePeroid: "返金可能期間:",
          refundablePeriodValue: "開催日7日前まで",
          nonRefundablePeriod: "返金不可期間:",
          nonRefundablePeriodValue: "開催日7日以内",
          confirmButton: "確認"
        },

        // AdRejectInfoModal
        adRejectInfoModal: {
          title: "広告拒否理由",
          rejectedAt: "拒否日時",
          rejectionReason: "拒否理由",
          noReason: "拒否理由が提供されませんでした。",
          noDate: "-",
          confirmButton: "確認"
        },

        // AdPaymentRefundModal
        adPaymentRefundModal: {
          title: {
            completed: "広告返金完了明細",
            pending: "広告返金申請明細"
          },
          refundTypes: {
            PENDING_PUBLISH: {
              type: "全額返金",
              description: "公開前のため全額返金されます。"
            },
            PUBLISHED: {
              type: "部分返金",
              description: "残りの公開期間分が返金されます。"
            },
            PENDING_CANCEL: {
              type: "返金処理中",
              description: "返金処理中です。"
            },
            DEFAULT: {
              type: "返金申請",
              description: "状態に応じて返金金額が決定されます。"
            }
          },
          fields: {
            totalDays: "総公開日数",
            dailyFee: "日割り広告費",
            totalAmount: "総決済金額",
            usedDays: "使用日数",
            usedAmount: "使用金額",
            remainingDays: "残り日数",
            refundFormula: "返金計算式",
            refundAmountCompleted: "返金完了金額",
            refundAmountPending: "返金予定金額",
            advertisementTitle: "広告名",
            applicant: "申請者",
            displayPeriod: "公開期間",
            refundRequestDate: "返金申請日",
            refundReason: "返金理由"
          },
          placeholders: {
            refundReason: "返金理由を入力してください"
          },
          buttons: {
            confirm: "確認",
            close: "閉じる",
            refund: "返金申請"
          },
          messages: {
            reasonRequired: "返金理由を入力してください。"
          },
          units: {
            days: "日",
            currency: "円"
          }
        },

        // PaymentDetailModal
        paymentDetailModal: {
          title: "決済明細",
          fields: {
            expoName: "博覧会名",
            applicant: "申請者",
            period: "公開期間",
            totalDays: "総公開日数",
            dailyUsageFee: "日割り使用料",
            usageFeeAmount: "使用料総額",
            basicDeposit: "基本登録金",
            premiumFee: "プレミアム利用料",
            totalAmount: "総決済金額"
          },
          units: {
            days: "日",
            currency: "円"
          }
        },

        // PaymentWaitingModal
        paymentWaitingModal: {
          buttons: {
            cancel: "キャンセル",
            pay: "決済する"
          }
        },

        // SettlementReceiptModal
        settlementReceiptModal: {
          title: "精算明細確認",
          fields: {
            expoName: "博覧会名",
            settlementRequestDate: "精算申請日",
            totalRevenue: "総売上金額",
            platformFee: "プラットフォーム手数料",
            netProfit: "純利益",
            bank: "銀行",
            accountNumber: "口座番号",
            accountHolder: "口座名義"
          },
          ticketSales: {
            title: "チケット販売明細",
            headers: {
              ticketName: "チケット名",
              soldCount: "販売数",
              totalSales: "総販売金額"
            }
          },
          settlementForm: {
            title: "精算申請情報",
            labels: {
              bank: "銀行",
              accountNumber: "口座番号",
              accountHolder: "口座名義"
            },
            placeholders: {
              bankSelect: "銀行を選択してください",
              accountNumber: "口座番号を入力してください（数字とハイフンのみ）",
              accountHolder: "口座名義を入力してください（日本語と英語のみ）"
            }
          },
          buttons: {
            close: "閉じる",
            submit: "精算申請",
            submitting: "申請中..."
          },
          messages: {
            allFieldsRequired: "すべての銀行情報を入力してください。",
            submitSuccess: "精算申請が完了しました。",
            submitError: "精算申請に失敗しました。",
            accountNumberWarning: "口座番号は数字とハイフン（-）のみ入力可能です。",
            accountHolderWarning: "口座名義は日本語、英語、スペースのみ入力可能です。",
            noInfo: "情報なし"
          },
          units: {
            pieces: "個",
            currency: "円",
            percent: "%"
          }
        },

        // PaymentRefundModal
        paymentRefundModal: {
          titles: {
            refundCompleted: "返金完了明細",
            refundPending: "返金申請明細",
            refundDetails: "返金明細",
            refundRequest: "返金申請書",
            fullRefundSuffix: " (全額返金)"
          },
          fields: {
            totalDays: "総公開日数",
            dailyUsageFee: "日割り利用料",
            totalDeposit: "総登録金",
            totalUsageFee: "総利用料",
            totalAmount: "総決済金額",
            publishedDays: "公開日数",
            usedAmount: "使用金額",
            remainingDays: "残り日数",
            refundFormula: "返金計算式",
            depositRefund: "登録金返金",
            usageFeeRefund: "利用料返金",
            refundCompletedAmount: "返金完了金額",
            refundPendingAmount: "返金予定金額",
            expoName: "博覧会名",
            applicant: "申請者",
            period: "公開期間",
            refundRequestDate: "返金申請日",
            refundReason: "返金理由",
            requiredMark: "*"
          },
          placeholders: {
            refundReason: "返金理由を入力してください。"
          },
          messages: {
            noRefundReason: "返金理由がありません。",
            reasonRequired: "返金理由を入力してください。",
            charCount: "/500"
          },
          buttons: {
            confirm: "確認",
            cancel: "キャンセル",
            refund: "返金申請"
          },
          units: {
            days: "日",
            currency: "円"
          }
        },

        // PaymentFinishedModal
        paymentFinishedModal: {
          buttons: {
            close: "閉じる"
          }
        }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;