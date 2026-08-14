import { db, auth, storage, doc, setDoc } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type SaveStage = 
  | 'IDLE'
  | 'AUTH_CHECK'
  | 'VALIDATION'
  | 'IMAGE_OPTIMIZATION'
  | 'STORAGE_UPLOAD'
  | 'DOWNLOAD_URL'
  | 'FIRESTORE_WRITE'
  | 'SUCCESS'
  | 'ERROR';

export interface SaveDiagnosticInfo {
  lastOperation: string;
  lastStage: SaveStage;
  lastError: string | null;
  lastPortfolioId: string | null;
  lastImageId: string | null;
  lastUploadDuration: number;
  lastFirestoreDuration: number;
  lastSuccess: boolean;
  lastFailure: boolean;
}

class CloudSaveEngineClass {
  private diagnostic: SaveDiagnosticInfo = {
    lastOperation: 'NONE',
    lastStage: 'IDLE',
    lastError: null,
    lastPortfolioId: null,
    lastImageId: null,
    lastUploadDuration: 0,
    lastFirestoreDuration: 0,
    lastSuccess: false,
    lastFailure: false
  };

  constructor() {
    if (typeof window !== 'undefined') {
      (window as any).__CONTINENTAL_SAVE_DIAGNOSTICS__ = () => this.diagnostic;
    }
  }

  public getDiagnostic() {
    return this.diagnostic;
  }

  private setStage(stage: SaveStage, opName: string) {
    this.diagnostic.lastStage = stage;
    this.diagnostic.lastOperation = opName;
    console.log(`[CloudSaveEngine] [${stage}] Operation: ${opName}`);
  }

  /**
   * Uploads an image file to Firebase Storage under portfolio/{portfolioId}/{uuid}.webp
   */
  public async uploadPortfolioImage(portfolioId: string, fileOrBlob: Blob | File): Promise<{ url: string; storagePath: string }> {
    const startTime = Date.now();
    this.setStage('AUTH_CHECK', 'UPLOAD_IMAGE');

    const user = auth.currentUser;
    if (!user) {
      console.warn('[CloudSaveEngine] Warning: auth.currentUser is null. Proceeding with public/anonymized write or check rules.');
    } else {
      console.log('[CloudSaveEngine] Auth OK. User UID:', user.uid);
    }

    this.setStage('STORAGE_UPLOAD', 'UPLOAD_IMAGE');
    const imageId = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    this.diagnostic.lastPortfolioId = portfolioId;
    this.diagnostic.lastImageId = imageId;

    const storagePath = `portfolio/${portfolioId}/${imageId}.webp`;
    const storageRef = ref(storage, storagePath);

    console.log(`[CloudSaveEngine] Starting uploadBytes to Storage path: ${storagePath}`);
    const snapshot = await uploadBytes(storageRef, fileOrBlob, {
      contentType: 'image/webp',
      cacheControl: 'public,max-age=31536000'
    });
    console.log('[CloudSaveEngine] uploadBytes success:', snapshot.metadata.fullPath);

    this.setStage('DOWNLOAD_URL', 'UPLOAD_IMAGE');
    const downloadURL = await getDownloadURL(storageRef);
    console.log('[CloudSaveEngine] getDownloadURL success:', downloadURL);

    this.diagnostic.lastUploadDuration = Date.now() - startTime;
    return { url: downloadURL, storagePath };
  }

  /**
   * Saves the entire site payload to Firestore biosite_data/main_settings with strict await confirmation
   */
  public async saveSitePayload(payload: any): Promise<boolean> {
    const startTime = Date.now();
    this.setStage('AUTH_CHECK', 'SAVE_SITE_PAYLOAD');

    try {
      this.setStage('FIRESTORE_WRITE', 'SAVE_SITE_PAYLOAD');
      const docRef = doc(db, 'biosite_data', 'main_settings');
      
      console.log('[CloudSaveEngine] Executing setDoc to biosite_data/main_settings with merge: true...');
      await setDoc(docRef, {
        ...payload,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      this.diagnostic.lastFirestoreDuration = Date.now() - startTime;
      this.diagnostic.lastSuccess = true;
      this.diagnostic.lastFailure = false;
      this.diagnostic.lastError = null;
      this.setStage('SUCCESS', 'SAVE_SITE_PAYLOAD');
      console.log('[CloudSaveEngine] Firestore save confirmed successfully!');
      return true;
    } catch (err: any) {
      console.error('[CloudSaveEngine] Firestore save failed:', err);
      this.diagnostic.lastSuccess = false;
      this.diagnostic.lastFailure = true;
      this.diagnostic.lastError = err?.message || String(err);
      this.setStage('ERROR', 'SAVE_SITE_PAYLOAD');
      throw err;
    }
  }
}

export const CloudSaveEngine = new CloudSaveEngineClass();
