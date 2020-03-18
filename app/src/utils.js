export function processResponse(response) {
  if (!response.ok) {
    throw { text: response.statusText, status: response.status };
  }

  return response.json();
}
