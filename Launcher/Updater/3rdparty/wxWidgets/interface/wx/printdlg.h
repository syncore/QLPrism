/////////////////////////////////////////////////////////////////////////////
// Name:        printdlg.h
// Purpose:     interface of wxPrintDialog
// Author:      wxWidgets team
// RCS-ID:      $Id: printdlg.h 56885 2008-11-22 00:21:10Z FM $
// Licence:     wxWindows license
/////////////////////////////////////////////////////////////////////////////

/**
    @class wxPrintDialog

    This class represents the print and print setup common dialogs.
    You may obtain a wxPrinterDC device context from a successfully dismissed
    print dialog.

    @library{wxcore}
    @category{printing}

    @see @ref overview_printing, @ref overview_cmndlg_print
*/
class wxPrintDialog : public wxDialog
{
public:
    /**
        Constructor.

        Pass a parent window, and optionally a pointer to a block of print
        data, which will be copied to the print dialog's print data.

        @see wxPrintDialogData
    */
    wxPrintDialog(wxWindow* parent, wxPrintDialogData* data = NULL);

    /**
        Destructor.

        If GetPrintDC() has not been called, the device context obtained by
        the dialog (if any) will be deleted.
    */
    virtual ~wxPrintDialog();

    /**
        Returns the device context created by the print dialog, if any.

        When this function has been called, the ownership of the device context
        is transferred to the application, so it must then be deleted
        explicitly.
    */
    virtual wxDC* GetPrintDC();

    /**
        Returns the @ref overview_printing_printdata "print dialog data" associated
        with the print dialog.
    */
    virtual wxPrintDialogData& GetPrintDialogData();

    /**
        Shows the dialog, returning @c wxID_OK if the user pressed OK, and @c
        wxID_CANCEL otherwise.

        After this function is called, a device context may be retrievable using
        GetPrintDC().
    */
    virtual int ShowModal();
};



/**
    @class wxPageSetupDialog

    This class represents the page setup common dialog. In MSW, the page setup
    dialog is standard from Windows 95 on, replacing the print setup dialog (which
    is retained in Windows and wxWidgets for backward compatibility).
    On Windows 95 and NT 4.0 and above, the page setup dialog is native to the windowing
    system, otherwise it is emulated.

    The page setup dialog contains controls for paper size (A4, A5 etc.),
    orientation (landscape or portrait), and controls for setting left, top, right
    and bottom margin sizes in millimetres.

    On Macintosh, the native page setup dialog is used, which lets you select paper
    size and orientation but it does not let you change the page margins.

    On other platforms, a generic dialog is used.

    When the dialog has been closed, you need to query the wxPageSetupDialogData
    object associated with the dialog.

    Note that the OK and Cancel buttons do not destroy the dialog; this must be done
    by the application.

    @library{wxcore}
    @category{printing}

    @see @ref overview_printing, wxPrintDialog, wxPageSetupDialogData
*/
class wxPageSetupDialog : public wxDialog
{
public:
    /**
        Constructor.

        Pass a parent window, and optionally a pointer to a block of page
        setup data, which will be copied to the print dialog's internal data.
    */
    wxPageSetupDialog(wxWindow* parent, wxPageSetupDialogData* data = NULL);

    /**
        Destructor.
    */
    virtual ~wxPageSetupDialog();

    /**
        Returns the wxPageSetupDialogData object associated with the dialog.
    */
    wxPageSetupDialogData& GetPageSetupData();

    /**
        Shows the dialog, returning @c wxID_OK if the user pressed OK, and
        @c wxID_CANCEL otherwise.
    */
    int ShowModal();
};

