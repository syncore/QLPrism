QLPrism v4.39 README / HELP
by syncore <syncore@qlprism.us>
http://www.qlprism.us

-> Need more help?
-> http://www.qlprism.us/forum
-> http://www.qlprism.us/faq/
-> PM syncore on irc.quakenet.org or irc.gamesurge.net

Thank you for installing QLPrism!

[ Common Configuration Errors for QLPrism ]
--------------------------------------------

----> *** IMPORTANT*** Windows 7/Vista Users: IF YOU HAVE UAC (User Account Control) ENABLED, DO NOT INSTALL QLPRISM TO
PROGRAM FILES OR PROGRAM FILES (X86) -- IT WILL INSTALL, WILL FUNCTION PROPERLY. PLEASE INSTALL TO C:\ OR ANOTHER LOCATION INSTEAD! ***

----> Windows XP Users: "This application has failed to start because the application
configuration is incorrect. Reinstalling the application may fix this program."

-> How to fix: Download the proper Microsoft Visual C++ Redistributable from Microsoft at:
http://www.microsoft.com/download/en/confirmation.aspx?id=5582

----> Windows 7/Vista Users: "The application has failed to start because its
side-by-side configuration is incorrect. Please see the application event log
for more detail."

-> How to fix: Download the proper Microsoft Visual C++ Redistributable from Microsoft at:
http://www.microsoft.com/download/en/confirmation.aspx?id=5582

----> Norton Internet Security and other Firewalls/Anti-virus software:

[ Special Thanks and Credit To ]
------------------------------------

-> Mozilla Labs (for writing Prism)

-> Jason Miller (for writing the original url input code)

