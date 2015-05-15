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

#ifndef _threads_h_
#define _threads_h_

#include <windows.h>

namespace winsparkle
{

/**
    Lightweight thread class.

    It's a base class; derived class must implement at least Run().

    Create the thread on heap, then call Start() on it. If the thread is joinable
    (see IsJoinable()), then you must call JoinAndDelete() on it to destroy it.
    Otherwise, it self-destructs.
 */
class Thread
{
public:
    /**
        Creates the thread.

        Note that you must explicitly call Start() to start it.

        @param name Descriptive name of the thread. This is shown in (Visual C++)
                    debugger and should always be set to something meaningful to
                    help identify WinSparkle threads.
     */
    Thread(const char *name);

    virtual ~Thread();

    /**
        Launch the thread.

        Calls Run() in the new thread's context.

        This method doesn't return until Run() calls SignalReady().

        Throws on error.
     */
    void Start();

    /**
        Wait for the thread to terminate.
     */
    void Join();


protected:
    /// Signals Start() that the thread is up and ready.
    void SignalReady();

    /**
        Code to run in the thread's context.

        This method @a must call SignalReady() as soon as it is initialized.
     */
    virtual void Run() = 0;

    /// Is the thread joinable?
    virtual bool IsJoinable() const = 0;

private:
    static unsigned __stdcall ThreadEntryPoint(void *data);

protected:
    HANDLE m_handle;
    unsigned m_id;
    HANDLE m_signalEvent;
};


/**
    C++ wrapper for win32 critical section object.
 */
class CriticalSection
{
public:
    CriticalSection()   { InitializeCriticalSection(&m_cs); }
    ~CriticalSection()  { DeleteCriticalSection(&m_cs); }

    void Enter()        { EnterCriticalSection(&m_cs); }
    void Leave()        { LeaveCriticalSection(&m_cs); }

private:
    CRITICAL_SECTION m_cs;
};


/**
    Locks a critical section as RIIA. Use this instead of manually calling
    CriticalSection::Enter() and CriticalSection::Leave().
 */
class CriticalSectionLocker
{
public:
    CriticalSectionLocker(CriticalSection& cs) : m_cs(cs) { cs.Enter(); }
    ~CriticalSectionLocker() { m_cs.Leave(); }

private:
    CriticalSection& m_cs;
};


} // namespace winsparkle

#endif // _threads_h_
