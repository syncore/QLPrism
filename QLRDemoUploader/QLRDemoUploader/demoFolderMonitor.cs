using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using QLRDemoUploader.Properties;
using Timer = System.Threading.Timer;

namespace QLRDemoUploader
{
    class DemoFolderMonitor
    {
        private readonly ListBox _listBox;
        private Timer _t;

        public static List<UploadDemo> L = new List<UploadDemo>();

        public DemoFolderMonitor(string demoPath, ListBox statusBox)
        {
            _listBox = statusBox;

            _t = new Timer(Tick, null, 30000, 30000);
            
            var w = new FileSystemWatcher {Path = demoPath};
            w.Created += WCreated;
            w.EnableRaisingEvents = true;
        }

        public void StopMonitoring()
        {
            if (_t != null)
                _t.Dispose();
            _t = null;
        }

        private void Tick(object state)
        {
            var deleteList = L.Where(u => !IsFileLocked(new FileInfo(u.FilePath))).ToList();
            foreach (UploadDemo f in deleteList)
            {
                UpdateStatusBox("Processing: " +  Path.GetFileName(f.FilePath));
                UploadDemo f1 = f;
                var t3 = new Thread(() => ThreadProcessQueue(f1.FilePath));
                t3.Start();
                L.Remove(f);
            }
        }

        private void ThreadProcessQueue(string path)
        {
                UpdateStatusBox(ProcessDemo.ManageDemo(path));
        }

     
        private void WCreated(object sender, FileSystemEventArgs e)
        {
            L.Add(new UploadDemo(e.FullPath));
            UpdateStatusBox("Monitoring: " + e.Name);
        }

        public void UpdateStatusBox(string updateMsg)
        {
            updateMsg = DateTime.Now + " - " + updateMsg + Environment.NewLine;
            try
            {
                _listBox.Invoke((MethodInvoker)(() =>
                {
                    _listBox.Items.Add(updateMsg);
                    int visibleItems = _listBox.ClientSize.Height / _listBox.ItemHeight;
                    _listBox.TopIndex = Math.Max(_listBox.Items.Count - visibleItems + 1, 0);
                }));
            }
            catch
            {
            }
        }


        private static bool IsFileLocked(FileInfo file)
        {
            FileStream stream = null;
            try
            {
                stream = file.Open(FileMode.Open, FileAccess.ReadWrite, FileShare.None);
            }
            catch (IOException)
            {
                return true;
            }
            finally
            {
                if (stream != null)
                    stream.Close();
            }
            return false;
        }
    }
}
