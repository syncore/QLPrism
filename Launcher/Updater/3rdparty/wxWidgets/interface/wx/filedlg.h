/////////////////////////////////////////////////////////////////////////////
// Name:        filedlg.h
// Purpose:     interface of wxFileDialog
// Author:      wxWidgets team
// RCS-ID:      $Id: filedlg.h 62101 2009-09-24 20:36:46Z JS $
// Licence:     wxWindows license
/////////////////////////////////////////////////////////////////////////////

/**
    @class wxFileDialog

    This class represents the file chooser dialog.

    The path and filename are distinct elements of a full file pathname.
    If path is wxEmptyString, the current directory will be used.
    If filename is wxEmptyString, no default filename will be supplied.
    The wildcard determines what files are displayed in the file selector,
    and file extension supplies a type extension for the required filename.

    @remarks
    All implementations of the wxFileDialog provide a wildcard filter. Typing a filename
    containing wildcards (*, ?) in the filename text item, and clicking on Ok, will
    result in only those files matching the pattern being displayed.
    The wildcard may be a specification for multiple types of file with a description
    for each, such as:
    @code
         "BMP and GIF files (*.bmp;*.gif)|*.bmp;*.gif|PNG files (*.png)|*.png"
    @endcode
    It must be noted that wildcard support in the native Motif file dialog is quite
    limited: only one alternative is supported, and it is displayed without the
    descriptive test; "BMP files (*.bmp)|*.bmp" is displayed as "*.bmp", and both
    "BMP files (*.bmp)|*.bmp|GIF files (*.gif)|*.gif" and "Image files|*.bmp;*.gif"
    are errors.

    @beginStyleTable
    @style{wxFD_DEFAULT_STYLE}
           Equivalent to wxFD_OPEN.
    @style{wxFD_OPEN}
           This is an open dialog; usually this means that the default
           button's label of the dialog is "Open". Cannot be combined with wxFD_SAVE.
    @style{wxFD_SAVE}
           This is a save dialog; usually this means that the default button's
           label of the dialog is "Save". Cannot be combined with wxFD_OPEN.
    @style{wxFD_OVERWRITE_PROMPT}
           For save dialog only: prompt for a confirmation if a file will be
           overwritten.
    @style{wxFD_FILE_MUST_EXIST}
           For open dialog only: the user may only select files that actually exist.
    @style{wxFD_MULTIPLE}
           For open dialog only: allows selecting multiple files.
    @style{wxFD_CHANGE_DIR}
           Change the current working directory to the directory where the
           file(s) chosen by the user are.
    @style{wxFD_PREVIEW}
           Show the preview of the selected files (currently only supported by
           wxGTK).
    @endStyleTable

    @library{wxcore}
    @category{cmndlg}

    @see @ref overview_cmndlg_file, ::wxFileSelector()
*/
class wxFileDialog : public wxDialog
{
public:
    /**
        Constructor. Use ShowModal() to show the dialog.

        @param parent
            Parent window.
        @param message
            Message to show on the dialog.
        @param defaultDir
            The default directory, or the empty string.
        @param defaultFile
            The default filename, or the empty string.
        @param wildcard
            A wildcard, such as "*.*" or "BMP files (*.bmp)|*.bmp|GIF files (*.gif)|*.gif".
            Note that the native Motif dialog has some limitations with respect to
            wildcards; see the Remarks section above.
        @param style
            A dialog style. See wxFD_* styles for more info.
        @param pos
            Dialog position. Not implemented.
        @param size
            Dialog size. Not implemented.
        @param name
            Dialog name. Not implemented.
    */
    wxFileDialog(wxWindow* parent,
                 const wxString& message = wxFileSelectorPromptStr,
                 const wxString& defaultDir = wxEmptyString,
                 const wxString& defaultFile = wxEmptyString,
                 const wxString& wildcard = wxFileSelectorDefaultWildcardStr,
                 long style = wxFD_DEFAULT_STYLE,
                 const wxPoint& pos = wxDefaultPosition,
                 const wxSize& size = wxDefaultSize,
                 const wxString& name = wxFileDialogNameStr);

    /**
        Destructor.
    */
    virtual ~wxFileDialog();

    /**
        Returns the default directory.
    */
    virtual wxString GetDirectory() const;

    /**
        If functions SetExtraControlCreator() and ShowModal() were called,
        returns the extra window. Otherwise returns @NULL.

        @since 2.9.0
    */
    wxWindow* GetExtraControl() const;

    /**
        Returns the default filename.
    */
    virtual wxString GetFilename() const;

