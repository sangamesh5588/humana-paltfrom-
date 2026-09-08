const fs = require('fs');
const zlib = require('zlib');

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function writeInt32(buf, val, offset) {
  buf.writeUInt32BE(val, offset);
}

const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

const ihdrData = Buffer.alloc(13);
writeInt32(ihdrData, 1, 0); 
writeInt32(ihdrData, 100, 4); 
ihdrData[8] = 8; 
ihdrData[9] = 6; 
ihdrData[10] = 0; 
ihdrData[11] = 0; 
ihdrData[12] = 0; 

const ihdrChunk = Buffer.alloc(4 + 4 + 13 + 4);
writeInt32(ihdrChunk, 13, 0); 
ihdrChunk.write('IHDR', 4);
ihdrData.copy(ihdrChunk, 8);
const ihdrCRC = crc32(ihdrChunk.slice(4, 21));
writeInt32(ihdrChunk, ihdrCRC, 21);

const rawData = Buffer.alloc(100 * 5);
for (let i = 0; i < 100; i++) {
  const offset = i * 5;
  rawData[offset] = 0; 
  rawData[offset + 1] = 0xFF; 
  rawData[offset + 2] = 0xFF; 
  rawData[offset + 3] = 0xFF; 
  // Custom quadratic alpha curve for smooth white fade
  const alpha = Math.round(Math.pow(i / 99, 1.8) * 255);
  rawData[offset + 4] = alpha;
}

const compressed = zlib.deflateSync(rawData);
const idatChunk = Buffer.alloc(4 + 4 + compressed.length + 4);
writeInt32(idatChunk, compressed.length, 0);
idatChunk.write('IDAT', 4);
compressed.copy(idatChunk, 8);
const idatCRC = crc32(idatChunk.slice(4, 8 + compressed.length));
writeInt32(idatChunk, idatCRC, 8 + compressed.length);

const iendChunk = Buffer.alloc(12);
writeInt32(iendChunk, 0, 0);
iendChunk.write('IEND', 4);
writeInt32(iendChunk, 0xAE426082, 8);

const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
const base64 = png.toString('base64');
console.log('data:image/png;base64,' + base64);
