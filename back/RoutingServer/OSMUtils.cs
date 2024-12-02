using System.Text.Json;

using OSMObjects;

public static class OSMUtils {
    public static async Task<AddressContainer[]> GetAddressDetails(HttpClient client, string address) {
        HttpResponseMessage response = await client.GetAsync(
                $"https://nominatim.openstreetmap.org/search?q={address}&format=json&polygon=1&addressdetails=1"
        );
        string str = await response.Content.ReadAsStringAsync();
        // Deserialize JSON
        AddressContainer[]? addresses = JsonSerializer.Deserialize<AddressContainer[]>(str);
        return addresses ?? Array.Empty<AddressContainer>();
    }
}

namespace OSMObjects {
    public class AddressContainer : JSONObject {
        public string? lat { get; set; }
        public string? lon { get; set; }
        public string? display_name { get; set; }
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
