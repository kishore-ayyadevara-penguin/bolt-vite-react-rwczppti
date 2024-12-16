const API_URL = 'https://apps.skesanupalli.com';

export async function uploadAndAnalyzeFiles(): Promise<APIPatientResponse[]> {
  try {
    const response = await fetch(`${API_URL}/raf/files`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading and analyzing files:', error);
    throw error;
  }
}