class Picture {
    constructor(id, filepath, size, eventId) {
      this.id = id;
      this.filepath = filepath;
      this.size = size;
      this.eventId = eventId;
    }
  
    setId(id) {
      this.id = id;
    }
  
    setFilepath(filepath) {
      this.filepath = filepath;
    }
  
    setSize(size) {
      this.size = size;
    }
  
    setEventId(eventId) {
      this.eventId = eventId;
    }
  
    getId() {
      return this.id;
    }
  
    getFilepath() {
      return this.filepath;
    }
  
    getSize() {
      return this.size;
    }
  
    getEventId() {
      return this.eventId;
    }
  }
  
  module.exports = Picture;