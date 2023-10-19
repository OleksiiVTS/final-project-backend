const generateAvatar = async (user) => {
  const firstLetterName = user.username[0];

  const response = await fetch(
    `https://ui-avatars.com/api/?name=${firstLetterName}`
  );

  if (response.ok) {
    const avatar = `https://ui-avatars.com/api/?name=${firstLetterName}&size=256`;
    user.avatarURL = avatar;
    await user.save();
    return avatar;
  } else {
    throw new HttpError(response.status);
  }
};

export default generateAvatar;
