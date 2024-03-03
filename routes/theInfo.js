const express = require("express");
const router = express.Router();
const fs = require('fs').promises;
const { exec } = require('child_process');

let jsonData = {};

function loadData(res = "") {
    // fs.readFile('./بايثون/users.json', 'utf8')
    // .then(data => {
        // console.log("Finished loading data Alhamdulillah.");
        // jsonData = JSON.parse(data);
        // res.render("all", { your_data: jsonData });
        // إرسال البيانات إلى الصفحة بعد الانتهاء من البرنامج البايثون
        // resolve();
    // })
    
    // try {
    //     // Promise للانتظار حتى انتهاء البرنامج البايثون وقراءة الملف JSON
    //     const dataPromise = new Promise(async (resolve, reject) => {
    //         console.log("Loading data..");
    //         exec('python ./بايثون/myPYcode.py', (error, stdout, stderr) => {
    //             if (error) {
    //                 console.error('Error:', error);
    //                 reject(error);
    //                 return;
    //             }
                
    //             // قراءة محتوى ملف JSON بعد انتهاء البرنامج البايثون
    //             fs.readFile('./بايثون/users.json', 'utf8')
    //             .then(data => {
    //                 console.log("Finished loading data Alhamdulillah.");
    //                 jsonData = JSON.parse(data);
    //                 // res.render("all", { your_data: jsonData });
    //                 // إرسال البيانات إلى الصفحة بعد الانتهاء من البرنامج البايثون
    //                 resolve();
    //             })
    //                 .catch(error => reject(error));
    //         });
    //     });
    // } catch (error) {
    //     // console.error('Error:', error);
    //     console.error('Error 404');
    //     // loadData();
    //     // res.status(500).send('<h1>تأكد من اتصالك بالشبكة</h1>');
    // }
}

loadData();
router.get("/", (req, res) => {
    res.redirect("/all");
});
