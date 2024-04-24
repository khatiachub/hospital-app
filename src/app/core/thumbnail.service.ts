// thumbnail.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  constructor() { }
  generateThumbnail(image: File, width: number, height: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                // Create a new File object with the same properties as the original image
                const thumbnailFile = new File([blob], image.name, { type: image.type, lastModified: image.lastModified });
                resolve(thumbnailFile);
              } else {
                reject(new Error('Failed to generate thumbnail blob'));
              }
            }, 'image/jpeg');
          } else {
            reject(new Error('Canvas context is null'));
          }
        };
  
        img.onerror = (error) => {
          reject(error);
        };
        
        img.src = reader.result as string;
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(image);
    });
  }
  
 
}