stdout := FileOpen("*", "w")

if WinWait(A_Args[1], ,10){
    WinActivate A_Args[1]
    loadingColors := getCurrentClrs()

    for n, param in A_Args {
        WinActivate param
        nowColors := getCurrentClrs()

        while checkMatch(loadingColors, nowColors) {
            nowColors := getCurrentClrs()
    }}

    stdout.WriteLine("loaded")
} else {
    stdout.WriteLine("timeout")
}

stdout.Read(0)

getCurrentClrs() {
    return [PixelGetColor(679, 248), PixelGetColor(423, 270)]
}

checkMatch(clr1, clr2) {
    loop clr1.Length {
        if clr1[A_Index] != clr2[A_Index] {
            return False
        }
    }
    return True
}