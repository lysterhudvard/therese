import { Buffer } from 'buffer';

const urls = [
  'https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000028-5883458837/image-crop-200000014-6.jpeg?ph=a6c2528650',
  'https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000032-c5f44c5f47/Thess0972_bw_highres.jpg?ph=a6c2528650'
];

async function run() {
  for (const url of urls) {
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());
    console.log('Size of', url, ':', buffer.length);
    // Print first 20 bytes hex to check format
    console.log(buffer.subarray(0, 20).toString('hex'));
  }
}

run();
