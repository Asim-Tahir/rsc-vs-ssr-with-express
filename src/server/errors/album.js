export default {
  /**
   * @param {string} id id of todo
   */
  NOT_EXIST_ERROR(id) {
    return `No existing album with id "${id}"!`;
  },
  /**
   * @param {Todo.TodoItem} existAlbum
   */
  ALREADY_EXIST_ERROR(existAlbum) {
    return `The album with id "${existAlbum.id}" already exists!`;
  }
};
