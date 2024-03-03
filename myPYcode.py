import yuag
yuag.clear()

try:
    from moviepy.editor import VideoFileClip, concatenate_videoclips, TextClip, CompositeVideoClip
    # الكود الخاص بك هنا
except Exception as error:
    yuag.saveFile(str(error), "Errors.txt")

yuag.doneMessage(0)
