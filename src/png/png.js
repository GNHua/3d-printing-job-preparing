'use strict';

const constants = require('./constants.js');
const CrcStream = require('./crc.js');
const filter = require('./filter-pack.js');
const zlib = require('zlib');
const fs = require('fs');

function _packChunk(type, data) {

  let len = (data ? data.length : 0);
  let buf = Buffer.allocUnsafe(len + 12);

  buf.writeUInt32BE(len, 0);
  buf.writeUInt32BE(type, 4);

  if (data) {
    data.copy(buf, 8);
  }

  buf.writeInt32BE(CrcStream.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
  return buf;
};

function packIHDR(width, height) {

  let buf = Buffer.allocUnsafe(13);
  buf.writeUInt32BE(width, 0);
  buf.writeUInt32BE(height, 4);
  buf[8] = 8; // Bit depth
  buf[9] = 0; // colorType 0: grayscale
  buf[10] = 0; // compression
  buf[11] = 0; // filter
  buf[12] = 0; // interlace

  return _packChunk(constants.TYPE_IHDR, buf);
};

function packIDAT(data) {
  return _packChunk(constants.TYPE_IDAT, data);
};

function packIEND() {
  return _packChunk(constants.TYPE_IEND, null);
};

function filterData(data, width, height) {

  // filter pixel data
  let colorType = 0; // grayscale
  let bpp = constants.COLORTYPE_TO_BPP_MAP[colorType];
  let filteredData = filter(data, width, height, bpp);
  return filteredData;
}

// save grayscale png
function save(fn, data, width, height) {

  let chunks = [];
  
  chunks.push(Buffer.from(constants.PNG_SIGNATURE));
  chunks.push(packIHDR(width, height));

  var filteredData = filterData(data, width, height);

  // compress it
  var compressedData = zlib.deflateSync(
    filteredData, 
    {
      chunkSize: 32 * 1024,
      level: 9,
      strategy: 3
    }
  );
  filteredData = null;

  if (!compressedData || !compressedData.length) {
    throw new Error('bad png - invalid compressed data response');
  }
  chunks.push(packIDAT(compressedData));
  // End
  chunks.push(packIEND());

  let pngCompletedData = Buffer.concat(chunks);
  fs.writeFileSync(fn, pngCompletedData);
}

module.exports = {
  save: save
};