using System;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;
using QLRDemoUploader.Properties;
using DemoUpdater;

namespace QLRDemoUploader
{
    public sealed partial class FrmQlrDemoUploader : Form
    {
        private string[] _files;
        private DemoFolderMonitor _d;
        private bool _demoFolderMonitorEnabled;
        readonly RegistryKey _rkApp = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);

        public FrmQlrDemoUploader()
        {
            InitializeComponent();
            cbStartup.Checked = _rkApp.GetValue("QLRanks.com Demo Uploader") != null;

            AllowDrop = true;
            DragEnter += FrmQlrDemoUploaderDragEnter;
            DragDrop += FrmQlrDemoUploaderDragDrop;

            Resize += FrmQlrDemoUploaderResize;
            cbMonitorEnabled.CheckedChanged += CbMonitorEnabledCheckedChanged;

            string path =
                Directory.GetParent(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)).FullName;
            if (Environment.OSVersion.Version.Major >= 6)
                path = Directory.GetParent(path).ToString();

            if (!string.IsNullOrEmpty(Settings.Default.demoPath))
                txtFolderToMonitor.Text = Settings.Default.demoPath;
            else if (Directory.Exists(path += @"\AppData\LocalLow\id Software\quakelive\home\baseq3\demos"))
                txtFolderToMonitor.Text = path;
            else if (Directory.Exists(path += @"\id Software\quakelive\home\baseq3\demos"))
                txtFolderToMonitor.Text = path;
            
            // the auto-updater (syncore)
            AutoUpdater.Start("http://www.qlprism.us/update/qlranksdemoupdater.xml");
        }

        private void FrmQlrDemoUploaderResize(object sender, EventArgs e)
        {
            switch (WindowState)
            {
                case FormWindowState.Minimized:
                    notifyIcon.Visible = true;
                    notifyIcon.BalloonTipTitle = Resources.ToolTipTitle;
                    notifyIcon.BalloonTipText = Resources.ToolTipText;
                    
                    notifyIcon.ShowBalloonTip(500);
                    Hide();
                    break;
                case FormWindowState.Normal:
                    notifyIcon.Visible = false;
                    break;
            }
        }

        private void CbMonitorEnabledCheckedChanged(object sender, EventArgs e)
        {
            if (cbMonitorEnabled.Checked)
            {
                if (Directory.Exists(txtFolderToMonitor.Text))
                {
                    Settings.Default.demoPath = txtFolderToMonitor.Text;
                    Settings.Default.Save();
                    _d = new DemoFolderMonitor(Settings.Default.demoPath, lbDemoStatus);
                    _demoFolderMonitorEnabled = true;
                    UpdateStatusBox("Monitoring: " + Settings.Default.demoPath);
                }
                else
                {
                    cbMonitorEnabled.Checked = false;
                    MessageBox.Show(string.Format("The path {0} does not exist", txtFolderToMonitor.Text));
                    Settings.Default.demoPath = "";
                    Settings.Default.Save();
                }
            }
            else
            {
                if (_demoFolderMonitorEnabled)
                    _d.StopMonitoring();
                UpdateStatusBox("Monitoring disabled.");
            }
        }

        public void UpdateStatusBox(string updateMsg)
        {
            updateMsg = DateTime.Now + " - " + updateMsg + Environment.NewLine;
            try
            {
                lbDemoStatus.Invoke((MethodInvoker) (() =>
                                                         {
                                                             lbDemoStatus.Items.Add(updateMsg);
                                                             int visibleItems = lbDemoStatus.ClientSize.Height/
                                                                                lbDemoStatus.ItemHeight;
                                                             lbDemoStatus.TopIndex =
                                                                 Math.Max(lbDemoStatus.Items.Count - visibleItems + 1, 0);
                                                         }));
            }
            catch
            {
            }
        }

        public void UpdateProgressBar(double percentage)
        {
            try
            {
                pbQueue.Invoke((MethodInvoker) (() =>
                                                    {
                                                        pbQueue.Value = (int) percentage;
                                                    }));
            }
            catch
            {
            }
        }

        private void FrmQlrDemoUploaderDragDrop(object sender, DragEventArgs e)
        {
            _files = (string[]) e.Data.GetData(DataFormats.FileDrop);
            lblFilesToBeUploaded.Text = _files.Length + Resources.lblQueueText;

            foreach (string s in _files)
                UpdateStatusBox("Added to Upload Queue: " + Path.GetFileName(s));

            if (_files.Length > 0)
            {
                btnProcessQueue.Enabled = true;
                btnProcessQueue.Text = Resources.btnProcessQueue;
            }
        }

        private static void FrmQlrDemoUploaderDragEnter(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop)) e.Effect = DragDropEffects.Copy;
        }

        private void BtnProcessQueueClick(object sender, EventArgs e)
        {
            if (_files == null || _files.Length < 1)
                return;
            btnProcessQueue.Enabled = false;
            btnProcessQueue.Text = Resources.btnProcessingQueue;
            var queueProcessor = new Thread(ThreadProcessQueue);
            queueProcessor.Start();
        }

        private void ThreadProcessQueue()
        {
            int c = _files.Length;
            double pb = 1;

            foreach (string f in _files)
            {
                pb++;
                Application.DoEvents();
                lblFilesToBeUploaded.Text = c + Resources.lblQueueText;
                UpdateStatusBox(ProcessDemo.ManageDemo(f));

                UpdateProgressBar((pb / _files.Length) * 100);
                c--;
            }
            _files = null;
            lblFilesToBeUploaded.Text = c + Resources.lblQueueText;
        }

        private void AboutToolStripMenuItemClick(object sender, EventArgs e)
        {
            var f = new frmAbout();
            f.Show();
        }

        private void ExitToolStripMenuItemClick(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void CbStartupCheckedChanged(object sender, EventArgs e)
        {
            if (cbStartup.Checked)
            {
                _rkApp.SetValue("QLRanks.com Demo Uploader", Application.ExecutablePath.ToString(CultureInfo.InvariantCulture));
            }
            else
            {
                _rkApp.DeleteValue("QLRanks.com Demo Uploader", false);
            }
        }

        private void NotifyIconMouseDoubleClick(object sender, MouseEventArgs e)
        {
            Show();
            WindowState = FormWindowState.Normal;
        }
    }
}