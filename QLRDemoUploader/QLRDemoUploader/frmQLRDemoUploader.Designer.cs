namespace QLRDemoUploader
{
    sealed partial class FrmQlrDemoUploader
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmQlrDemoUploader));
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.lblFilesToBeUploaded = new System.Windows.Forms.ToolStripStatusLabel();
            this.lbDemoStatus = new System.Windows.Forms.ListBox();
            this.txtFolderToMonitor = new System.Windows.Forms.TextBox();
            this.cbMonitorEnabled = new System.Windows.Forms.CheckBox();
            this.btnProcessQueue = new System.Windows.Forms.Button();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.helpToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.aboutToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.grpStatus = new System.Windows.Forms.GroupBox();
            this.grpFile = new System.Windows.Forms.GroupBox();
            this.notifyIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.cbStartup = new System.Windows.Forms.CheckBox();
            this.pbQueue = new System.Windows.Forms.ProgressBar();
            this.statusStrip1.SuspendLayout();
            this.menuStrip1.SuspendLayout();
            this.grpStatus.SuspendLayout();
            this.grpFile.SuspendLayout();
            this.SuspendLayout();
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblFilesToBeUploaded});
            this.statusStrip1.Location = new System.Drawing.Point(0, 306);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(396, 22);
            this.statusStrip1.TabIndex = 0;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // lblFilesToBeUploaded
            // 
            this.lblFilesToBeUploaded.Name = "lblFilesToBeUploaded";
            this.lblFilesToBeUploaded.Size = new System.Drawing.Size(143, 17);
            this.lblFilesToBeUploaded.Text = "0 demos in queue to upload.";
            // 
            // lbDemoStatus
            // 
            this.lbDemoStatus.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbDemoStatus.FormattingEnabled = true;
            this.lbDemoStatus.Location = new System.Drawing.Point(6, 19);
            this.lbDemoStatus.Name = "lbDemoStatus";
            this.lbDemoStatus.Size = new System.Drawing.Size(379, 147);
            this.lbDemoStatus.TabIndex = 1;
            // 
            // txtFolderToMonitor
            // 
            this.txtFolderToMonitor.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtFolderToMonitor.Location = new System.Drawing.Point(6, 19);
            this.txtFolderToMonitor.Name = "txtFolderToMonitor";
            this.txtFolderToMonitor.Size = new System.Drawing.Size(249, 20);
            this.txtFolderToMonitor.TabIndex = 2;
            // 
            // cbMonitorEnabled
            // 
            this.cbMonitorEnabled.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cbMonitorEnabled.AutoSize = true;
            this.cbMonitorEnabled.Location = new System.Drawing.Point(261, 19);
            this.cbMonitorEnabled.Name = "cbMonitorEnabled";
            this.cbMonitorEnabled.Size = new System.Drawing.Size(124, 17);
            this.cbMonitorEnabled.TabIndex = 3;
            this.cbMonitorEnabled.Text = "Monitor Demo Folder";
            this.cbMonitorEnabled.UseVisualStyleBackColor = true;
            // 
            // btnProcessQueue
            // 
            this.btnProcessQueue.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnProcessQueue.Enabled = false;
            this.btnProcessQueue.Location = new System.Drawing.Point(259, 212);
            this.btnProcessQueue.Name = "btnProcessQueue";
            this.btnProcessQueue.Size = new System.Drawing.Size(133, 30);
            this.btnProcessQueue.TabIndex = 4;
            this.btnProcessQueue.Text = "Process Queue";
            this.btnProcessQueue.UseVisualStyleBackColor = true;
            this.btnProcessQueue.Click += new System.EventHandler(this.BtnProcessQueueClick);
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.helpToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(396, 24);
            this.menuStrip1.TabIndex = 5;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.exitToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(35, 20);
            this.fileToolStripMenuItem.Text = "File";
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(92, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.ExitToolStripMenuItemClick);
            // 
            // helpToolStripMenuItem
            // 
            this.helpToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.aboutToolStripMenuItem});
            this.helpToolStripMenuItem.Name = "helpToolStripMenuItem";
            this.helpToolStripMenuItem.Size = new System.Drawing.Size(40, 20);
            this.helpToolStripMenuItem.Text = "Help";
            // 
            // aboutToolStripMenuItem
            // 
            this.aboutToolStripMenuItem.Name = "aboutToolStripMenuItem";
            this.aboutToolStripMenuItem.Size = new System.Drawing.Size(103, 22);
            this.aboutToolStripMenuItem.Text = "About";
            this.aboutToolStripMenuItem.Click += new System.EventHandler(this.AboutToolStripMenuItemClick);
            // 
            // grpStatus
            // 
            this.grpStatus.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.grpStatus.Controls.Add(this.lbDemoStatus);
            this.grpStatus.Location = new System.Drawing.Point(1, 27);
            this.grpStatus.Name = "grpStatus";
            this.grpStatus.Size = new System.Drawing.Size(391, 179);
            this.grpStatus.TabIndex = 6;
            this.grpStatus.TabStop = false;
            this.grpStatus.Text = "Status";
            // 
            // grpFile
            // 
            this.grpFile.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.grpFile.Controls.Add(this.txtFolderToMonitor);
            this.grpFile.Controls.Add(this.cbMonitorEnabled);
            this.grpFile.Location = new System.Drawing.Point(1, 248);
            this.grpFile.Name = "grpFile";
            this.grpFile.Size = new System.Drawing.Size(391, 51);
            this.grpFile.TabIndex = 7;
            this.grpFile.TabStop = false;
            this.grpFile.Text = "Auto Upload Demo / Update Player";
            // 
            // notifyIcon
            // 
            this.notifyIcon.Icon = ((System.Drawing.Icon)(resources.GetObject("notifyIcon.Icon")));
            this.notifyIcon.Text = "QLRanks.com Demo Uploader";
            this.notifyIcon.Visible = true;
            this.notifyIcon.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.NotifyIconMouseDoubleClick);
            // 
            // cbStartup
            // 
            this.cbStartup.AutoSize = true;
            this.cbStartup.Checked = true;
            this.cbStartup.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cbStartup.Location = new System.Drawing.Point(12, 220);
            this.cbStartup.Name = "cbStartup";
            this.cbStartup.Size = new System.Drawing.Size(99, 17);
            this.cbStartup.TabIndex = 8;
            this.cbStartup.Text = "Load at Startup";
            this.cbStartup.UseVisualStyleBackColor = true;
            this.cbStartup.CheckedChanged += new System.EventHandler(this.CbStartupCheckedChanged);
            // 
            // pbQueue
            // 
            this.pbQueue.Location = new System.Drawing.Point(123, 220);
            this.pbQueue.Name = "pbQueue";
            this.pbQueue.Size = new System.Drawing.Size(130, 17);
            this.pbQueue.TabIndex = 9;
            // 
            // FrmQlrDemoUploader
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(396, 328);
            this.Controls.Add(this.pbQueue);
            this.Controls.Add(this.cbStartup);
            this.Controls.Add(this.btnProcessQueue);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.menuStrip1);
            this.Controls.Add(this.grpStatus);
            this.Controls.Add(this.grpFile);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "FrmQlrDemoUploader";
            this.Text = "QLRanks.com Demo Uploader";
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.grpStatus.ResumeLayout(false);
            this.grpFile.ResumeLayout(false);
            this.grpFile.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel lblFilesToBeUploaded;
        private System.Windows.Forms.ListBox lbDemoStatus;
        private System.Windows.Forms.TextBox txtFolderToMonitor;
        private System.Windows.Forms.CheckBox cbMonitorEnabled;
        private System.Windows.Forms.Button btnProcessQueue;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem helpToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem aboutToolStripMenuItem;
        private System.Windows.Forms.GroupBox grpStatus;
        private System.Windows.Forms.GroupBox grpFile;
        private System.Windows.Forms.NotifyIcon notifyIcon;
        private System.Windows.Forms.CheckBox cbStartup;
        private System.Windows.Forms.ProgressBar pbQueue;
    }
}

