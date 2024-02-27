import time
import os
import base64

def wait(wait_time: int = 1):
    time.sleep(wait_time)

def clear():
    os.system("cls")

def saveFile(data, file_path: str, encoding: str = "utf-8", save_mode = "w"):
    with open(file_path, save_mode, encoding=encoding) as output_file:
        output_file.write(data)

def readFile(file_path: str, errorAs = 404, errorOnly: int = 0, encoding: str = "utf-8"):
    try:
        with open(file_path, 'r', encoding=encoding) as file:
            data = file.read()
            return data
    except Exception as error:
        if errorOnly == 0:
            return errorAs
        else:
            return error

def videoFile_to_dataurl(video_path, error = 404):
    try:
        # قراءة ملف الفيديو كتسلسل بيانات
        with open(video_path, "rb") as video_file:
            video_data = video_file.read()

        # تحويل التسلسل إلى base64
        video_base64 = base64.b64encode(video_data)

        # إنشاء Data URL
        data_url = "data:video/mp4;base64," + video_base64.decode('utf-8')

        return data_url
    except:
        return error

def doneMessage(want_clear: int = 1):
    if want_clear > 0: clear()
    print("Done.. Alhamdulillah")