-> wn (for generally being the a tremendous help with this whole project, bugfixing, and for awesome QL user scripts
such as: the alternative server browser, new QLRanks Display script, new url code, QL Streams script,
qlprism:// link script, friendlist sorter script, background changer script)

-> flugsio (for the original Quake Live Pro Auto Invite script)

-> Sean Cline (for the updated pro invite script)

-> uzz (for the adskip script)

-> aiken (for the quakelive gametype switcher script)

-> Lam (for the extended stats script)

-> kry (for the linkify plus for quakelive script)

-> Drayan (for the QL Friend Commands and QL Message Beep scripts)

-> simonov (for qlping script, for original implementation of QL ELO Announcer)

-> rahzei (for the player status script)

-> fusen (for the anti-idle script)

-> szr (for the original QLRanks ELO script)

-> xambro (for the extended stats script)

-> peol (for QLDP)

-> the chatzilla team (for the IRC client)

-> rul3x (for the quakelive in-game friend commands script)

-> Sebastian Tschan (for secure login)

-> zipper (for testing)

-> Fi (for testing)

-> swampy (for promoting)

-> O`gibz (for testing)

-> Nimrod (for promoting)

-> ESReality community

-> QL Forums

-> People who report bugs

-> Anyone who uses and promotes QLPrism

-> id software for making Quake, of course

[ QLPrism Changelog ]
-----------------------------------
--> Version 4.40 (08/02/2013)

* (Linux/Windows): Several bug fixes

* (Linux/Windows): qlping updated, refresh button re-added to server browser

--> Version 4.39 (07/13/2013)

* (Linux/Windows): qlprism://#!join URLs no longer result in 'unable to load profile' error on QL site

* (Linux/Windows): The server browser will now show your ping to the server. You can also get a list of your pings to all locations
by selecting the 'Locations' menu on the server browser. You can share your ping list in-game using the "-", "+", and "\" keys. You can
send a list of your pings to your friend by right-clicking his name on the QL friends list and selecting 'send my locations.' Huge thanks to
simonov for developing this functionality.

* (Linux/Windows): New QL community addon: displays status of upcoming European and North American FACEIT tournaments, current live QL twitch.tv
streams (replaces QL Stream Notifier, however this script is still included but not enabled by default), ESR community news. Automatically updates
every 10 minutes or on-demand by right clicking news bar and selecting 'refresh'

* (Linux/Windows): URL input is now handled by browser itself, no additional script needed (QLPrism Location Utility script removed). URL input also supports
pasting of qlprism:// urls.

* (Windows): QLRanks Demo Uploader included, can be launched from QLPrism. Used for uploading demos to http://www.qlranks.com/demo/
(for more info, see: http://www.esreality.com/post/2435243/qlranks-com-demo-uploading/)

* (Windows): QLPrism Config Utility removed, previous options such as auto-launch IRC, minimize to tray are now accessible from QLPrism options menu (these two
options are also now available in Linux as well). Remaining options for Steam/XFire are now located in 'QLPrism Steam/XFire Utility'

* (Windows): Two executables in QLPrism directory: quakelive.exe to launch QL with normal priority (default), quakelive-highpriority.exe to launch QL with high priority (may fix some
lag issues for some users, was previously located in now-removed QLPrism config utility)

* (Linux/Windows): Changed default friend list message 'beep' sound to something more pleasant

* (Linux/Windows): Added menu for 1-click QLRanks Elo updating through QLM bot

* (Linux/Windows): Users may now clear cache

* (Linux/Windows): Added #ctfpickup (playquake) team info script

* (Linux/Windows): IRC client disappearing scrollbar bug fixed

* (Linux/Windows): complete re-theme of GUI for more unified look

* Launched #qlprism IRC channel and web forums at http://www.qlprism.us/forum

* New website designed by INCubus from http://www.tds-designs.net/ has been launched. Much thanks to Ted for the great work!

--> Version 4.38 (02/13/2013)

* (Linux/Windows): Added ability to quickly log into and log out from (multiple) accounts when password has been saved in QLPrism. Click the new lightning icon for more information.
					Thank you to Sebastian Tschan for the original extension (Secure Login) that has now been modified to provide this functionality specifically for QuakeLive

* (Linux/Windows): Added (very basic!) support for my Quake Live Messenger (QLM) relay system. Click the 'QLM' button above the server browser for more information & to add "QLM" to your QL friends list to use the system.

			** Please visit http://qlm.qlprism.us for the full command list and information on how to use this system! **

			In short, QLM is a messenger bot that allows you to:

			Advertise that you're looking for a duel (sends message with your current server & ELO information to multiple QuakeNet IRC channels and online QLM users)
			Advertise that your clan is looking for a TDM clan match (sends message with your server, your ELO and the average of your clan's ELO) to multple QuakeNet channels and QLM users
			Send messages from the chatbox on the QL website or from in-game (/tell_buddy) to multiple QuakeNet IRC channels or to a single channel as well as all other users who use QLM
			Send messages from IRC to in-game players who also use QLM
			Send a message from one QuakeNet IRC channel to all other channels that the QLM bot is in

* (Linux/Windows): Status bar can be toggled by pressing F2 key or clicking "-" icon on status bar.

* (Linux/Windows): Clicking the scroll wheel now has the same effect as CTRL+V (pasting)

* (Linux/Windows): Added 'Linkify for Plus for Quake Live' script that creates clickable links in QL chat (thanks kry)

* (Linux/Windows): Added Quake Live In-game Friends Commands script, which adds the following new console commands:
		/friends - Lists online friends and shows if they are ingame or not.
		/show friend - Shows short info about your friend and info about game he/she is in.
		/join friend - Join friends game.

* (Linux/Windows): Added updated version of Quake Live Extended Stats script (thanks Lam)

* (Linux/Windows): Removed a couple outdated/buggy scripts

* (Linux/Windows): QLPrism may now use slightly less memory on many systems

* (Linux/Windows): Minor visual improvements and a few new icons. Minor re-skinning of IRC theme. It now uses QL's in-game font and is bigger than old font for improved readability. To use the old theme instead, use the QLPrism Configuration utility.

* (Windows): Added option to QLPrism Config Utility to fix "QLPrism is already running" error


--> Version 4.37 (08/02/2012)

* (Windows): Updated xulrunner

* (Windows): Added option to QLPrism installer to install a script (QLRanks ELO Announcer originally by simonov) that displays ELO while in game,
	if installed, in a Quake Live server hit the "[" key to display ELO, hit the "]" key to change how ELO is displayed (echo, print, say, say_team)

* (Linux/Windows): Fixed '404 page not found' bug when viewing profiles from buddy list

* (Linux/Windows): Minor visual changes

* (Linux/Windows): Added separate button to change user script options (right click flask icon next to lightbulb in bottom right corner of Prism window)

* (Linux/Windows): Added new Quake Live console commands via Drayan's QL Friend Command script, new commands are:
	/invite Invites someone to the current match
	/addfriend Sends a friend invite or accepts an incoming invite by name
	/pending Lists incoming friend invites that you haven't accepted
	/accept Accepts an invite from the /pending list
	/clans Lists clans you are in
	/clantag Changes your on-site clantag to one of the clans listed in /clans

* (Linux/Windows): A sound will now be played when you receive a web message on the QL site via Drayan's QL Message Beep script

* (Linux/Windows): Added ability to change the background on the QL website through wn's QL Background Changer script

* (Linux/Windows):  Included rahzei's updated Quake Live Player Status script


--> Version 4.36 (04/30/2012)

* (Linux/Windows): Updated xulrunner

* (Linux): Fixed to support QL Update Apr 30, 2012 (1.0.520 plugin)

* (Windows): Added option to install/re-install QL Plug-in (1.0.520) from installer for those with problems updating or without QL

* (Windows): Minor file clean-ups, etc.

--> Version 4.35 (03/05/2012)

* (Linux/Windows): Updated xulrunner

* (Linux/Windows): Included wn's script for alphabetical names for friends list

* (Linux/Windows): Changed pro-autoinvite script to Sean Cline's updated version

* (Linux/Windows): Minor speed/memory tweaks

--> Version 4.34 (12/20/2011)

* (Linux/Windows): Added "qlprism://" link support. QLPrism now displays short QL server links that
can be launched directly in QLPrism from the included IRC client by clicking the qlprism:// link (in Windows) or
by CTRL-clicking or MWHEEL-clicking the link (in Linux). QLPrism server links are also now supported in mIRC.
The QLPrism installer will tell you how to enable qlprism:// links in mIRC, but it is actually very easy: after installation,
load mIRC and type: "/load -rs C:\windows\qlprism" without the quotes. If you installed windows to some location other than
C:\windows then change the command to that location. These links may also be launched from the Run menu on the Windows Start menu,
but the main focus of this feature is IRC and pickup game channels, etc. Due to a limitation of the QL page itself, it is advised
that you remain logged into the site when clicking qlprism:// urls. If you are not logged in, then the site will ask you to
login and will only direct you to the server browser, not the "join game" info page. Again, this is a problem with the QL site itself
and it also occurs in ALL web browsers and with regular http://www.quakelive.com URLs when the user is not logged in.

* (Windows): Included a simple configuration utility that allows the user to change certain QLPrism settings without
having to edit messy config files or reinstall. A shortcut is in the QLPrism start menu folder and the file
("qlprism-config.exe") is located in the QLPrism installation directory. With this utility, users can:
re-enable XFire support after XFire updates, change IRC auto-start settings, force Quake Live to run at High
or Normal priority (may fix sensitivity and fps drops for some users), change the icon options for the
system tray/taskbar, and launch Steam to add QLPrism to the games library.

* (Linux/Windows): Included aiken's QL Gametype Switcher Script

* (Linux/Windows): Included wn's script that displays the qlprism:// server links by clicking the link icon
in the server browser and on various other parts of the Quake Live page

* (Linux/Windows): Included the fixed version of Lam's "Quake Live Window Mode Extender" script (thanks, wn)

* (Linux): Updated xulrunner

* (Windows): Potential mouse sensitivity/accel bug-fix from 12/05/2011 also included by default

--> Version 4.33 bugfix (12/05/2011)
* (Windows): Addressed possible mouse sensitivity bug on some systems - version number remains the same

--> Version 4.33 (11/29/2011)
* (Windows/Linux:): Updated xulrunner
* (Windows): Re-worked how QLPrism launches. Now users may launch directly from "quakelive.exe" in QLPrism directory.
* (Windows): Removed old updater & implemented automatic notifcation of QLPrism updates. Now we automatically
check for program update on startup, no more separate shortcut!
* (Windows): Implemented full Xfire integration without Xfire toolbar (ex: Xfire chat, status update, screenshots,
videos, music player, etc) while in game. Requires Xfire (http://www.xfire.com), which installer will
automatically detect.
* (Windows): Implemented simple Steam integration (as non-Steam game). Can now easily enable Steam overlay in-game.
Installer will detect if you have Steam.
* (Windows/Linux): Included Lam's "Quake Live Window Mode Extender" script (Adds video modes, removes white boxes, and changes window mode resolution in windowed mode)
* (Windows/Linux): Included kry's "Chat in Welcome Screen" script (shows the Quake Live chat in Welcome screen with previous chat on the right)
* (Windows/Linux): Included rahzei's fixed "Quake Live Player Status" script (now correctly displays server slots and location on friend list)


--> Version 4.32 (10/26/2011)
* Updated xulrunner
* Fixed friends list height and formatting issues
* Included wn/Live.QL's QL Stream Script
* Included Pro Invite Script (Send message to a pro user with word "invite" and receive invite to server, thanks flugsio!)
* Fixed User Script Commands (can toggle red server highlighting/icons etc. properly now)
* Updated Linux release to include new QuakeLive Plugin (released Oct. 25, 2011)
* Running QLPrism Uninstaller now completely removes QLPrism directory from hard drive

--> Version 4.31 (09/27/2011)
* Updated xulrunner to 1.9.2.24pre
* 64-bit version for Linux released
* Fixed Join & Stop Server buttons from disappearing
* Included Friend List Info Script (thanks rahzei)
* Included Weighted Accuracy Script (see: http://is.gd/qlwacc)
* Various tweaks


--> Version 4.3 (09/12/2011)
* Updated xulrunner to 1.9.2.23pre
* Added fullscreen option
* Included Mozilla network and rendering tweaks
* Added option (installer) to auto-start IRC on QLPrism launch
* Tweaks to adfilters (multi-language + google analytics)
* Appearance changes: removed top banner and condensed chatbox on QL site, halved lineheight in IRC and reduced font
* QLPrism should use 10-18 MB less ram when running in background

--> Version 4.231 (09/06/2011)
* Small bug-fix: IRC client now automatically connects to servers & join channels when launched

--> Version 4.23 (09/05/2011)
* Integrated IRC client now included (modified CZ, plus ported to Prism)
* Integrated Quake Live Demo Player now built into User's page (peol's QLDP 1.3.3 + parsing fix ported to Prism)
* Navigation UI elements reskinned and modified - no more space-consuming navbar, navigation now runs in bottom-left corner
* Extended stats script included for game details pages (displays: net frags, net damage, gauntlet frags)
* Installer now asks user if they prefer to minimize QLPrism to Windows taskbar or system tray
* Tweaks to QLPrism Updater and Installer

--> Version 4.22 (09/01/2011)
* Navigation bar further modified and now enabled by default
* Linux: permissions fixed; bash script included (thanks wolf1e)
* VERY minor program changes

--> Version 4.21 (09/01/2011)

* Updated Mozilla xulrunner to 3.6.21 runtime
* Bugfix to wn's Quake Live New Alt Browser (now 1.10 onward properly auto-updates)
* QLPrism for Linux released (get it at http://www.qlprism.us/download/)

--> Version 4.2 (08/31/2011): [major update]

* URL code completely re-written (thanks, wn!)
* QLPrism uninstaller reworked.
* QLPrism Auto Updater included!
* Other installer issues addressed.
* Greasemonkey 'User Script Commands' menu now works.
* Prism version of QLRanks.com display script merged with wn's official version,
and will auto-update with latest version from userscripts.org now.

--> Version 4.10 (08/30/2011):

* Included wn's fixed QLRanks.com Display script.
* Future updates to this script will be pushed to you automatically without having to re-DL QLPrism

--> Version 4.09 (08/30/2011):

* Modified new QLRanks.com Display script by wn to automatically update
* Launching quakelive.exe w/o using shortcut now returns an error popup
* Fixed installer start menu issue for non-English speaking users

--> Version 4.07 (08/30/2011):

* Updated Prism User Agent from Prism 1.0b4 to reflect Firefox 6.0,
* Added new QLRanks.com Display script by wn [still has problems / under development]

--> Version 4.06 (08/26/2011):

* Added QLRanks.com Greasemonkey Script by szr

--> Version 4.05 (08/22/2011):

* Updated Mozilla Xulrunner to 3.6.20

--> Version 3.0 (08/18/2011):

* Added additional Greasemonkey scripts

--> Version 2.0 (08/16/2011):

* Fixed installer issues.
* Implemented URL input feature (courtesy of Jason Miller)

--> Version 1.0 (08/13/2011): Initial release


eof -- http://www.qlprism.us