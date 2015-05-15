###############################################################################
# Name:         misc/gdb/print.py
# Purpose:      pretty-printers for wx data structures: this file is meant to
#               be sourced from gdb using "source -p" (or, better, autoloaded
#               in the future...)
# Author:       Vadim Zeitlin
# Created:      2009-01-04
# RCS-Id:       $Id: print.py 62619 2009-11-11 23:08:41Z VZ $
# Copyright:    (c) 2009 Vadim Zeitlin
# License:      wxWindows licence
###############################################################################

# shamelessly stolen from std::string example
class wxStringPrinter:
    def __init__(self, val):
        self.val = val

    def to_string(self):
        return '"' + self.val['m_impl']['_M_dataplus']['_M_p'].string() + '"'

    def display_hint(self):
        return 'string'

def wxLookupFunction(val):
    if val.type.tag == 'wxString':
        return wxStringPrinter(val)
    return None

gdb.pretty_printers.append(wxLookupFunction)
