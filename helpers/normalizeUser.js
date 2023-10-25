const normalizeUser = (object) => {
  delete object.createdAt;
  delete object.updatedAt;
  delete object.verificationToken;
  delete object.verify;
  delete object.public_id;
  delete object.password;

  return object;
};

export default normalizeUser;
