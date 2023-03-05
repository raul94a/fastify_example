class User {
    constructor(id, email, password, name, createdAt, updatedAt) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.name = name;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  
  module.exports = User;
  