#include <windows.h>  //You need shell32.lib for this one 
#include "winsparkle.h"

HINSTANCE g_hInstance;
HWND g_hwndMain;

void OnDestroy(HWND hwnd)
{
    /* Perform proper shutdown of WinSparkle. Notice that it's done while
       the main window is still visible, so that the app doesn't do 
       things when it appears to have quit already. */
    win_sparkle_cleanup();

    PostQuitMessage(0);
}

int WINAPI WinMain(HINSTANCE inst,HINSTANCE prev,LPSTR cmd,int show)
{
win_sparkle_set_appcast_url("http://www.qlprism.us/update/qlpupdate.xml");
win_sparkle_init();

char szPath[] = "xul\\quakelive.exe";

  HINSTANCE hRet = ShellExecute(
        HWND_DESKTOP, //Parent window
        "open",       //Operation to perform
        szPath,       //Path to program
        " application.ini -profile ql\\data -override ql\\settings\\override.ini -webapp ql\\settings",         //Parameters
        NULL,         //Default directory
        SW_SHOW);     //How to open

  /*
  The function returns a HINSTANCE (not really useful in this case)
  So therefore, to test its result, we cast it to a LONG.
  Any value over 32 represents success!
  */

  if((LONG)hRet <= 32)
  {
    MessageBox(HWND_DESKTOP,"Unable to start program","",MB_OK);
    return 1;
  }

  return 0;

}