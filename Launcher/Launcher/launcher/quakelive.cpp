/*
Simple single executable launcher for QLPrism
Allows for easy Steam integration, etc.
syncore <syncore@syncore.org> - November 27, 2011
*/

#include <windows.h>
#include <stdio.h>
#include <tchar.h>
#include "winsparkle.h"

int APIENTRY WinMain(HINSTANCE hInstance,
                     HINSTANCE hPrevInstance,
                     LPSTR lpCmdLine,
                     int nCmdShow)
{
	win_sparkle_set_appcast_url("http://www.qlprism.us/update/qlpupdate.xml");
	win_sparkle_set_automatic_check_for_updates(1);

	LPSTR cmdArgs = "quakelive.exe application.ini -profile ql\\data -webapp ql\\settings -override ql\\settings\\override.ini";
	STARTUPINFO si;
  PROCESS_INFORMATION pi;
  ZeroMemory(&si, sizeof(si));
  si.cb = sizeof(si);
	ZeroMemory(&pi, sizeof(pi));

	// high priority
	//CreateProcess("xul\\quakelive.exe", cmdArgs, NULL, NULL, FALSE, HIGH_PRIORITY_CLASS, NULL, NULL, &si, &pi);

	// normal (for people complaining about sens resetting, due to high priority?)
	CreateProcess("xul\\quakelive.exe", cmdArgs, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi);
	Sleep(8000);

	win_sparkle_init();
	Sleep(35000);
	win_sparkle_cleanup();

	return 0;
}