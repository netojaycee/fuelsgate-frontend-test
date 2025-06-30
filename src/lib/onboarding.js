const isOnboarded = (request) => {
  if (request.cookies.get('profile')) {
    return true;
  } 
  return false;
}

export default isOnboarded;