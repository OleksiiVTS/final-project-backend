const generateAvatar = async (username) => {
  const firstLetterName = username[0];

  const response = await fetch(
    `https://ui-avatars.com/api/?name=${firstLetterName}`
  );

  if (response.ok) {
    const avatar = `https://ui-avatars.com/api/?name=${firstLetterName}&size=256`;
    return avatar;
  } else {
    throw new HttpError(response.status);
  }
};

export default generateAvatar;
