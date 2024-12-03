using System.Text.RegularExpressions;
using System.Text.Json;

using JCDecauxObjects;
using OSMObjects;

public static class OSMUtils {
    private static readonly string BASE_OSRM_URL = "http://router.project-osrm.org/route/v1/bike";

    private static string? ExtractGeometry(string json) {
        var regex = new Regex("\"geometry\"\\s*:\\s*\"([^\"]*)\"");
        var match = regex.Match(json);

        if (match.Success) {
            return match.Groups[1].Value;
        }

        return null;
    }

    public static async Task<AddressContainer[]> GetAddressDetails(HttpClient client, string address) {
        HttpResponseMessage response = await client.GetAsync(
                $"https://nominatim.openstreetmap.org/search?q={address}&format=json&polygon=1&addressdetails=1"
        );
        string str = await response.Content.ReadAsStringAsync();
        // Deserialize JSON
        AddressContainer[]? addresses = JsonSerializer.Deserialize<AddressContainer[]>(str);
        return addresses ?? Array.Empty<AddressContainer>();
    }

    public static async Task<string?> ComputeItinerary(HttpClient client, AddressContainer origin, AddressContainer destination, Station[] stations) {
        // Compute nearest station to destination first because we will then filter the stations
        // and I don't know, they might disappear magically
        Array.Sort<Station>(stations, new DistanceCalculator.DistanceComparer(destination));
        Station destinationStation = stations[0];

        // TODO: maybe catch InvalidOperationException that First() might throw
        Station originStation = stations
            .Where(station => station.available_bikes != null && station.available_bikes > 0)
            .OrderBy(station => station, new DistanceCalculator.DistanceComparer(origin))
            .First();
        if (originStation.Equals(destination)) {
            // do something about it
            Console.WriteLine("No need to use a bike");
            return null;
        } else {
            string originCoord = $"{origin.lon},{origin.lat}";
            string originStationCoord = $"{originStation.position!.longitude},{originStation.position.latitude}";
            string destinationStationCoord = $"{destinationStation.position!.longitude},{destinationStation.position.latitude}";
            string destinationCoord = $"{destination.lon},{destination.lat}";

            string url = $"{BASE_OSRM_URL}/{originCoord};{originStationCoord};{destinationStationCoord};{destinationCoord}";
            HttpResponseMessage response = await client.GetAsync(url);
            string str = await response.Content.ReadAsStringAsync();
            return ExtractGeometry(str);
        }
    }
}

namespace OSMObjects {
    public class AddressContainer : JSONObject {
        public string? lat { get; set; }
        public string? lon { get; set; }
        public string? display_name { get; set; }
        public AddressDetails? address { get; set; }
    }

    public class AddressDetails : JSONObject {
        public string? road { get; set; }
        public string? quarter { get; set; }
        public string? suburb { get; set; }
        public string? city { get; set; }
        public string? county { get; set; }
        public string? state { get; set; }
        public string? country { get; set; }
        public string? postcode { get; set; }
    }
}
