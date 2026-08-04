import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrl = 'https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg';
const destPath = path.join(__dirname, '..', 'public', 'hero-source.jpg');

const file = fs.createWriteStream(destPath);

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(imageUrl, options, (response) => {
  if (response.statusCode === 301 || response.statusCode === 302) {
    // Handle redirect
    https.get(response.headers.location, options, (redirectResponse) => {
      redirectResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download completed successfully via redirect: ' + destPath);
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download completed successfully: ' + destPath);
    });
  }
}).on('error', (err) => {
  fs.unlink(destPath, () => {});
  console.error('Error downloading file: ', err.message);
});
