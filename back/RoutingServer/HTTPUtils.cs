using System.Net;
using System.Text;

namespace ServerHTTPListener {
    public static class HTTPUtils {
        private static void SendResponse(HttpListenerResponse response, in string responseString) {
            byte[] buffer = Encoding.UTF8.GetBytes(responseString);
            response.ContentLength64 = buffer.Length;
            response.OutputStream.Write(buffer, 0, buffer.Length);
            response.OutputStream.Close();
        }

        public static void SendError(HttpListenerResponse response, in string errorMessage, in int errorCode) {
            string json = $"{{\"error\":\"{errorMessage}\"}}";
            response.StatusCode = errorCode;
            SendResponse(response, json);
        }
    }
}
