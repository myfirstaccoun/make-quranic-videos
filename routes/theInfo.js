const express = require("express");
const router = express.Router();
const fs = require('fs').promises;
const { exec } = require('child_process');
const { spawn } = require('child_process');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // حدد مجلد لتخزين الملفات المرفوعة
