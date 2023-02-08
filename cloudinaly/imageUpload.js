import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: 'dyj6wkcyd',
  api_key: '151897649882197',
  api_secret: 'RPmOCTITWyaBurHiXUpTsIXqTu8',
});

export default cloudinary;
