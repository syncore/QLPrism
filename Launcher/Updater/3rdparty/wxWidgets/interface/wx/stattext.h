/////////////////////////////////////////////////////////////////////////////
// Name:        stattext.h
// Purpose:     interface of wxStaticText
// Author:      wxWidgets team
// RCS-ID:      $Id: stattext.h 62958 2009-12-20 15:07:08Z FM $
// Licence:     wxWindows license
/////////////////////////////////////////////////////////////////////////////

/**
    @class wxStaticText

    A static text control displays one or more lines of read-only text.
    wxStaticText supports the three classic text alignments, label ellipsization
    and formatting markup.

    @beginStyleTable
    @style{wxALIGN_LEFT}
           Align the text to the left.
    @style{wxALIGN_RIGHT}
           Align the text to the right.
    @style{wxALIGN_CENTRE}
           Center the text (horizontally).
    @style{wxST_NO_AUTORESIZE}
           By default, the control will adjust its size to exactly fit to the
           size of the text when  SetLabel is called. If this style flag is
           given, the control will not change its size (this style is
           especially useful with controls which also have wxALIGN_RIGHT or
           CENTER style because otherwise they won't make sense any longer
           after a call to SetLabel).
    @style{wxST_ELLIPSIZE_START}
           If the labeltext width exceeds the control width, replace the beginning
           of the label with an ellipsis; uses wxControl::Ellipsize.
    @style{wxST_ELLIPSIZE_MIDDLE}
           If the label text width exceeds the control width, replace the middle
           of the label with an ellipsis; uses wxControl::Ellipsize.
    @style{wxST_ELLIPSIZE_END}
           If the label text width exceeds the control width, replace the end
           of the label with an ellipsis; uses wxControl::Ellipsize.
    @style{wxST_MARKUP}
           Support markup in the label; see SetLabel() for more information.
    @endStyleTable

    @library{wxcore}
    @category{ctrl}
    @appearance{statictext.png}

    @see wxStaticBitmap, wxStaticBox
*/
class wxStaticText : public wxControl
{
public:
    /**
        Default constructor.
    */
    wxStaticText();

    /**
        Constructor, creating and showing a text control.

        @param parent
            Parent window. Should not be @NULL.
        @param id
            Control identifier. A value of -1 denotes a default value.
        @param label
            Text label.
        @param pos
            Window position.
        @param size
            Window size.
        @param style
            Window style. See wxStaticText.
        @param name
            Window name.

        @see Create()
    */
    wxStaticText(wxWindow* parent, wxWindowID id,
                 const wxString& label,
                 const wxPoint& pos = wxDefaultPosition,
                 const wxSize& size = wxDefaultSize,
                 long style = 0,
                 const wxString& name = wxStaticTextNameStr);

    /**
        Creation function, for two-step construction. For details see wxStaticText().
    */
    bool Create(wxWindow* parent, wxWindowID id, const wxString& label,
                const wxPoint& pos = wxDefaultPosition,
                const wxSize& size = wxDefaultSize, long style = 0,
                const wxString& name = wxStaticTextNameStr);

    // NB: when writing docs for the following function remember that Doxygen
    //     will always expand HTML entities (e.g. &quot;) and thus we need to
    //     write e.g. "&amp;lt;" to have in the output the "&lt;" string.
    /**
        Escapes all the symbols of @a str that have a special meaning (<tt><>&quot;'&</tt>) for
        wxStaticText objects with the @c wxST_MARKUP style.
        
        Those symbols are replaced the corresponding entities 
        (&amp;lt; &amp;gt; &amp;quot; &amp;apos; &amp;amp;).
    */
    static wxString EscapeMarkup(const wxString& str);

    /**
        Returns the contents of the control.

        Note that the returned string contains both the mnemonics (@& characters),
        if any, and markup tags, if any.
        Use GetLabelText() if only the label text is needed.
    */
    wxString GetLabel() const;

