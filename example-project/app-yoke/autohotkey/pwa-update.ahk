#SingleInstance, Force
SendMode Input
SetWorkingDir, %A_ScriptDir%
#^u::
    name = %A_ScriptName%
    path =
    url := "http://localhost:3000/step-file?" . A_ScriptName . ".txt"
    url := StrReplace(url,".ahk","")
    url := StrReplace(url,".exe","")

    objWebRequest := ComObjCreate("WinHttp.WinHttpRequest.5.1")
    objWebRequest.Open("GET", url)
    objWebRequest.Send()