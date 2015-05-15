/*
 *  This file is part of WinSparkle (http://winsparkle.org)
 *
 *  Copyright (C) 2009-2010 Vaclav Slavik
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *  copy of this software and associated documentation files (the "Software"),
 *  to deal in the Software without restriction, including without limitation
 *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *  DEALINGS IN THE SOFTWARE.
 *
 */

#ifndef _utils_h_
#define _utils_h_

#include <string>
#include <string.h>

namespace winsparkle
{

/// Helper class for RIIA handling of allocated buffers
struct DataBuffer
{
    DataBuffer(size_t size)
    {
        data = new unsigned char[size];
        memset(data, 0, size);
    }

    ~DataBuffer() { delete[] data; }

    unsigned char *data;
};


// Simple conversion between wide and narrow strings (only safe for ASCII!):

template<typename TIn, typename TOut>
inline std::basic_string<TOut> ConvertString(const std::basic_string<TIn>& s)
{
    std::basic_string<TOut> out;
    out.reserve(s.length());

    for ( std::basic_string<TIn>::const_iterator i = s.begin(); i != s.end(); ++i )
    {
        out += static_cast<TOut>(*i);
    }

    return out;
}

inline std::string WideToAnsi(const std::wstring& s)
{
    return ConvertString<wchar_t, char>(s);
}

inline std::wstring AnsiToWide(const std::string& s)
{
    return ConvertString<char, wchar_t>(s);
}


} // namespace winsparkle

#endif // _utils_h_
