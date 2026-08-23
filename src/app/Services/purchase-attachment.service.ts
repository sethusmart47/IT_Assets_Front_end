import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseAttachmentDto } from '../models/purchase';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseAttachmentService {

   private readonly baseUrl = `${environment.apiUrl}/PurchaseAttachment`;

  constructor(private http: HttpClient) {}

  getAll(purchaseId: string): Observable<PurchaseAttachmentDto[]> {
    return this.http.get<PurchaseAttachmentDto[]>(`${this.baseUrl}/${purchaseId}/attachments`);
  }

  upload(purchaseId: string, files: File[]): Observable<PurchaseAttachmentDto[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<PurchaseAttachmentDto[]>(`${this.baseUrl}/${purchaseId}/attachments`, formData);
  }

  getDownloadUrl(purchaseId: string, attachmentId: string): string {
    return `${this.baseUrl}/${purchaseId}/attachments/${attachmentId}/download`;
  }

  delete(purchaseId: string, attachmentId: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${purchaseId}/attachments/${attachmentId}`, { responseType: 'text' });
  }
}
