///////////////////////////////////////////////////////////////////////////////
// Name:        wx/generic/dvrenderer.h
// Purpose:     wxDataViewRenderer for generic wxDataViewCtrl implementation
// Author:      Robert Roebling, Vadim Zeitlin
// Created:     2009-11-07 (extracted from wx/generic/dataview.h)
// RCS-ID:      $Id: dvrenderer.h 62590 2009-11-10 17:41:11Z VZ $
// Copyright:   (c) 2006 Robert Roebling
//              (c) 2009 Vadim Zeitlin <vadim@wxwidgets.org>
// Licence:     wxWindows licence
///////////////////////////////////////////////////////////////////////////////

#ifndef _WX_GENERIC_DVRENDERER_H_
#define _WX_GENERIC_DVRENDERER_H_

// ----------------------------------------------------------------------------
// wxDataViewRenderer
// ----------------------------------------------------------------------------

class WXDLLIMPEXP_ADV wxDataViewRenderer: public wxDataViewCustomRendererBase
{
public:
    wxDataViewRenderer( const wxString &varianttype,
                        wxDataViewCellMode mode = wxDATAVIEW_CELL_INERT,
                        int align = wxDVR_DEFAULT_ALIGNMENT );
    virtual ~wxDataViewRenderer();

    virtual wxDC *GetDC();

    virtual void SetAlignment( int align );
    virtual int GetAlignment() const;

    virtual void EnableEllipsize(wxEllipsizeMode mode = wxELLIPSIZE_MIDDLE)
        { m_ellipsizeMode = mode; }
    virtual wxEllipsizeMode GetEllipsizeMode() const
        { return m_ellipsizeMode; }

    virtual void SetMode( wxDataViewCellMode mode )
        { m_mode = mode; }
    virtual wxDataViewCellMode GetMode() const
        { return m_mode; }

    // implementation

    // this is a replacement for dynamic_cast<wxDataViewCustomRenderer> in the
    // code checking whether the renderer is interested in mouse events, it's
    // overridden in wxDataViewCustomRenderer to return the object itself but
    // intentionally returns NULL for all the other renderer classes as the
    // user should _not_ be able to override Activate/LeftClick() when deriving
    // from them for consistency with the other ports and while we can't
    // prevent this from working at compile-time because all renderer are
    // custom renderers in the generic implementation, we at least make sure
    // that it doesn't work at run-time because Activate/LeftClick() would
    // never be called
    virtual wxDataViewCustomRenderer *WXGetAsCustom() { return NULL; }

private:
    int                          m_align;
    wxDataViewCellMode           m_mode;

    wxEllipsizeMode m_ellipsizeMode;

    wxDC *m_dc;

    DECLARE_DYNAMIC_CLASS_NO_COPY(wxDataViewRenderer)
};

#endif // _WX_GENERIC_DVRENDERER_H_

