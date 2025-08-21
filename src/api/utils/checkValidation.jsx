const checkPhoneFormat = (phone) => {
    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
      return phoneRegex.test(phoneNumber);
}