/////////////////////////////////////////////////////////////////////////////
// Name:        dateevt.h
// Purpose:     interface of wxDateEvent
// Author:      wxWidgets team
// RCS-ID:      $Id: dateevt.h 55942 2008-09-29 10:52:37Z FM $
// Licence:     wxWindows license
/////////////////////////////////////////////////////////////////////////////

/**
    @class wxDateEvent

    This event class holds information about a date change and is used together
    with wxDatePickerCtrl. It also serves as a base class
    for wxCalendarEvent.

    @library{wxadv}
    @category{events}
*/
class wxDateEvent : public wxCommandEvent
{
public:
    /**
        Returns the date.
    */
    const wxDateTime& GetDate() const;

    /**
        Sets the date carried by the event, normally only used by the library
        internally.
    */
    void SetDate(const wxDateTime& date);
};

