import yuag
from moviepy.editor import VideoFileClip, concatenate_videoclips, TextClip, CompositeVideoClip
yuag.clear()

input_file_path = yuag.readFile("./dynamic files/video path.txt")
reader_name = yuag.readFile("./dynamic files/reader name.txt")
output_file_path = "./dynamic files/result.mp4"
text_color = "rgb(223, 189, 0)"
text_bg_color = "rgba(71, 71, 71, 0.692)"
font = "Courier"
font_size = 30
text_width = 1
text_position = ('center', 'bottom')
method = "caption"

def time_to_seconds(time_str): # 00:01:30 ==> 90 ثانية
    # تقسيم الساعات، الدقائق، والثواني
    hours, minutes, seconds = map(float, time_str.split(':'))
    
    # حساب الثواني الإجمالية
    total_seconds = hours * 3600 + minutes * 60 + seconds
    return total_seconds

def get_ind(arr, search): # [ "abc", "def", "gai" ], "a" ==> [0, 2]
    res = []

    for i, item in enumerate(arr):
        if search in item:
            res.append(i)
    
    return res

def toObj(text): # 00:00:00/00:00:05 hello ==> [ {"text": "hello", "start": 0, "end": 5} ]
    res = []

    for line in text.split("\n"):
        line_parts = line.split(" ")
        if len(get_ind(line_parts, ":")) > 0:
            obj_text = " ".join(line_parts[1:])  # النص
            
            start_end_parts = line_parts[0].split("/")
            obj_start = time_to_seconds(start_end_parts[0])  # بداية النص
            obj_end = time_to_seconds(start_end_parts[1])  # نهاية النص

            res.append({"text": obj_text, "start": obj_start, "end": obj_end})

    return res

def get_duration(video=None):
    if video == None:
        video = VideoFileClip(input_file_path)
    
    return video.duration

def add_text(text_arr, video_path=input_file_path, output_file_path=output_file_path, text_color=text_color, text_bg_color=text_bg_color, text_width=text_width, font=font, font_size=font_size, auto_width = False, text_position=text_position, method=method, video=None):
    if video == None:
        # تحميل مقطع مقطع
        video = VideoFileClip(video_path)
    
    video_width, video_height = video.size

    # إضافة النص إلى المقطع الأصلي
    for item in text_arr:
        text = item["text"]
        start = item["start"]
        end = item["end"]

        if auto_width == True:
            txt_clip = TextClip(text, fontsize=font_size, color=text_color, bg_color=text_bg_color, method=method, size=(None, None), font=font).set_position(text_position).set_duration(end - start).set_start(start)
        else:
            txt_clip = TextClip(text, fontsize=font_size, color=text_color, bg_color=text_bg_color, method=method, size=(video_width*text_width, None), font=font).set_position(text_position).set_duration(end - start).set_start(start)
        
        # دمج النص مع مقطع الأصلي
        video = CompositeVideoClip([video, txt_clip])
    
    return video

if __name__ == "__main__":
    captions = yuag.readFile("./dynamic files/captions.txt")
    video = add_text(toObj(captions))
    video = add_text([{"text": reader_name, "start": 0, "end": get_duration()}], text_position=("right", "top"), auto_width=True, video=video, method="label")
    # IMAGEMAGICK_BINARY = r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\ImageMagick-7.1.1-28-Q16-HDRI-x64-dll.exe"

    # حفظ المقطع بالنص المضاف
    video.write_videofile(output_file_path)

    # تحرير الموارد
    video.close()

    # حفظ المقطع ك نصّ dataurl
    yuag.saveFile(yuag.videoFile_to_dataurl(output_file_path), "./dynamic files/result.txt")

yuag.doneMessage(0)
