



export const fetchPublicStates = async () => {
  let response = await fetch(
    'https://nga-states-lga.onrender.com/fetch'
  );
  return await response.json();
}

export const fetchPublicStateLGA = async (state?: string) => {
  let response = await fetch(
    'https://nga-states-lga.onrender.com/?state=' + state
  );
  return await response.json();
}