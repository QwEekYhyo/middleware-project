using System.Text.Json;

using JCDecauxObjects;

public static class JCDecauxUtils {
    // TODO: read this key from a file that is NOT on GitHub unlike this source file
    private static readonly string API_KEY = "156041d85480d64a92d2b27901283c6dc79b8952";
    private static readonly string BASE_URL = "https://api.jcdecaux.com/vls/v2";

    public static async Task<Contract[]> GetContracts(HttpClient client) {
        HttpResponseMessage response = await client.GetAsync(
                JCDecauxUtils.BASE_URL + "/contracts?apiKey=" + JCDecauxUtils.API_KEY
        );
        string str = await response.Content.ReadAsStringAsync();
        // Deserialize JSON
        Contract[]? contracts = JsonSerializer.Deserialize<Contract[]>(str);
        return contracts ?? Array.Empty<Contract>();
    }

    public static Contract? GetContractForCity(in string? city, in Contract[] contracts) {
        if (city == null)
            return null;

        foreach (Contract contract in contracts) {
            if (
                    contract.name != null &&
                    Utils.CompareStringsIgnoringAccents(city, contract.name)
               )
                return contract;

            if (contract.cities != null) {
                string copiedCityBecauseCsharp = city;

                if (contract.cities.Any(contractCity => Utils.CompareStringsIgnoringAccents(
                                copiedCityBecauseCsharp,
                                contractCity
                )))
                    return contract;
            }

        }

        return null;
    }

    public static async Task<Station[]> GetContractStations(HttpClient client, Contract contract) {
        HttpResponseMessage response = await client.GetAsync(
                $"{JCDecauxUtils.BASE_URL}/stations?contract={contract.name}&apiKey={JCDecauxUtils.API_KEY}"
        );
        string str = await response.Content.ReadAsStringAsync();
        Station[]? stations = JsonSerializer.Deserialize<Station[]>(str);
        return stations ?? Array.Empty<Station>();
    }
}

namespace JCDecauxObjects {
    public class Contract : JSONObject {
        public string? name { get; set; }
        public string? commercial_name { get; set; }
        public string[]? cities { get; set; }

        public override bool Equals(object? obj) {
            if (obj is not Contract other)
                return false;

            return string.Equals(name, other.name) &&
                   string.Equals(commercial_name, other.commercial_name);
        }

        public override int GetHashCode() {
            return HashCode.Combine(name, commercial_name);
        }
    }

    public class Station : JSONObject {
        public int? number { get; set; }
        public string? name { get; set; }
        public string? contract_name { get; set; }
        public string? address { get; set; }
        public string? status { get; set; }
        public int? available_bikes { get; set; }
        public Position? position { get; set; }

        public override bool Equals(object? obj) {
            if (obj is not Station other)
                return false;

            return string.Equals(name, other.name) &&
                   string.Equals(contract_name, other.contract_name) &&
                   number == other.number;
        }

        public override int GetHashCode() {
            return HashCode.Combine(name, contract_name, number);
        }
    }

    public class Position : JSONObject {
        public double? latitude { get; set; }
        public double? longitude { get; set; }
    }
}
