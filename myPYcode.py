import yuag

try:
    from moviepy.editor import VideoFileClip, concatenate_videoclips, TextClip, CompositeVideoClip
    yuag.saveFile("error", "Errors.txt")
    # الكود الخاص بك هنا
except Exception as error:
    yuag.saveFile(str(error), "Errors.txt")
