/////////////////////////////////////////////////////////////////////////////
// Name:        stockitem.h
// Purpose:     interface of global functions
// Author:      wxWidgets team
// RCS-ID:      $Id: stockitem.h 61526 2009-07-25 16:41:05Z VZ $
// Licence:     wxWindows license
/////////////////////////////////////////////////////////////////////////////

/**
    Possible values for flags parameter of wxGetStockLabel().

    The elements of this enum are bit masks and may be combined with each other
    (except when specified otherwise).
 */
enum wxStockLabelQueryFlag
{
    /**
        Indicates absence of wxSTOCK_WITH_MNEMONIC and wxSTOCK_WITH_ACCELERATOR.

        Requests just the label (e.g. "Print...").
     */
    wxSTOCK_NOFLAGS = 0,

    /**
        Request the label with mnemonics character.
       
        E.g. "&amp;Print...".
     */
    wxSTOCK_WITH_MNEMONIC = 1,

    /**
        Return the label with accelerator following it after TAB.

        E.g. "Print...\tCtrl-P". This can be combined with
        wxSTOCK_WITH_MNEMONIC to get "&Print...\tCtrl-P".
     */
    wxSTOCK_WITH_ACCELERATOR = 2,

    /**
        Return the label appropriate for a button and not a menu item.

        Currently the main difference is that the trailing ellipsis used in
        some stock labels is never included in the returned label. Also, the
        mnemonics is included if this flag is used. So the returned value for
        wxID_PRINT when this flag is used is "&Print".

        This flag can't be combined with wxSTOCK_WITH_ACCELERATOR.
     */
    wxSTOCK_FOR_BUTTON = 5
};

/** @addtogroup group_funcmacro_misc */
//@{

/**
    Returns label that should be used for given @a id element.

    @param id
        Given id of the wxMenuItem, wxButton, wxToolBar tool, etc.
    @param flags
        Combination of the elements of wxStockLabelQueryFlag.

    @header{wx/stockitem.h}
*/
wxString wxGetStockLabel(wxWindowID id, long flags = wxSTOCK_WITH_MNEMONIC);

//@}

