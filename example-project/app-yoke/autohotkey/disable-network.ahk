#SingleInstance, Force
SendMode Input
SetWorkingDir, %A_ScriptDir%
#+n::
    name = %A_ScriptName%

    url := "http://localhost:3000/network?false"
    url := StrReplace(url,".ahk","")
    url := StrReplace(url,".exe","")

    objWebRequest := ComObjCreate("WinHttp.WinHttpRequest.5.1")
    objWebRequest.Open("GET", url)
    objWebRequest.Send()