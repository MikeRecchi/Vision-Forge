import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize or reuse Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use Google Drive broad scope as requested and configured in OAuth tool
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const provider = new GoogleAuthProvider();
provider.addScope(DRIVE_SCOPE);
// Ask for consent to guarantee a fresh access token is supplied when logging in
provider.setCustomParameters({
  prompt: 'consent'
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // We have a user account session but need to connect/acquire the Drive Access Token.
        // The user can connect manually via the button.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google to get access token for Drive
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (isSigningIn) return null;
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!accessToken) {
      throw new Error('Failed to retrieve Google Drive OAuth access token.');
    }

    cachedAccessToken = accessToken;
    return { user: result.user, accessToken };
  } catch (error: any) {
    console.error('Error signing in with Google Drive scopes:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Log out of session
export const logoutDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Get current token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Set token manually
export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * GOOGLE DRIVE API FUNCTIONS
 */

// Helper to handle standard Google Drive API errors
async function handleDriveResponse(response: Response, action: string) {
  if (!response.ok) {
    const errText = await response.text();
    let message = `Failed to ${action}.`;
    try {
      const parsed = JSON.parse(errText);
      message = parsed.error?.message || message;
    } catch {
      message = errText || message;
    }
    throw new Error(message);
  }
  return response.json();
}

// Find or create 'Vision Forge Creations' folder in Drive
export const getOrCreateFolder = async (token: string): Promise<string> => {
  const folderName = 'Vision Forge Creations';
  
  // Search for folder
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(folderName)}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const searchData = await handleDriveResponse(searchRes, 'search for folder');
  
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Directory for animated video sequences and creative assets generated via Vision Forge.'
    })
  });
  const createdFolder = await handleDriveResponse(createRes, 'create folder');
  return createdFolder.id;
};

// Upload a base64 asset or blob to the specified Google Drive folder
export const uploadFileToDrive = async (
  token: string,
  fileName: string,
  mimeType: string,
  base64OrBlobUrl: string
): Promise<{ id: string; webViewLink: string }> => {
  const folderId = await getOrCreateFolder(token);
  
  let base64Data = '';
  
  if (base64OrBlobUrl.startsWith('data:')) {
    base64Data = base64OrBlobUrl.split(',')[1];
  } else if (base64OrBlobUrl.startsWith('blob:')) {
    // Read blob to base64
    const res = await fetch(base64OrBlobUrl);
    const blob = await res.blob();
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    throw new Error('Unsupported asset URL format. Must be a Blob or Data URL.');
  }

  const metadata = {
    name: fileName,
    mimeType: mimeType,
    parents: [folderId]
  };

  // Construct multipart/related request body
  const boundary = 'vf_boundary_delimiter';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const bodyData = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    `Content-Type: ${mimeType}\r\n`,
    'Content-Transfer-Encoding: base64\r\n\r\n',
    base64Data,
    closeDelim
  ], { type: `multipart/related; boundary=${boundary}` });

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,thumbnailLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: bodyData
  });

  return handleDriveResponse(uploadRes, 'upload file to Drive');
};

// List files inside our custom 'Vision Forge Creations' folder
export const listDriveFiles = async (token: string): Promise<any[]> => {
  const folderId = await getOrCreateFolder(token);
  
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,mimeType,webViewLink,thumbnailLink,createdTime,size)&orderBy=createdTime desc`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await handleDriveResponse(res, 'list Drive files');
  return data.files || [];
};

// Delete file from Google Drive (Requires explicit confirmation before calling this)
export const deleteDriveFile = async (token: string, fileId: string): Promise<void> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Failed to delete file from Drive');
  }
};
