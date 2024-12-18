﻿using System.Net;
using System.Text;
using System.Web;
using System.Collections.Specialized;

using JCDecauxObjects;

namespace ServerHTTPListener {
    internal class Program {
        private static readonly HttpClient CLIENT = new HttpClient();

        private static async Task Main(string[] args) {
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

            Program.CLIENT.DefaultRequestHeaders.UserAgent.ParseAdd("LetzGoBiking/1.0");

            // TODO: do this in another thread
            Contract[] jcdecauxContracts = await JCDecauxUtils.GetContracts(Program.CLIENT);

            while (true) {
                // Note: The GetContext method blocks while waiting for a request.
                HttpListenerContext context = listener.GetContext();
                HttpListenerRequest request = context.Request;

                if (request.HttpMethod == "OPTIONS") {
                    HttpListenerResponse preflightResponse = context.Response;
                    preflightResponse.AddHeader("Access-Control-Allow-Origin", "*");
                    preflightResponse.AddHeader("Access-Control-Allow-Methods", "GET");
                    preflightResponse.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
                    preflightResponse.StatusCode = 204;
                    preflightResponse.Close();
                    continue;
                }

                _ = Task.Run(async () => {
                    string documentContents;
                    using (Stream receiveStream = request.InputStream) {
                        using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8)) {
                            documentContents = readStream.ReadToEnd();
                        }
                    }
                    
                    HttpListenerResponse response = context.Response;
                    response.AddHeader("Access-Control-Allow-Origin", "*");
                    response.AddHeader("Access-Control-Allow-Methods", "GET");
                    response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

                    if (request.Url == null) {
                        HTTPUtils.SendError(response, "no URI provided", 400);
                        return;
                    } else if (request.Url.LocalPath != "/api/itineraries") { // there is only one endpoint
                        HTTPUtils.SendError(response, "endpoint does not exists", 404);
                        return;
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
                        return;
                    }

                    // TODO: cache these results somehow
                    OSMObjects.AddressContainer[] originDetails = await OSMUtils.GetAddressDetails(Program.CLIENT, origin);
                    OSMObjects.AddressContainer[] destinationDetails = await OSMUtils.GetAddressDetails(Program.CLIENT, destination);

                    if (originDetails.Length == 0) {
                        HTTPUtils.SendError(response, "origin address not found", 404);
                        return;
                    }
                    if (destinationDetails.Length == 0) {
                        HTTPUtils.SendError(response, "destination address not found", 404);
                        return;
                    }

                    Contract? contract = JCDecauxUtils.GetContractForCity(originDetails[0].address!.city, jcdecauxContracts);

                    if (contract == null) {
                        HTTPUtils.SendError(response, "no contract found for origin input", 404);
                        return;
                    }
                    // TODO: handle origin and destination not in same contract
                    if (!contract.Equals(JCDecauxUtils.GetContractForCity(destinationDetails[0].address!.city, jcdecauxContracts))) {
                        HTTPUtils.SendError(response, "origin and destination are not in the same contract", 418);
                        return;
                    }
                    Station[] stations = await JCDecauxUtils.GetContractStations(CLIENT, contract);
                    string? responseString = await OSMUtils.ComputeItinerary(CLIENT, originDetails[0], destinationDetails[0], stations);
                    if (responseString == null) {
                        HTTPUtils.SendError(response, "could not compute itinerary", 418);
                        return;
                    }

                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
                    // Get a response stream and write the response to it.
                    response.ContentLength64 = buffer.Length;
                    System.IO.Stream output = response.OutputStream;
                    output.Write(buffer, 0, buffer.Length);
                    // You must close the output stream.
                    output.Close();
                });
            }
            // Httplistener never stop ... But Ctrl-C do that ...
            // listener.Stop();
        }
    }
}