    /**
        Fills the array @a filenames with the names of the files chosen.

        This function should only be used with the dialogs which have @c wxFD_MULTIPLE style,
        use GetFilename() for the others.

        Note that under Windows, if the user selects shortcuts, the filenames
        include paths, since the application cannot determine the full path
        of each referenced file by appending the directory containing the shortcuts
        to the filename.
    */
    virtual void GetFilenames(wxArrayString& filenames) const;

    /**
        Returns the index into the list of filters supplied, optionally, in the
        wildcard parameter.

        Before the dialog is shown, this is the index which will be used when the
        dialog is first displayed.

        After the dialog is shown, this is the index selected by the user.
    */
    virtual int GetFilterIndex() const;

    /**
        Returns the message that will be displayed on the dialog.
    */
    virtual wxString GetMessage() const;

    /**
        Returns the full path (directory and filename) of the selected file.
    */
    virtual wxString GetPath() const;

    /**
        Fills the array @a paths with the full paths of the files chosen.

        This function should only be used with the dialogs which have @c wxFD_MULTIPLE style,
        use GetPath() for the others.
    */
    virtual void GetPaths(wxArrayString& paths) const;

    /**
        Returns the file dialog wildcard.
    */
    virtual wxString GetWildcard() const;

    /**
        Sets the default directory.
    */
    virtual void SetDirectory(const wxString& directory);

    /**
        The type of function used as an argument for SetExtraControlCreator().

        @since 2.9.0
    */
    typedef wxWindow *(*ExtraControlCreatorFunction)(wxWindow*);

    /**
        Customize file dialog by adding extra window, which is typically placed
        below the list of files and above the buttons.

        SetExtraControlCreator() can be called only once, before calling ShowModal().

        The @c creator function should take pointer to parent window (file dialog)
        and should return a window allocated with operator new.

        Supported platforms: wxGTK, wxMSW, wxUniv.

        @since 2.9.0
    */
    bool SetExtraControlCreator(ExtraControlCreatorFunction creator);

    /**
        Sets the default filename.
        
        In wxGTK this will have little effect unless a default directory has previously been set.
    */
    virtual void SetFilename(const wxString& setfilename);

    /**
        Sets the default filter index, starting from zero.
    */
    virtual void SetFilterIndex(int filterIndex);

    /**
        Sets the message that will be displayed on the dialog.
    */
    virtual void SetMessage(const wxString& message);

    /**
        Sets the path (the combined directory and filename that will be returned when
        the dialog is dismissed).
    */
    virtual void SetPath(const wxString& path);

    /**
        Sets the wildcard, which can contain multiple file types, for example:
        "BMP files (*.bmp)|*.bmp|GIF files (*.gif)|*.gif".

        Note that the native Motif dialog has some limitations with respect to
        wildcards; see the Remarks section above.
    */
    virtual void SetWildcard(const wxString& wildCard);

    /**
        Shows the dialog, returning wxID_OK if the user pressed OK, and wxID_CANCEL
        otherwise.
    */
    virtual int ShowModal();
};



// ============================================================================
// Global functions/macros
// ============================================================================

/** @addtogroup group_funcmacro_dialog */
//@{

/**
    Pops up a file selector box. In Windows, this is the common file selector
    dialog. In X, this is a file selector box with the same functionality. The
    path and filename are distinct elements of a full file pathname. If path
    is empty, the current directory will be used. If filename is empty, no
    default filename will be supplied. The wildcard determines what files are
    displayed in the file selector, and file extension supplies a type
    extension for the required filename. Flags may be a combination of
    wxFD_OPEN, wxFD_SAVE, wxFD_OVERWRITE_PROMPT or wxFD_FILE_MUST_EXIST.

    @note wxFD_MULTIPLE can only be used with wxFileDialog and not here since
          this function only returns a single file name.

    Both the Unix and Windows versions implement a wildcard filter. Typing a
    filename containing wildcards (*, ?) in the filename text item, and
    clicking on Ok, will result in only those files matching the pattern being
    displayed.

    The wildcard may be a specification for multiple types of file with a
    description for each, such as:

    @code
    "BMP files (*.bmp)|*.bmp|GIF files (*.gif)|*.gif"
    @endcode

    The application must check for an empty return value (the user pressed
    Cancel). For example:

    @code
    wxString filename = wxFileSelector("Choose a file to open");
    if ( !filename.empty() )
    {
        // work with the file
        ...
    }
    //else: cancelled by user
    @endcode

    @header{wx/filedlg.h}
*/
wxString wxFileSelector(const wxString& message,
                        const wxString& default_path = wxEmptyString,
                        const wxString& default_filename = wxEmptyString,
                        const wxString& default_extension = wxEmptyString,
                        const wxString& wildcard = ".",
                        int flags = 0,
                        wxWindow* parent = NULL,
                        int x = -1,
                        int y = -1);

//@}