    /**
        This method returns the control's label without the mnemonics characters
        (if any) and without the markup (if the control has @c wxST_MARKUP style).
    */
    wxString GetLabelText() const;

    /**
        This overload returns the given @a label string without the
        mnemonics characters (if any) and without the markup.
    */
    static wxString GetLabelText(const wxString& label);

    /**
        Returns @true if the window styles for this control contains one of the
        @c wxST_ELLIPSIZE_START, @c wxST_ELLIPSIZE_MIDDLE or @c wxST_ELLIPSIZE_END styles.
    */
    bool IsEllipsized() const;

    /**
        Removes the markup accepted by wxStaticText when the @c wxST_MARKUP style is used,
        and then returns the cleaned string.

        See SetLabel() for more info about the markup.
    */
    static wxString RemoveMarkup(const wxString& str);

    /**
        Sets the static text label and updates the controls size to exactly fit the
        label unless the control has wxST_NO_AUTORESIZE flag.

        This function allows to set decorated static label text on platforms which
        support it (currently only GTK+ 2). For the other platforms, the markup is
        ignored.

        The supported tags are:
        <TABLE>
            <TR>
                <TD>&lt;b&gt;</TD>
                <TD>bold text</TD>
            </TR>
            <TR>
                <TD>&lt;big&gt;</TD>
                <TD>bigger text</TD>
            </TR>
            <TR>
                <TD>&lt;i&gt;</TD>
                <TD>italic text</TD>
            </TR>
            <TR>
                <TD>&lt;s&gt;</TD>
                <TD>strike-through text</TD>
            </TR>
            <TR>
                <TD>&lt;sub&gt;</TD>
                <TD>subscript text</TD>
            </TR>
            <TR>
                <TD>&lt;sup&gt;</TD>
                <TD>superscript text</TD>
            </TR>
            <TR>
                <TD>&lt;small&gt;</TD>
                <TD>smaller text</TD>
            </TR>
            <TR>
                <TD>&lt;tt&gt;</TD>
                <TD>monospaced text</TD>
            </TR>
            <TR>
                <TD>&lt;u&gt;</TD>
                <TD>underlined text</TD>
            </TR>
            <TR>
                <TD>&lt;span&gt;</TD>
                <TD>generic formatter tag; see Pango Markup
                    (http://library.gnome.org/devel/pango/unstable/PangoMarkupFormat.html)
                    for more information.</TD>
            </TR>
        </TABLE>

        Note that the string must be well-formed (e.g. all tags must be correctly
        closed) otherwise it can be not shown correctly or at all.
        Also note that you need to escape the following special characters:

        <TABLE>
            <TR>
                <TD><b>Special character</b></TD>
                <TD><b>Escape as</b></TD>
            </TR>
            <TR>
                <TD>@c &amp;</TD>
                <TD>@c &amp;amp; or as @c &amp;&amp;</TD>
            </TR>
            <TR>
                <TD>@c &apos;</TD>
                <TD>@c &amp;apos;</TD>
            </TR>
            <TR>
                <TD>@c &quot;</TD>
                <TD>@c &amp;quot;</TD>
            </TR>
            <TR>
                <TD>@c &lt;</TD>
                <TD>@c &amp;lt;</TD>
            </TR>
            <TR>
                <TD>@c &gt;</TD>
                <TD>@c &amp;gt;</TD>
            </TR>
        </TABLE>

        The non-escaped ampersand @c &amp; characters are interpreted as
        mnemonics; see wxControl::SetLabel.

        Example:

        @param label
            The new label to set.
            It may contain newline characters and the markup tags described above.
    */
    virtual void SetLabel(const wxString& label);

    /**
        This functions wraps the controls label so that each of its lines becomes at
        most @a width pixels wide if possible (the lines are broken at words
        boundaries so it might not be the case if words are too long).

        If @a width is negative, no wrapping is done. Note that this width is not
        necessarily the total width of the control, since a few pixels for the
        border (depending on the controls border style) may be added.

        @since 2.6.2
    */
    void Wrap(int width);
};

