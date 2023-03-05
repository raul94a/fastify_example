class AccessToken {
    constructor(id, userId, token, expiresAt) {
      this.id = id;
      this.userId = userId;
      this.token = token;
      this.expiresAt = expiresAt;
    }
  }
  
  module.exports = AccessToken