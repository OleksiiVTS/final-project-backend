const generateAvatar = async (name) => {
  const response = await fetch(`https://ui-avatars.com/api/?name=${name}`);
  if (response.ok) {
    const firstLetterName = name[0];
    const avatar = `https://ui-avatars.com/api/?name=${firstLetterName}&size=256`;
    return avatar;
  } else {
    throw HttpError(response.status);
  }
};

export default generateAvatar;
