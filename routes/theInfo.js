const express = require("express");
const router = express.Router();
const fs = require('fs').promises;
const { exec } = require('child_process');
const { spawn } = require('child_process');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // حدد مجلد لتخزين الملفات المرفوعة
// const streamToPromise = require('stream-to-promise');

let jsonData = {};

// اعداد ملف الترجمة
let read_file_path = "Quran_sp.json";
function loadData() {
    const dataPromise = new Promise(async (resolve, reject) => {
        fs.readFile(read_file_path, 'utf8')
        .then(data => {
            console.log("Finished loading data Alhamdulillah.");
            jsonData = JSON.parse(data);
            jsonData = JSON.stringify(jsonData).split("`").join("");

            // إرسال البيانات إلى الصفحة بعد الانتهاء من البرنامج البايثون
            resolve();
        })
            .catch(error => reject(error));
    });
    
    exec('python "init lib.py"', (error, stdout, stderr) => {
        if (error) {
            console.error(`خطأ: ${error.message}`);
            return;
        }
        
        if (stderr) {
            console.error(`خطأ قيد التنفيذ: ${stderr}`);
            return;
        }
        
        console.log(`الناتج: ${stdout}`);
    });
}

// إعادة توجيه الصفحة
loadData();
router.get("/", (req, res) => {
    res.redirect("/all");
});

// ارسال ملف الترجمة
router.get("/all", async (req, res) => {
    res.render("all", { your_data: jsonData });
});

// وضع الملف الذي وضعه المستخدم في مجلد وحفظ مساره
let filePath = "";
router.post('/upload', upload.single('videoFile'), (req, res) => {
    // req.file يحتوي على معلومات الملف المرفوع
    filePath = req.file.path;
    console.log(filePath);

    // إرسال استجابة بنجاح
    res.status(200).send("تم رفع المقطع بنجاح.");
});

// تعديل المقطع الذي رفعه المستخدم
router.post("/make-video", (req, res) => {
    // عمل ملف التسميات التوضيحية للآيات
    fs.writeFile("./dynamic files/captions.txt", req.body.page_data[0], (err) => {
        if (err) {
            console.error('حدث خطأ أثناء كتابة الملف:', err);
            return;
        }
        console.log('تم عمل ملف التسميات التوضيحية للآيات');
    });
    
    // حفظ مسار المقطع الذي رفعه المستخدم
    fs.writeFile("./dynamic files/video path.txt", filePath, (err) => {
        if (err) {
            console.error('حدث خطأ أثناء كتابة الملف:', err);
            console.log('حدث خطأ أثناء كتابة الملف:', err);
            return;
        }
        console.log('تم حفظ مسار المقطع الذي رفعه المستخدم');
        console.log("done video path.txt");
    });

    // حفظ إسم القارئ الذي كتبه المستخدم
    fs.writeFile("./dynamic files/reader name.txt", req.body.page_data[1], (err) => {
        if (err) {
            console.error('حدث خطأ أثناء كتابة الملف:', err);
            return;
        }
        console.log('تم إسم القارئ الذي كتبه المستخدم');
    });
    
    // تشغيل الشيفرة لتعديل المقطع الذي رفعه المستخدم
    console.log("loading python code");
    const pythonProcess = spawn('python', ['myPYcode.py']);
    
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        console.log("send your the_data");
    });
    
    let dataSent = false; // تحقق مما إذا تم بالفعل إرسال البيانات
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        if (!dataSent) { // التحقق مما إذا لم تكن البيانات قد تم إرسالها بالفعل
            dataSent = true; // تعيين المتغير للإشارة إلى أن البيانات قد تم إرسالها الآن
            fs.readFile("Errors.txt", 'utf8')
            .then(data => {
                // إرسال البيانات إلى الصفحة بعد الانتهاء من البرنامج البايثون
                res.json({ success: "stderr", data: data});
            })
            .catch(error => {
                console.log(error);
                res.json({ success: "stderr", error: error});
            });
        }
    });
    

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (!dataSent) { // التحقق مما إذا لم تكن البيانات قد تم إرسالها بالفعل
            dataSent = true; // تعيين المتغير للإشارة إلى أن البيانات قد تم إرسالها الآن
            fs.readFile("Errors.txt", 'utf8')
            .then(data => {
                // إرسال البيانات إلى الصفحة بعد الانتهاء من البرنامج البايثون
                res.json({ success: "Errors", data: data});
            })
            .catch(error => {
                console.log(error);
            
                fs.readFile("./dynamic files/result.txt", 'utf8')
                .then(video_data => {
                    res.json({ success: "result", data: video_data});
                })
                .catch(video_error => {
                    res.json({ success: "result error", error: error});
                });
            });
        }
    });
});

// دالة لإرسال البيانات إلى الواجهة الأمامية
async function postData(data) {
    await fetch('/receive-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });
}

module.exports = router;
