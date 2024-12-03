using System.Globalization;

namespace DistanceCalculator {
    static class DistanceUtils {
        private static readonly double EARTH_RADIUS = 6371.009;
        private static readonly double PI = Math.PI / 180.0;

        public static double ComputeDistance(
            double lat1,
            double lng1,
            double lat2,
            double lng2
        ) {
            double a =
                0.5 -
                Math.Cos((lat2 - lat1) * PI) / 2 +
                (Math.Cos(lat1 * PI) * Math.Cos(lat2 * PI) * (1 - Math.Cos((lng2 - lng1) * PI))) / 2;

            return 2 * EARTH_RADIUS * Math.Asin(Math.Sqrt(a));
        }
    }

    public class DistanceComparer : IComparer<JCDecauxObjects.Station> {
        private OSMObjects.AddressContainer address;

        public DistanceComparer(OSMObjects.AddressContainer addr) {
            this.address = addr;
        }

        public int Compare(JCDecauxObjects.Station? a, JCDecauxObjects.Station? b) {
            if (a == null)
                return -1;

            if (b == null)
                return 1;

            double lat = double.Parse(address.lat!, CultureInfo.InvariantCulture);
            double lng = double.Parse(address.lon!, CultureInfo.InvariantCulture);

            double distanceToA = DistanceUtils.ComputeDistance(
                    a.position!.latitude ?? 0, // this should never be the case
                    a.position.longitude ?? 0, // source: trust me bro
                    lat,
                    lng
            );
            double distanceToB = DistanceUtils.ComputeDistance(
                    b.position!.latitude ?? 0,
                    b.position.longitude ?? 0,
                    lat,
                    lng
            );

            return distanceToA.CompareTo(distanceToB); // ascending order
        }
    }
}
