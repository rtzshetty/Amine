import { getAccessToken } from "./workspace";

export async function fetchDriveVideos(): Promise<any[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('You must be signed in with Google to use Drive.');
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=mimeType contains 'video/' and trashed = false&fields=files(id,name,thumbnailLink,mimeType)&pageSize=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch files from Google Drive');
  }

  const data = await response.json();
  return data.files || [];
}
