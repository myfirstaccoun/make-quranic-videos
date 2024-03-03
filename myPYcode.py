import yuag
yuag.clear()

if __name__ == "__main__":
    # حفظ المقطع ك نصّ dataurl
    yuag.saveFile(yuag.readFile("./dynamic files/captions.txt"), "./dynamic files/result.txt")

yuag.doneMessage(0)
