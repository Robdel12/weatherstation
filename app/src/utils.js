export function processResponse(response) {
  if (!response.ok) {
    throw Object.assign(new Error(), {
      text: response.statusText,
      status: response.status
    });
  }

  return response.json();
}
