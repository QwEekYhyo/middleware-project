using System.Net;
using System.Text;
using System.Web;
using System.Collections.Specialized;

namespace ServerHTTPListener {
    internal class Program {
        private static void Main(string[] args) {
            // if HttpListener is not supported by the Framework
            if (!HttpListener.IsSupported) {
                Console.WriteLine("A more recent Windows version is required to use the HttpListener class.");
                return;
            }
 
            // Create a listener.
            HttpListener listener = new HttpListener();

            // Add the prefixes.
            if (args.Length != 0) {
                foreach (string s in args) 
                    listener.Prefixes.Add(s);
            } else
                Console.WriteLine("Syntax error: the call must contain at least one web server url as argument"); 

            listener.Start();

            // get args 
            foreach (string s in args)
                Console.WriteLine("Listening for connections on " + s);

            // Trap Ctrl-C on console to exit 
            Console.CancelKeyPress += delegate {
                // call methods to close socket and exit
                listener.Stop();
                listener.Close();
                Environment.Exit(0);
            };


            while (true) {
                // Note: The GetContext method blocks while waiting for a request.
                HttpListenerContext context = listener.GetContext();
                HttpListenerRequest request = context.Request;

                string documentContents;
                using (Stream receiveStream = request.InputStream) {
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                        documentContents = readStream.ReadToEnd();
                    }
                }
                
                HttpListenerResponse response = context.Response;

                if (request.Url == null) {
                    HTTPUtils.SendError(response, "no URI provided", 400);
                    continue;
                } else if (request.Url.LocalPath != "/api/itineraries") { // there is only one endpoint
                    HTTPUtils.SendError(response, "endpoint does not exists", 404);
                    continue;
                }

                //get params un url. After ? and between &
                NameValueCollection queryParams = HttpUtility.ParseQueryString(request.Url.Query);
                string? origin = queryParams["origin"];
                string? destination = queryParams["destination"];
                if (origin == null || destination == null) {
                    string errorMessage = String.Format(
                            "missing required parameter '{0}'",
                            origin == null ? "origin" : "destination"
                    );
                    HTTPUtils.SendError(response, errorMessage, 422);
                    continue;
                }

                string responseString = "{\"coucou\":\"les amis\"}";

                Console.WriteLine(documentContents);


                // Construct a response.
                
                byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
                // Get a response stream and write the response to it.
                response.ContentLength64 = buffer.Length;
                System.IO.Stream output = response.OutputStream;
                output.Write(buffer, 0, buffer.Length);
                // You must close the output stream.
                output.Close();
            }
            // Httplistener neither stop ... But Ctrl-C do that ...
            // listener.Stop();
        }
    }
}
