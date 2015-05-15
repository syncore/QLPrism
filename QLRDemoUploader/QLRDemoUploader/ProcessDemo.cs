using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using QLRDemoUploader.com.qlranks.qlranksscanningengine;

namespace QLRDemoUploader
{
    public class ProcessDemo
    {
        public static string ManageDemo(string path)
        {
            var api = new QlranksScanningEngineService();
            if (!api.CheckDemoInMd5(GenerateMd5(path)))
            {
                try
                {
                    string extension = Path.GetExtension(path);
                    if (extension != null)
                        return api.UploadDemo(FileToByteArray(path),
                                              Path.GetFileNameWithoutExtension(path),
                                              extension.Replace(".", ""),
                                              (int) new FileInfo(path).Length);
                }
                catch
                {
                    return "Error uploading demo.";
                }
            }

            return "Demo already uploaded.";
        }

        public static string GenerateMd5(string fileName)
        {
            var sb = new StringBuilder();
            MD5 md5Hasher = MD5.Create();
            using (FileStream fs = File.OpenRead(fileName))
            {
                foreach (Byte b in md5Hasher.ComputeHash(fs))
                    sb.Append(b.ToString("x2").ToLower());
            }
            return sb.ToString();
        }

        public static byte[] FileToByteArray(string fileName)
        {
            byte[] buffer = null;
            try
            {
                var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                var binaryReader = new BinaryReader(fileStream);
                long totalBytes = new FileInfo(fileName).Length;
                buffer = binaryReader.ReadBytes((Int32) totalBytes);
                fileStream.Close();
                fileStream.Dispose();
                binaryReader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return buffer;
        }
    }
}